import { Chapter } from '../../types';

export const PART5_CHAPTER: Chapter = {
  id: 'part5-caching',
  part: 5,
  partTitle: 'Part 5 — Caching Architecture',
  chapterNumber: 5,
  title: 'Caching Strategies, Invalidation & Edge Caching',
  subtitle: 'Cache-Aside, Write-Through, Write-Back, Stampedes, Penetration, and Invalidation Invariants',
  summary: 'There are only two hard things in Computer Science: cache invalidation and naming things (Phil Karlton). Caching drastically reduces database load and slashes read latency from 15ms to 200µs. However, improper caching patterns introduce stale data, race conditions, cache stampedes, and cascading database collapse during cold starts.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                            THE 4 CANONICAL CACHING STRATEGIES                                    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. CACHE-ASIDE (Lazy Loading)                                                                  |
|      [App] --(1. Read Cache)--> [Redis]                                                          |
|        | (Cache Miss!)                                                                           |
|        +----(2. Read DB)------> [Database]                                                       |
|        +----(3. Write Cache)-> [Redis]                                                           |
|                                                                                                  |
|   2. READ-THROUGH                                                                                |
|      [App] --(Read Request)--> [Cache Engine] --(Fetch on Miss)--> [Database]                    |
|                                                                                                  |
|   3. WRITE-THROUGH                                                                               |
|      [App] --(Write Data)----> [Cache Engine]                                                    |
|                                     |                                                            |
|                                     +--(Synchronous Write)-------> [Database]                    |
|                                                                                                  |
|   4. WRITE-BACK (Write-Behind)                                                                   |
|      [App] --(Write Data)----> [Cache Engine] (Returns Success immediately)                      |
|                                     |                                                            |
|                                     +--(Async Batch Flush)-------> [Database]                    |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
|   CACHE FAILURE MODES & DEFENSES                                                                 |
|   - STAMPEDE (Dog-piling): Hot key expires -> 10,000 concurrent DB queries. (Fix: Mutex Lock)    |
|   - PENETRATION: Querying non-existent keys bypasses cache to DB. (Fix: Bloom Filter / Null)     |
|   - AVALANCHE: Mass simultaneous expiration crashes DB. (Fix: Jittered TTL = Base + Random)      |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Cache-Aside vs. Write-Through vs. Write-Back',
      confidence: 'stable',
      simpleDefinition: 'Cache-Aside puts the application in charge of checking and populating the cache; Write-Through writes to cache and database synchronously; Write-Back writes to cache immediately and flushes to database asynchronously.',
      whyItExists: 'Different workloads have different tolerances for data staleness, write latency, and data loss risk on cache node crash.',
      analogy: 'Cache-Aside is checking your personal notebook before calling the clerk. Write-Through is handing a document to a secretary who updates the computer and files the physical paper before letting you leave. Write-Back is dropping a check in a mailbox: you leave instantly, and the mail carrier collects and deposits it in the bank hours later.',
      technicalExplanation: 'In Cache-Aside, the app queries cache; on miss, it reads database and populates cache with TTL. When data is updated, the app writes to DB and DELETES (invalidates) the cache key. In Write-Through, the cache layer acts as the proxy to the database; writes are synchronous to both. In Write-Back (Write-Behind), writes are acknowledged immediately upon hitting in-memory cache, and queued for asynchronous batch writes to disk. Write-Back offers maximum write throughput and low latency, but risks data loss if the cache server crashes before flushing.',
      example: 'Most SaaS web applications (e-commerce product pages, user profiles) use Cache-Aside with Redis. High-frequency IoT telemetry and game score counters use Write-Back to buffer 50,000 updates/sec in Redis before flushing every 10 seconds to PostgreSQL.',
      whenToUse: [
        'Use Cache-Aside for read-heavy web applications with resilient database fallbacks.',
        'Use Write-Through when reading recently written data must be 100% consistent and up-to-date.',
        'Use Write-Back for heavy write workloads (audit logs, view counters, real-time metrics).'
      ],
      whenNotToUse: [
        'Do not use Write-Back for financial money transfers or billing ledgers where power loss to Redis would cause irreversible financial discrepancies.'
      ],
      commonMistakes: [
        'Updating the cache on write instead of invalidating (deleting) it: if Transaction A and Transaction B write concurrently, updating cache creates race conditions where stale values overwrite newer values. Always delete the cache key upon DB write.'
      ],
      interviewQuestion: {
        question: 'Why should you invalidate (delete) a cache entry on update instead of setting the new value directly in the cache?',
        answer: 'Setting the new value directly creates race conditions with concurrent transactions. Suppose Transaction 1 writes to DB (value=A), then Transaction 2 writes to DB (value=B). Due to network scheduling delays, Transaction 2 might update the cache to B first, and then Transaction 1 updates the cache to A second. Now the DB holds B, but the cache permanently holds stale value A. If you simply DELETE the cache key on every DB update, subsequent reads are guaranteed to fetch the authoritative committed state from the database.'
      }
    },
    {
      title: 'Cache Failure Modes: Stampede, Penetration, and Avalanche',
      confidence: 'stable',
      simpleDefinition: 'Stampede is thousands of requests hitting the database simultaneously when a popular key expires; Penetration is querying keys that don’t exist; Avalanche is many keys expiring at the exact same second.',
      whyItExists: 'In high-scale systems (10,000+ RPS), even a 1-second cache outage or single key expiration will trigger a deluge of database queries that exhausts the connection pool and crashes the database.',
      analogy: 'Stampede is 5,000 concert fans rushing the stage door the instant it unlocks. Penetration is prank callers asking for a person who doesn’t live in the house, forcing you to walk to the basement to check the tenant list every time. Avalanche is 100 alarm clocks ringing at 8:00:00 AM simultaneously.',
      technicalExplanation: 'Cache Stampede (Dog-piling): Occurs when an ultra-hot key expires. Thousands of concurrent reader threads experience a cache miss simultaneously and all issue identical expensive SQL queries to the DB. Solution: Mutual Exclusion (Mutex) Distributed Lock: only the first thread acquires a lock to query the DB and refresh the cache; other threads wait or return a slightly stale cached value (Probabilistic Early Expiration / XFetch algorithm). Cache Penetration: Occurs when attackers query non-existent IDs (e.g., `id=-99999`). Cache never has it; DB does full scan and finds nothing. Solution: Bloom Filters at the gateway, or caching empty "null" values with a short TTL (e.g., 60s). Cache Avalanche: Occurs when many keys share identical TTLs (e.g., set to 3600s). At minute 60, all keys vanish simultaneously, dumping all read traffic onto the DB. Solution: Add random TTL Jitter (`TTL = base_ttl + rand(0, 300)`).',
      example: 'A breaking news article on a major news site expires. 50,000 users refresh the page within 500ms. Without mutex locking, 50,000 identical SQL queries crash PostgreSQL.',
      whenToUse: ['Always apply TTL jitter and mutex locking on hot keys in high-traffic production endpoints.'],
      whenNotToUse: ['Do not implement heavy distributed locks for low-traffic internal admin tools where stampedes are mathematically impossible.'],
      commonMistakes: [
        'Not setting TTL on null-cache entries, allowing malicious attackers to permanently exhaust Redis memory by querying millions of random non-existent keys.'
      ],
      interviewQuestion: {
        question: 'How does the XFetch (Probabilistic Early Expiration) algorithm prevent cache stampedes without locking?',
        answer: 'Instead of waiting for a key to strictly expire at `ttl = 0`, XFetch computes a probability of early background refresh on every read: `-(beta * delta * ln(random())) > (expiry - now)`. Here, `delta` is the time it takes to compute the database query and `beta > 0` is an aggressiveness multiplier. As time approaches expiration, the probability of an incoming read triggering a background async refresh approaches 100%. The hot key is refreshed transparently in the background BEFORE it ever expires, achieving 100% cache hits and zero stampedes without blocking reader threads.'
      }
    },
    {
      title: 'Eviction Policies: LRU vs. LFU vs. FIFO',
      confidence: 'stable',
      simpleDefinition: 'When cache memory fills up, eviction policies dictate which items are discarded to make room for new data.',
      whyItExists: 'RAM is limited and expensive. The cache must retain the most valuable items that maximize the cache hit ratio.',
      analogy: 'LRU is clearing the clothes off your chair that you haven’t worn in the longest time. LFU is keeping the 5 shirts you wear 4 days a week, even if you didn’t wear one today.',
      technicalExplanation: 'LRU (Least Recently Used): Evicts the item whose last access timestamp is oldest. Implemented via a Hash Map paired with a Doubly Linked List for O(1) lookups and O(1) node re-ordering. Vulnerable to "cache pollution" from one-off batch scans. LFU (Least Frequently Used): Tracks access frequency counters; evicts items with the lowest access count. Solves scan pollution, but historical hot items that are now dead can linger in cache. Redis implements Approximated LRU and LFU: instead of maintaining expensive pointers for every key, Redis samples N random keys (default 5) and evicts the best candidate among them, using negligible memory overhead.',
      example: 'Redis configured with `maxmemory-policy allkeys-lru` automatically drops inactive session tokens when memory reaches 80% capacity.',
      whenToUse: [
        'Use LRU for general web traffic where recently accessed data has the highest probability of being accessed again (temporal locality).',
        'Use LFU for long-term stable popularity distributions (e.g., top 1,000 movie titles or best-selling books).'
      ],
      whenNotToUse: [
        'Do not use strict LRU in systems running frequent table-scan batch jobs, as a single batch job will evict your entire working set.'
      ],
      commonMistakes: [
        'Assuming Redis `volatile-lru` evicts all keys: `volatile-lru` ONLY evicts keys with an explicit TTL. If you forget to set TTLs, Redis will run out of memory and return `OOM command not allowed` errors. Use `allkeys-lru` if all keys are expendable.'
      ],
      interviewQuestion: {
        question: 'How do you implement an O(1) LRU Cache in data structure design?',
        answer: 'You combine a Hash Map and a Doubly Linked List. The Hash Map stores `key -> NodePointer` for O(1) lookups. The Doubly Linked List maintains access order: the Head represents the Most Recently Used (MRU) item, and the Tail represents the Least Recently Used (LRU) item. When a key is accessed or updated, look up the node in the map, splice it out of its current list position, and prepend it to the Head. When capacity is exceeded, remove the Tail node, delete its key from the Hash Map, and insert the new item at the Head. All operations are strictly O(1).'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'In-Memory Application Local Cache (e.g., Guava, Go sync.Map)',
    technologyB: 'Distributed Centralized Cache (e.g., Redis Cluster)',
    comparisonDimensions: [
      {
        dimension: 'Latency',
        optionA: 'Sub-microsecond (< 1 µs). Reads directly from local CPU/RAM.',
        optionB: 'Sub-millisecond (0.5 - 2 ms). Incurs network TCP round-trip.',
        verdict: 'Local cache wins for ultra-low latency static configuration.'
      },
      {
        dimension: 'Consistency Across Nodes',
        optionA: 'Poor. Node A might hold stale data while Node B has updated.',
        optionB: 'High. All application instances share the exact same state.',
        verdict: 'Redis wins for shared distributed sessions and rate limiting.'
      },
      {
        dimension: 'Memory Utilization',
        optionA: 'Duplicated across all N application pods (N copies of data).',
        optionB: 'Deduplicated: single centralized copy in Redis.',
        verdict: 'Redis wins for large working sets (> 10GB).'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Cache-Aside: App reads cache -> on miss reads DB -> updates cache. On write: writes DB -> deletes cache.',
      'Always delete cache on DB write rather than updating to prevent concurrent race condition staleness.',
      'Cache Stampede: Hot key expires -> use Mutex lock or XFetch probabilistic early refresh.',
      'Cache Penetration: Non-existent keys hit DB -> use Bloom Filter or cache null with short TTL.',
      'Cache Avalanche: Keys expire simultaneously -> add random jitter to TTL.'
    ],
    conceptualQuestions: [
      {
        id: 'q5-1',
        question: 'What is the difference between Redis and Memcached?',
        answer: 'Memcached is multi-threaded, purely in-memory, and only supports simple key-value strings. Redis is single-threaded (for core event loop), supports rich data structures (Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLog, Streams), provides persistence (RDB snapshots and AOF logs), pub/sub, Lua scripting, and high availability clustering.'
      },
      {
        id: 'q5-2',
        question: 'What is a Bloom Filter and how does it prevent cache penetration?',
        answer: 'A Bloom filter is a space-efficient probabilistic data structure that tests set membership. It can return "definitely not in set" or "might be in set". When a request for an ID arrives, the gateway checks the Bloom filter: if it returns "not in set", the request is rejected immediately without touching Redis or the database.'
      },
      {
        id: 'q5-3',
        question: 'What is Redis Sentinel versus Redis Cluster?',
        answer: 'Redis Sentinel provides high availability for a single Primary-Replica pair (monitoring, health checks, and automatic failover). Redis Cluster provides horizontal data sharding across multiple primary nodes using 16,384 hash slots, combining automatic sharding with high availability failover.'
      },
      {
        id: 'q5-4',
        question: 'How do you handle CDN cache invalidation for static web assets?',
        answer: 'Do not rely on active cache purge APIs (which can take minutes to propagate globally). Use content hashing (cache busting): embed the file content hash into the filename (e.g., `bundle.7f3a9b.js`) and set `Cache-Control: public, max-age=31536000, immutable`. When code changes, the filename changes, forcing an instant fresh fetch while never serving stale files.'
      },
      {
        id: 'q5-5',
        question: 'What is the difference between RDB and AOF persistence in Redis?',
        answer: 'RDB (Redis Database) takes point-in-time binary snapshots of memory at specified intervals (compact, fast recovery, but risks losing minutes of data between snapshots). AOF (Append-Only File) logs every write command sequentially (fsync every second or every write; durable, zero data loss, but larger files and slower restart replay).'
      },
      {
        id: 'q5-6',
        question: 'What is the two-tier caching pattern (L1 / L2)?',
        answer: 'L1 is a small, ultra-fast in-memory cache inside the application process (e.g., Caffeine in Java, 100ns latency). L2 is a centralized shared distributed cache (Redis, 1ms latency). App checks L1 -> then L2 -> then DB. When L2 updates, it broadcasts an invalidation message via Redis Pub/Sub to clear L1 across all app instances.'
      },
      {
        id: 'q5-7',
        question: 'Why can hot keys cause CPU saturation in Redis Cluster?',
        answer: 'In Redis Cluster, all requests for a specific key map to a single hash slot hosted on a single primary node. If a celebrity tweet or flash sale product key experiences 200,000 requests/sec, that single Redis core is overwhelmed while the other 30 nodes in the cluster sit idle.'
      },
      {
        id: 'q5-8',
        question: 'How do you mitigate hot key saturation in Redis?',
        answer: 'Techniques: (1) Key Salting: append random suffixes to the key (`item_1234:1`, `item_1234:2`, ..., `item_1234:N`) so requests scatter across different hash slots and Redis nodes; (2) In-process L1 caching with a 5-second TTL on the application servers.'
      },
      {
        id: 'q5-9',
        question: 'What is HTTP Cache-Control `stale-while-revalidate`?',
        answer: 'It instructs the browser or CDN to immediately return a stale cached response if available, while asynchronously in the background sending a fetch request to the origin server to refresh the cache for future requests. It delivers instant zero-wait page loads.'
      },
      {
        id: 'q5-10',
        question: 'What is the "thundering herd" problem in web server sockets?',
        answer: 'Occurs when many waiting processes are awakened simultaneously by an incoming connection or event, but only one process can acquire it. The others waste CPU cycles competing and fall back to sleep. Mitigated via `SO_REUSEPORT` or EPOLLEXCLUSIVE flags in modern Linux kernels.'
      }
    ],
    designExercises: [
      {
        id: 'de5-1',
        scenario: 'A flash sale e-commerce platform sells 5,000 limited-edition sneakers. When the clock hits 12:00:00, 200,000 users refresh the product page.',
        task: 'Design a caching layer that prevents database crash and hot-key Redis collapse.',
        solutionGuide: '1. Push static product description and photos to CDN edge POPs with 24-hour cache and Anycast routing. 2. For live inventory stock, duplicate the Redis key across 10 salted keys (`stock_sneaker_42_{1..10}`). The app randomly picks one of the 10 keys for read checks, distributing load across 10 Redis nodes. 3. Use an in-process local cache (L1) with 1-second TTL to absorb 90% of reads inside the app memory before hitting Redis.'
      },
      {
        id: 'de5-2',
        scenario: 'An enterprise SaaS analytics dashboard runs slow aggregate SQL queries (`SELECT COUNT(*), SUM(sales)...`) taking 4 seconds per tenant.',
        task: 'Design an asynchronous cache warming and invalidation pipeline.',
        solutionGuide: 'Do not compute the aggregate synchronously on user page load. Use Write-Behind or Change Data Capture (CDC): whenever a sale occurs, publish an event to Kafka. A stream processing worker (Flink or Node.js) consumes the event, updates the running aggregate in Redis (`HINCRBYFLOAT tenant_aggregates sales_total amount`), and caches the pre-computed JSON summary with a 24-hour TTL. The dashboard queries Redis in 1ms.'
      },
      {
        id: 'de5-3',
        scenario: 'An attacker is bombarding an API with requests for random non-existent user IDs (`/api/v1/users/uuid-random-1234`), causing 10,000 full-table database scans per second.',
        task: 'Design a defense against this cache penetration attack.',
        solutionGuide: 'Deploy a Redis Bloom filter pre-populated with all legitimate user IDs (updated whenever a user registers). Incoming requests check the Bloom filter first. If false, immediately return HTTP 404 at the gateway without querying Redis or PostgreSQL. For any misses that pass the Bloom filter (due to false-positive probability), store `users:{id} = "NULL"` in Redis with a 60-second TTL.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq5-1',
        question: 'How do you guarantee consistency between a relational database and a Redis cache during high-concurrency writes?',
        answer: 'You cannot achieve 100% atomic two-system consensus between Redis and PostgreSQL without Two-Phase Commit, which destroys performance. The industry standard approach is: (1) Execute the database transaction first. (2) Commit the transaction. (3) Delete the Redis cache key. (4) If step 3 fails (e.g., Redis network timeout), publish an asynchronous message via PostgreSQL transactional outbox / CDC (Debezium) to Kafka to guarantee the cache key is deleted via retry. (5) Set a fallback TTL (e.g., 5-15 mins) on all Redis keys so any transient inconsistency is bounded.'
      },
      {
        id: 'iq5-2',
        question: 'Explain why Redis is single-threaded yet capable of executing over 100,000 operations per second.',
        answer: 'Redis’s core command execution loop is single-threaded, avoiding CPU context switching overhead, thread contention, lock acquisition, and race conditions. It achieves high throughput because: (1) All operations are pure RAM memory operations (nanosecond latency); (2) It uses non-blocking I/O multiplexing (`epoll` on Linux, `kqueue` on BSD) to monitor thousands of client sockets concurrently; (3) In Redis 6.0+, multi-threading was added specifically for network socket read/write parsing, while keeping state manipulation single-threaded.'
      },
      {
        id: 'iq5-3',
        question: 'What is the Cache Stampede Mutex (Locking) pattern and how is it coded?',
        answer: 'When a cache miss occurs, the client does not query the DB immediately. It attempts to acquire a short-lived distributed lock in Redis: `SET lock:item_123 uuid NX EX 10`. If lock acquisition succeeds: this worker queries the DB, writes the result to Redis, and releases the lock. If lock acquisition fails (meaning another worker is already fetching data): this worker sleeps for 50ms and retries reading the cache, or returns a degraded fallback value. Only 1 query reaches the database.'
      },
      {
        id: 'iq5-4',
        question: 'What happens when a Redis node runs out of memory under `noeviction` vs `volatile-lru` vs `allkeys-lru`?',
        answer: 'Under `noeviction`, Redis refuses all new write commands and returns an OOM error, but continues serving reads. Under `volatile-lru`, Redis evicts the least recently used keys among those that have an explicit TTL set; if no keys have TTLs, it errors. Under `allkeys-lru`, Redis evicts the least recently used keys across the entire database regardless of TTL, ensuring write commands continue succeeding.'
      },
      {
        id: 'iq5-5',
        question: 'What is the role of an Anycast CDN in edge caching?',
        answer: 'An Anycast CDN advertises the same IP address across hundreds of Points of Presence (POPs) globally via BGP routing. When a user requests a static asset or cached API response, internet routing directs the packet to the geographically closest POP (often < 5ms away). The POP terminates TLS, serves the cached asset from edge NVMe SSD/RAM, and only proxies to the origin server on a cache miss, protecting origin infrastructure from global traffic spikes.'
      }
    ],
    practicalTask: {
      title: 'Calculate Cache Hit Ratio and Effective Latency',
      instructions: 'A database has a read latency of 25ms. A Redis cache has a read latency of 1ms. Calculate the average effective latency for: (A) Cache Hit Ratio = 80%, (B) Cache Hit Ratio = 95%, (C) Cache Hit Ratio = 99%.',
      verification: 'Effective Latency = (HitRatio * CacheLatency) + ((1 - HitRatio) * (CacheLatency + DBLatency)). Case A (80%): (0.80 * 1) + (0.20 * 26) = 0.8 + 5.2 = 6.0ms. Case B (95%): (0.95 * 1) + (0.05 * 26) = 0.95 + 1.3 = 2.25ms. Case C (99%): (0.99 * 1) + (0.01 * 26) = 0.99 + 0.26 = 1.25ms. Improving hit ratio from 80% to 99% speeds up the application by nearly 5x.'
    }
  },
  sources: [
    {
      title: 'Optimal Probabilistic Cache Stampede Prevention (XFetch)',
      url: 'https://vldb.org/pvldb/vol8/p886-vattani.pdf',
      type: 'Research Paper',
      whatItSupports: 'Vattani et al. (VLDB 2015): Mathematical proof and implementation of the XFetch probabilistic early expiration algorithm.'
    },
    {
      title: 'Redis Documentation: Key Eviction & Memory Optimization',
      url: 'https://redis.io/docs/latest/develop/reference/eviction/',
      type: 'Official Documentation',
      whatItSupports: 'Official Redis documentation on maxmemory policies, LRU/LFU approximation algorithms, and memory defragmentation.'
    }
  ],
  videos: [
    {
      title: 'Distributed Systems 3.2: Clocks and time',
      creator: 'Martin Kleppmann (University of Cambridge)',
      duration: '42m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Physical clocks, drift, monotonic clocks, and why wall-clock time causes subtle cache invalidation bugs.',
      url: 'https://www.youtube.com/watch?v=mOHX12bsy-I'
    }
  ]
};

export const PART6_CHAPTER: Chapter = {
  id: 'part6-messaging',
  part: 6,
  partTitle: 'Part 6 — Messaging & Event-Driven Architecture',
  chapterNumber: 6,
  title: 'Messaging & Event-Driven Architecture',
  subtitle: 'Queues vs Pub/Sub, Kafka, RabbitMQ, SQS, Delivery Guarantees, Outbox Pattern, and Event Sourcing',
  summary: 'Synchronous REST/gRPC coupling creates tight inter-service dependencies where the failure of one microservice cascades across the entire system. Event-driven architectures decouple producers from consumers using distributed message queues and log-based streaming brokers, enabling resilient asynchronous execution and temporal decoupling.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                    TRANSACTIONAL OUTBOX PATTERN (Dual-Write Solution)                            |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. BUSINESS SERVICE (Single ACID Local Transaction)                                            |
|      BEGIN TRANSACTION;                                                                          |
|        INSERT INTO orders (id, user_id, amount) VALUES ('ord_101', 'u_42', 250.00);             |
|        INSERT INTO outbox_events (id, aggregate_type, payload)                                  |
|               VALUES ('evt_99', 'Order', '{"order_id":"ord_101","event":"OrderCreated"}');       |
|      COMMIT; -- Both order and event succeed or fail atomically! Zero dual-write loss!           |
|          |                                                                                       |
|          v                                                                                       |
|   2. CHANGE DATA CAPTURE / LOG RELAY (e.g. Debezium / Kafka Connect)                             |
|      - Tails PostgreSQL WAL log (or polls outbox table)                                          |
|      - Reads 'evt_99' and publishes to Kafka topic: "orders.events"                              |
|          |                                                                                       |
|          v                                                                                       |
|   3. APACHE KAFKA (Distributed Commit Log)                                                       |
|      Topic: "orders.events" [ Partition 0 | Partition 1 | Partition 2 ]                           |
|          |                                            |                                          |
|          v                                            v                                          |
|   4. CONSUMER GROUP: INVOICE WORKERS            CONSUMER GROUP: NOTIFICATION WORKERS             |
|      - Worker A (Partition 0, 1)                  - Worker C (Partition 0, 1, 2)                 |
|      - Worker B (Partition 2)                     - Idempotent deduplication by 'evt_99'         |
|      - Generates PDF invoice                      - Sends Push Notification to User              |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Message Queues (RabbitMQ/SQS) vs. Event Streams (Kafka/Kinesis)',
      confidence: 'stable',
      simpleDefinition: 'A message queue distributes transient tasks to workers and deletes messages once acknowledged; an event stream appends immutable events to an ordered, durable commit log that multiple consumer groups can replay independently.',
      whyItExists: 'Traditional message queues are designed for transient task orchestration. Event streams are designed for durable state replication, analytics, and event-driven data streaming.',
      analogy: 'A message queue is a restaurant order ticket spike: the chef pulls a ticket, cooks the meal, and throws the ticket in the trash. An event stream is a permanent financial ledger book: entries are recorded chronologically in permanent ink; anyone can read from page 1 to 500 at their own pace without erasing anything.',
      technicalExplanation: 'RabbitMQ / SQS: Smart broker, dumb consumer. The broker tracks which consumer has which message, handles acknowledgments, and deletes messages upon success. Messages are ephemeral. Scale is limited when tracking millions of individual message states. Apache Kafka: Dumb broker, smart consumer. Kafka is an append-only distributed commit log divided into Partitions. Messages are retained for days/months based on retention policies. The consumer maintains its own read pointer (Offset). Multiple independent consumer groups can read the same topic simultaneously at different speeds without affecting each other.',
      example: 'Use AWS SQS or RabbitMQ for sending transactional customer emails (order receipt, password reset). Use Apache Kafka for real-time clickstream tracking, financial audit trails, and microservice state propagation.',
      whenToUse: [
        'Use RabbitMQ/SQS when you need complex routing (fanout, topic, direct exchanges), individual message acknowledgment, and task queuing.',
        'Use Kafka when you need high-throughput event streaming (1,000,000 msgs/sec), message replayability, strict partition ordering, and stream processing.'
      ],
      whenNotToUse: [
        'Do not use Kafka as a simple task queue with individual message acknowledgments or complex per-message delayed retry timers (Kafka commits offsets sequentially per partition).'
      ],
      commonMistakes: [
        'Attempting to delete individual messages in Kafka (Kafka only deletes data via retention time or log compaction per key).',
        'Not setting up a Dead-Letter Queue (DLQ) in RabbitMQ/SQS, causing poisoned malformed messages to crash worker loops infinitely.'
      ],
      interviewQuestion: {
        question: 'Why can Apache Kafka achieve millions of messages per second on modest commodity hardware?',
        answer: 'Kafka leverages four core architectural design choices: (1) Sequential Disk I/O: It appends records to immutable log files, matching the raw bandwidth of spinning disks and SSDs; (2) Page Cache utilization: It relies on the Linux OS kernel page cache rather than Java JVM heap memory, avoiding garbage collection pauses; (3) Zero-Copy Data Transfer: It uses the Linux `sendfile()` system call to transfer bytes directly from OS page cache to network socket, bypassing application memory; (4) Batching: Producers and brokers aggressively batch records together over the network and on disk.'
      }
    },
    {
      title: 'Kafka Partitions, Consumer Groups, and Ordering Guarantees',
      confidence: 'stable',
      simpleDefinition: 'A Kafka topic is split into Partitions for parallelism. Kafka guarantees strict ordering ONLY within a single partition, not across the entire topic.',
      whyItExists: 'A single machine cannot handle hundreds of thousands of messages per second. Partitioning spreads the log across multiple brokers to scale horizontally.',
      analogy: 'A bank with 4 teller windows: customers for window 1 are served in strict first-come-first-served order. But you cannot guarantee customer 5 at Window 1 finishes before customer 6 at Window 2.',
      technicalExplanation: 'When a producer publishes a record, it specifies a Partition Key (e.g., `user_id` or `tenant_id`). Kafka hashes the key: `hash(key) % num_partitions` to assign the partition. All events for the same key land on the exact same partition in strict chronological order. A Consumer Group represents a logical application. Each partition is assigned to exactly ONE consumer within a consumer group. If you have 10 partitions and 4 consumer instances, some instances read 2 or 3 partitions. If you add an 11th consumer instance, it sits completely idle because consumer count cannot exceed partition count.',
      example: 'In an order tracking system, partition by `order_id`. All state transitions (`OrderCreated`, `PaymentAuthorized`, `OrderShipped`) for order 101 land on Partition 2 and are processed in exact sequence. Order 102 might land on Partition 4.',
      whenToUse: ['Always provide a business entity ID as the partition key when causal event ordering matters (e.g., `account_id`, `order_id`).'],
      whenNotToUse: ['Do not use a low-cardinality key (e.g., `country_code` with 90% traffic from "US"), which creates hot partitions that overwhelm a single consumer.'],
      commonMistakes: [
        'Adding more consumer pods than partitions, expecting higher parallelism (excess consumers do nothing).',
        'Leaving partition key empty (round-robin), which scatters related events across partitions and destroys ordering.'
      ],
      interviewQuestion: {
        question: 'What happens during a Kafka Consumer Group Rebalance?',
        answer: 'A rebalance occurs when a consumer joins the group, crashes/leaves the group, or topic partitions are added. During rebalance, partition assignments are revoked and reassigned among alive consumers. In older Kafka versions, this caused "stop-the-world" pauses (Eager Rebalance). Modern Kafka uses Cooperative Sticky Assignors, which allow unaffected consumers to continue processing their partitions while only migrating reallocated partitions, minimizing downtime.'
      }
    },
    {
      title: 'The Transactional Outbox & Inbox Patterns',
      confidence: 'stable',
      simpleDefinition: 'The Outbox Pattern solves the "Dual-Write" distributed bug by saving the database change AND the event to the same local database within a single ACID transaction, then relaying it to Kafka.',
      whyItExists: 'If an application writes to PostgreSQL and then makes a network call to Kafka, a crash or network drop between the two creates an irreconcilable inconsistency (DB updated but event lost, or vice versa).',
      analogy: 'Writing a letter and addressing the envelope at your desk before handing it to the mail carrier. You never mail an empty envelope hoping you will write the letter later.',
      technicalExplanation: 'The application executes: `BEGIN; INSERT INTO orders ...; INSERT INTO outbox_events ...; COMMIT;`. Because both tables live in the same database, the write is 100% atomic. A separate Change Data Capture (CDC) process (like Debezium reading the database Write-Ahead Log) reads the `outbox_events` table and streams events to Kafka. Once published, the event is marked published or deleted. The Transactional Inbox Pattern is the consumer counterpart: the consumer writes the incoming event ID to an `inbox` table within its local database transaction, guaranteeing idempotent deduplication.',
      example: 'A banking application creates a loan account in PostgreSQL and must notify credit scoring and billing. Using the Outbox pattern guarantees that credit scoring is never notified of a phantom loan if the DB commit fails.',
      whenToUse: ['Mandatory whenever a database mutation must reliably trigger an asynchronous message to an external broker.'],
      whenNotToUse: ['Not required for fire-and-forget non-critical telemetry (e.g., user mouse hover tracking).'],
      commonMistakes: [
        'Polling the outbox table with `SELECT * FROM outbox WHERE published = false` every 500ms on a busy database, causing high CPU and lock contention. Use log-based CDC (Debezium reading the WAL) instead.'
      ],
      interviewQuestion: {
        question: 'Why is the "Dual-Write" problem a fundamental flaw in naive microservices, and how does the Outbox Pattern fix it?',
        answer: 'A dual-write occurs when a service tries to update two independent stateful systems (e.g., PostgreSQL and Kafka) sequentially. If the service writes to PostgreSQL and crashes before publishing to Kafka, the message is permanently lost. If it reverses the order (publishes to Kafka first) and the DB transaction rolls back due to a constraint violation, an invalid phantom event was published. Because there is no distributed transaction spanning PostgreSQL and Kafka, one will inevitably fail. The Outbox pattern fixes this by converting the message publish into a local SQL insert into an `outbox` table inside the exact same local ACID transaction as the business write.'
      }
    },
    {
      title: 'CQRS and Event Sourcing',
      confidence: 'stable',
      simpleDefinition: 'CQRS (Command Query Responsibility Segregation) separates read models from write models; Event Sourcing stores the state of an entity as an append-only sequence of historical state-changing events.',
      whyItExists: 'Traditional CRUD overwrites current state, permanently destroying audit history and making complex analytical queries slow on transactional tables.',
      analogy: 'A bank ledger: your bank does not just store a single number representing your current balance. It stores every deposit, withdrawal, and fee since account opening. Your current balance is calculated by summing all events.',
      technicalExplanation: 'In Event Sourcing, the database stores immutable domain events (`OrderCreated`, `ItemAdded`, `ShippingAddressChanged`). Current entity state is reconstructed by replaying all historical events from origin (or from a periodic Snapshot). In CQRS, the Write Model (Command) handles validations and emits events. The Read Model (Query) subscribes to those events and updates optimized, denormalized read views (e.g., Elasticsearch for search, PostgreSQL for reports). The read and write stores are decoupled and eventually consistent.',
      example: 'Git is an event-sourced system: it stores commit diffs (events), not just the final state of your code. You can checkout any commit in history. Financial ledgers and airline reservation systems use Event Sourcing for audit compliance.',
      whenToUse: [
        'Use Event Sourcing for financial ledgers, legal audit trails, complex business workflows with state rollback needs, and collaborative editing.',
        'Use CQRS when read query patterns diverge wildly from transactional write models (e.g., search indexing).'
      ],
      whenNotToUse: [
        'Do NOT default to Event Sourcing for simple CRUD applications—it adds immense complexity in schema evolution, event versioning, and snapshot management.'
      ],
      commonMistakes: [
        'Assuming Event Sourcing gives you strong read consistency: read projections are updated asynchronously, meaning reads are eventually consistent.'
      ],
      interviewQuestion: {
        question: 'How do you handle schema evolution (breaking changes to event payloads) in an Event-Sourced system?',
        answer: 'Because past events in the event store are immutable and can never be rewritten, schema evolution requires careful versioning: (1) Upcasting: Application middleware intercepts old event versions during deserialization and transforms them to the latest schema before passing them to domain logic; (2) Event Versioning: include a `version` field in event metadata (`OrderCreatedV1`, `OrderCreatedV2`); (3) Additive changes only: new fields should always be optional or have defaults; never delete or repurpose existing fields.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'RabbitMQ (Traditional Message Queue)',
    technologyB: 'Apache Kafka (Distributed Commit Log)',
    comparisonDimensions: [
      {
        dimension: 'Message Retention',
        optionA: 'Ephemeral. Deleted immediately upon consumer acknowledgment.',
        optionB: 'Durable. Retained for days/months based on retention policy; replayable.',
        verdict: 'Kafka wins when historical replay or analytics streaming is needed.'
      },
      {
        dimension: 'Routing Flexibility',
        optionA: 'Rich. Topic, Direct, Fanout, and Headers exchanges.',
        optionB: 'Basic. Topic and partition key hashing.',
        verdict: 'RabbitMQ wins for complex enterprise message routing topologies.'
      },
      {
        dimension: 'Throughput',
        optionA: 'Tens of thousands of messages per second per cluster.',
        optionB: 'Hundreds of thousands to millions of messages per second.',
        verdict: 'Kafka wins for massive event ingest and clickstreams.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Queues (RabbitMQ/SQS) delete messages upon ACK; Event streams (Kafka) append to durable logs.',
      'Kafka guarantees strict ordering ONLY within a single partition, governed by the partition key.',
      'A consumer group shares partition reads; partition count sets the ceiling for consumer parallelism.',
      'The Transactional Outbox pattern solves the dual-write problem by saving events in the local DB transaction.',
      'Event Sourcing stores state as a sequence of immutable events; CQRS separates read and write data models.'
    ],
    conceptualQuestions: [
      {
        id: 'q6-1',
        question: 'What is a Dead-Letter Queue (DLQ) and when should messages be sent to it?',
        answer: 'A DLQ is a secondary queue where messages that fail processing repeatedly (poison pills) are routed after exceeding a maximum retry threshold (e.g., 5 retries). This prevents malformed messages from blocking the main queue and allows engineers to inspect and debug failures.'
      },
      {
        id: 'q6-2',
        question: 'What is the difference between at-least-once and exactly-once processing in Kafka?',
        answer: 'At-least-once: Messages are guaranteed to be delivered, but failures/retries can cause consumers to process duplicates. Exactly-once (Kafka EOS): Uses transactional producers (`enable.idempotence=true`) and two-phase commit coordinators across Kafka topics so read-process-write streams execute with exactly-once side effects.'
      },
      {
        id: 'q6-3',
        question: 'What is Kafka Log Compaction?',
        answer: 'Log compaction ensures Kafka retains at least the last known value for each message key within a topic partition. It periodically scans log segments and removes older records that share the same key as a newer record, creating a compacted key-value snapshot table.'
      },
      {
        id: 'q6-4',
        question: 'What is backpressure in an event-driven system and how is it handled?',
        answer: 'Backpressure occurs when messages arrive faster than consumers can process them. Handled by: (1) Pull-based consumers (Kafka) where consumers pull at their own pace; (2) Dropping non-critical messages; (3) Scaling consumer pods; (4) Rate-limiting producers at the gateway.'
      },
      {
        id: 'q6-5',
        question: 'Why does Kafka use pull-based consumers instead of push-based consumers?',
        answer: 'Push-based brokers (like early versions of traditional queues) can easily overwhelm slow consumers with floods of data. Pull-based consumers give the consumer full control over its ingestion rate, allowing it to batch messages efficiently and apply natural backpressure.'
      },
      {
        id: 'q6-6',
        question: 'What is a consumer offset in Kafka?',
        answer: 'An offset is a sequential integer assigned to each message within a partition. The consumer group periodically commits its current offset to an internal Kafka topic (`__consumer_offsets`), recording its exact progress through the log.'
      },
      {
        id: 'q6-7',
        question: 'How do you prevent message loss in Apache Kafka producers?',
        answer: 'Configure: (1) `acks=all` (wait for all in-sync replicas to acknowledge); (2) `min.insync.replicas=2`; (3) `retries=MAX_INT`; (4) `enable.idempotence=true`.'
      },
      {
        id: 'q6-8',
        question: 'What is the difference between fanout and direct exchange in RabbitMQ?',
        answer: 'A Direct Exchange routes messages to queues based on an exact match of the routing key. A Fanout Exchange routes messages to ALL bound queues unconditionally, broadcasting to all subscribers.'
      },
      {
        id: 'q6-9',
        question: 'What is an event-driven Saga orchestrator vs choreographer?',
        answer: 'In Choreography, services listen to events and decide their next action without a central coordinator. In Orchestration, a dedicated orchestrator service (e.g., Temporal, AWS Step Functions) centrally commands each participant service and handles rollbacks.'
      },
      {
        id: 'q6-10',
        question: 'What is the role of Schema Registry in Kafka?',
        answer: 'A Schema Registry (e.g., Confluent Schema Registry) stores versioned schemas (Avro, Protobuf, JSON Schema). Producers register schemas and consumers validate payloads against the registry, preventing breaking data contract changes.'
      }
    ],
    designExercises: [
      {
        id: 'de6-1',
        scenario: 'An online food delivery platform needs to process restaurant orders. When an order is placed, it must charge payment, notify the restaurant tablet, and dispatch a courier.',
        task: 'Design an event-driven workflow using the Transactional Outbox pattern.',
        solutionGuide: 'The Order Service receives `POST /orders`, writes order details to the `orders` table and writes an `OrderPlaced` event to the `outbox` table inside a single PostgreSQL transaction. Debezium CDC reads the outbox and publishes the event to Kafka topic `orders.events` with key `order_id`. Three independent consumer groups (Payment Service, Restaurant Gateway, Dispatch Service) consume the event. If payment fails, Payment Service publishes `PaymentFailed`, which triggers a compensating cancellation event.'
      },
      {
        id: 'de6-2',
        scenario: 'A crypto exchange matching engine processes 500,000 trades/sec. Regulators require an immutable audit trail of every order modification.',
        task: 'Design the storage and streaming architecture using Event Sourcing.',
        solutionGuide: 'Use Event Sourcing: every order action is stored as an immutable event (`OrderSubmitted`, `OrderMatched`, `OrderCancelled`) in a high-throughput distributed commit log (Kafka backed by NVMe SSDs or Apache BookKeeper). The in-memory matching engine runs deterministically from the log. Current order book state is projected into an in-memory Redis cluster for low-latency trader UI queries.'
      },
      {
        id: 'de6-3',
        scenario: 'A Kafka consumer processing financial transactions crashes mid-batch after processing 40 out of 100 messages, before committing its offset.',
        task: 'Explain the failure mode and design an idempotent consumer to prevent double execution.',
        solutionGuide: 'Failure Mode: When a new consumer restarts or rebalances, it reads from the last committed offset (message 0), re-processing messages 1 through 40 (duplicate execution). Defense: Store an `inbox` table in the consumer’s local database. For each message, execute `INSERT INTO inbox (message_id) VALUES ($1)` within the local business transaction. If the message was already processed, the unique constraint aborts the transaction, guaranteeing exactly-once side effects.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq6-1',
        question: 'How do you guarantee strict chronological message ordering in a distributed messaging system?',
        answer: 'You must ensure three conditions: (1) All causally related events share the same Partition Key so they are routed to the exact same Kafka partition; (2) The producer sets `max.in.flight.requests.per.connection=1` (or uses `enable.idempotence=true`) so network retries do not reorder packets; (3) The consumer processes messages single-threaded per partition without asynchronous worker pool hand-offs that could complete out of order.'
      },
      {
        id: 'iq6-2',
        question: 'What is the difference between log-based Change Data Capture (CDC) and trigger-based CDC?',
        answer: 'Trigger-based CDC uses SQL triggers (`AFTER INSERT/UPDATE/DELETE`) to write to an audit table. This incurs heavy database CPU overhead, slows down every transactional write, and can fail under high load. Log-based CDC (like Debezium) directly reads the database’s native binary Write-Ahead Log (WAL) from outside the database engine. It has near-zero overhead on the primary transaction path and captures all mutations, including schema changes.'
      },
      {
        id: 'iq6-3',
        question: 'How does Apache Kafka handle broker crashes without data loss?',
        answer: 'Kafka uses Leader-Follower partition replication. Each partition has 1 Leader broker and N-1 Follower brokers. Followers continuously fetch messages from the leader. Brokers keeping up with the leader are in the In-Sync Replicas (ISR) list. If the leader crashes, the Kafka Controller (via KRaft or ZooKeeper) elects a new leader from the ISR. With `acks=all` and `min.insync.replicas=2`, no committed message is lost.'
      },
      {
        id: 'iq6-4',
        question: 'What are the main trade-offs between Choreographed and Orchestrated Sagas?',
        answer: 'Choreography has no central coordinator; services communicate via events. It is simple for small workflows (2-3 services), but becomes difficult to debug, monitor, and trace as workflows grow ("event spaghetti"). Orchestration uses a central orchestrator (like Temporal or Step Functions) that explicitly defines state transitions and error handling. It is easier to reason about and debug, but introduces a centralized dependency.'
      },
      {
        id: 'iq6-5',
        question: 'What is Head-of-Line blocking in message queues and how do you prevent it?',
        answer: 'In a FIFO queue or Kafka partition, if a single poison-pill message fails processing and blocks consumer progress, all subsequent messages behind it are stalled. Mitigate by: (1) Rapid retry with exponential backoff; (2) Routing the failed message to a Dead-Letter Queue (DLQ) after 3 attempts and committing the offset; (3) Non-blocking retry topics in Kafka (e.g., `orders.retry.10s`, `orders.retry.1m`).'
      }
    ],
    practicalTask: {
      title: 'Calculate Kafka Partition Sizing for Throughput Targets',
      instructions: 'A system produces 120,000 messages per second. Average message size is 1 KB. A single Kafka partition can write up to 10 MB/sec. A single consumer worker thread can process 1,500 messages per second. Calculate: (A) Total producer bandwidth, (B) Minimum partitions required for write throughput, (C) Minimum partitions required for consumer throughput.',
      verification: 'Total Bandwidth = 120,000 * 1 KB = 120,000 KB/s ≈ 120 MB/s. Partitions for write = 120 MB/s / 10 MB/s = 12 partitions. Partitions for consumption = 120,000 msgs/s / 1,500 msgs/s = 80 partitions. To satisfy both producer and consumer requirements, you must provision at least 80 partitions on the topic.'
    }
  },
  sources: [
    {
      title: 'Kafka: A Distributed Messaging System for Log Processing',
      url: 'https://www.microsoft.com/en-us/research/publication/kafka-a-distributed-messaging-system-for-log-processing/',
      type: 'Research Paper',
      whatItSupports: 'Kreps, Narkhede, Rao (LinkedIn, 2011): Original architectural paper introducing Kafka, log-centric storage, and distributed pub/sub.'
    },
    {
      title: 'Pattern: Transactional Outbox (Chris Richardson)',
      url: 'https://microservices.io/patterns/data/transactional-outbox.html',
      type: 'Official Documentation',
      whatItSupports: 'Architectural pattern definition, dual-write prevention, and CDC integration.'
    }
  ],
  videos: [
    {
      title: 'GOTO 2020 • The Event-Driven Disruption • Jonas Bonér',
      creator: 'GOTO Conferences',
      duration: '47m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Foundations of event-driven architectures, temporal decoupling, and stateful streaming systems.',
      url: 'https://www.youtube.com/watch?v=Fmptmm_G_1Q'
    }
  ]
};
