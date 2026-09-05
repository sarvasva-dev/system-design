import { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'CAP Theorem',
    category: 'Distributed Systems',
    simpleMeaning: 'In a network with broken communication wires (Partition), a distributed system can either stay accurate (Consistency) or keep answering (Availability), but not both.',
    technicalMeaning: 'Formulated by Eric Brewer and formally proven by Gilbert and Lynch: in any asynchronous network subject to partitions (P), a distributed data store can guarantee at most two of: Consistency (Linearizability), Availability (every non-failing node returns a non-error response), and Partition Tolerance.',
    example: 'CockroachDB and Spanner are CP systems (prioritizing linearizable correctness); Cassandra and DynamoDB are AP systems (prioritizing continuous writes over immediate consistency).'
  },
  {
    term: 'PACELC Theorem',
    category: 'Distributed Systems',
    simpleMeaning: 'An extension of CAP: even when the network is working fine (Else), you still have to choose between Latency (speed) and Consistency (accuracy).',
    technicalMeaning: 'Formulated by Daniel Abadi: If there is a Partition (P), trade off Availability (A) vs Consistency (C); Else (E), trade off Latency (L) vs Consistency (C).',
    example: 'Amazon DynamoDB allows users to configure consistency: Strong Consistency (higher latency, C) or Eventual Consistency (sub-10ms response, L).'
  },
  {
    term: 'Write-Ahead Log (WAL)',
    category: 'Databases',
    simpleMeaning: 'Writing the change to an append-only log file on disk before updating the actual database tables.',
    technicalMeaning: 'An append-only sequential log where all state mutations are recorded before being applied to the in-memory buffer pool or on-disk B-Tree pages, ensuring Atomicity and Durability (ACID) during unexpected crashes.',
    example: 'PostgreSQL WAL (`pg_wal`) and MySQL Redo Log allow the database to recover uncheckpointed transactions upon rebooting after a power loss.'
  },
  {
    term: 'LSM-Tree (Log-Structured Merge-Tree)',
    category: 'Databases',
    simpleMeaning: 'A storage engine that writes changes to memory (MemTable) and flushes them to disk as immutable sorted files (SSTables), optimized for fast writes.',
    technicalMeaning: 'A data structure that converts random writes into high-throughput sequential writes. Mutations are written to a WAL and an in-memory MemTable (SkipList). When full, the MemTable is flushed to disk as an immutable Sorted String Table (SSTable). Background compactions merge SSTables to reclaim space.',
    example: 'Apache Cassandra, RocksDB, and ScyllaDB use LSM-Trees to sustain 100,000+ writes/second per node.'
  },
  {
    term: 'B+ Tree',
    category: 'Databases',
    simpleMeaning: 'A balanced search tree where all data rows are stored in sorted leaf nodes, optimized for fast reads and range queries on disk.',
    technicalMeaning: 'A self-balancing N-ary search tree with a high branching factor (typically 100-500) matching disk page sizes (4KB-16KB). Internal nodes store only routing keys; leaf nodes store pointers to data rows and are linked sequentially for O(log N) point lookups and fast range scans.',
    example: 'PostgreSQL and MySQL InnoDB use B+ Trees for primary keys and secondary indexes.'
  },
  {
    term: 'Consistent Hashing',
    category: 'Distributed Systems',
    simpleMeaning: 'Arranging servers and data keys on a virtual circle so that adding or removing a server only moves a tiny fraction of the data.',
    technicalMeaning: 'Maps both nodes and data keys to a 360-degree hash ring (0 to 2^32 - 1) using MD5/SHA-1. A key is stored on the first node encountered moving clockwise. Virtual nodes (vnodes) are used to distribute load evenly across physical servers, ensuring only K/N keys are migrated upon node topology changes.',
    example: 'Amazon Dynamo, Discord voice channel routing, and Memcached clusters use consistent hashing.'
  },
  {
    term: 'CRDT (Conflict-Free Replicated Data Type)',
    category: 'Distributed Systems',
    simpleMeaning: 'A mathematical data structure that allows multiple computers to edit the same data offline and merge changes automatically with zero conflicts.',
    technicalMeaning: 'Data types (State-based or Operation-based) whose concurrent mutations form a semilattice with a join operator that is commutative, associative, and idempotent. This guarantees strong eventual consistency: any two replicas that have received the same set of updates will converge to the exact same state.',
    example: 'Figma, Notion, and Apple Notes use CRDTs (Yjs, Automerge) for real-time collaborative editing.'
  },
  {
    term: 'Transactional Outbox Pattern',
    category: 'Messaging',
    simpleMeaning: 'Writing the database change and the outgoing message into the SAME local database transaction to prevent losing events.',
    technicalMeaning: 'Solves the Dual-Write problem in microservices. The business transaction inserts both the domain entity and an event record into an `outbox` table in a single local ACID transaction. An asynchronous Change Data Capture (CDC) process (Debezium) tails the database WAL and relays the event to Kafka.',
    example: 'Ensuring that creating an order and emitting an `OrderCreated` Kafka event succeed or fail together atomically.'
  },
  {
    term: 'Row-Level Security (RLS)',
    category: 'SaaS Architecture',
    simpleMeaning: 'A database feature that automatically hides rows belonging to other tenants, even if your application code forgets to filter by tenant.',
    technicalMeaning: 'A security mechanism built into the relational database engine (PostgreSQL, SQL Server) that evaluates a security policy expression against every row during query planning, restricting `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations based on session parameters like `current_setting(\'app.current_tenant\')`.',
    example: 'Multi-tenant SaaS platforms enforce RLS so a bug in a GraphQL or REST query cannot leak data across corporate workspaces.'
  },
  {
    term: 'Envelope Encryption',
    category: 'Security',
    simpleMeaning: 'Encrypting your data with a local key, and encrypting that local key with a master key locked inside a secure hardware chip.',
    technicalMeaning: 'A cryptographic practice where a payload is encrypted locally with a symmetric Data Encryption Key (DEK). The DEK is then encrypted with a Key Encryption Key (KEK) protected inside a Hardware Security Module (HSM / AWS KMS). The encrypted DEK is stored alongside the ciphertext.',
    example: 'AWS S3 SSE-KMS uses envelope encryption to protect petabytes of data without exporting master keys from HSMs.'
  },
  {
    term: 'AWS Nitro System',
    category: 'IaaS & Cloud',
    simpleMeaning: 'Custom hardware microchips that handle networking and storage so 100% of the physical server’s CPU is dedicated to running customer VMs.',
    technicalMeaning: 'A collection of custom PCIe ASIC hardware cards (Nitro Card for VPC, Nitro Card for EBS, Nitro Security Chip) that offload hypervisor virtualization tasks (networking encapsulation, storage encryption, device emulation) from the host CPU, enabling near-bare-metal performance with zero hypervisor tax.',
    example: 'Powers all modern AWS EC2 instance types (c5, m5, r5 and newer) and Bare Metal instances.'
  },
  {
    term: 'Little’s Law',
    category: 'Performance Engineering',
    simpleMeaning: 'A mathematical formula stating that the number of requests inside a system equals the arrival rate multiplied by the average response time.',
    technicalMeaning: 'L = λ * W. In a stable queuing system, the average number of items in a system (L) equals the average arrival rate (λ) multiplied by the average time an item spends in the system (W). Used to size thread pools and socket buffers.',
    example: 'If a service receives 2,000 requests/sec with an average latency of 50ms (0.05s), it maintains 100 concurrent requests in flight.'
  },
  {
    term: 'Amdahl’s Law',
    category: 'Performance Engineering',
    simpleMeaning: 'A law proving that adding more computers or CPU cores will never make a job faster than its strictly serial (un-parallelizable) part.',
    technicalMeaning: 'Speedup = 1 / ((1 - P) + (P / N)). Where P is the parallelizable fraction of the program and N is the number of processors. If 10% of a task is serial, the maximum possible speedup with infinite cores is 10x.',
    example: 'Explains why scaling a distributed batch job to 1,000 nodes yields diminishing returns if 5% of the runtime is spent acquiring a global database lock.'
  },
  {
    term: 'OpenTelemetry (OTel)',
    category: 'Observability',
    simpleMeaning: 'A universal, vendor-neutral standard for generating and collecting metrics, logs, and distributed traces from applications.',
    technicalMeaning: 'A CNCF open-source observability framework comprising standard APIs, SDKs, tools, and the OpenTelemetry Protocol (OTLP) to instrument, generate, and export telemetry data to backends (Jaeger, Prometheus, Datadog) without vendor lock-in.',
    example: 'Injecting W3C `traceparent` HTTP headers across microservices to trace a customer request end-to-end across 30 services.'
  },
  {
    term: 'Circuit Breaker',
    category: 'Reliability',
    simpleMeaning: 'A software switch that stops sending requests to a failing service so it has time to recover instead of crashing your whole system.',
    technicalMeaning: 'A resilience design pattern with three states: CLOSED (normal), OPEN (fast-failing immediately without calling downstream), and HALF-OPEN (probing with limited trial requests). Trips when downstream error rates exceed a configurable threshold.',
    example: 'Resilience4j or Envoy wrapping remote payment gateway calls to prevent thread pool exhaustion during Stripe outages.'
  }
];
