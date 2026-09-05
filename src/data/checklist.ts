import { ArchitectureChecklistItem } from '../types';

export const ARCHITECTURE_CHECKLIST: ArchitectureChecklistItem[] = [
  {
    step: 1,
    category: 'Step 1: Clarify Scope & Functional Requirements (3-5 mins)',
    description: 'Never start drawing boxes before defining explicit system boundaries, user personas, and constraints.',
    keyQuestionsToAsk: [
      'What are the core 3-4 user actions (e.g. can users delete posts, edit them, or only append)?',
      'Who are the clients: Web browsers, mobile apps, or backend automated microservice APIs?',
      'Are there geographic distribution requirements (global multi-region vs single-region)?',
      'What are the non-functional targets: Availability (99.9% vs 99.99%), Latency (p99 < 100ms), and Consistency (Strong vs Eventual)?'
    ],
    commonRedFlags: [
      'Assuming features that were not requested (e.g. adding video transcoding when asked to design Twitter text tweets).',
      'Failing to ask about read vs write dominance.'
    ]
  },
  {
    step: 2,
    category: 'Step 2: Back-of-the-Envelope Capacity Estimation (5 mins)',
    description: 'Establish the quantitative order-of-magnitude scale to guide database and networking choices.',
    keyQuestionsToAsk: [
      'What is the Daily Active User (DAU) or Monthly Active User (MAU) count?',
      'What is the Read-to-Write ratio (e.g. 100:1 for social feeds vs 1:1 for messaging)?',
      'What is the Average Queries Per Second (QPS) = Total Daily Requests / 86,400 (rule of thumb: / 100,000)?',
      'What is the Peak QPS factor (typically 2x to 5x average)?',
      'What is the Storage growth per day and across 5 years including replication (3x)?',
      'What is the Network Ingress and Egress Bandwidth (QPS * average payload size)?'
    ],
    commonRedFlags: [
      'Confusing bits (Gbps network) and bytes (GB memory/storage). 1 Byte = 8 bits.',
      'Forgetting to multiply storage by 3x replication factor.'
    ]
  },
  {
    step: 3,
    category: 'Step 3: High-Level Architecture & API Contracts (10-12 mins)',
    description: 'Sketch the complete end-to-end data flow from client to storage engines.',
    keyQuestionsToAsk: [
      'What are the clean REST / gRPC endpoint definitions with idempotent request keys?',
      'Where is the API Gateway, SSL termination, and rate-limiting layer positioned?',
      'Are services stateless to allow horizontal auto-scaling behind an Application Load Balancer?',
      'What are the primary data models, entities, and primary partition keys?'
    ],
    commonRedFlags: [
      'Creating monolithic database schemas with no clear partition or sharding strategy.',
      'Connecting client apps directly to databases without an API Gateway or service boundary.'
    ]
  },
  {
    step: 4,
    category: 'Step 4: Deep Dive Component Engineering (15 mins)',
    description: 'Drill into the hardest 1 or 2 architectural challenges requested by the interviewer.',
    keyQuestionsToAsk: [
      'Storage engine selection: Relational (PostgreSQL ACID B-Tree) vs NoSQL (Cassandra/DynamoDB LSM-Tree) vs In-Memory (Redis).',
      'Caching strategy: Cache-Aside vs Write-Through; Cache invalidation & TTL; Eviction (LRU/LFU); Thundering herd protection.',
      'Messaging & Asynchrony: Kafka (event log replay) vs SQS/RabbitMQ (transient task queues); Outbox Pattern for dual-write safety.',
      'Distributed coordination: Consensus (Raft/Paxos), Distributed Locks (Redlock with TTL vs etcd leases).'
    ],
    commonRedFlags: [
      'Using Redis as a durable database without explaining AOF/RDB persistence and memory ceiling.',
      'Claiming two microservices write to separate databases synchronously without addressing partial failure.'
    ]
  },
  {
    step: 5,
    category: 'Step 5: Bottlenecks, Resilience, Security & Cost (5-8 mins)',
    description: 'Demonstrate senior staff-level maturity by proactively identifying failure modes and mitigations.',
    keyQuestionsToAsk: [
      'Single Point of Failure (SPOF) audit: What happens if Master DB dies? (Automated failover via Patroni/Raft).',
      'Network partition: How does the system handle split-brain? (Quorum reads/writes: R + W > N).',
      'Cascading failures: Circuit breakers, token bucket rate limiters, client backpressure, and hedged requests.',
      'Security: mTLS between microservices, KMS envelope encryption at rest, Row-Level Security for multi-tenancy.',
      'Observability: OpenTelemetry distributed tracing, Prometheus RED metrics, and structured audit logs.'
    ],
    commonRedFlags: [
      'Saying "the system will never fail because AWS is reliable".',
      'Neglecting observability and disaster recovery (RPO and RTO).'
    ]
  }
];
