import { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'CAP Theorem',
    category: 'Distributed Systems',
    simpleMeaning: 'In a network with broken communication wires (Partition), a distributed system can either stay accurate (Consistency) or keep answering (Availability), but not both.',
    technicalMeaning: 'Formulated by Eric Brewer and formally proven by Gilbert and Lynch: in any asynchronous network subject to partitions (P), a distributed data store can guarantee at most two of: Consistency (Linearizability), Availability (every non-failing node returns a non-error response), and Partition Tolerance.',
    example: 'CockroachDB and Spanner are CP systems (prioritizing linearizable correctness); Cassandra and DynamoDB are AP systems (prioritizing continuous writes over immediate consistency).',
    interviewQuestions: [
      {
        question: 'Why is Network Partition (P) unavoidable in real-world distributed systems, and how do you choose between CP and AP when designing an E-commerce Checkout vs. Social Media Feed?',
        companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
        level: 'L5 (Senior)',
        detailedAnswer: 'In distributed physical infrastructure, network cables get cut, switches fail, cross-region fiber links suffer BGP flapping, and GC pauses mimic node failures. Therefore, Partition Tolerance (P) is a physical reality of networking, not an architectural option. The real choice during a network split is strictly between Consistency (C) and Availability (A).\n\n1. E-Commerce Checkout / Bank Ledger (CP):\nIf the inventory service is partitioned between East and West datacenters, allowing both to decrement stock for the last remaining iPhone results in catastrophic overselling. Here, we must reject writes on the minority partition (sacrifice Availability) to guarantee linearizable consistency (C).\n\n2. Social Media Feed / Tweet Likes (AP):\nIf a user likes a post on a partitioned replica, showing 1,002 likes in Europe and 1,003 likes in the US for 5 seconds harms no one. The system accepts the write locally and reconciles via CRDTs or Last-Write-Wins (LWW) once the partition heals, prioritizing 100% Availability.',
        keyPoints: [
          'P is mandatory because networks are inherently unreliable (FLP Impossibility & fallacies of distributed computing).',
          'CP systems reject writes or timeout on minority partitions to prevent split-brain and stale reads.',
          'AP systems accept writes on any partition and use conflict resolution (vector clocks, CRDTs, LWW) later.',
          'Mention that Brewer himself later clarified that CAP is not binary: systems can operate with sub-document tunable consistency.'
        ],
        interviewerFollowUp: 'What if an interviewer asks: "Can a system be CA (Consistent and Available)?"',
        followUpAnswer: 'CA only exists in a single-machine database (like standalone SQLite or MySQL on one box) where network partitions cannot happen. In any distributed system with multiple nodes across a network, CA is physically impossible because an unpartitionable network cannot be guaranteed.'
      }
    ]
  },
  {
    term: 'PACELC Theorem',
    category: 'Distributed Systems',
    simpleMeaning: 'An extension of CAP: even when the network is working fine (Else), you still have to choose between Latency (speed) and Consistency (accuracy).',
    technicalMeaning: 'Formulated by Daniel Abadi: If there is a Partition (P), trade off Availability (A) vs Consistency (C); Else (E), trade off Latency (L) vs Consistency (C).',
    example: 'Amazon DynamoDB allows users to configure consistency: Strong Consistency (higher latency, C) or Eventual Consistency (sub-10ms response, L).',
    interviewQuestions: [
      {
        question: 'How does PACELC go beyond CAP in practical system design, and how does DynamoDB or Cassandra classify under PACELC?',
        companies: ['Amazon', 'Meta', 'Netflix'],
        level: 'L5 (Senior)',
        detailedAnswer: 'CAP Theorem only describes system behavior during rare network partitions (< 0.1% of the time). PACELC answers the 99.9% normal operating state: even when everything is healthy (Else), sending synchronous network roundtrips to 3 replicas to guarantee strong consistency inherently increases request latency (L vs C).\n\n- DynamoDB default reads: PA/EL (Partition -> Available; Else -> Latency-optimized eventual consistency with sub-5ms latency).\n- DynamoDB with Strongly Consistent Read flag: PC/EC (Partition -> Consistent; Else -> High consistency at the cost of higher RTT and double read capacity units).\n- MongoDB: PC/EC by default (writes to primary, reads from primary unless readPreference=secondary is set, which shifts it to PA/EL).',
        keyPoints: [
          'PACELC covers normal latency trade-offs that CAP completely ignores.',
          'Synchronous replication increases tail latency (p99/p999) because the client waits for the slowest replica.',
          'Asynchronous replication delivers ultra-low latency but opens a dirty read/replication lag window.'
        ],
        interviewerFollowUp: 'How do you convince an interviewer you understand tail latency in PACELC?',
        followUpAnswer: 'Explain that in a quorum write where W=2 out of 3 replicas, your p99 latency is bounded by the second fastest node, whereas W=3 binds your p99 latency to the slowest outlier node in the cluster.'
      }
    ]
  },
  {
    term: 'Write-Ahead Log (WAL)',
    category: 'Databases',
    simpleMeaning: 'Writing the change to an append-only log file on disk before updating the actual database tables.',
    technicalMeaning: 'An append-only sequential log where all state mutations are recorded before being applied to the in-memory buffer pool or on-disk B-Tree pages, ensuring Atomicity and Durability (ACID) during unexpected crashes.',
    example: 'PostgreSQL WAL (pg_wal) and MySQL Redo Log allow the database to recover uncheckpointed transactions upon rebooting after a power loss.',
    interviewQuestions: [
      {
        question: 'How does a Write-Ahead Log (WAL) guarantee durability while still maintaining high throughput in modern relational databases?',
        companies: ['Google', 'Meta', 'Uber', 'Amazon'],
        level: 'L5 (Senior)',
        detailedAnswer: 'Modifying relational database tables (like PostgreSQL or MySQL InnoDB) requires updating in-memory pages and disk B-Trees at arbitrary random memory/disk offsets. If a power outage occurs before all dirty pages are written to disk, data is corrupted.\n\nWAL guarantees durability through two principles:\n1. Sequential I/O vs Random I/O: Appending a binary mutation log record to the end of a file is pure sequential disk I/O, which HDD heads do at 150MB/s and modern NVMe SSDs do at 3-7 GB/s with near-zero seek latency.\n2. In-Memory Buffer Pool & Background Checkpointing: Once the WAL entry is fsynced to disk, the transaction is declared committed and safe. The database updates its in-memory buffer pool immediately and lazily flushes dirty pages to the actual table files in the background during periodic checkpoints. If the server crashes, it reads the WAL from the last checkpoint forward and replays all committed transactions.',
        keyPoints: [
          'Sequential append-only writes bypass random B-Tree page seek overhead.',
          'Fsync guarantees bytes are physically written to non-volatile storage, not just OS page cache.',
          'Group Commit batches multiple concurrent transactions into a single disk fsync call to maximize IOPS efficiency.',
          'WAL also serves as the source of truth for Read Replicas via Physical Replication Streams and CDC tools (Debezium).'
        ],
        interviewerFollowUp: 'What is the danger of setting fsync=off or innodb_flush_log_at_trx_commit=2 in production?',
        followUpAnswer: 'It boosts write performance by leaving log records in the OS buffer cache instead of flushing to disk. However, if the OS crashes or the physical server loses power, up to 1-2 seconds of recently acknowledged customer transactions are irreversibly lost.'
      }
    ]
  },
  {
    term: 'LSM-Tree (Log-Structured Merge-Tree)',
    category: 'Databases',
    simpleMeaning: 'A storage engine that writes changes to memory (MemTable) and flushes them to disk as immutable sorted files (SSTables), optimized for fast writes.',
    technicalMeaning: 'A data structure that converts random writes into high-throughput sequential writes. Mutations are written to a WAL and an in-memory MemTable (SkipList). When full, the MemTable is flushed to disk as an immutable Sorted String Table (SSTable). Background compactions merge SSTables to reclaim space.',
    example: 'Apache Cassandra, RocksDB, and ScyllaDB use LSM-Trees to sustain 100,000+ writes/second per node.',
    interviewQuestions: [
      {
        question: 'Compare LSM-Trees vs B+ Trees. Why do high-write systems like Cassandra or RocksDB use LSM-Trees while OLTP systems like PostgreSQL use B+ Trees?',
        companies: ['Meta', 'Google', 'Amazon', 'Apple'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. Write Path:\n- B+ Tree (In-place updates): Requires modifying internal tree pages and leaf pages on disk. A single logical row write can cause multiple random disk I/O operations (splitting pages, rewriting 4KB/8KB blocks). Write amplification is high.\n- LSM-Tree (Append-only): Writes sequentially to a WAL and inserts into an in-memory SkipList (MemTable). Writes never perform random disk seeks! Once MemTable reaches ~64MB, it flushes to disk as an immutable SSTable in one fast sequential write. Write throughput is 5-10x higher than B+ Trees.\n\n2. Read Path:\n- B+ Tree: Fast point lookups in O(log N) and deterministic range scans because data is sorted on disk in a single unified hierarchy. Read amplification is low (1-3 page reads).\n- LSM-Tree: To read a key, the engine checks MemTable, then Level 0 SSTables, then deeper levels. If the key doesn\'t exist, it might check 10 different files on disk (Read Amplification). LSM engines mitigate this using in-memory Bloom Filters to skip files that don\'t contain the key.',
        keyPoints: [
          'LSM-Trees trade off Read performance and Background Compaction CPU/IOPS for blazing Write throughput.',
          'Compaction (Size-Tiered vs Leveled) merges older SSTables, removes tombstones (deletes), and deduplicates keys.',
          'Compaction Spikes can cause tail latency jitter (p99/p999 latency spikes) under heavy sustained write workloads.'
        ],
        interviewerFollowUp: 'How do deletes work in an LSM-Tree if SSTables are immutable?',
        followUpAnswer: 'LSM-Trees do not delete data in-place. They write a "tombstone" marker for that key into the MemTable. During subsequent reads, the tombstone tells the engine the key is deleted. During background compaction, the engine discards both the old value and the tombstone, reclaiming disk space.'
      }
    ]
  },
  {
    term: 'Consistent Hashing',
    category: 'Distributed Systems',
    simpleMeaning: 'Arranging servers and data keys on a virtual circle so that adding or removing a server only moves a tiny fraction of the data.',
    technicalMeaning: 'Maps both nodes and data keys to a 360-degree hash ring (0 to 2^32 - 1) using MD5/SHA-1. A key is stored on the first node encountered moving clockwise. Virtual nodes (vnodes) are used to distribute load evenly across physical servers, ensuring only K/N keys are migrated upon node topology changes.',
    example: 'Amazon Dynamo, Discord voice channel routing, and Memcached clusters use consistent hashing.',
    interviewQuestions: [
      {
        question: 'Why does traditional modulo hashing (hash(key) % N) fail in distributed caches, and how do Virtual Nodes in Consistent Hashing prevent hot spots?',
        companies: ['Amazon', 'Google', 'Meta', 'Netflix', 'Uber'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. Failure of Modulo Hashing:\nIf you have N=10 cache servers and cache key X routes to hash(key) % 10. If 1 server crashes, N becomes 9. Suddenly, almost 100% of all keys re-hash to different servers (hash(key) % 9). This causes a total cache invalidation stampede, sending millions of requests directly to the database, instantly crashing it.\n\n2. Consistent Hashing:\nMaps keys and servers to an identical 360° integer ring [0, 2^32 - 1]. When a server is added or removed, only keys between that server and its adjacent neighbor (on average K/N keys) need to be reassigned. The remaining (N-1)/N keys stay on their existing servers.\n\n3. Virtual Nodes (vnodes):\nWithout virtual nodes, physical servers end up non-uniformly distributed on the ring, creating huge arcs of responsibility and hot spots. By assigning each physical server 100-256 virtual tokens (e.g., nodeA#1, nodeA#2, nodeA#3) scattered evenly across the ring, load distributes uniformly. Furthermore, heterogenous servers with 2x RAM/CPU can simply be assigned 2x virtual nodes.',
        keyPoints: [
          'Modulo hashing invalidates ~(N-1)/N of all keys on scale up/down.',
          'Consistent hashing minimizes key migration to only K/N keys.',
          'Virtual nodes guarantee uniform distribution and smooth rebalancing without hot spots.',
          'Replication on the ring is achieved by storing data on the first R distinct physical nodes encountered clockwise.'
        ],
        interviewerFollowUp: 'What happens when a node on the ring crashes? Who takes its traffic?',
        followUpAnswer: 'The next node clockwise on the ring immediately takes over the keys. In Dynamo-style systems, the next node can also store a "hinted handoff" temporary write and deliver it back to the revived node once it reboots.'
      }
    ]
  },
  {
    term: 'Bloom Filter',
    category: 'Databases',
    simpleMeaning: 'A super-fast, tiny memory filter that tells you if something is definitely NOT in the database, or might be in the database.',
    technicalMeaning: 'A space-efficient probabilistic data structure based on an m-bit array and k independent cryptographic hash functions. It can test whether an element is a member of a set. False positive matches are possible with tunable probability, but false negatives are mathematically impossible.',
    example: 'Google Chrome uses Bloom filters to detect malicious URLs; Bigtable and Cassandra use Bloom filters to avoid expensive disk seeks for non-existent row keys.',
    interviewQuestions: [
      {
        question: 'How does a Bloom Filter eliminate 90%+ of disk reads in Cassandra or RocksDB, and why can it have false positives but NEVER false negatives?',
        companies: ['Google', 'Meta', 'Amazon', 'Netflix'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Problem:\nIn LSM-tree databases, a row might be in any of 20 SSTable files on disk. If a user queries a non-existent user_id, without a Bloom filter the database would have to read all 20 SSTable index blocks from disk, wasting massive IOPS.\n\n2. How Bloom Filters Solve It:\nEach SSTable file keeps an in-memory Bloom filter (usually ~10 bits per key). When querying key K, the engine checks the Bloom filter in RAM:\n- If the Bloom filter returns FALSE: The key is 100% DEFINITELY NOT in this file. The engine skips the disk read completely!\n- If it returns TRUE: The key MIGHT be in the file. The engine reads the disk.\n\n3. Why False Negatives are Impossible:\nWhen key K was inserted, k hash functions set bits h1(K), h2(K)... hk(K) to 1. If any one of those bit positions in the array is 0, key K could never have been inserted. Hence, false negatives are impossible.\n\n4. Why False Positives Can Happen:\nDifferent keys hashing to the same bit positions might coincidentally turn all k bits to 1, causing the filter to report TRUE even though the exact key was never added.',
        keyPoints: [
          'Never has false negatives: if it says "No", it is guaranteed not there.',
          'False positive rate can be mathematically tuned by increasing bit array size (m) and hash functions (k = (m/n) * ln 2).',
          'Standard Bloom filters do NOT support deletions because clearing a bit would inadvertently delete other keys that hashed to that bit. Counting Bloom Filters solve this using 4-bit counters.'
        ],
        interviewerFollowUp: 'Can you resize a Bloom filter when your dataset grows beyond expectations?',
        followUpAnswer: 'No, a standard Bloom filter cannot be resized dynamically because the original items are not stored. If saturated, the false positive rate explodes towards 100%. You must create a new larger filter and repopulate it, or use a Scalable Bloom Filter (a chain of increasing-capacity filters).'
      }
    ]
  },
  {
    term: 'Transactional Outbox Pattern',
    category: 'Messaging',
    simpleMeaning: 'Writing the database change and the outgoing message into the SAME local database transaction to prevent losing events.',
    technicalMeaning: 'Solves the Dual-Write problem in microservices. The business transaction inserts both the domain entity and an event record into an outbox table in a single local ACID transaction. An asynchronous Change Data Capture (CDC) process (Debezium) tails the database WAL and relays the event to Kafka.',
    example: 'Ensuring that creating an order and emitting an OrderCreated Kafka event succeed or fail together atomically.',
    interviewQuestions: [
      {
        question: 'What is the "Dual-Write Problem" in microservices, and why is Transactional Outbox preferred over 2-Phase Commit (2PC) or distributed transactions?',
        companies: ['Uber', 'Stripe', 'Amazon', 'Netflix', 'Airbnb'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Dual-Write Problem:\nA service needs to save an Order to PostgreSQL and publish an `OrderPlaced` event to Apache Kafka. If you save to DB first and then publish to Kafka, the app or network can crash before Kafka receives it, causing a lost message. If you publish to Kafka first and DB insert fails (e.g., unique constraint violation), other services process an order that does not exist in the database.\n\n2. Why not Two-Phase Commit (XA / 2PC)?\nKafka and many cloud message brokers do not support distributed XA transactions. Furthermore, 2PC is a blocking protocol: if the transaction coordinator or any participant crashes during the PREPARE phase, locks are held indefinitely, destroying throughput and availability.\n\n3. The Transactional Outbox Solution:\nInside the local SQL transaction, the service writes the business data (INSERT INTO orders) AND an event payload (INSERT INTO outbox_table). Because both writes happen in the same local ACID transaction, either both succeed or both roll back atomically. Then, an asynchronous Message Relay (like Debezium using Postgres WAL logical decoding) reads the outbox table and streams the event to Kafka with at-least-once delivery guarantees.',
        keyPoints: [
          'Dual writes without outbox inevitably cause data inconsistency.',
          'Local ACID transactions are fast (< 2ms) and avoid distributed locks.',
          'Change Data Capture (CDC) via database transaction logs is zero-overhead compared to polling the database table.',
          'Downstream consumers must be idempotent because outbox relays guarantee at-least-once delivery.'
        ],
        interviewerFollowUp: 'How do you prevent the outbox table from growing indefinitely and running out of disk space?',
        followUpAnswer: 'If using Polling publisher, delete rows after successful ACK or partition the table by day and drop old partitions. If using CDC (Debezium), Debezium tails the WAL directly and doesn\'t even require keeping table rows long-term, or you can use a background worker that deletes processed rows in batches.'
      }
    ]
  },
  {
    term: 'Two-Phase Commit (2PC) & SAGA Pattern',
    category: 'Distributed Systems',
    simpleMeaning: '2PC asks all servers "Are you ready?" before committing, which is slow and fragile; SAGA splits a long transaction into small steps with rollback (compensating) actions.',
    technicalMeaning: '2PC is a blocking consensus protocol with a Prepare phase and a Commit phase across distributed resource managers. SAGA is an architectural pattern for long-running distributed transactions where each microservice executes a local transaction and emits an event. If a step fails, compensating transactions are executed in reverse order to undo changes.',
    example: 'Stripe and Uber use SAGA Choreography/Orchestration for rides and multi-step payments instead of 2PC.',
    interviewQuestions: [
      {
        question: 'Why is Two-Phase Commit (2PC) considered an anti-pattern in modern cloud-scale microservices, and how does the SAGA pattern solve distributed transactions?',
        companies: ['Stripe', 'Amazon', 'Uber', 'Salesforce'],
        level: 'L6+ (Staff)',
        detailedAnswer: '1. Why 2PC Fails at Scale:\n- Blocking Protocol: During the "Prepare" phase, all participating databases acquire exclusive row locks. If the coordinator or any network link fails between Prepare and Commit, those row locks remain held indefinitely, causing database connection pool exhaustion.\n- Lowest Common Denominator Latency: 2PC latency is the sum of roundtrips across all participating services.\n- Scalability Ceiling: Does not work across heterogeneous cloud databases, third-party APIs (Stripe, Twilio), or NoSQL engines.\n\n2. SAGA Pattern (Eventual Consistency with Compensating Actions):\nInstead of one giant distributed transaction, SAGA decomposes the workflow into a series of local transactions: T1, T2, T3... Tn. Each service commits its local transaction immediately, releasing locks.\nIf step T3 fails (e.g., Payment Declined), the SAGA executes backward compensating transactions: C2 (Release Hotel Reservation) and C1 (Cancel Flight Seat) to return the system to a clean state.\n\n3. Orchestration vs Choreography:\n- Choreography: Services react to each other\'s domain events via Kafka. Good for simple 2-3 step workflows, but hard to trace in complex systems.\n- Orchestration: A centralized state machine orchestrator (Temporal, AWS Step Functions) explicitly commands each service (reserveFlight -> reserveHotel -> chargeCard). Highly recommended for complex multi-step enterprise workflows.',
        keyPoints: [
          '2PC provides strict ACID linearizability but sacrifices availability and throughput (CAP trade-off).',
          'SAGA trades isolation for availability: intermediate states are visible to other users (dirty reads can happen).',
          'Compensating transactions MUST be idempotent and cannot fail; if compensation fails, human alerting/dead-letter queues take over.'
        ],
        interviewerFollowUp: 'What is the "Semantic Anomaly" in SAGA, and how do you handle it?',
        followUpAnswer: 'Because local transactions commit before the entire SAGA finishes, another concurrent transaction can read unfinalized state (lack of Isolation). We solve this using Semantic Locks (setting status = PENDING_APPROVAL) or Pessimistic Hold reservations with auto-expiry TTLs.'
      }
    ]
  },
  {
    term: 'Rate Limiting Algorithms',
    category: 'Security',
    simpleMeaning: 'Traffic control rules that restrict how many requests a client or IP can send per minute to protect servers from crashes and abuse.',
    technicalMeaning: 'Algorithmic rate-limiting policies implemented at API Gateways (Envoy, Kong, Cloudflare) to prevent DoS, brute-force attacks, and noisy neighbor resource hogging. Common algorithms include Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window Log/Counter.',
    example: 'Stripe API enforces a 100 req/sec limit using Redis-backed Token Bucket; Cloudflare protects origin servers using sliding window counters.',
    interviewQuestions: [
      {
        question: 'Compare Token Bucket, Leaky Bucket, and Sliding Window Counter. How would you implement a distributed rate limiter in Redis with zero race conditions?',
        companies: ['Stripe', 'Cloudflare', 'Meta', 'Google', 'Uber'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. Algorithmic Comparison:\n- Token Bucket: Tokens refill at rate R up to max capacity C. A request consumes 1 token. Allows bursts of traffic up to capacity C without dropping requests. Ideal for general REST APIs (Stripe, GitHub).\n- Leaky Bucket: Requests enter a queue and leak out at a strictly constant rate. Drops requests if the queue overflows. Smooths traffic perfectly (zero bursts). Ideal for egress to third-party APIs with strict RPM quotas.\n- Fixed Window: Counts requests in rigid time blocks (e.g., 00:00 - 00:01). Suffers from the 2x boundary burst vulnerability (100 requests at 00:59 and 100 requests at 01:00 = 200 requests within 2 seconds).\n- Sliding Window Counter: Combines current window count with a weighted percentage of the previous window (e.g., requests_current + requests_prev * (1 - time_into_window)). Solves boundary spikes with minimal memory.\n\n2. Distributed Implementation in Redis:\nA naive `GET count -> IF count < limit -> INCR count` causes race conditions under high concurrency. Two production approaches:\n- Redis Lua Script: Run the Token Bucket logic inside an atomic Redis Lua script (`redis.eval()`). Because Redis executes scripts single-threaded, check-and-decrement is 100% atomic with sub-millisecond execution.\n- Redis Sorted Set (ZSET) for Sliding Window: Store timestamp as score and member (`ZADD client_ip now now`). Run `ZREMRANGEBYSCORE client_ip 0 (now - window)` to purge old entries, then `ZCARD` to count recent requests.',
        keyPoints: [
          'Token Bucket allows controlled burstiness; Leaky Bucket forces constant egress rate.',
          'Fixed window has 2x spike defect at window boundaries.',
          'Single Redis node is a single point of failure; use Redis Cluster with local memory caching (Tiered Rate Limiting) for 10M+ RPS scale.'
        ],
        interviewerFollowUp: 'What HTTP response headers should your rate limiter return?',
        followUpAnswer: 'Always return standard RFC 6585 headers: HTTP 429 Too Many Requests, X-RateLimit-Limit: 100, X-RateLimit-Remaining: 0, and Retry-After: 30 (seconds until next window opens).'
      }
    ]
  },
  {
    term: 'Idempotency Keys',
    category: 'SaaS Architecture',
    simpleMeaning: 'A unique ticket attached to an API request so that if you click "Pay" twice or your internet disconnects, you are only charged once.',
    technicalMeaning: 'A unique client-generated UUID (Idempotency-Key header) included in mutating HTTP requests (POST/PATCH). The server records the key and cached response in a transactional data store. If the client retries with the same key, the server returns the cached response without executing side effects again.',
    example: 'Stripe, PayPal, and Shopify require `Idempotency-Key: uuid` for all payment charge endpoints to survive mobile network retries.',
    interviewQuestions: [
      {
        question: 'Design an end-to-end idempotent payment processing architecture. How do you handle concurrent identical requests arriving at the exact same millisecond?',
        companies: ['Stripe', 'Uber', 'Airbnb', 'PayPal', 'Amazon'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Challenge:\nA user clicks "Pay $100". The client sends POST /charges with `Idempotency-Key: abc-123`. A network glitch occurs after the server processed the card but before the client received the HTTP 200. The mobile app automatically retries. Without idempotency, the customer is billed $200.\n\n2. Architecture & Request Lifecycle:\nStep 1: Client generates a UUIDv4 on button press and sends header `Idempotency-Key: abc-123`.\nStep 2: API Gateway/Payment Service attempts an atomic lock in Redis or PostgreSQL:\n`INSERT INTO idempotency_records (key, user_id, status, request_hash, created_at) VALUES (\'abc-123\', user_42, \'IN_PROGRESS\', sha256(body), NOW()) ON CONFLICT (key) DO NOTHING;`\nStep 3: Check return value:\n- If insert succeeded: We acquired the lock. Proceed to call payment gateway (Stripe/Visa).\n- If conflict and status is \'IN_PROGRESS\': Another thread is already processing this key! Return HTTP 409 Conflict or hold connection for up to 2 seconds.\n- If conflict and status is \'COMPLETED\': Return the previously saved cached response (JSON payload + status code 200) directly from database.\nStep 4: After payment succeeds, atomically update:\n`UPDATE idempotency_records SET status = \'COMPLETED\', response_body = :json, status_code = 200 WHERE key = \'abc-123\';`',
        keyPoints: [
          'Client must generate the UUID before the first network transmission.',
          'Hash the request body to ensure the client didn\'t send the same idempotency key with completely different payment parameters (tamper detection).',
          'Set a TTL on idempotency records (typically 24-48 hours) to prevent unbounded storage bloat.'
        ],
        interviewerFollowUp: 'What if the server crashes while status is IN_PROGRESS? Will the user be locked out forever?',
        followUpAnswer: 'Each IN_PROGRESS record has an expiration timestamp (lease timeout of e.g. 60 seconds). If expired, the retry is permitted to assume the previous attempt died, or it initiates a reconciliation query against the payment gateway.'
      }
    ]
  },
  {
    term: 'Raft & Paxos Consensus',
    category: 'Distributed Systems',
    simpleMeaning: 'A democratic voting system where servers elect a leader and agree on the exact same sequence of changes, even if some servers die.',
    technicalMeaning: 'Distributed consensus algorithms that ensure a cluster of state machines agree on a sequence of log entries. Raft achieves equivalent safety and fault tolerance to Paxos but structures consensus into three decomposed subproblems: Leader Election, Log Replication, and Safety, requiring a majority quorum (N/2 + 1) to proceed.',
    example: 'etcd (Kubernetes control plane), CockroachDB, and Consul use Raft; Google Spanner and Chubby use Multi-Paxos.',
    interviewQuestions: [
      {
        question: 'How does Raft handle leader election and log replication? How does it mathematically guarantee safety during a network split-brain scenario?',
        companies: ['Google', 'Microsoft', 'CockroachDB', 'AWS'],
        level: 'L6+ (Staff)',
        detailedAnswer: '1. Node States & Leader Election:\nNodes are in one of three states: Follower, Candidate, or Leader. If a Follower hears no heartbeat within a randomized election timeout (150ms-300ms), it transitions to Candidate, increments term number, votes for itself, and broadcasts RequestVote RPCs. If it receives votes from a majority of nodes ((N/2) + 1), it becomes the Leader.\n\n2. Log Replication:\nClients send commands to the Leader. The Leader appends the entry to its local log and sends AppendEntries RPCs to all followers. Once a majority confirms receipt, the Leader commits the entry, applies it to its local state machine, and replies to the client.\n\n3. Split-Brain Protection:\nSuppose a 5-node cluster (Nodes A, B, C, D, E) is partitioned into two sub-networks:\n- Minority partition (Nodes A, B with original Leader A)\n- Majority partition (Nodes C, D, E)\nWhen a client writes to Leader A on the minority partition, Leader A attempts to replicate to B, but can only get 2 confirmations out of 5. Because 2 < (5/2 + 1 = 3), Leader A CANNOT commit the write! Meanwhile, partition {C, D, E} elects a new Leader with Term 2 and commits writes successfully. When the partition heals, Node A discovers higher Term 2, steps down to Follower, and overwrites its uncommitted log entries with the majority log.',
        keyPoints: [
          'Requires odd number of nodes (3, 5, 7). A 5-node cluster can tolerate 2 node failures.',
          'Randomized election timeouts prevent split-vote deadlocks where multiple candidates split the vote equally.',
          'Leader Completeness: Raft ensures that if a log entry is committed in a given term, it will be present in the logs of the leaders for all higher terms.'
        ],
        interviewerFollowUp: 'Why not use 6 nodes instead of 5 nodes?',
        followUpAnswer: 'A 6-node cluster requires 4 nodes for majority quorum (6/2 + 1 = 4). It still only tolerates 2 failures (6 - 4 = 2), identical to a 5-node cluster, but increases network overhead and risk of quorum loss. Therefore, odd numbers (3, 5, 7) are always preferred.'
      }
    ]
  },
  {
    term: 'Quorum Consensus (N, W, R)',
    category: 'Databases',
    simpleMeaning: 'Tuning how many database copies must confirm a write (W) and how many must answer a read (R) to ensure you always see fresh data.',
    technicalMeaning: 'In leaderless replication systems (Dynamo, Cassandra), N is the replication factor, W is the number of replicas that must acknowledge a write, and R is the number of replicas that must respond to a read. When W + R > N, the read set and write set overlap by the Pigeonhole Principle, guaranteeing strong consistency.',
    example: 'Amazon DynamoDB and Apache Cassandra support tunable consistency levels (ONE, QUORUM, ALL) on a per-query basis.',
    interviewQuestions: [
      {
        question: 'If N=3, why does W + R > N guarantee reading the latest write? What are the practical trade-offs of setting W=1, R=3 vs. W=2, R=2 vs. W=3, R=1?',
        companies: ['Amazon', 'Netflix', 'Apple', 'Meta'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Math (Pigeonhole Principle):\nSuppose N=3 replicas (A, B, C). If you write with W=2, the write is confirmed on {A, B}. If you read with R=2, your read set could be {B, C} or {A, C} or {A, B}. In every single combination, at least one node in your read set (Node B or A) participated in the write! By comparing version timestamps or vector clocks across the R nodes, the client picks the latest value.\n\n2. Trade-Off Analysis:\n- Option 1: W=1, R=3 (Write-Heavy optimization)\nWrites are blazing fast (sub-millisecond, only waits for 1 node). However, reads are slow because the client must wait for all 3 nodes. If 1 node is dead, reads fail completely.\n- Option 2: W=2, R=2 (Balanced Quorum - Industry Standard)\nBoth writes and reads require a simple majority ((N/2) + 1). The system can tolerate 1 dead node without any outage or data staleness.\n- Option 3: W=3, R=1 (Read-Heavy optimization)\nReads are sub-millisecond from any single local replica. But writes are fragile: if a single node is undergoing maintenance or GC pause, all writes fail.',
        keyPoints: [
          'W + R > N guarantees strong consistency (strict quorum).',
          'W + R <= N allows eventual consistency (fast, but susceptible to stale reads).',
          'Read Repair: When a quorum read discovers that Node C has an older version than Node A and B, the coordinator node asynchronously writes the fresh version back to Node C.'
        ],
        interviewerFollowUp: 'What happens if a write with W=2 succeeds on 1 node and fails on the second node due to timeout? Is the write committed or aborted?',
        followUpAnswer: 'In Cassandra/Dynamo, the write is neither cleanly committed nor rolled back. The single node keeps the write. A future read might see it or miss it unless the client issues a compensating delete or rewrites the value.'
      }
    ]
  },
  {
    term: 'Circuit Breaker',
    category: 'Reliability',
    simpleMeaning: 'A software switch that stops sending requests to a failing service so it has time to recover instead of crashing your whole system.',
    technicalMeaning: 'A resilience design pattern with three states: CLOSED (normal), OPEN (fast-failing immediately without calling downstream), and HALF-OPEN (probing with limited trial requests). Trips when downstream error rates exceed a configurable threshold.',
    example: 'Resilience4j or Envoy wrapping remote payment gateway calls to prevent thread pool exhaustion during Stripe outages.',
    interviewQuestions: [
      {
        question: 'How does a Circuit Breaker prevent cascading failure and thread pool exhaustion in microservices? How does it differ from a retry with exponential backoff?',
        companies: ['Netflix', 'Amazon', 'Microsoft', 'Uber'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Problem (Cascading Thread Exhaustion):\nService A calls Service B over HTTP. If Service B slows down from 20ms to 30,000ms (hung database connection), threads in Service A wait for 30 seconds before timing out. Under 500 RPS, Service A\'s 200 Tomcat/Go worker threads are exhausted in less than 400 milliseconds. Service A crashes. Then Service C which calls Service A crashes. The entire company goes dark.\n\n2. Difference from Retries:\nRetries with exponential backoff are useful for rare, transient glitches (e.g., 1 dropped packet). But if Service B is already overwhelmed, retrying multiplies traffic by 3x-5x, creating a "Retry Storm" that guarantees Service B will never recover.\n\n3. How Circuit Breaker Works:\n- CLOSED: Normal operation. Measures rolling failure rate (e.g., in a sliding window of 100 requests).\n- OPEN: If failure rate exceeds threshold (e.g., > 50%), the breaker trips to OPEN. For the next 30 seconds, 100% of requests are rejected instantly (fail-fast in 0.1ms) or diverted to a local fallback cache without touching Service B. Service B gets breathing room to recover.\n- HALF-OPEN: After the sleep window, the breaker permits 5 test requests through. If all 5 succeed, it resets to CLOSED. If any fail, it trips back to OPEN.',
        keyPoints: [
          'Fail-fast preserves caller thread pools and memory.',
          'Fallback mechanisms (e.g., return cached catalog data or generic recommendations) preserve user experience during outages.',
          'Combine with Rate Limiting and Bulkheading (isolating thread pools per downstream service).'
        ],
        interviewerFollowUp: 'What is the Bulkhead pattern and how does it complement Circuit Breakers?',
        followUpAnswer: 'Named after compartmentalized ship hulls. If Service A calls both Payment and Recommendations, Bulkhead assigns separate isolated thread pools (e.g., 20 threads for Recommendations, 50 for Payment). If Recommendations hangs, it only exhausts its 20 threads, leaving Payment 100% operational.'
      }
    ]
  },
  {
    term: 'Database Sharding & Resharding',
    category: 'Databases',
    simpleMeaning: 'Splitting a massive database table across multiple physical database servers based on a shard key (like user_id).',
    technicalMeaning: 'Horizontal partitioning of a database into independent database instances (shards), each holding a subset of the total dataset. Routing is governed by a shard key using Hash-based or Range-based partitioning. Resharding redistributes data when shards approach IOPS or storage saturation.',
    example: 'Meta sharded MySQL into thousands of instances using shard maps; Discord sharded MongoDB to ScyllaDB to handle billions of messages.',
    interviewQuestions: [
      {
        question: 'How do you choose a Shard Key for an enterprise social network or messaging app, and how do you execute live resharding with ZERO downtime?',
        companies: ['Meta', 'Twitter/X', 'Discord', 'Pinterest', 'Google'],
        level: 'L6+ (Staff)',
        detailedAnswer: '1. Choosing the Shard Key:\nA bad shard key causes Hot Shards (one shard gets 90% of traffic) or Cross-Shard Joins (queries must scatter-gather across 100 servers, destroying p99 latency).\n- Bad Shard Key: Timestamp / Created_At. All new tweets/messages hit the latest shard, causing a massive write bottleneck while older shards sit idle.\n- Good Shard Key for Chat/Social: `workspace_id` (Slack) or `guild_id` (Discord) or `user_id` (Twitter). All messages within a channel or user reside on the exact same physical node. 99% of queries are single-shard lookups.\n\n2. Zero-Downtime Live Resharding Architecture (Dual-Write + CDC):\nWhen migrating from 10 shards to 20 shards:\n- Step 1: Deploy new 20-shard cluster.\n- Step 2: Historical Backfill: Run an offline batch job (MapReduce / Spark) copying existing data from 10 shards to 20 shards.\n- Step 3: Dual Writes: Application writes to both old shards and new shards simultaneously. If new shard write fails, log to DLQ without failing the client.\n- Step 4: CDC Catch-up: Run Debezium to stream any real-time changes that occurred during backfill until replication lag is 0ms.\n- Step 5: Shadow Validation: Route 1% of reads to new shards asynchronously and compare responses against old shards.\n- Step 6: Flip the Switch: Change routing map to read from new shards. Deprecate old shards after 48 hours.',
        keyPoints: [
          'High Cardinality is critical for even data distribution.',
          'Scatter-gather queries (queries without a shard key in the WHERE clause) are the #1 killer of sharded database performance.',
          'Consistent Hashing or Directory-Based Virtual Sharding (e.g. 1024 logical shards mapped to physical nodes) makes future resharding 10x easier.'
        ],
        interviewerFollowUp: 'What do you do about Celebrity / Hot Key problems (e.g. Justin Bieber with 100M followers)?',
        followUpAnswer: 'Split the celebrity key across multiple secondary shards using a salt: `hash(celebrity_id + "_" + random(1..10))`. Writes fan out across 10 shards, and read requests aggregate from the 10 shards using in-memory fanout.'
      }
    ]
  },
  {
    term: 'Cache Invalidation & Thundering Herd',
    category: 'Performance Engineering',
    simpleMeaning: 'The Thundering Herd problem is when a cached item expires and thousands of requests rush to query the database simultaneously, knocking it down.',
    technicalMeaning: 'Cache Stampede (Thundering Herd) occurs when a high-traffic cache key expires or is invalidated, causing concurrent worker threads to experience a cache miss and simultaneously execute the expensive backend database query. Mitigations include Distributed Locks (Mutex), Probabilistic Early Expiration (XFetch), and Background Refresh.',
    example: 'Meta uses Memcached with lease tokens (get-with-lease) to allow only 1 server to recalculate a cache miss while others wait.',
    interviewQuestions: [
      {
        question: 'What causes a Cache Stampede (Thundering Herd), and how do you protect your database using Probabilistic Early Expiration (XFetch algorithm) or Mutex locks?',
        companies: ['Meta', 'Netflix', 'Amazon', 'Google'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Disaster Scenario:\nA celebrity homepage is cached in Redis with a 5-minute TTL, serving 20,000 RPS. At 12:05:00, the TTL expires. In the next 100 milliseconds, 2,000 concurrent client requests miss the cache simultaneously. All 2,000 threads execute `SELECT * FROM users JOIN posts...` on the primary database. The database CPU hits 100%, connection pools exhaust, and the site goes down.\n\n2. Solution 1: Distributed Mutex Lock:\nWhen a worker gets a cache miss, it attempts to acquire a short-lived Redis lock (`SET lock:user_42 uuid NX EX 5`).\n- If it gets the lock: It queries the database, repopulates Redis, and releases the lock.\n- If it fails to get the lock: It sleeps for 50ms and re-reads the cache, or returns a slightly stale value.\n\n3. Solution 2: Optimal Probabilistic Early Expiration (XFetch Algorithm):\nInstead of waiting for the key to expire at T, we refresh it slightly before expiration based on traffic volume:\nFormula: `time() - (beta * delta * ln(random())) > expiry`\nWhere `delta` is computation time and `beta > 0` is aggressiveness. As the key gets closer to expiry and request volume increases, the probability of an early background refresh reaches 100%, guaranteeing the key NEVER expires during peak traffic!',
        keyPoints: [
          'Cache Aside is the standard pattern, but requires protection against stampedes.',
          'Never set identical hardcoded TTLs across thousands of keys: always add random jitter (e.g., 300s + rand(0, 60s)) to avoid synchronized mass expirations.',
          'Serve stale while revalidating (stale-while-revalidate) pattern keeps latency sub-millisecond.'
        ],
        interviewerFollowUp: 'What is Cache Penetration and how does it differ from Cache Stampede?',
        followUpAnswer: 'Cache Stampede is valid data expiring. Cache Penetration is an attacker querying keys that NEVER exist in the database (e.g. user_id=-999999). Every request misses cache and hits DB. Mitigated by using Bloom Filters or caching null objects with a short 30-second TTL.'
      }
    ]
  },
  {
    term: 'CRDT (Conflict-Free Replicated Data Type)',
    category: 'Distributed Systems',
    simpleMeaning: 'A mathematical data structure that allows multiple computers to edit the same data offline and merge changes automatically with zero conflicts.',
    technicalMeaning: 'Data types (State-based or Operation-based) whose concurrent mutations form a semilattice with a join operator that is commutative, associative, and idempotent. This guarantees strong eventual consistency: any two replicas that have received the same set of updates will converge to the exact same state.',
    example: 'Figma, Notion, and Apple Notes use CRDTs (Yjs, Automerge) for real-time collaborative editing.',
    interviewQuestions: [
      {
        question: 'Why do modern collaborative applications (Figma, Notion, Google Docs) prefer CRDTs over Operational Transformation (OT)?',
        companies: ['Figma', 'Google', 'Apple', 'Notion', 'Microsoft'],
        level: 'L6+ (Staff)',
        detailedAnswer: '1. The Historical Approach: Operational Transformation (OT):\nGoogle Docs originally pioneered OT. OT transforms character indices (e.g., "Insert \'A\' at index 5"). However, OT strictly requires a centralized single-threaded server to establish the definitive sequence of operations. If two users type offline on a plane, merging their edits requires complex exponential transformation matrices that fail in peer-to-peer or decentralized environments.\n\n2. The Modern Standard: CRDTs:\nCRDTs assign each character a globally unique, immutable, fractional identifier between 0 and 1 (e.g., character \'H\' has ID 0.5, character \'e\' has ID 0.75). When a user inserts \'X\' between them, it gets assigned ID 0.625.\nBecause CRDT merge operations are mathematically:\n- Commutative (A + B = B + A)\n- Associative ((A + B) + C = A + (B + C))\n- Idempotent (A + A = A)\nReplicas can receive updates in completely different orders, over high-latency networks, or after days offline, and are mathematically guaranteed to converge to the exact same document without any central server intervention!',
        keyPoints: [
          'CRDTs enable offline-first and peer-to-peer collaborative editing.',
          'LWW-Element-Set (Last-Write-Wins) and PN-Counter (Positive-Negative Counter) are common state-based CRDTs.',
          'The historical drawback of CRDTs was memory overhead (storing IDs per character), but modern libraries like Yjs and Automerge use run-length encoding to achieve performance comparable to OT.'
        ],
        interviewerFollowUp: 'What type of CRDT would you use to track real-time active user counts in a Twitch or YouTube live stream?',
        followUpAnswer: 'A PN-Counter (Positive-Negative Counter CRDT). Each cluster node maintains an array of increments (joins) and decrements (leaves). Merging simply takes the max of each node\'s counter, guaranteeing an accurate convergent viewer count without distributed locks.'
      }
    ]
  },
  {
    term: 'Envelope Encryption',
    category: 'Security',
    simpleMeaning: 'Encrypting your data with a local key, and encrypting that local key with a master key locked inside a secure hardware chip.',
    technicalMeaning: 'A cryptographic practice where a payload is encrypted locally with a symmetric Data Encryption Key (DEK). The DEK is then encrypted with a Key Encryption Key (KEK) protected inside a Hardware Security Module (HSM / AWS KMS). The encrypted DEK is stored alongside the ciphertext.',
    example: 'AWS S3 SSE-KMS uses envelope encryption to protect petabytes of data without exporting master keys from HSMs.',
    interviewQuestions: [
      {
        question: 'Why not send all raw data directly to AWS KMS or Google Cloud KMS for encryption? How does Envelope Encryption solve performance, cost, and rate limits?',
        companies: ['AWS', 'Google Cloud', 'Stripe', 'Palantir'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. Direct KMS Limitations:\n- Payload Size Cap: Cloud KMS APIs (like AWS KMS Encrypt) have a strict limit of 4 KB per request! You cannot send a 1 GB video or 100 MB database backup to KMS.\n- Rate Limits & Cost: KMS costs $0.03 per 10,000 API calls and throttles at 10,000-50,000 requests/sec. Under high-throughput streaming workloads, direct KMS calls exhaust quotas and cost thousands of dollars.\n- Network Latency: Every encryption would require an external HTTPS network hop to the KMS endpoint.\n\n2. How Envelope Encryption Works:\nStep 1: Application asks KMS for a Data Encryption Key (DEK): KMS returns a plaintext DEK and a ciphertext DEK (encrypted by the master KEK inside the HSM).\nStep 2: The application encrypts the 1 GB file locally in RAM using the plaintext DEK via hardware-accelerated AES-256-GCM (running at multiple GB/sec).\nStep 3: The application immediately zeroes out the plaintext DEK from memory and stores the encrypted DEK right alongside the encrypted file.\nStep 4: To decrypt, the app sends only the tiny encrypted DEK to KMS to unwrap it, then decrypts the local file.',
        keyPoints: [
          'The master Key Encryption Key (KEK) never leaves the physical HSM hardware.',
          'Local AES-256 encryption avoids network bottlenecks and handles arbitrarily large payloads.',
          'Enables instant crypto-shredding: deleting the master KEK instantly renders petabytes of data permanently unreadable.'
        ],
        interviewerFollowUp: 'What is Crypto-Shredding in GDPR compliance?',
        followUpAnswer: 'When a user demands "Right to be Forgotten", instead of searching through petabytes of compressed immutable backups to purge rows, if that user\'s data was encrypted with a unique per-user DEK, simply destroying that single DEK makes all their historical backup data computationally impossible to decrypt.'
      }
    ]
  },
  {
    term: 'Row-Level Security (RLS)',
    category: 'SaaS Architecture',
    simpleMeaning: 'A database feature that automatically hides rows belonging to other tenants, even if your application code forgets to filter by tenant.',
    technicalMeaning: 'A security mechanism built into the relational database engine (PostgreSQL, SQL Server) that evaluates a security policy expression against every row during query planning, restricting SELECT, INSERT, UPDATE, and DELETE operations based on session parameters like current_setting(\'app.current_tenant\').',
    example: 'Multi-tenant SaaS platforms enforce RLS so a bug in a GraphQL or REST query cannot leak data across corporate workspaces.',
    interviewQuestions: [
      {
        question: 'Compare Multi-Tenant Database architectures: Shared Database with RLS vs. Separate Schemas vs. Separate Databases. Which would you choose for an enterprise SaaS startup?',
        companies: ['Salesforce', 'Supabase', 'Workday', 'Stripe'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. Shared Database + Shared Schema with RLS:\nAll tenants share the same tables (`tenants`, `orders`, `users`). Every table has a `tenant_id` column. PostgreSQL Row-Level Security policies automatically inject `WHERE tenant_id = current_tenant` into every single query at the SQL engine level.\n- Pros: Lowest infrastructure cost, instant onboarding of new tenants, trivial database migrations (run migration once).\n- Cons: Noisy neighbor risk, risk of misconfigured policy leaking data, tenant-level backups are harder.\n\n2. Separate Schema per Tenant:\nSingle database instance, but each tenant gets their own schema (`tenant_123.orders`).\n- Pros: Stronger logical isolation, can drop or backup a single schema easily.\n- Cons: Migration nightmare (running DDL migrations across 10,000 schemas causes database catalog bloat and long maintenance locks).\n\n3. Database per Tenant (Silo Model):\nEach tenant gets an independent RDS instance or database container.\n- Pros: Absolute security isolation, zero noisy neighbors, easy to meet strict HIPAA/SOC2 compliance for Fortune 500 clients.\n- Cons: Extremely expensive, operational overhead of managing hundreds of database instances.\n\nRecommendation: Start with Shared Database + RLS for 95% of self-serve SMB tiers, and offer dedicated Database per Tenant as an expensive enterprise tier.',
        keyPoints: [
          'RLS pushes authorization down to the database engine, guarding against ORM bugs and developer oversights.',
          'Always set connection pool hooks to reset session variables (`SET LOCAL app.current_tenant_id`) before handing connections back to the pool.',
          'Database indexes MUST include `tenant_id` as the leading composite column for high performance.'
        ],
        interviewerFollowUp: 'What is the "Connection Poisoning" danger when using RLS with connection poolers like PgBouncer?',
        followUpAnswer: 'If using Transaction pooling in PgBouncer, a session variable set with `SET app.tenant_id = 42` will linger on that physical connection and leak to the next tenant! You MUST use `SET LOCAL app.tenant_id = 42` so the variable is strictly scoped to the single transaction.'
      }
    ]
  },
  {
    term: 'Little’s Law',
    category: 'Performance Engineering',
    simpleMeaning: 'A mathematical formula stating that the number of requests inside a system equals the arrival rate multiplied by the average response time.',
    technicalMeaning: 'L = λ * W. In a stable queuing system, the average number of items in a system (L) equals the average arrival rate (λ) multiplied by the average time an item spends in the system (W). Used to size thread pools and socket buffers.',
    example: 'If a service receives 2,000 requests/sec with an average latency of 50ms (0.05s), it maintains 100 concurrent requests in flight.',
    interviewQuestions: [
      {
        question: 'How do you apply Little’s Law to size Tomcat/Go worker thread pools and calculate connection pool limits for a microservice handling 10,000 RPS?',
        companies: ['Google', 'Meta', 'Netflix', 'Amazon'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Formula:\nL = λ * W\nWhere:\n- L = Average number of concurrent requests in the system\n- λ = Arrival rate (Requests Per Second, RPS)\n- W = Average response time (Latency in seconds)\n\n2. Practical System Sizing Example:\nSuppose an Order Service receives λ = 10,000 RPS. The downstream database takes W = 50ms (0.050 seconds) on average.\nL = 10,000 * 0.050 = 500 concurrent requests in flight at any given instant.\nIf you deploy 5 microservice container instances behind a load balancer, each instance handles 2,000 RPS:\nL_per_instance = 2,000 * 0.050 = 100 concurrent requests.\nTherefore, each instance needs at least 100 worker threads and a database connection pool of at least 100 connections.\n\n3. What happens if downstream latency spikes?\nIf the database slows down to W = 200ms (0.200s):\nL = 10,000 * 0.200 = 2,000 concurrent requests!\nIf your thread pools were capped at 500, the remaining 1,500 requests enter the queue. If arrival rate continues at 10,000 RPS, the queue fills up and requests are dropped with HTTP 503 or timeout errors.',
        keyPoints: [
          'Little\'s Law applies regardless of the arrival distribution or internal system topology.',
          'Doubling latency doubles the number of concurrent in-flight requests holding memory and sockets.',
          'Always size thread pools based on p99 latency rather than optimistic p50 averages.'
        ],
        interviewerFollowUp: 'Why is setting an infinite queue size in an application server dangerous?',
        followUpAnswer: 'An unbounded queue consumes RAM until the server crashes with an OutOfMemoryError. Worse, requests sitting in the queue for 10 seconds will timeout at the client, so when the server finally processes them, it wastes CPU work on requests the user already abandoned.'
      }
    ]
  },
  {
    term: 'Amdahl’s Law',
    category: 'Performance Engineering',
    simpleMeaning: 'A law proving that adding more computers or CPU cores will never make a job faster than its strictly serial (un-parallelizable) part.',
    technicalMeaning: 'Speedup = 1 / ((1 - P) + (P / N)). Where P is the parallelizable fraction of the program and N is the number of processors. If 10% of a task is serial, the maximum possible speedup with infinite cores is 10x.',
    example: 'Explains why scaling a distributed batch job to 1,000 nodes yields diminishing returns if 5% of the runtime is spent acquiring a global database lock.',
    interviewQuestions: [
      {
        question: 'Why does throwing 1,000 EC2 instances at a slow distributed batch processing job often yield disappointing performance gains? How does Amdahl’s Law explain this?',
        companies: ['Google', 'Amazon', 'Meta', 'Snowflake'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Math of Amdahl\'s Law:\nSpeedup = 1 / ((1 - P) + (P / N))\nWhere P is the parallelizable portion of code, and N is the number of worker nodes.\nIf a data processing pipeline is 95% parallelizable (P = 0.95), the remaining 5% (1 - P = 0.05) is strictly sequential (e.g., initial metadata catalog scan, leader election, final result aggregation, or single database lock).\n- With N = 10 nodes: Speedup = 1 / (0.05 + 0.95/10) = 1 / 0.145 = 6.9x speedup.\n- With N = 100 nodes: Speedup = 1 / (0.05 + 0.95/100) = 1 / 0.0595 = 16.8x speedup.\n- With N = 1,000 nodes: Speedup = 1 / (0.05 + 0.95/1000) = 1 / 0.05095 = 19.6x speedup.\n- With N = Infinity nodes: Speedup can NEVER exceed 1 / 0.05 = 20x speedup!\n\n2. The Engineering Takeaway:\nIncreasing nodes from 100 to 1,000 costs 10x more money but only delivers a measly 16% speedup. To achieve 100x speedup, engineers must focus on shrinking the 5% serial bottleneck (e.g., decentralized map-reduce aggregation, lock-free data structures) rather than simply adding more machines.',
        keyPoints: [
          'Serial bottlenecks place a hard asymptotic mathematical ceiling on horizontal scaling.',
          'Gunther\'s Universal Scalability Law (USL) goes even further by accounting for cross-node communication crosstalk (coherency penalty), which causes throughput to actually decrease past a certain node count.',
          'Eliminating global synchronization points is the primary goal of distributed software architecture.'
        ],
        interviewerFollowUp: 'How does Gustafson’s Law differ from Amdahl’s Law in big data systems?',
        followUpAnswer: 'Amdahl assumes a fixed workload size. Gustafson\'s Law observes that as more compute is added, engineers scale the problem size (processing 100x more data in the same total time window), achieving near-linear scaled speedup.'
      }
    ]
  },
  {
    term: 'OpenTelemetry (OTel)',
    category: 'Observability',
    simpleMeaning: 'A universal, vendor-neutral standard for generating and collecting metrics, logs, and distributed traces from applications.',
    technicalMeaning: 'A CNCF open-source observability framework comprising standard APIs, SDKs, tools, and the OpenTelemetry Protocol (OTLP) to instrument, generate, and export telemetry data to backends (Jaeger, Prometheus, Datadog) without vendor lock-in.',
    example: 'Injecting W3C traceparent HTTP headers across microservices to trace a customer request end-to-end across 30 services.',
    interviewQuestions: [
      {
        question: 'How does Distributed Tracing work across asynchronous microservices (HTTP + Kafka), and how does OpenTelemetry propagate context using W3C TraceContext headers?',
        companies: ['Datadog', 'Uber', 'Google', 'Amazon', 'Netflix'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Core Problem:\nWhen a user action triggers a cascade of 20 microservices communicating over REST, gRPC, and Kafka, standard server logs are disconnected silos. When an order fails, finding which service caused the 500ms latency spike is impossible without distributed tracing.\n\n2. How Distributed Tracing Works:\n- Trace: Represents the end-to-end journey of a single request across the entire distributed system.\n- Span: Represents a single unit of work (e.g., an HTTP call, a database query, or a Kafka publish) with a start time, duration, tags, and status.\n- Trace ID: A unique 16-byte hex string shared across all spans in the request.\n- Span ID: An 8-byte hex string identifying the individual operation.\n\n3. W3C TraceContext Header Propagation:\nWhen Service A calls Service B over HTTP, OTel automatically injects the standard header:\n`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`\n(Format: version - trace_id - parent_span_id - trace_flags)\nService B extracts the header, creates a child span with the same `trace_id` and sets `parent_id = 00f067aa0ba902b7`.\nFor asynchronous messaging (Kafka), OTel injects the exact same `traceparent` key into the Kafka Record Headers so downstream consumer workers continue the trace seamlessly.',
        keyPoints: [
          'Context propagation bridges asynchronous queues, background threads, and RPC boundaries.',
          'Head-based Sampling vs Tail-based Sampling: Head-based samples 1% of requests at the edge; Tail-based collects all spans and only retains traces that suffered errors or > 1,000ms latency.',
          'OTel Collector acts as an out-of-process proxy that batches, enriches, and exports telemetry to Datadog, Prometheus, or Jaeger without stalling the app.'
        ],
        interviewerFollowUp: 'What is the performance overhead of distributed tracing, and how do you prevent telemetry from overwhelming your network?',
        followUpAnswer: 'Overhead is typically 1-2% CPU. To prevent network saturation, production systems use dynamic sampling (e.g. 5% sampling for 200 OKs, 100% sampling for 5xx errors) and offload span serialization to local UDP/gRPC daemon collectors.'
      }
    ]
  },
  {
    term: 'AWS Nitro System',
    category: 'IaaS & Cloud',
    simpleMeaning: 'Custom hardware microchips that handle networking and storage so 100% of the physical server’s CPU is dedicated to running customer VMs.',
    technicalMeaning: 'A collection of custom PCIe ASIC hardware cards (Nitro Card for VPC, Nitro Card for EBS, Nitro Security Chip) that offload hypervisor virtualization tasks (networking encapsulation, storage encryption, device emulation) from the host CPU, enabling near-bare-metal performance with zero hypervisor tax.',
    example: 'Powers all modern AWS EC2 instance types (c5, m5, r5 and newer) and Bare Metal instances.',
    interviewQuestions: [
      {
        question: 'What is the "Hypervisor Tax" in traditional cloud computing, and how does AWS Nitro architecture achieve near-bare-metal performance and security isolation?',
        companies: ['AWS', 'Google Cloud', 'Microsoft Azure', 'Cloudflare'],
        level: 'L5 (Senior)',
        detailedAnswer: '1. The Traditional Hypervisor Problem:\nIn classic virtualization (Xen / KVM), the host physical CPU spends 15% to 30% of its clock cycles running the hypervisor: managing VPC software-defined networking (VLAN encapsulation), encrypting EBS storage I/O, emulating disk devices, and isolating memory. This is called the "Hypervisor Tax" — customers pay for a 16-core machine but lose significant performance to virtualization overhead.\n\n2. The Nitro Solution:\nAWS built custom PCIe ASIC hardware cards:\n- Nitro Card for VPC: Handles all VPC networking, security groups, and packet encapsulation on dedicated hardware with 100 Gbps line-rate throughput.\n- Nitro Card for EBS: Dedicated NVMe storage controller handling transparent AES-256 encryption and remote network block storage.\n- Nitro Security Chip: Physically locks down the motherboard firmware, preventing anyone (including AWS engineers) from modifying the BIOS or accessing running customer memory.\n- Nitro Hypervisor: A tiny, lightweight core that only does CPU and memory allocation.\n\n3. The Result:\nAlmost 100% of the host\'s physical CPU cores and RAM are delivered directly to the customer EC2 instance, enabling EC2 Bare Metal instances with zero virtualization overhead.',
        keyPoints: [
          'Hardware offloading frees host CPU cores exclusively for customer workloads.',
          'Eliminates virtualization jitter and achieves consistent microsecond network latency.',
          'Provides hardware-enforced root of trust and cryptographic isolation.'
        ],
        interviewerFollowUp: 'How does AWS Nitro Enclaves provide confidential computing for cryptographic private keys?',
        followUpAnswer: 'Nitro Enclaves carves out dedicated CPU cores and memory from an EC2 instance with NO external networking, NO persistent storage, and NO SSH access. Communication happens solely over a local cryptographic virtual socket (vsock) with cryptographic attestation.'
      }
    ]
  }
];
