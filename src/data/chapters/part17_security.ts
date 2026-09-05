import { Chapter } from '../../types';

export const PART17_CHAPTER: Chapter = {
  id: 'part17-security',
  part: 17,
  partTitle: 'Part 17 — Security & Threat Modeling',
  chapterNumber: 17,
  title: 'Security Engineering & Threat Modeling',
  subtitle: 'STRIDE Framework, Zero Trust Architecture, Envelope Encryption (KMS), and SSRF Defense',
  summary: 'Security cannot be an afterthought bolted onto a finished architecture. Enterprise system design requires proactive threat modeling using the STRIDE framework, zero-trust network segmentation, envelope encryption with hardware-secured keys, and hardened defense against critical web vulnerabilities such as Server-Side Request Forgery (SSRF) and cryptographic replay.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                    ENVELOPE ENCRYPTION WITH AWS KMS / CLOUD HSM                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. Application needs to encrypt 500MB sensitive file "user_tax_data.pdf"                      |
|          |                                                                                       |
|          v                                                                                       |
|   2. Application calls KMS: kms.generateDataKey({ KeyId: 'master-key-arn', KeySpec: 'AES_256' }) |
|          |                                                                                       |
|          v                                                                                       |
|   3. AWS KMS (Hardware Security Module HSM) returns two items:                                   |
|      (A) Plaintext Data Key:  [ 32-byte raw AES-256 key: 0x9F3A... ]                            |
|      (B) Encrypted Data Key:  [ Ciphertext: 0x88BC... encrypted by KMS Master Key ]             |
|          |                                                                                       |
|          v                                                                                       |
|   4. Application encrypts 500MB file locally in memory using Plaintext Data Key (AES-256-GCM)   |
|          |                                                                                       |
|          v                                                                                       |
|   5. ZEROIZATION: Application immediately overwrites Plaintext Key from memory (Zero-Fill)      |
|          |                                                                                       |
|          v                                                                                       |
|   6. S3 Storage: App stores [ Encrypted File ] + [ Encrypted Data Key (Ciphertext) ] side-by-side|
|      (KMS Master Key NEVER leaves the physical HSM hardware!)                                    |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Threat Modeling with STRIDE',
      confidence: 'stable',
      simpleDefinition: 'STRIDE is a mnemonic methodology used to systematically discover security threats across six categories: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.',
      whyItExists: 'Building defenses randomly leaves blind spots. STRIDE provides a structured, exhaustive framework to evaluate every data flow, trust boundary, and process.',
      analogy: 'A home security inspector who systematically checks every possible entry point: front door lock (Spoofing), window glass thickness (Tampering), security camera coverage (Repudiation), curtain opacity (Information Disclosure), telephone wire cutting (Denial of Service), and basement tunnel access (Elevation of Privilege).',
      technicalExplanation: 'STRIDE mapping: (1) Spoofing: Impersonating a user or service. Mitigation: Strong authentication, mTLS, signed JWTs. (2) Tampering: Modifying data in transit or at rest. Mitigation: HMAC signatures, TLS 1.3, SHA-256 hashing. (3) Repudiation: Claiming an action was not performed. Mitigation: Immutable audit trails, append-only ledgers, digital signatures. (4) Information Disclosure: Data leaks to unauthorized parties. Mitigation: AES-256 encryption at rest, column-level masking, strict least privilege. (5) Denial of Service: Exhausting resources. Mitigation: Rate limiting, SYN cookies, auto-scaling, request body size limits. (6) Elevation of Privilege: Gaining unauthorized permissions. Mitigation: RBAC, ABAC, non-root containers, boundary validation.',
      example: 'During architectural review of an API gateway: We evaluate "Tampering" for query parameters by enforcing cryptographic request signatures (AWS SigV4).',
      whenToUse: ['Perform STRIDE threat modeling at the design phase of every new microservice or API.'],
      whenNotToUse: ['Do not defer threat modeling until after production launch or penetration testing.'],
      commonMistakes: [
        'Treating threat modeling as a one-time checklist rather than a continuous architectural process revisited upon every major feature change.'
      ],
      interviewQuestion: {
        question: 'How do you apply STRIDE to design a secure file-upload service?',
        answer: 'Spoofing: Require authenticated session token before issuing upload URLs. Tampering: S3 enforces SHA-256 checksums and Content-MD5 verification. Repudiation: Log user ID, IP address, timestamp, and S3 ETag in an append-only audit ledger. Information Disclosure: Store files in private S3 buckets with SSE-KMS encryption; issue time-limited presigned URLs (15 min). Denial of Service: Enforce hard file-size limits (max 50MB) and rate-limit upload requests per tenant. Elevation of Privilege: Isolate file transcoding in sandboxed unprivileged containers (gVisor/Firecracker) with no AWS IAM permissions.'
      }
    },
    {
      title: 'Envelope Encryption & Key Management (KMS / HSM)',
      confidence: 'stable',
      simpleDefinition: 'Envelope encryption encrypts data with a Data Encryption Key (DEK), and encrypts the DEK with a Root Key (Key Encryption Key) stored inside a Hardware Security Module (HSM).',
      whyItExists: 'Encrypting gigabytes of data directly inside an HSM is slow and exceeds HSM memory limits. Envelope encryption combines the security of HSMs with the speed of local symmetric encryption.',
      analogy: 'Putting your valuables inside a heavy steel safe (Data Key), and putting the safe’s brass key inside a titanium bank deposit box (Root Key) that never leaves the bank vault.',
      technicalExplanation: 'AWS KMS / Google Cloud KMS Workflow: (1) Application calls `kms:GenerateDataKey`. (2) KMS HSM uses Customer Master Key (CMK) to generate a 256-bit AES Data Encryption Key (DEK). (3) KMS returns two copies: Plaintext DEK and Ciphertext DEK (encrypted by CMK). (4) App uses Plaintext DEK to encrypt large payload locally via AES-GCM-256 (extremely fast). (5) App destroys the Plaintext DEK from RAM immediately. (6) App stores the Ciphertext DEK alongside the encrypted payload. (7) Decryption: App sends Ciphertext DEK to KMS (`kms:Decrypt`); KMS decrypts it using CMK inside the HSM and returns Plaintext DEK; App decrypts payload.',
      example: 'AWS S3 Server-Side Encryption (SSE-KMS) and Google Cloud Storage default to envelope encryption for all customer data at rest.',
      whenToUse: ['Mandatory for all sensitive customer data at rest, PII, healthcare records, and database backups.'],
      whenNotToUse: ['Never export or log the Plaintext Data Key to disk or monitoring traces.'],
      commonMistakes: [
        'Calling KMS `Encrypt` directly for large files: KMS APIs have a strict 4KB payload limit and strict per-second API rate limits; direct encryption is completely wrong for files or databases.'
      ],
      interviewQuestion: {
        question: 'Why does Envelope Encryption eliminate the need to re-encrypt petabytes of data when rotating encryption keys?',
        answer: 'When you rotate a Root Key (CMK) in AWS KMS, KMS generates a new backing key version for future encryptions while preserving historical keys for decryptions. Because the actual petabytes of data are encrypted with unique Data Encryption Keys (DEKs), you do NOT need to re-encrypt the massive data files. You only re-encrypt the tiny 32-byte DEKs with the new CMK (`kms:ReEncrypt`). This reduces cryptographic key rotation from weeks of heavy disk I/O down to milliseconds.'
      }
    },
    {
      title: 'Server-Side Request Forgery (SSRF) & Defense',
      confidence: 'stable',
      simpleDefinition: 'SSRF occurs when an attacker tricks a backend server into making an HTTP request to an internal private network or metadata service.',
      whyItExists: 'Backend servers often fetch user-provided URLs (e.g., importing webhooks, generating PDF previews). Attackers provide internal IPs like `http://169.254.169.254` to steal cloud credentials.',
      analogy: 'Tricking a security guard into walking into the bank vault and reading the safe combination out loud because you claimed it was an urgent package delivery for the manager.',
      technicalExplanation: 'Attack vector: An app allows users to supply an avatar URL (`POST /avatar { url: "http://169.254.169.254/latest/meta-data/iam/security-credentials/" }`). The server fetches the link, dumping IAM credentials to the attacker. Mitigations: (1) DNS Resolution Pinning: Resolve DNS to IP in application code; check that resolved IP does NOT belong to private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`). (2) Prevent DNS Rebinding: Connect directly to the validated IP, passing the original domain in the `Host` header. (3) Outbound Proxy: Route outbound requests through an egress proxy (Smokescreen, Envoy) that drops RFC 1918 traffic. (4) Cloud IMDSv2: Enforce session tokens for metadata access.',
      example: 'The infamous 2019 Capital One data breach compromised 106 million customer records via an SSRF vulnerability in an open-source WAF that allowed querying AWS EC2 metadata.',
      whenToUse: ['Mandatory defense for any microservice that fetches external URLs, webhooks, or performs web scraping.'],
      whenNotToUse: ['Never rely on naive regex blacklists (e.g., blocking "localhost" or "127.0.0.1")—attackers bypass them easily using decimal IPs (`2130706433`), hex IPs (`0x7f000001`), or DNS rebinding.'],
      commonMistakes: [
        'Checking the URL hostname before DNS resolution: an attacker points `attacker.com` to `169.254.169.254`, bypassing all string-based domain filters.'
      ],
      interviewQuestion: {
        question: 'How does a DNS Rebinding attack bypass traditional IP address validation in SSRF defenses?',
        answer: 'In DNS Rebinding, an attacker controls a DNS server that responds with a very short TTL (e.g., 1 second). On the first DNS lookup (when the application checks if the IP is public), the DNS server returns a legitimate public IP (`1.2.3.4`), passing the validation check. 1 second later, when the application makes the actual HTTP `fetch()` request, the DNS cache has expired, forcing a second lookup. The attacker’s DNS server now returns `169.254.169.254` or `127.0.0.1`. The application makes the HTTP call to the internal private IP, bypassing the firewall. Defense: The application must resolve the IP once, validate it, and establish the TCP connection directly to that specific IP.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Network Perimeter Security (Traditional Firewalls / VPN)',
    technologyB: 'Zero Trust Architecture (mTLS + Identity Everywhere)',
    comparisonDimensions: [
      {
        dimension: 'Internal Trust Model',
        optionA: 'Implicit trust once inside the corporate VPN or VPC.',
        optionB: 'Zero implicit trust. Every single RPC call is authenticated and authorized.',
        verdict: 'Zero Trust prevents catastrophic lateral movement after an initial breach.'
      },
      {
        dimension: 'Performance Overhead',
        optionA: 'Zero internal encryption overhead.',
        optionB: 'Slight latency added by continuous TLS handshakes and mTLS verification.',
        verdict: 'Perimeter wins slightly on raw CPU, but Zero Trust is mandatory for enterprise.'
      },
      {
        dimension: 'Remote / Multi-Cloud Flexibility',
        optionA: 'Rigid. Requires fragile VPN tunnels and fixed IP routes.',
        optionB: 'Seamless. Workloads authenticate anywhere over public networks.',
        verdict: 'Zero Trust wins decisively for modern distributed workforces.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'STRIDE categorizes threats: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation.',
      'Envelope encryption encrypts data locally with a DEK and protects the DEK with an HSM Root Key.',
      'KMS Root Keys never leave physical HSM hardware; key rotation requires re-encrypting only DEKs.',
      'SSRF allows attackers to query internal clouds (169.254.169.254); defend via DNS pinning & IMDSv2.',
      'Zero Trust assumes the internal network is already compromised; enforce mTLS and auth on every RPC.'
    ],
    conceptualQuestions: [
      {
        id: 'q17-1',
        question: 'What is the difference between TLS 1.2 and TLS 1.3?',
        answer: 'TLS 1.3 reduces the cryptographic handshake from 2 round-trips (2-RTT) to 1 round-trip (1-RTT), significantly improving connection latency. It also removes legacy insecure cryptographic algorithms (MD5, SHA-1, RC4, RSA key exchange) and mandates Perfect Forward Secrecy (PFS) via ephemeral Diffie-Hellman.'
      },
      {
        id: 'q17-2',
        question: 'What is Perfect Forward Secrecy (PFS)?',
        answer: 'PFS guarantees that even if a server’s long-term private SSL/TLS key is stolen in the future, past encrypted network sessions recorded by adversaries cannot be decrypted, because each session used unique ephemeral keys that were discarded.'
      },
      {
        id: 'q17-3',
        question: 'What is the purpose of Content Security Policy (CSP) headers?',
        answer: 'CSP is an HTTP response header that instructs the browser which domains are permitted to execute scripts, load stylesheets, or open WebSocket connections, mitigating Cross-Site Scripting (XSS) and data injection attacks.'
      }
    ],
    designExercises: [
      {
        id: 'de17-1',
        scenario: 'You are architecting a webhook delivery system that sends HTTP POST payloads to customer-provided URLs on the internet.',
        task: 'Design an egress architecture that completely prevents SSRF attacks against your internal cloud infrastructure.',
        solutionGuide: '1. Webhook worker resolves the destination domain via custom DNS resolver. 2. Verify IP is not in RFC 1918 private ranges, loopback (`127.0.0.0/8`), link-local (`169.254.0.0/16`), or multicast. 3. Establish TCP connection directly to the resolved IP. 4. Run webhook workers inside a dedicated, air-gapped Egress VPC that has zero routing or peering to internal production VPCs. 5. Route all outbound traffic through an egress proxy (Smokescreen) that enforces network-level IP blocking.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq17-1',
        question: 'How do you design a secure credential rotation architecture for database passwords in production?',
        answer: 'Use AWS Secrets Manager or HashiCorp Vault with automated rotation lambdas: (1) The database contains two administrative users (`app_user_a` and `app_user_b`); (2) Currently, application servers read password for `app_user_a` from Secrets Manager; (3) When rotation triggers (every 30 days), Secrets Manager generates a high-entropy password, changes `app_user_b` password in the database, and tests the connection; (4) Secrets Manager updates the active secret to `app_user_b`; (5) Application connection pools refresh credentials dynamically without restarting pods; (6) On the next rotation, `app_user_a` is rotated, achieving zero-downtime rolling password updates.'
      }
    ],
    practicalTask: {
      title: 'Analyze Cryptographic Nonce and Timestamp Invariants',
      instructions: 'Explain why an API security signature (e.g., AWS SigV4 or Stripe webhook signatures) must include BOTH an expiration timestamp AND a unique cryptographic nonce.',
      verification: 'A timestamp defines a narrow validity window (e.g., 5 minutes) to prevent delayed replays, but allows an attacker to replay the exact same captured request multiple times within that 5-minute window. A unique Nonce (Number Used Once) is stored in a fast Redis set with a 5-minute TTL. The server checks: (1) Is `abs(now - timestamp) <= 300s`? (2) Has this `nonce` already been seen? If either fails, request is rejected. Together, they mathematically eliminate replay attacks.'
    }
  },
  sources: [
    {
      title: 'NIST Special Publication 800-207: Zero Trust Architecture',
      url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final',
      type: 'Official Documentation',
      whatItSupports: 'Core zero trust tenets, policy enforcement points, and identity-driven access control.'
    }
  ],
  videos: [
    {
      title: 'AWS re:Invent 2022 - AWS KMS: Cryptographic details & performance (SEC303)',
      creator: 'AWS Events',
      duration: '50m',
      difficulty: 'Advanced',
      whatYouWillLearn: 'Hardware Security Modules, envelope encryption, key hierarchy, and cryptographic authorization.',
      url: 'https://www.youtube.com/watch?v=kYJj3d4b1aI'
    }
  ]
};

export const PART18_CHAPTER: Chapter = {
  id: 'part18-reliability-dr',
  part: 18,
  partTitle: 'Part 18 — Reliability, High Availability & Disaster Recovery',
  chapterNumber: 18,
  title: 'Reliability Engineering & Disaster Recovery',
  subtitle: 'Availability Math (The Nines), RPO vs. RTO, Multi-Region Active-Active & Chaos Engineering',
  summary: 'Reliability is the foundational promise of production software. Designing resilient architectures requires understanding availability probability math, defining strict Recovery Point and Time Objectives (RPO/RTO), architecting active-active and warm standby disaster recovery strategies, and proactively testing failure modes through Chaos Engineering.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                    DISASTER RECOVERY ARCHETYPES: RPO & RTO SPECTRUM                              |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   COST & COMPLEXITY                                                                              |
|      ^                                                                                           |
|      |                                                    [ 4. MULTI-REGION ACTIVE-ACTIVE ]      |
|      |                                                      - RPO = 0 (Zero data loss)           |
|      |                                                      - RTO = 0 (Instant traffic shift)    |
|      |                                                      - Extreme cost & complexity          |
|      |                                                                                           |
|      |                                    [ 3. WARM STANDBY (Pilot Light) ]                      |
|      |                                      - RPO = Sub-minute (Async DB replication)            |
|      |                                      - RTO = 5-15 mins (Scale up standby compute)         |
|      |                                      - Moderate cost                                      |
|      |                                                                                           |
|      |                    [ 2. COLD STANDBY (Backup & Restore) ]                                 |
|      |                      - RPO = Hours (Latest S3 snapshot)                                   |
|      |                      - RTO = Hours (Provision new DB & servers from IaC)                  |
|      |                      - Low cost                                                           |
|      |                                                                                           |
|      +-----------------------------------------------------------------------------------> SPEED |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'The Math of Availability: Calculating "Nines"',
      confidence: 'stable',
      simpleDefinition: 'Availability is the percentage of time a system is operational. Each "nine" represents an order-of-magnitude reduction in allowable annual downtime.',
      whyItExists: 'Adding another "nine" (e.g., jumping from 99.9% to 99.99%) increases infrastructure cost and engineering complexity exponentially. Understanding downtime budgets prevents over-engineering.',
      analogy: '99% (Two Nines) means your car won’t start for nearly 4 full days a year. 99.9% (Three Nines) means it won’t start for 8.7 hours a year. 99.999% (Five Nines) means it won’t start for only 5 minutes over an entire year.',
      technicalExplanation: 'Availability Formula: `Availability = MTBF / (MTBF + MTTR)`. MTBF = Mean Time Between Failures; MTTR = Mean Time To Repair. Annual downtime limits: (1) 99% (Two Nines) = 3.65 days/year downtime; (2) 99.9% (Three Nines) = 8.76 hours/year (43.8 mins/month); (3) 99.95% = 4.38 hours/year; (4) 99.99% (Four Nines) = 52.56 minutes/year (4.38 mins/month); (5) 99.999% (Five Nines) = 5.26 minutes/year (26.3 seconds/month). Calculating Serial vs Parallel Availability: Serial components (Chain of dependencies: DNS -> ALB -> App -> DB): `A_total = A1 * A2 * A3 * A4` (availability is always WORSE than the weakest link). Parallel components (Redundant pairs): `A_total = 1 - (1 - A1) * (1 - A2)` (availability increases).',
      example: 'If your web app (99.9%) relies on a third-party SMS API (99.5%) synchronously: your maximum theoretical availability is `0.999 * 0.995 = 99.4%` (over 52 hours of downtime per year).',
      whenToUse: ['Calculate composite serial availability for all critical user workflows to identify single points of failure.'],
      whenNotToUse: ['Do not promise Five Nines (99.999%) in a customer SLA unless you have multi-datacenter active-active infrastructure with automated instant failover.'],
      commonMistakes: [
        'Assuming you can achieve 99.99% availability while depending on an external cloud service with a 99.9% SLA: math dictates your availability cannot exceed the lowest component in a serial dependency.'
      ],
      interviewQuestion: {
        question: 'If a system consists of 3 microservices called in serial order, each with 99.9% availability, what is the composite availability?',
        answer: 'Composite availability for serial components is calculated by multiplying their individual availabilities: `A = 0.999 * 0.999 * 0.999 = (0.999)^3 = 0.997003` (approximately 99.7%). This means the combined system will experience approximately 26.2 hours of downtime per year, compared to only 8.76 hours for an individual service. To achieve high availability, you must decouple serial dependencies using asynchronous queues or fallback caches.'
      }
    },
    {
      title: 'Disaster Recovery Metrics: RPO vs. RTO',
      confidence: 'stable',
      simpleDefinition: 'RPO (Recovery Point Objective) is the maximum acceptable amount of data loss measured in time; RTO (Recovery Time Objective) is the maximum acceptable time to restore service after a disaster.',
      whyItExists: 'Every disaster recovery plan is governed by these two variables. A financial bank demands RPO = 0; a photo sharing app can tolerate RPO = 1 hour.',
      analogy: 'RPO is how often you back up your laptop: if you back up at midnight and your laptop breaks at 3 PM, you lost 15 hours of work (RPO = 15 hours). RTO is how long it takes you to go to the store, buy a new laptop, and restore files (RTO = 4 hours).',
      technicalExplanation: 'RPO (Data Loss Tolerance): Governed by data replication mechanisms. Synchronous replication (cross-AZ) achieves RPO = 0 (zero committed transaction loss). Asynchronous replication (cross-region) achieves RPO = milliseconds to seconds (replication lag). Daily database dumps achieve RPO = 24 hours. RTO (Downtime Tolerance): Governed by infrastructure automation. Multi-Region Active-Active achieves RTO = 0 (traffic shifted at DNS layer instantly). Warm Standby achieves RTO = 5-15 minutes (promoting standby DB and scaling compute). Cold Backup Restore achieves RTO = hours to days (downloading terabytes of snapshots and replaying WAL).',
      example: 'A healthcare SaaS defines RPO = 5 minutes and RTO = 30 minutes in their SOC2 compliance documentation.',
      whenToUse: ['Define RPO and RTO with business stakeholders before choosing disaster recovery architectures.'],
      whenNotToUse: ['Do not design an Active-Active multi-region architecture if the business SLA only requires RPO = 4 hours and RTO = 12 hours.'],
      commonMistakes: [
        'Confusing RPO with backup frequency: if a snapshot runs every 6 hours, your worst-case RPO is 6 hours, not zero.'
      ],
      interviewQuestion: {
        question: 'How do you design a disaster recovery strategy with RPO < 1 minute and RTO < 10 minutes between AWS regions?',
        answer: 'Implement a "Pilot Light / Warm Standby" cross-region architecture: (1) Primary Region (us-east-1) runs full active production traffic; (2) Amazon Aurora Global Database replicates storage across regions asynchronously with typical lag < 1 second (satisfies RPO < 1 min); (3) Secondary Region (us-west-2) maintains a minimal pilot light: core VPC, subnets, and an idle or scaled-down ECS/EKS cluster; (4) Route 53 Application Recovery Controller (ARC) continuously runs readiness checks; (5) On primary region disaster, trigger failover runbook: promote Aurora secondary cluster to primary writer (takes ~1 minute), scale up EKS worker pods via Terraform/HPA (takes ~5 minutes), and update Route 53 health check routing (takes ~1 minute). Total recovery time is ~7 minutes, satisfying RTO < 10 mins.'
      }
    },
    {
      title: 'Chaos Engineering & The Principle of Antifragility',
      confidence: 'stable',
      simpleDefinition: 'Chaos Engineering is the discipline of intentionally injecting failures (killing nodes, simulating network packet loss, cutting database links) into production to verify resiliency before real disasters occur.',
      whyItExists: 'Complex distributed systems fail in unpredictable emergent ways that cannot be discovered through static testing. The only way to know if failover works is to trigger it.',
      analogy: 'A vaccine: you inject a tiny, controlled dose of a pathogen into the body so the immune system develops antibodies and learns to survive the real disease.',
      technicalExplanation: 'Chaos Engineering principles (pioneered by Netflix Chaos Monkey): (1) Define "steady state" using business metrics (e.g., successful checkouts per minute); (2) Hypothesize that steady state will continue despite a specific failure (e.g., "If AZ-A dies, checkout rate will drop by < 1%"); (3) Introduce realistic production variables: kill random container pods, inject 500ms network latency via Linux `tc` (traffic control), sever DB primary connection, corrupt DNS responses; (4) Observe metrics: Did circuit breakers trip? Did traffic shift cleanly? (5) Automate experiments continuously in production during business hours when engineers are available to observe.',
      example: 'Netflix Chaos Monkey randomly terminates AWS EC2 instances during business hours. Chaos Kong simulates the failure of an entire AWS Availability Zone or Region.',
      whenToUse: ['Run chaos experiments after implementing redundancy and automated failover to validate that runbooks actually work.'],
      whenNotToUse: ['Never run chaos experiments on systems that lack baseline observability or automated rollback controls.'],
      commonMistakes: [
        'Running chaos experiments without a "blast radius containment" switch: if an experiment goes out of control, you must be able to halt it instantly.'
      ],
      interviewQuestion: {
        question: 'What is the difference between testing for failure and practicing Chaos Engineering?',
        answer: 'Testing verifies a specific known assertion under controlled conditions (e.g., "Unit test: does function X throw an error if database returns null?"). Testing passes or fails based on binary code logic. Chaos Engineering experiments explore the unknown and emergent behavior of complex distributed systems under turbulent conditions (e.g., "What happens to end-user checkout latency if the payment recommendation cache experiences 20% packet drop and 300ms latency spikes?"). Chaos engineering generates new insights about cascading failures and systemic weaknesses that cannot be predicted by unit or integration tests.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Multi-Region Warm Standby (Pilot Light)',
    technologyB: 'Multi-Region Active-Active',
    comparisonDimensions: [
      {
        dimension: 'RTO (Recovery Time)',
        optionA: '5 to 15 minutes (requires promoting standby DB and scaling compute).',
        optionB: '0 to 2 seconds (both regions actively serve traffic; DNS shifts instantly).',
        verdict: 'Active-Active wins for zero-interruption business continuity.'
      },
      {
        dimension: 'Cost & Operational Complexity',
        optionA: 'Moderate. Small standby footprint, standard async DB replication.',
        optionB: 'Extreme. 2x infrastructure cost, multi-master DB conflict resolution.',
        verdict: 'Warm Standby wins for 99% of enterprise SaaS applications.'
      },
      {
        dimension: 'Data Conflict Resolution',
        optionA: 'Zero conflict. Only one region accepts writes at any time.',
        optionB: 'Requires CRDTs, Last-Write-Wins, or complex application merge logic.',
        verdict: 'Warm Standby preserves strict ACID consistency without merge conflicts.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Availability math: Serial components multiply (`A1 * A2`), lowering overall uptime.',
      'RPO = Allowable data loss in time; RTO = Allowable downtime to restore service.',
      'Synchronous replication achieves RPO = 0; Asynchronous replication risks seconds of lost data.',
      'Warm Standby achieves RTO of minutes at a fraction of the cost of Active-Active.',
      'Chaos Engineering intentionally injects failure to verify steady-state resilience.'
    ],
    conceptualQuestions: [
      {
        id: 'q18-1',
        question: 'What is Split-Brain syndrome in distributed cluster failover?',
        answer: 'Split-Brain occurs when a network partition cuts communication between two datacenters. If both sides believe the other is dead, both promote their local database to Primary (Writer). Clients write conflicting data to both sides simultaneously, causing irreversible data corruption. Prevented via Quorum (majority consensus requiring `N/2 + 1` nodes) or external fencing tokens.'
      },
      {
        id: 'q18-2',
        question: 'What is a Fencing Token in distributed systems?',
        answer: 'A monotonically increasing number issued by a consensus coordinator (ZooKeeper/etcd) when granting a primary lease. The storage server rejects any write request carrying an older fencing token, preventing a paused or zombie former leader from overwriting data.'
      },
      {
        id: 'q18-3',
        question: 'What is MTTR and how does automated rollback reduce it?',
        answer: 'MTTR (Mean Time To Repair) measures the average duration from incident detection to full recovery. Automated canary rollbacks (e.g., Argo Rollouts auto-aborting a deployment if error rates exceed 1%) reduce MTTR from hours down to seconds without human intervention.'
      }
    ],
    designExercises: [
      {
        id: 'de18-1',
        scenario: 'A major airline’s flight reservation system requires 99.99% availability (less than 52 minutes of downtime per year).',
        task: 'Design a highly available infrastructure topology across cloud availability zones and regions.',
        solutionGuide: '1. Deploy across 3 Availability Zones in Primary Region. 2. Redundant Application Load Balancers with multi-AZ targets. 3. Stateless API servers running on Kubernetes across 3 AZs with Pod Disruption Budgets (`minAvailable: 75%`). 4. Primary database: Aurora Multi-AZ with automated 30-second failover to reader replica. 5. Cross-Region Aurora Global Database replicating asynchronously to Secondary Region (RPO < 1s). 6. Route 53 DNS with health checks for automated regional failover. 7. Continuous Chaos testing verifying automated AZ failure recovery.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq18-1',
        question: 'How do you handle data conflict resolution in an Active-Active Multi-Region database?',
        answer: 'Three standard strategies: (1) Partitioning by Geography: Direct users strictly to their home region (European users write to EU; US users write to US); cross-region conflicts are eliminated by design. (2) Conflict-Free Replicated Data Types (CRDTs): Use mathematical structures (P-N Counters, LWW-Element-Sets) that guarantee deterministic convergence regardless of message delivery order. (3) Last-Write-Wins (LWW) with TrueTime / NTP: Timestamp writes and overwrite earlier timestamps (risks silent data loss due to clock skew). For critical financial transactions, Active-Active multi-master writes should be avoided in favor of single-leader consensus.'
      }
    ],
    practicalTask: {
      title: 'Calculate Theoretical Multi-Component Availability',
      instructions: 'An application consists of an edge CDN (99.99%), an API Gateway (99.95%), a Microservice Container (99.9%), and a PostgreSQL Database (99.95%) called sequentially. Calculate the composite serial availability and the total allowable downtime per year.',
      verification: 'Serial Availability = 0.9999 * 0.9995 * 0.999 * 0.9995 = 0.998401 (99.84%). Total allowable annual downtime = 365.25 days * 24 hrs * 60 mins * (1 - 0.998401) = 525,960 mins * 0.001599 = 841 minutes (approximately 14 hours of annual downtime).'
    }
  },
  sources: [
    {
      title: 'Principles of Chaos Engineering',
      url: 'https://principlesofchaos.org/',
      type: 'Official Documentation',
      whatItSupports: 'Core tenets of hypothesis-driven failure injection and steady-state validation.'
    }
  ],
  videos: [
    {
      title: 'Reliability Engineering: Resilience and Chaos in Practice',
      creator: 'InfoQ (Nora Jones)',
      duration: '45m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Chaos engineering methodologies, incident analysis, and building fault-tolerant cloud services.',
      url: 'https://www.youtube.com/watch?v=kYJj3d4b1aI'
    }
  ]
};
