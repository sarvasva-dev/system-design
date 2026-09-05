import { VerifiedSource, VerifiedVideo } from '../types';

export const GLOBAL_VERIFIED_SOURCES: VerifiedSource[] = [
  {
    title: 'RFC 9110: HTTP Semantics (Replaces RFC 7231)',
    url: 'https://datatracker.ietf.org/doc/html/rfc9110',
    type: 'RFC / Standard',
    whatItSupports: 'Defines modern HTTP architecture, status codes, idempotent and safe method semantics, and cache control headers.'
  },
  {
    title: 'RFC 9113: HTTP/2 (Replaces RFC 7540)',
    url: 'https://datatracker.ietf.org/doc/html/rfc9113',
    type: 'RFC / Standard',
    whatItSupports: 'Binary framing, stream multiplexing over a single TCP connection, HPACK header compression, and stream prioritization.'
  },
  {
    title: 'RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport',
    url: 'https://datatracker.ietf.org/doc/html/rfc9000',
    type: 'RFC / Standard',
    whatItSupports: 'Underlying transport for HTTP/3, zero-RTT connection establishment, connection migration across IP changes, and eliminating TCP Head-of-Line blocking.'
  },
  {
    title: 'RFC 6749: The OAuth 2.0 Authorization Framework',
    url: 'https://datatracker.ietf.org/doc/html/rfc6749',
    type: 'RFC / Standard',
    whatItSupports: 'Authorization flows (Authorization Code, Client Credentials, Refresh Token), token issuance, and scoped delegation.'
  },
  {
    title: 'RFC 7519: JSON Web Token (JWT)',
    url: 'https://datatracker.ietf.org/doc/html/rfc7519',
    type: 'RFC / Standard',
    whatItSupports: 'Compact, URL-safe means of representing claims to be transferred between two parties with HMAC or RSA/ECDSA digital signatures.'
  },
  {
    title: 'RFC 6455: The WebSocket Protocol',
    url: 'https://datatracker.ietf.org/doc/html/rfc6455',
    type: 'RFC / Standard',
    whatItSupports: 'Full-duplex bidirectional persistent communication channels over a single TCP connection initiated via HTTP Upgrade.'
  },
  {
    title: 'AWS Whitepaper: SaaS Architecture Fundamentals',
    url: 'https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/introduction.html',
    type: 'Official Documentation',
    whatItSupports: 'Core multi-tenant models (Silo vs. Pool vs. Bridge), tenant isolation strategies, control plane vs. application plane, and SaaS identity routing.'
  },
  {
    title: 'AWS Nitro System Architecture Guide',
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-nitro-system/aws-nitro-system.html',
    type: 'Official Documentation',
    whatItSupports: 'Hardware-offloaded IaaS virtualization, Nitro Cards (VPC, EBS, Local Storage), minimal KVM-based hypervisor, and elimination of Dom0 overhead.'
  },
  {
    title: 'In Search of an Understandable Consensus Algorithm (Raft)',
    url: 'https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro',
    type: 'Research Paper',
    whatItSupports: 'Ongaro & Ousterhout (USENIX ATC 2014): Leader election, log replication, safety invariants, and joint consensus cluster membership changes.'
  },
  {
    title: 'Spanner: Google’s Globally-Distributed Database',
    url: 'https://www.usenix.org/conference/osdi12/technical-sessions/presentation/corbett',
    type: 'Research Paper',
    whatItSupports: 'Corbett et al. (OSDI 2012): TrueTime API with bounded clock uncertainty, external consistency, linearizable distributed transactions across continents.'
  },
  {
    title: 'Andromeda: Performance, Isolation, and Agility at Scale in Cloud Network Virtualization',
    url: 'https://www.usenix.org/conference/nsdi18/presentation/dalton',
    type: 'Research Paper',
    whatItSupports: 'Dalton et al. (USENIX NSDI 2018): Software-defined networking (SDN) data-plane offloading, OpenFlow flow rules, packet processing pipeline in Google Cloud.'
  },
  {
    title: 'Large-scale cluster management at Google with Borg',
    url: 'https://dl.acm.org/doi/10.1145/2741948.2741964',
    type: 'Research Paper',
    whatItSupports: 'Verma et al. (EuroSys 2015): Borgmaster, Borglet, cell architecture, priority scheduling, quota management, the direct architectural ancestor of Kubernetes.'
  },
  {
    title: 'PostgreSQL Documentation: Concurrency Control & MVCC',
    url: 'https://www.postgresql.org/docs/current/mvcc.html',
    type: 'Official Documentation',
    whatItSupports: 'Snapshot isolation, Read Committed vs. Repeatable Read vs. Serializable, transaction IDs (xmin/xmax), vacuuming, and write lock semantics.'
  },
  {
    title: 'PostgreSQL Documentation: B-Tree Index Internals',
    url: 'https://www.postgresql.org/docs/current/btree-intro.html',
    type: 'Official Documentation',
    whatItSupports: 'Lehman & Yao high-concurrency B-Tree algorithm, page layout, right-sibling pointers, leaf node chaining, and index scans.'
  },
  {
    title: 'Redis Documentation: Persistence Demystified (RDB & AOF)',
    url: 'https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/',
    type: 'Official Documentation',
    whatItSupports: 'Point-in-time RDB snapshots via fork() copy-on-write, Append Only File (AOF) fsync policies (always, everysec, no), and AOF background rewrite.'
  },
  {
    title: 'Apache Kafka Documentation: Design & Storage Architecture',
    url: 'https://kafka.apache.org/documentation/#design',
    type: 'Official Documentation',
    whatItSupports: 'Sequential disk I/O, OS page cache utilization, zero-copy sendfile syscalls, immutable append-only commit logs, partitions, and consumer groups.'
  },
  {
    title: 'Kubernetes Documentation: Cluster Architecture & Components',
    url: 'https://kubernetes.io/docs/concepts/overview/components/',
    type: 'Official Documentation',
    whatItSupports: 'Control plane (kube-apiserver, etcd, kube-scheduler, kube-controller-manager) and worker node agents (kubelet, kube-proxy, container runtime).'
  },
  {
    title: 'OpenTelemetry Specification: Trace Context & Data Model',
    url: 'https://opentelemetry.io/docs/specs/otel/overview/',
    type: 'Official Documentation',
    whatItSupports: 'W3C TraceContext standards, span hierarchies, baggage propagation, OTLP protocol, collectors, and semantic conventions.'
  },
  {
    title: 'Stripe Documentation: Designing Robust Webhook Handlers & Idempotency',
    url: 'https://docs.stripe.com/webhooks',
    type: 'Official Documentation',
    whatItSupports: 'HMAC-SHA256 signature verification, idempotency keys, replay attack prevention with timestamp tolerances, and exponential backoff delivery.'
  }
];

export const VERIFIED_FEATURED_VIDEOS: VerifiedVideo[] = [
  {
    title: 'Distributed Systems 1.1: Introduction',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '1h 10m',
    difficulty: 'Beginner',
    whatYouWillLearn: 'Fundamental definition of distributed systems, motivations (latency, fault tolerance, scaling), and core distributed failure modes.',
    url: 'https://www.youtube.com/watch?v=UEAMfLPZZhE'
  },
  {
    title: 'Distributed Systems 1.2: Computer networking',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '45m',
    difficulty: 'Beginner',
    whatYouWillLearn: 'Packet switching, IP routing, TCP byte streams vs. UDP datagrams, latency vs. bandwidth, and real-world network links.',
    url: 'https://www.youtube.com/watch?v=1F3DEq8ML1U'
  },
  {
    title: 'Distributed Systems 1.3: RPC (Remote Procedure Call)',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '42m',
    difficulty: 'Beginner',
    whatYouWillLearn: 'RPC semantics, serialization (JSON, Protobuf), at-most-once vs. at-least-once invocation, and network timeouts.',
    url: 'https://www.youtube.com/watch?v=S2osKiqQG9s'
  },
  {
    title: 'Distributed Systems 2.1: The two generals problem',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '38m',
    difficulty: 'Intermediate',
    whatYouWillLearn: 'Impossibility of guaranteed consensus over lossy channels, common knowledge theory, and idempotent real-world mitigations.',
    url: 'https://www.youtube.com/watch?v=MDuWnzVnfpI'
  },
  {
    title: 'Distributed Systems 3.2: Clock synchronisation',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '40m',
    difficulty: 'Intermediate',
    whatYouWillLearn: 'Network Time Protocol (NTP), Cristian’s algorithm, clock skew and drift, monotonic vs. wall-clock time, and Google TrueTime.',
    url: 'https://www.youtube.com/watch?v=mAyW-4LeXZo'
  },
  {
    title: 'Distributed Systems 6.2: Raft',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '50m',
    difficulty: 'Advanced',
    whatYouWillLearn: 'Step-by-step breakdown of Raft leader election, heartbeats, log consistency check, term numbers, and commit index rules.',
    url: 'https://www.youtube.com/watch?v=uXEYuDwm7e4'
  },
  {
    title: 'Distributed Systems 7.1: Two-phase commit (2PC)',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '44m',
    difficulty: 'Advanced',
    whatYouWillLearn: 'Atomic commitment across multiple database nodes, coordinator prepare and commit phases, and blocking coordinator failure states.',
    url: 'https://www.youtube.com/watch?v=-_rdWB9hN1c'
  },
  {
    title: 'Distributed Systems 7.2: Linearizability',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '48m',
    difficulty: 'Advanced',
    whatYouWillLearn: 'Strongest single-object consistency model, real-time ordering constraints, differentiating linearizability from serializability.',
    url: 'https://www.youtube.com/watch?v=noUNH3jDLC0'
  },
  {
    title: 'Distributed Systems 8.2: Google’s Spanner',
    creator: 'Martin Kleppmann (University of Cambridge)',
    duration: '52m',
    difficulty: 'Advanced',
    whatYouWillLearn: 'TrueTime atomic clocks and GPS receivers, external consistency, multi-version timestamp ordering, Paxos groups, and two-phase locking.',
    url: 'https://www.youtube.com/watch?v=oeycOVX70aE'
  },
  {
    title: 'AWS re:Invent 2021 - Powering next-gen Amazon EC2: Deep dive on the Nitro System',
    creator: 'AWS Events (Amazon Web Services)',
    duration: '54m',
    difficulty: 'Advanced',
    whatYouWillLearn: 'Deconstruction of hypervisor tasks into dedicated Nitro ASIC cards (VPC, EBS, Local NVMe, Security), zero Dom0 overhead, and bare-metal performance.',
    url: 'https://www.youtube.com/watch?v=2uc1vaEsPXU'
  },
  {
    title: 'Microservices • Martin Fowler • GOTO 2014',
    creator: 'GOTO Conferences (Martin Fowler)',
    duration: '26m',
    difficulty: 'Intermediate',
    whatYouWillLearn: 'Canonical definition of microservices: componentization via services, organization around business capabilities, smart endpoints and dumb pipes, decentralized governance.',
    url: 'https://www.youtube.com/watch?v=wgdBVIX9ifA'
  },
  {
    title: 'When To Use Microservices (And When Not To!) • Sam Newman & Martin Fowler',
    creator: 'GOTO Conferences',
    duration: '42m',
    difficulty: 'Intermediate',
    whatYouWillLearn: 'When a monolith or modular monolith is superior, team cognitive load, distributed transaction hazards, independent deployability tests.',
    url: 'https://www.youtube.com/watch?v=GBTdnfD6s5Q'
  },
  {
    title: '01 - Course Introduction & Relational Model (CMU Databases Systems / Fall 2019)',
    creator: 'CMU Database Group (Prof. Andy Pavlo)',
    duration: '1h 06m',
    difficulty: 'Beginner',
    whatYouWillLearn: 'Relational algebra, schema normalization, physical vs. logical data independence, and relational DBMS memory architecture.',
    url: 'https://www.youtube.com/watch?v=oeYBdghaIjc'
  },
  {
    title: 'What is Apache Kafka®?',
    creator: 'Confluent Developer',
    duration: '10m',
    difficulty: 'Beginner',
    whatYouWillLearn: 'Event streaming fundamentals, commit log paradigm, topics, partitions, producers, and consumer group offset management.',
    url: 'https://www.youtube.com/watch?v=06iRM1Ghr1k'
  },
  {
    title: 'The Illustrated Children’s Guide to Kubernetes',
    creator: 'CNCF [Cloud Native Computing Foundation]',
    duration: '9m',
    difficulty: 'Beginner',
    whatYouWillLearn: 'Intuitive visual journey explaining Pods, ReplicaSets, Deployments, Services, and Ingress through the story of Phippy the PHP app.',
    url: 'https://www.youtube.com/watch?v=3I9PkvZ80BQ'
  }
];
