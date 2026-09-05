import { Chapter } from '../../types';

export const PART7_CHAPTER: Chapter = {
  id: 'part7-storage',
  part: 7,
  partTitle: 'Part 7 — Storage & File System Architecture',
  chapterNumber: 7,
  title: 'Storage & File Systems: Block, File & Object',
  subtitle: 'S3 Object Storage, EBS Block Storage, NFS, Multipart Uploads, Presigned URLs & Erasure Coding',
  summary: 'Data comes in vastly different shapes and access patterns: raw disk blocks formatted by an operating system (Block), shared hierarchical directories (File), and globally addressable unstructured key-value blobs (Object). Choosing the wrong storage archetype causes crippling latency, astronomical cloud bills, and throughput bottlenecks.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                       DIRECT S3 UPLOAD VIA PRESIGNED URLS                                        |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. Client (Browser / Mobile)                                                                   |
|      Requests Upload Ticket: POST /api/v1/files/upload-ticket                                    |
|      { filename: "video.mp4", size: 524288000, mime: "video/mp4" }                               |
|          |                                                                                       |
|          v                                                                                       |
|   2. Application Backend Service (Zero Bandwidth Tax!)                                           |
|      - Authenticates user and checks tenant storage quota                                        |
|      - Calls AWS S3 SDK: generatePresignedPutUrl() with IAM Signature V4                         |
|      - Returns: { uploadUrl: "https://bucket.s3.amazonaws.com/uuid.mp4?X-Amz-Signature=...",     |
|                   fileKey: "tenants/42/uuid.mp4" }                                               |
|          |                                                                                       |
|          v                                                                                       |
|   3. Client Directly Uploads to AWS S3 (Multipart Upload)                                        |
|      PUT https://bucket.s3.amazonaws.com/uuid.mp4?partNumber=1... (Bypasses backend servers!)    |
|          |                                                                                       |
|          v                                                                                       |
|   4. S3 Emits Event (S3 Event Notifications -> SQS -> Transcoding Worker)                        |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Block vs. File vs. Object Storage Archetypes',
      confidence: 'stable',
      simpleDefinition: 'Block storage provides raw unformatted storage blocks attached to a single server (like an internal hard drive); File storage provides a shared network folder with POSIX hierarchy; Object storage stores unstructured data files with metadata accessed via HTTP REST APIs.',
      whyItExists: 'Operating systems and databases need raw block I/O with microsecond latency; office networks need shared files; cloud applications need infinitely scalable, cheap file hosting.',
      analogy: 'Block storage is raw unpaved land where you build your own custom house foundation. File storage is an office filing cabinet organized by drawers and folders that multiple colleagues can open. Object storage is an automated valet parking lot: you hand your car over, get a ticket (URL), and they park it wherever space exists.',
      technicalExplanation: 'Block Storage (AWS EBS, SAN, NVMe-oF): Interacts via low-level protocols (NVMe, iSCSI, SCSI) with 512-byte or 4KB blocks. Lowest latency (sub-millisecond), highest IOPS. Cannot be shared across multiple instances simultaneously (with rare exceptions). File Storage (AWS EFS, NFS, SMB/CIFS): Implements POSIX file standards (open, seek, read, lock). Multiple compute nodes mount the same volume concurrently. Slower than block storage due to network locking overhead. Object Storage (AWS S3, Google Cloud Storage, MinIO): Flat namespace with unique keys (bucket + path). Accessed via HTTP (GET, PUT, DELETE). Scales infinitely, highly durable (11 nines via erasure coding), but cannot modify bytes in place (must overwrite the entire object).',
      example: 'PostgreSQL runs its WAL and data tables on an AWS EBS gp3/io2 Block volume. Multiple container pods sharing configuration logs mount an AWS EFS File system. User-uploaded profile pictures and video archives are stored in AWS S3 Object storage.',
      whenToUse: [
        'Use Block Storage for running relational databases, virtual machine boot volumes, and low-latency disk-heavy processes.',
        'Use Object Storage for PDFs, images, videos, backups, machine learning datasets, and static website hosting.'
      ],
      whenNotToUse: [
        'Never run a database engine (like MySQL or SQLite) on Object Storage directly—it does not support random byte seeks and in-place writes.'
      ],
      commonMistakes: [
        'Streaming large file uploads through backend application servers instead of issuing direct Presigned URLs to S3, consuming all server bandwidth and memory.'
      ],
      interviewQuestion: {
        question: 'Why can you not append a few bytes to an existing file in AWS S3 Object Storage?',
        answer: 'Object storage treats files as immutable binary blobs. Internally, S3 splits objects into data chunks and parity fragments distributed across hundreds of storage nodes using erasure coding. There is no file system directory or block allocation table that supports in-place seeking or appending. Any modification requires uploading the entire object anew.'
      }
    },
    {
      title: 'Direct-to-Storage: Presigned URLs & Multipart Uploads',
      confidence: 'stable',
      simpleDefinition: 'Presigned URLs give clients temporary permission to upload or download files directly to S3 without passing bytes through your application servers; Multipart uploads split large files into chunks for parallel upload and error recovery.',
      whyItExists: 'Routing gigabytes of video or document uploads through web servers wastes CPU, saturates network bandwidth, and leads to HTTP connection timeouts.',
      analogy: 'Instead of having a courier bring a heavy package to your office desk so you can personally walk it over to the warehouse, you sign a temporary warehouse gate pass and tell the courier to drive straight to the warehouse loading dock.',
      technicalExplanation: 'The client requests an upload authorization. The backend validates user permissions, generates an S3 Presigned PUT URL using its AWS IAM credentials (with HMAC-SHA256 signature and 15-minute expiration), and returns the URL. The client makes a direct HTTP PUT to S3. For files > 100MB, Multipart Upload is mandatory: (1) Client initiates multipart upload (`InitiateMultipartUpload`); (2) Splits file into 5MB-50MB parts; (3) Uploads parts in parallel via presigned URLs; (4) Submits `CompleteMultipartUpload` with part numbers and ETags. S3 reassembles the parts. If Part 4 drops, only Part 4 is retried, not the entire 5GB file.',
      example: 'YouTube, Dropbox, and Google Drive use direct-to-storage multipart uploads for all user video and file uploads.',
      whenToUse: ['Always use Presigned URLs and Multipart Uploads for user-uploaded assets larger than 5MB.'],
      whenNotToUse: ['Do not use presigned URLs if the uploaded file must undergo synchronous in-memory scanning (e.g., malware virus scanning) before being accepted into storage.'],
      commonMistakes: [
        'Not configuring S3 Lifecycle rules to abort incomplete multipart uploads: abandoned upload parts linger indefinitely on disk, accumulating massive hidden AWS bills.'
      ],
      interviewQuestion: {
        question: 'How do you securely handle virus scanning on files uploaded via S3 Presigned URLs?',
        answer: 'You adopt an asynchronous Quarantine Pipeline: (1) S3 bucket configuration isolates newly uploaded files in a `/quarantine/` prefix with restricted read access. (2) S3 emits an `ObjectCreated` event to AWS SQS. (3) A dedicated scanning worker (running ClamAV or commercial antivirus) downloads the file, scans it, and if clean, moves the object to the `/clean/` prefix and updates the database record. If infected, the worker deletes the file and alerts the security team.'
      }
    },
    {
      title: 'Storage Durability & Erasure Coding',
      confidence: 'stable',
      simpleDefinition: 'Erasure coding breaks data into N fragments and adds M parity fragments so the original data can be reconstructed even if M fragments are completely lost or destroyed.',
      whyItExists: 'Traditional 3x replication (keeping 3 complete copies) costs 300% storage overhead. Erasure coding achieves higher durability with only 130%-150% storage overhead.',
      analogy: 'Reed-Solomon erasure coding is like an algebraic equation: 4 equations with 2 parity formulas. If any 2 variables are erased, you can solve the remaining equations to recover the missing data with 100% mathematical precision.',
      technicalExplanation: 'In an `8+4` Reed-Solomon erasure coding scheme: an object is broken into 8 data chunks and 4 parity chunks (12 chunks total), each stored on a different physical disk or rack. The object can survive the simultaneous loss of ANY 4 disks without data loss. The storage overhead is `(12 / 8) = 1.5x` (50% overhead), compared to 3x replication (200% overhead). AWS S3 uses erasure coding across multiple independent Availability Zones to achieve "11 nines" (99.999999999%) annual durability.',
      example: 'AWS S3, Ceph, and MinIO use erasure coding for their primary storage engine.',
      whenToUse: ['Erasure coding is ideal for large, immutable objects, cold archives, and petabyte-scale storage clusters.'],
      whenNotToUse: ['Do not use erasure coding for small, frequently modified transactional blocks (like database WAL pages) due to high CPU parity calculation and write amplification.'],
      commonMistakes: [
        'Confusing durability with availability: a file with 11 nines durability will never be lost, but if the network link to the datacenter is cut, the file is temporarily unavailable.'
      ],
      interviewQuestion: {
        question: 'What is the storage overhead difference between 3x replication and an 8+4 erasure coding scheme?',
        answer: '3x replication stores 3 complete copies of the data: 1GB of user data consumes 3GB of raw storage (200% storage overhead / 33% storage efficiency). An 8+4 erasure coding scheme divides the data into 8 chunks and generates 4 parity chunks (12 total): 1GB of user data consumes 1.5GB of raw storage (50% storage overhead / 66.7% storage efficiency). Erasure coding saves 50% of total physical disk hardware costs while delivering superior fault tolerance.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Block Storage (AWS EBS)',
    technologyB: 'Object Storage (AWS S3)',
    comparisonDimensions: [
      {
        dimension: 'Latency',
        optionA: 'Sub-millisecond (0.5ms - 2ms). Low-level NVMe/SAN bus.',
        optionB: '10ms - 50ms. HTTP REST API over TCP/TLS.',
        verdict: 'Block storage is mandatory for transactional database engines.'
      },
      {
        dimension: 'Cost per Gigabyte',
        optionA: 'High (~$0.08 - $0.12 / GB / month).',
        optionB: 'Low (~$0.023 / GB / month, drops to $0.004 in Glacier).',
        verdict: 'Object storage is 4x to 30x cheaper for media and backups.'
      },
      {
        dimension: 'Concurrency & Scale',
        optionA: 'Attached to a single server instance (strict single-writer).',
        optionB: 'Globally accessible by millions of concurrent clients over HTTP.',
        verdict: 'Object storage wins for web media distribution.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Block storage (EBS) provides raw disks for databases; Object storage (S3) provides HTTP key-value files.',
      'Never route large file uploads through app servers; use Presigned URLs and Multipart Uploads.',
      'Multipart uploads split files into 5-50MB chunks, allowing parallel uploads and isolated retries.',
      'Erasure coding achieves 11 nines durability with 50% storage overhead compared to 200% for 3x replication.'
    ],
    conceptualQuestions: [
      {
        id: 'q7-1',
        question: 'What is the difference between AWS S3 Standard, S3 Infrequent Access (IA), and S3 Glacier?',
        answer: 'S3 Standard is designed for active, frequently accessed data with millisecond retrieval and standard storage pricing. S3 IA has lower storage pricing but charges a per-GB retrieval fee, ideal for backups. S3 Glacier has ultra-low storage pricing designed for compliance archives, with retrieval times ranging from minutes (Expedited) to hours (Bulk).'
      },
      {
        id: 'q7-2',
        question: 'What is S3 Strong Consistency model?',
        answer: 'Since December 2020, AWS S3 provides strong read-after-write consistency for PUTs and DELETEs of objects in all regions with zero latency penalty, eliminating the previous eventual consistency model.'
      },
      {
        id: 'q7-3',
        question: 'What is a Content-Disposition HTTP header in file downloads?',
        answer: 'It instructs the browser whether to display the file inline in the browser tab (`inline`) or download it directly to the local disk as an attachment (`attachment; filename="report.pdf"`).'
      },
      {
        id: 'q7-4',
        question: 'How do S3 Lifecycle Policies optimize storage costs?',
        answer: 'Lifecycle policies automatically transition objects between storage tiers based on age (e.g., transition to S3 IA after 30 days, transition to Glacier after 90 days, and permanently delete after 365 days).'
      },
      {
        id: 'q7-5',
        question: 'What is Cross-Region Replication (CRR) in object storage?',
        answer: 'CRR automatically and asynchronously replicates S3 objects across buckets in different geographic regions for disaster recovery and compliance data residency.'
      }
    ],
    designExercises: [
      {
        id: 'de7-1',
        scenario: 'A video course platform allows users to upload 4K video files up to 10GB in size.',
        task: 'Design the end-to-end upload and transcoding architecture.',
        solutionGuide: 'Client requests upload session from API Gateway. Gateway returns presigned multipart upload URLs for 20MB parts. Client uploads parts directly to S3 bucket in parallel with 3 retries per chunk. Upon completion, S3 emits `ObjectCreated` event to SQS. An AWS Fargate worker running FFmpeg transcodes the raw 10GB video into HLS bitrate variants (1080p, 720p, 480p) and writes output chunks to a public CDN-fronted S3 bucket.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq7-1',
        question: 'How would you design Dropbox or Google Drive file synchronization?',
        answer: 'Divide files into content-addressed chunks (e.g., 4MB chunks hashed with SHA-256). A local daemon watches the file system. When a file changes, it computes chunk hashes; only modified chunks are uploaded to S3. Chunks are deduplicated globally across all users (if two users have the same chunk, it is stored once). Metadata (file names, directory trees, chunk mappings) is stored in a relational database.'
      }
    ],
    practicalTask: {
      title: 'Calculate Storage and Parity Costs for Erasure Coding',
      instructions: 'Calculate the total raw storage required to store 500 Terabytes of user files under: (A) 3x Replication, and (B) 10+4 Reed-Solomon Erasure Coding.',
      verification: 'Case A (3x Replication): 500 TB * 3 = 1,500 TB of raw storage. Case B (10+4 Erasure Coding): 500 TB * (14 / 10) = 700 TB of raw storage. Erasure coding saves 800 TB of disk space (53% reduction in disk hardware costs).'
    }
  },
  sources: [
    {
      title: 'Amazon S3 Architecture & Strong Consistency Model',
      url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html',
      type: 'Official Documentation',
      whatItSupports: 'S3 primitives, consistency guarantees, multipart uploads, and lifecycle rules.'
    }
  ],
  videos: [
    {
      title: 'Deep Dive on Amazon S3 (AWS re:Invent 2022)',
      creator: 'AWS Events',
      duration: '52m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'S3 internals, scaling architecture, replication, and performance optimization.',
      url: 'https://www.youtube.com/watch?v=kYJj3d4b1aI'
    }
  ]
};

export const PART8_CHAPTER: Chapter = {
  id: 'part8-microservices',
  part: 8,
  partTitle: 'Part 8 — Microservices Architecture',
  chapterNumber: 8,
  title: 'Microservices: Boundaries, Meshes & Resilience',
  subtitle: 'Domain-Driven Design, Service Discovery, Istio/Envoy, Circuit Breakers & Distributed Tracing',
  summary: 'Microservices decompose complex systems into independently deployable, loosely coupled services aligned around business domains. However, moving function calls across the network introduces distributed failure modes. Mastering service discovery, traffic meshes, circuit breakers, and distributed telemetry is required to operate microservices reliably at scale.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                    CIRCUIT BREAKER STATE MACHINE (Resilience4j / Envoy)                          |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   +-------------------+                                                                          |
|   |      CLOSED       |  <--- Normal Operation: Requests pass through to downstream service.     |
|   +-------------------+                                                                          |
|          |                                                                                       |
|          | Failure Rate > 50% (e.g. 50 out of 100 requests timeout or return HTTP 500)           |
|          v                                                                                       |
|   +-------------------+                                                                          |
|   |       OPEN        |  <--- Fast-Fail State: Requests fail IMMEDIATELY with fallback.          |
|   +-------------------+       Downstream service receives ZERO traffic, allowing it to recover.  |
|          |                                                                                       |
|          | Wait Duration Expires (e.g. 30 seconds cooldown)                                      |
|          v                                                                                       |
|   +-------------------+                                                                          |
|   |     HALF-OPEN     |  <--- Trial State: Allow small probe traffic (e.g. 10 requests).         |
|   +-------------------+                                                                          |
|          /             \\                                                                        |
|   All Probe             Any Probe                                                                |
|   Requests Succeeded    Requests Failed                                                          |
|        /                 \\                                                                       |
|       v                   v                                                                      |
|  [ Back to CLOSED ]   [ Back to OPEN ]                                                           |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Domain-Driven Design (DDD) & Service Boundaries',
      confidence: 'stable',
      simpleDefinition: 'Domain-Driven Design uses business subdomains and Bounded Contexts to define where one microservice begins and another ends.',
      whyItExists: 'Slicing microservices by technical layers (e.g., UI service, DB service) causes tight coupling. Slicing by business domain allows teams to deploy independently.',
      analogy: 'In a hospital: Radiology, Pharmacy, and Billing have different vocabularies and systems. A "patient" means medical history to a doctor, but an insurance policy to the billing clerk. They are separate Bounded Contexts.',
      technicalExplanation: 'DDD identifies: (1) Ubiquitous Language: Shared vocabulary between engineers and domain experts; (2) Bounded Context: The explicit boundary within which a domain model applies; (3) Aggregates: Clusters of domain entities that change together under a strict consistency boundary. A microservice should map 1:1 with a Bounded Context. Database per Service is mandatory: no two services should ever query or mutate the same database tables directly.',
      example: 'In an e-commerce platform: Catalog Service owns product descriptions; Inventory Service owns stock levels; Order Service coordinates checkout. Order Service communicates with Inventory Service via gRPC or Kafka, never via direct SQL joins.',
      whenToUse: ['Use DDD bounded contexts to carve out service boundaries during monolithic decomposition.'],
      whenNotToUse: ['Do not split tiny cohesive features into multiple microservices (e.g., separate "User Login" and "User Registration" services).'],
      commonMistakes: [
        'Sharing database tables across microservices, creating hidden schema coupling that breaks independent deployments.',
        'Anemic Domain Models where services are just dumb CRUD endpoints with business logic scattered across multiple callers.'
      ],
      interviewQuestion: {
        question: 'What is the "Database per Service" pattern and why is it considered non-negotiable in microservices?',
        answer: 'Database per Service dictates that each microservice owns its private persistent data store; no other service can access it directly. All access must traverse the service’s public API (REST/gRPC/Events). This is non-negotiable because shared databases: (1) Couple services to a single database schema, preventing independent schema migrations; (2) Create invisible lock contention and deadlocks; (3) Prevent teams from picking the optimal storage engine for their domain (e.g., Graph vs Relational).'
      }
    },
    {
      title: 'Service Mesh & Sidecar Pattern (Envoy / Istio)',
      confidence: 'stable',
      simpleDefinition: 'A service mesh is a dedicated infrastructure layer that handles service-to-service communication, encryption (mTLS), observability, and traffic routing transparently using sidecar proxies.',
      whyItExists: 'Writing retries, circuit breakers, TLS certificate rotation, and tracing libraries into every programming language (Node, Go, Java, Python) creates massive maintenance overhead.',
      analogy: 'A diplomat who travels with an official translator and bodyguard (sidecar). The diplomat speaks only their native tongue; the bodyguard handles all security, passport verification, and foreign phone calls.',
      technicalExplanation: 'A service mesh consists of: (1) Data Plane: High-performance proxy sidecars (Envoy) co-located inside the same Kubernetes Pod as the application container. All inbound and outbound network traffic is intercepted by the sidecar via `iptables`. (2) Control Plane (Istio): Distributes configuration, routing rules, and mTLS certificates to proxies. Features include: Automatic mutual TLS (mTLS) zero-trust encryption, canary traffic splitting (e.g., route 5% to v2), circuit breaking, and OpenTelemetry trace propagation.',
      example: 'In Kubernetes with Istio: Service A calls `http://service-b`. The local Envoy sidecar intercepts the call, upgrades the connection to encrypted mTLS, load-balances across healthy pods, and injects `traceparent` headers.',
      whenToUse: ['Use a service mesh when managing 30+ polyglot microservices requiring strict zero-trust mTLS encryption and uniform observability.'],
      whenNotToUse: ['Do not deploy a complex service mesh for small systems (5-10 services)—it adds 2-5ms of proxy latency and heavy RAM/CPU overhead.'],
      commonMistakes: [
        'Underestimating the memory overhead of running an Envoy sidecar proxy in every single Kubernetes pod across a 2,000-pod cluster.'
      ],
      interviewQuestion: {
        question: 'How does a sidecar proxy intercept application network traffic transparently without code changes?',
        answer: 'When a Kubernetes pod boots, an init-container (`istio-init`) runs with `NET_ADMIN` Linux privileges. It executes Linux `iptables` commands (e.g., `PREROUTING` and `OUTPUT` chains) to redirect all inbound and outbound TCP packets on port 80/443 to the local Envoy proxy listening on port 15001/15006. The application code believes it is making a normal outbound HTTP call, completely unaware that Envoy is intercepting and managing the connection.'
      }
    },
    {
      title: 'Resilience Patterns: Circuit Breakers, Bulkheads & Retries',
      confidence: 'stable',
      simpleDefinition: 'Circuit breakers stop calling failing downstream services to prevent cascading collapse; Bulkheads isolate resource pools so one failing service cannot exhaust all threads; Retries with jitter handle transient network blips.',
      whyItExists: 'In distributed systems, failures cascade: if Service C is slow, Service B exhausts its thread pool waiting, and Service A collapses. The entire platform goes down.',
      analogy: 'Circuit breaker is an electrical fuse that trips to prevent your house wiring from catching fire. Bulkhead is the watertight compartments of a ship hull: if water breaches compartment 1, the other compartments stay dry and the ship doesn’t sink.',
      technicalExplanation: 'Circuit Breaker states: CLOSED (normal), OPEN (fast-fail without calling downstream), HALF-OPEN (trial requests to test recovery). Configured via failure rate threshold (e.g., 50% failures over 100 requests) and cooldown wait duration (e.g., 30s). Bulkhead Pattern: Assigns separate connection pools or thread pools per downstream service. If Service C hangs, only its 20 allocated threads freeze; the 80 threads reserved for Service D and E continue operating smoothly. Retry with Exponential Backoff and Full Jitter: `sleep = rand(0, min(cap, base * 2^attempt))`. Jitter is mandatory to prevent synchronized thundering herd retries.',
      example: 'Netflix Hystrix and Resilience4j wrap remote RPC calls with circuit breakers and fallback responses (e.g., returning cached recommendations if the recommendation service trips).',
      whenToUse: ['Mandatory for all synchronous inter-service HTTP and gRPC network calls.'],
      whenNotToUse: ['Do not retry non-idempotent write operations without idempotency keys.'],
      commonMistakes: [
        'Retrying immediately in a tight loop without exponential backoff or jitter, which acts as a self-inflicted DDoS attack against an already struggling downstream service.',
        'Not setting strict timeouts: an HTTP call without a timeout will hang indefinitely until OS socket limits are exhausted.'
      ],
      interviewQuestion: {
        question: 'Why is "Full Jitter" essential when implementing exponential backoff retries?',
        answer: 'Without jitter, when a service experiences a transient outage, hundreds of concurrent failed clients calculate the exact same backoff delay (e.g., 2s, 4s, 8s) and retry in synchronized waves. This periodically hammers the struggling service with spikes of traffic ("thundering herd"), keeping it permanently overloaded. Full Jitter randomly distributes retry attempts uniformly across the time window (`rand(0, delay)`), smoothing traffic into a flat, manageable stream that allows the service to recover.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Direct Microservice Calls with Client Libraries',
    technologyB: 'Service Mesh Sidecar Architecture (Istio / Envoy)',
    comparisonDimensions: [
      {
        dimension: 'Operational Complexity',
        optionA: 'Low. Standard code dependencies.',
        optionB: 'High. Sidecar injection, control plane upgrades, proxy debugging.',
        verdict: 'Direct client calls win for small, single-language teams.'
      },
      {
        dimension: 'Language Agnosticism',
        optionA: 'Poor. Must re-implement retries, mTLS, and metrics in Java, Go, Node, Python.',
        optionB: 'Complete. Network features run outside the application in Envoy.',
        verdict: 'Service mesh wins for large polyglot enterprise fleets.'
      },
      {
        dimension: 'Resource Overhead',
        optionA: 'Zero extra proxy processes.',
        optionB: 'Adds 50MB-150MB RAM and 0.1-0.5 CPU cores per pod.',
        verdict: 'Direct calls win for lean infrastructure budgets.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Bounded contexts (DDD) dictate service boundaries; Database per Service is non-negotiable.',
      'A service mesh manages mTLS, traffic routing, and metrics transparently using sidecar proxies.',
      'Circuit breakers trip to OPEN state on high failure rates, protecting downstream services from cascading collapse.',
      'Bulkheads isolate thread pools so one slow dependency cannot crash the entire application.',
      'Retries must always include exponential backoff and randomized full jitter.'
    ],
    conceptualQuestions: [
      {
        id: 'q8-1',
        question: 'What is Distributed Tracing and what is the role of `traceparent` (W3C Trace Context)?',
        answer: 'Distributed tracing tracks a single user request as it traverses dozens of microservices. The W3C `traceparent` HTTP header standardizes trace propagation: it contains `version-trace_id-parent_id-trace_flags`. Every microservice extracts the trace ID, attaches its own span ID, and forwards it to downstream services, assembling a complete visualization in Jaeger or Datadog.'
      },
      {
        id: 'q8-2',
        question: 'What is the difference between client-side load balancing and server-side load balancing in microservices?',
        answer: 'In server-side load balancing, the client calls a central load balancer (ALB), which routes to backend pods. In client-side load balancing (gRPC, Envoy), the client queries service discovery (Consul/K8s DNS) for the list of healthy backend pod IPs and balances requests directly, eliminating a central network hop.'
      },
      {
        id: 'q8-3',
        question: 'What is graceful degradation?',
        answer: 'Graceful degradation is returning a partial or cached fallback response when a secondary microservice fails, rather than crashing the entire user experience (e.g., displaying product info with an empty reviews section if Review Service is down).'
      }
    ],
    designExercises: [
      {
        id: 'de8-1',
        scenario: 'A ride-sharing app’s Dispatch Service calls the Driver Location Service, which is experiencing severe database lock contention and 95% timeouts.',
        task: 'Design a resilience strategy that prevents the Dispatch Service from crashing.',
        solutionGuide: 'Wrap the Driver Location Service client with Resilience4j circuit breaker and bulkhead: (1) Bulkhead limits concurrent requests to 30 threads; (2) Strict timeout of 200ms; (3) Circuit breaker trips to OPEN if > 50% of requests fail over a 10-second sliding window; (4) Fallback: return driver locations from an in-memory Redis geospatial cache with a "stale" flag.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq8-1',
        question: 'How do you prevent cascading failures in microservices?',
        answer: 'Cascading failures are prevented by: (1) Setting strict request timeouts on all RPC calls; (2) Implementing circuit breakers to fast-fail before thread pools exhaust; (3) Bulkheading thread and connection pools; (4) Rate limiting and shedding load at the gateway; (5) Ensuring retries use exponential backoff and full jitter.'
      }
    ],
    practicalTask: {
      title: 'Configure a Circuit Breaker Threshold',
      instructions: 'Define the parameters for a production circuit breaker: Sliding Window Size, Minimum Number of Calls, Failure Rate Threshold, Wait Duration in Open State, and Permitted Calls in Half-Open State.',
      verification: 'Recommended values: Sliding Window Size = 100 calls; Minimum Calls = 20; Failure Rate Threshold = 50%; Wait Duration in Open State = 30 seconds; Permitted Calls in Half-Open State = 10. This ensures statistical significance before tripping and gives struggling backends time to cool down.'
    }
  },
  sources: [
    {
      title: 'Microservices Patterns (Chris Richardson)',
      url: 'https://microservices.io/patterns/index.html',
      type: 'Official Documentation',
      whatItSupports: 'Service boundaries, saga patterns, API composition, and database per service.'
    }
  ],
  videos: [
    {
      title: 'Microservices • Martin Fowler • GOTO 2014',
      creator: 'GOTO Conferences',
      duration: '26m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Foundations of microservice boundaries, decentralized governance, and infrastructure automation.',
      url: 'https://www.youtube.com/watch?v=wgdBVIX9ifA'
    }
  ]
};
