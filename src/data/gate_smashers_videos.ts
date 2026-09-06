import { GateSmashersLecture } from '../types';

export const GATE_SMASHERS_PLAYLIST_ID = 'PLxCzCOWd7aiGzmLZFRkhfe_e0a4f5';
export const GATE_SMASHERS_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${GATE_SMASHERS_PLAYLIST_ID}`;

export const GATE_SMASHERS_LECTURES: GateSmashersLecture[] = [
  {
    id: 'gs-lec-1',
    lectureNumber: 1,
    title: 'Lec:1 : System Design | Complete Syllabus Discussion',
    duration: '6:25',
    category: 'Foundations & Mindset',
    summary: 'Varun Sir breaks down the complete syllabus and roadmap for System Design, explaining the interview expectations from freshers to Staff engineers.',
    keyTakeaways: [
      'Difference between HLD (High Level Design) and LLD (Low Level Design)',
      'Core pillars: Scalability, Availability, Reliability, and Consistency',
      'Step-by-step interview roadmap for FAANG/MNC placements'
    ],
    associatedChapterTitle: 'Part 0: Staff Mindset & Requirements',
    associatedChapterId: 'ch-part0',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+1+System+Design+Complete+Syllabus+Discussion`,
    searchQuery: 'Gate Smashers Lec 1 System Design Complete Syllabus Discussion',
    isPopular: true
  },
  {
    id: 'gs-lec-2',
    lectureNumber: 2,
    title: 'Lec-2: What happens when you open a website/Mobile App? | System Design',
    duration: '6:05',
    category: 'Foundations & Mindset',
    summary: 'Detailed explanation of the exact client-server flow when a user enters a URL into a browser or opens a mobile application.',
    keyTakeaways: [
      'DNS resolution tree: Browser Cache -> OS Hosts -> Resolver -> Root/TLD/Authoritative DNS',
      'TCP 3-Way Handshake and TLS 1.3 cryptographic negotiation',
      'HTTP Request parsing, Web Server dispatch, App Server logic, and Database queries'
    ],
    associatedChapterTitle: 'Part 1: Networking & Edge Infrastructure',
    associatedChapterId: 'ch-part1',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+2+What+happens+when+you+open+a+website`,
    searchQuery: 'Gate Smashers Lec 2 What happens when you open a website Mobile App System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-3',
    lectureNumber: 3,
    title: 'Lec-3: Load Balancer in System Design',
    duration: '9:26',
    category: 'Load Balancing & Networking',
    summary: 'Comprehensive guide to Load Balancers, Layer 4 vs Layer 7 routing, and common load balancing scheduling algorithms.',
    keyTakeaways: [
      'Layer 4 (Transport/TCP) vs Layer 7 (Application/HTTP header) routing',
      'Balancing algorithms: Round Robin, Weighted Round Robin, Least Connections, IP Hash',
      'Health checks, heartbeat monitors, and Active-Passive vs Active-Active failover'
    ],
    associatedChapterTitle: 'Part 1: Networking & Edge Infrastructure',
    associatedChapterId: 'ch-part1',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+3+Load+Balancer+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 3 Load Balancer in System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-4',
    lectureNumber: 4,
    title: 'Lec-4 : Content Delivery Network (CDN) | How it works',
    duration: '5:53',
    category: 'Load Balancing & Networking',
    summary: 'How Content Delivery Networks work, Points of Presence (PoPs), Edge Caching, and latency reduction worldwide.',
    keyTakeaways: [
      'Push CDNs vs Pull CDNs and edge cache hit/miss semantics',
      'Anycast routing to direct users to the geographically closest Edge server',
      'Static asset caching, media streaming, and origin shielding'
    ],
    associatedChapterTitle: 'Part 1: Networking & Edge Infrastructure',
    associatedChapterId: 'ch-part1',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+4+Content+Delivery+Network+CDN`,
    searchQuery: 'Gate Smashers Lec 4 Content Delivery Network CDN How it works',
    isPopular: false
  },
  {
    id: 'gs-lec-5',
    lectureNumber: 5,
    title: 'Lec-5: Forward proxy vs Reverse proxy | System Design',
    duration: '7:41',
    category: 'Load Balancing & Networking',
    summary: 'Clarifies the critical distinction between Forward Proxies (client-side) and Reverse Proxies (server-side).',
    keyTakeaways: [
      'Forward Proxy protects and anonymizes clients (Corporate firewall, VPN, content filtering)',
      'Reverse Proxy protects and optimizes backend servers (SSL termination, caching, compression)',
      'Nginx and Envoy architecture in production microservices'
    ],
    associatedChapterTitle: 'Part 1: Networking & Edge Infrastructure',
    associatedChapterId: 'ch-part1',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+5+Forward+proxy+vs+Reverse+proxy`,
    searchQuery: 'Gate Smashers Lec 5 Forward proxy vs Reverse proxy System Design',
    isPopular: false
  },
  {
    id: 'gs-lec-6',
    lectureNumber: 6,
    title: 'Lec-6: What are SSL Certificates & How they work? | System Design',
    duration: '9:10',
    category: 'Security & Auth',
    summary: 'How SSL/TLS certificates operate, symmetric vs asymmetric encryption, Certificate Authorities, and secure communication.',
    keyTakeaways: [
      'Public key vs Private key cryptography and asymmetric key exchange',
      'Session key generation for high-speed symmetric data encryption',
      'Certificate Authorities (CAs), Chain of Trust, and SSL termination at API Gateway'
    ],
    associatedChapterTitle: 'Part 17: Zero-Trust Security & DDoS Defense',
    associatedChapterId: 'ch-part17',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+6+What+are+SSL+Certificates`,
    searchQuery: 'Gate Smashers Lec 6 What are SSL Certificates How they work System Design',
    isPopular: false
  },
  {
    id: 'gs-lec-7',
    lectureNumber: 7,
    title: 'Lec-7: What is Caching in System Design | All Types of Caching with Real life examples',
    duration: '8:01',
    category: 'Caching & Performance',
    summary: 'Explains caching at all layers (Browser, CDN, Application, Redis Cache, Database buffer pool) with real-world examples.',
    keyTakeaways: [
      'Multi-level caching hierarchy from CPU registers to distributed Redis clusters',
      'Cache eviction policies: LRU (Least Recently Used), LFU, FIFO, and TTL expiry',
      'Preventing Cache Stampede, Cache Penetration, and Cache Avalanche'
    ],
    associatedChapterTitle: 'Part 5: Caching Strategies & Performance',
    associatedChapterId: 'ch-part5',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+7+What+is+Caching+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 7 What is Caching in System Design All Types of Caching',
    isPopular: true
  },
  {
    id: 'gs-lec-8',
    lectureNumber: 8,
    title: 'Lec-8: Full Stack Request Flow Explained | DNS, CDN, API, Cache & Database | Complete System Design',
    duration: '8:23',
    category: 'Foundations & Mindset',
    summary: 'End-to-end integration walkthrough tracing a request across DNS, CDN, API Gateway, Redis Cache, Services, and DB.',
    keyTakeaways: [
      'Holistic system architecture diagram bridging all components together',
      'Latency cost breakdown at each hop: Network, Cache hit, DB disk I/O',
      'Failure handling when downstream components (cache/DB) become unreachable'
    ],
    associatedChapterTitle: 'Part 2: Backend Architecture & Request Flow',
    associatedChapterId: 'ch-part2',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+8+Full+Stack+Request+Flow+Explained`,
    searchQuery: 'Gate Smashers Lec 8 Full Stack Request Flow Explained Complete System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-9',
    lectureNumber: 9,
    title: 'Lec-9: What are APIs(Application Programming Interface) | System Design',
    duration: '7:00',
    category: 'APIs & Microservices',
    summary: 'Fundamentals of APIs, contracts, interface design, request-response paradigms, and how systems talk to each other.',
    keyTakeaways: [
      'API contracts as boundary interfaces decoupling client and server evolution',
      'Stateless communication, endpoints, query params, headers, and HTTP verbs',
      'Idempotency requirements for distributed financial and order operations'
    ],
    associatedChapterTitle: 'Part 2: Backend Architecture & Request Flow',
    associatedChapterId: 'ch-part2',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+9+What+are+APIs+System+Design`,
    searchQuery: 'Gate Smashers Lec 9 What are APIs Application Programming Interface System Design',
    isPopular: false
  },
  {
    id: 'gs-lec-10',
    lectureNumber: 10,
    title: 'Lec10: Database Partitioning | How it is Done in System Design',
    duration: '8:11',
    category: 'Databases & Sharding',
    summary: 'Mechanics of database partitioning: horizontal vs vertical table partitioning, partition keys, and query routing.',
    keyTakeaways: [
      'Horizontal partitioning (splitting rows) vs Vertical partitioning (splitting columns/wide tables)',
      'Partitioning strategies: Range-based, Hash-based, and List-based partitioning',
      'Cross-partition query overhead and index management'
    ],
    associatedChapterTitle: 'Part 3: Relational Databases & Sharding',
    associatedChapterId: 'ch-part3',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+10+Database+Partitioning`,
    searchQuery: 'Gate Smashers Lec 10 Database Partitioning How it is Done in System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-11',
    lectureNumber: 11,
    title: 'Lec-11: Database Partitioning vs Sharding | System Design with Real Life Examples',
    duration: '5:12',
    category: 'Databases & Sharding',
    summary: 'Clear demarcation between Database Partitioning (single instance or logical split) and Sharding (distributed across independent database machines).',
    keyTakeaways: [
      'Partitioning splits tables logically inside a single DB engine',
      'Sharding distributes chunks across distinct physical database servers (Shared-Nothing architecture)',
      'Handling Hotspot shards, shard rebalancing, and Consistent Hashing'
    ],
    associatedChapterTitle: 'Part 3: Relational Databases & Sharding',
    associatedChapterId: 'ch-part3',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+11+Database+Partitioning+vs+Sharding`,
    searchQuery: 'Gate Smashers Lec 11 Database Partitioning vs Sharding System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-12',
    lectureNumber: 12,
    title: 'Lec-12: CAP Theorem in System Design | Consistency, Availability, Partition Tolerance',
    duration: '8:45',
    category: 'Scaling & Architecture',
    summary: 'Eric Brewer’s CAP Theorem made crystal clear with network partition scenarios and CP vs AP system trade-offs.',
    keyTakeaways: [
      'Why Partition Tolerance (P) is non-negotiable in distributed real-world networks',
      'CP Systems (MongoDB, HBase, Spanner): Prioritize exact consistency over availability during split',
      'AP Systems (Cassandra, DynamoDB, CouchDB): Prioritize 100% availability with eventual consistency'
    ],
    associatedChapterTitle: 'Part 8: Distributed Consensus & CAP Theorem',
    associatedChapterId: 'ch-part8',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+12+CAP+Theorem+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 12 CAP Theorem in System Design Consistency Availability Partition Tolerance',
    isPopular: true
  },
  {
    id: 'gs-lec-13',
    lectureNumber: 13,
    title: 'Lec-13: Message Queue System | System Design',
    duration: '7:30',
    category: 'Scaling & Architecture',
    summary: 'Asynchronous communication with Message Queues (RabbitMQ, Kafka), producers, consumers, decoupling, and load buffering.',
    keyTakeaways: [
      'Decoupling producer throughput from consumer processing capacity (Backpressure buffer)',
      'Point-to-Point Queue vs Publish/Subscribe (Pub/Sub) topic architectures',
      'Delivery guarantees: At-most-once, At-least-once, and Exactly-once semantics'
    ],
    associatedChapterTitle: 'Part 6: Messaging Systems & Event Streaming',
    associatedChapterId: 'ch-part6',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+13+Message+Queue+System+System+Design`,
    searchQuery: 'Gate Smashers Lec 13 Message Queue System System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-14',
    lectureNumber: 14,
    title: 'Lec-14: Horizontal vs Vertical Scaling | System Design',
    duration: '6:50',
    category: 'Scaling & Architecture',
    summary: 'Vertical Scaling (Scale-Up) vs Horizontal Scaling (Scale-Out), cost trade-offs, hardware ceilings, and stateless tier design.',
    keyTakeaways: [
      'Scale-Up: Bigger CPU/RAM machine, zero code complexity, hard hardware limit and single point of failure',
      'Scale-Out: Adding commodity servers, stateless services, load balancing, elastic auto-scaling',
      'Stateless architectures: Storing session state outside nodes in Redis/DB'
    ],
    associatedChapterTitle: 'Part 9: Scaling Horizons & Traffic Management',
    associatedChapterId: 'ch-part9',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+14+Horizontal+vs+Vertical+Scaling`,
    searchQuery: 'Gate Smashers Lec 14 Horizontal vs Vertical Scaling System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-15',
    lectureNumber: 15,
    title: 'Lec-15: Microservice Architecture | System Design',
    duration: '9:15',
    category: 'APIs & Microservices',
    summary: 'Monolith vs Microservices architecture, domain boundary separation, API Gateway pattern, and distributed system trade-offs.',
    keyTakeaways: [
      'Monolithic benefits vs organizational scaling bottlenecks',
      'Microservices: Independent deployments, polyglot tech stacks, fault isolation',
      'Downsides: Network latency, distributed debugging, and distributed transaction complexity (Saga pattern)'
    ],
    associatedChapterTitle: 'Part 2: Backend Architecture & Request Flow',
    associatedChapterId: 'ch-part2',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+15+Microservice+Architecture+System+Design`,
    searchQuery: 'Gate Smashers Lec 15 Microservice Architecture System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-16',
    lectureNumber: 16,
    title: 'Lec-16: Write Through vs Write Back | System Design',
    duration: '7:20',
    category: 'Caching & Performance',
    summary: 'Deep dive into caching write policies: Write-Through, Write-Back (Write-Behind), and Write-Around.',
    keyTakeaways: [
      'Write-Through: Synchronous write to Cache AND Database together (high consistency, higher latency)',
      'Write-Back: Asynchronous write to Cache first, background batch flush to DB (ultra low write latency, risk of data loss on crash)',
      'Write-Around: Write directly to DB bypassing cache to prevent cache pollution for rarely read items'
    ],
    associatedChapterTitle: 'Part 5: Caching Strategies & Performance',
    associatedChapterId: 'ch-part5',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+16+Write+Through+vs+Write+Back`,
    searchQuery: 'Gate Smashers Lec 16 Write Through vs Write Back System Design',
    isPopular: false
  },
  {
    id: 'gs-lec-17',
    lectureNumber: 17,
    title: 'Lec-17: NoSql Document Database with examples',
    duration: '8:35',
    category: 'Databases & Sharding',
    summary: 'Document-oriented NoSQL databases (MongoDB, CouchDB), JSON/BSON storage, schema flexibility, and secondary indexes.',
    keyTakeaways: [
      'Hierarchical JSON documents, embedded sub-documents vs referenced documents',
      'Ideal for content management, product catalogs, user profiles, and polymorphic schemas',
      'Horizontal sharding with shard key selection'
    ],
    associatedChapterTitle: 'Part 4: NoSQL Databases & Storage Engines',
    associatedChapterId: 'ch-part4',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+17+NoSql+Document+Database`,
    searchQuery: 'Gate Smashers Lec 17 NoSql Document Database with examples',
    isPopular: false
  },
  {
    id: 'gs-lec-18',
    lectureNumber: 18,
    title: 'Lec-18: Key-Value Database with Example | NoSQL Database | System Design',
    duration: '6:40',
    category: 'Databases & Sharding',
    summary: 'Key-Value stores (Redis, Memcached, DynamoDB), hash table lookups, in-memory architectures, and O(1) performance.',
    keyTakeaways: [
      'Simplicity of key-value lookup: Get, Set, Delete in constant time O(1)',
      'In-memory RAM speed vs persistence options (RDB snapshots, AOF append-only log)',
      'Use cases: Session management, shopping carts, fast caching, real-time counters'
    ],
    associatedChapterTitle: 'Part 4: NoSQL Databases & Storage Engines',
    associatedChapterId: 'ch-part4',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+18+Key+Value+Database+with+Example`,
    searchQuery: 'Gate Smashers Lec 18 Key-Value Database with Example NoSQL Database System Design',
    isPopular: false
  },
  {
    id: 'gs-lec-19',
    lectureNumber: 19,
    title: 'Lec-19: Column-Family Database in System Design | NoSQL Database',
    duration: '7:50',
    category: 'Databases & Sharding',
    summary: 'Wide-column stores (Apache Cassandra, ScyllaDB, HBase), column families, LSM-Trees, and high-throughput write optimization.',
    keyTakeaways: [
      'Sparse multi-dimensional sorted map data model (Row Key, Column Key, Timestamp)',
      'LSM-Tree engine (Log-Structured Merge-tree): MemTable, CommitLog, SSTables for non-blocking disk writes',
      'Ideal for time-series metrics, IoT sensor data, and chat messaging history'
    ],
    associatedChapterTitle: 'Part 4: NoSQL Databases & Storage Engines',
    associatedChapterId: 'ch-part4',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+19+Column+Family+Database`,
    searchQuery: 'Gate Smashers Lec 19 Column-Family Database in System Design NoSQL Database',
    isPopular: false
  },
  {
    id: 'gs-lec-20',
    lectureNumber: 20,
    title: 'Lec-20 : Graph Database in System Design | NoSQL Database for Beginners',
    duration: '8:10',
    category: 'Databases & Sharding',
    summary: 'Graph databases (Neo4j, AWS Neptune), nodes, edges, properties, index-free adjacency, and relationship traversals.',
    keyTakeaways: [
      'Index-free adjacency: Navigating complex relationships without expensive SQL JOINs',
      'Nodes (Entities) and Edges (Relationships with properties and direction)',
      'Use cases: Social graphs (followers/friends), fraud detection networks, recommendation engines'
    ],
    associatedChapterTitle: 'Part 4: NoSQL Databases & Storage Engines',
    associatedChapterId: 'ch-part4',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+20+Graph+Database+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 20 Graph Database in System Design NoSQL Database for Beginners',
    isPopular: false
  },
  {
    id: 'gs-lec-21',
    lectureNumber: 21,
    title: 'Lec-21: Security Layers in System Design | With Real Life Example',
    duration: '8:30',
    category: 'Security & Auth',
    summary: 'Defense-in-depth across the entire stack: Perimeter WAF, Network firewalls, API Gateway validation, App Auth, and Data encryption.',
    keyTakeaways: [
      'Defense in Depth: Layered security preventing single points of compromise',
      'WAF (Web Application Firewall) protecting against SQL Injection, XSS, and bot scrapers',
      'Encryption in Transit (TLS 1.3) vs Encryption at Rest (AES-256 with KMS key rotation)'
    ],
    associatedChapterTitle: 'Part 17: Zero-Trust Security & DDoS Defense',
    associatedChapterId: 'ch-part17',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+21+Security+Layers+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 21 Security Layers in System Design With Real Life Example',
    isPopular: false
  },
  {
    id: 'gs-lec-22',
    lectureNumber: 22,
    title: 'Lec-22 : HLD vs LLD in System Design',
    duration: '6:15',
    category: 'Foundations & Mindset',
    summary: 'Clear distinction between High Level Design (macro architecture, services, databases) and Low Level Design (class diagrams, design patterns, OOP).',
    keyTakeaways: [
      'HLD: System architecture, capacity estimations, microservice boundaries, data flow, scaling',
      'LLD: Class diagrams, SOLID design principles, concurrency locks, design patterns (Factory, Strategy, Observer)',
      'How interviewers evaluate candidates differently for HLD vs LLD rounds'
    ],
    associatedChapterTitle: 'Part 0: Staff Mindset & Requirements',
    associatedChapterId: 'ch-part0',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+22+HLD+vs+LLD+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 22 HLD vs LLD in System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-23',
    lectureNumber: 23,
    title: 'Lec-23: ACID vs BASE in System Design',
    duration: '7:45',
    category: 'Databases & Sharding',
    summary: 'ACID transactional guarantees (RDBMS) contrasted with BASE eventual consistency model (Distributed NoSQL).',
    keyTakeaways: [
      'ACID: Atomicity, Consistency, Isolation, Durability (Strict financial integrity)',
      'BASE: Basically Available, Soft state, Eventual consistency (High scalability, loose coupling)',
      'Two-Phase Commit (2PC) vs Saga pattern for distributed transactions'
    ],
    associatedChapterTitle: 'Part 3: Relational Databases & Sharding',
    associatedChapterId: 'ch-part3',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+23+ACID+vs+BASE+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 23 ACID vs BASE in System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-24',
    lectureNumber: 24,
    title: 'Lec-24 : Replication vs Sharding Explained | System Design',
    duration: '8:20',
    category: 'Databases & Sharding',
    summary: 'Deep comparison between Database Replication (High Availability, read scaling) and Database Sharding (Data volume scaling, write scaling).',
    keyTakeaways: [
      'Replication: Exact duplicate copies across Leader-Follower (Read replicas, failover)',
      'Sharding: Partitioning unique datasets across multiple primary nodes (Scale write throughput)',
      'Combining both: Each Shard having its own Leader-Follower replica set in production'
    ],
    associatedChapterTitle: 'Part 3: Relational Databases & Sharding',
    associatedChapterId: 'ch-part3',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+24+Replication+vs+Sharding+Explained`,
    searchQuery: 'Gate Smashers Lec 24 Replication vs Sharding Explained System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-26',
    lectureNumber: 25,
    title: 'Lec-26: SDK (Software Development Kit) | API vs SDK',
    duration: '5:40',
    category: 'APIs & Microservices',
    summary: 'What is an SDK, how it wraps raw REST/gRPC APIs with client-side retry logic, connection pooling, and developer ergonomical abstractions.',
    keyTakeaways: [
      'API is the communication protocol interface over the wire (HTTP/JSON)',
      'SDK is the language-specific library providing auth, automatic retries, backoff, and typings (e.g. AWS SDK, Stripe SDK)',
      'Client-side circuit breaking and exponential backoff embedded in modern SDKs'
    ],
    associatedChapterTitle: 'Part 2: Backend Architecture & Request Flow',
    associatedChapterId: 'ch-part2',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+26+SDK+API+vs+SDK`,
    searchQuery: 'Gate Smashers Lec 26 SDK Software Development Kit API vs SDK',
    isPopular: false
  },
  {
    id: 'gs-lec-27',
    lectureNumber: 26,
    title: 'Lec-27: Rate Limiting in System Design | Various Algorithms & Implementation',
    duration: '9:30',
    category: 'Scaling & Architecture',
    summary: 'Rate Limiting algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log, and Sliding Window Counter.',
    keyTakeaways: [
      'Token Bucket: Bursts allowed, constant refill rate, standard in AWS/Stripe',
      'Leaky Bucket: Smooth constant output rate regardless of ingress bursts (Traffic shaping)',
      'Distributed rate limiting using Redis Sorted Sets and atomic Lua scripts'
    ],
    associatedChapterTitle: 'Part 9: Scaling Horizons & Traffic Management',
    associatedChapterId: 'ch-part9',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Lec+27+Rate+Limiting+in+System+Design`,
    searchQuery: 'Gate Smashers Lec 27 Rate Limiting in System Design Various Algorithms Implementation',
    isPopular: true
  },
  {
    id: 'gs-lec-all-apis',
    lectureNumber: 27,
    title: 'All Types of APIs in 10 Minutes | REST, SOAP, GraphQL, gRPC & WebSockets',
    duration: '10:00',
    category: 'APIs & Microservices',
    summary: 'A 10-minute masterclass comparing all major API paradigms: RESTful HTTP, legacy SOAP, declarative GraphQL, high-performance gRPC, and real-time WebSockets.',
    keyTakeaways: [
      'REST: Resource-based URLs, standard HTTP status codes, stateless caching',
      'GraphQL: Single endpoint, client requests exact fields needed, eliminates over/under-fetching',
      'gRPC: Protocol Buffers, HTTP/2 multiplexing, binary serialization for ultra-fast microservice RPC',
      'WebSockets: Full-duplex persistent bidirectional TCP connection for chat and live tickers'
    ],
    associatedChapterTitle: 'Part 2: Backend Architecture & Request Flow',
    associatedChapterId: 'ch-part2',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+All+Types+of+APIs+in+10+Minutes+REST+SOAP+GraphQL+gRPC+WebSockets`,
    searchQuery: 'Gate Smashers All Types of APIs in 10 Minutes REST SOAP GraphQL gRPC WebSockets',
    isPopular: true
  },
  {
    id: 'gs-lec-instagram',
    lectureNumber: 28,
    title: 'Instagram System Design Explained | How Instagram Works',
    duration: '14:20',
    category: 'Real-World Systems',
    summary: 'End-to-end architecture breakdown of Instagram: News Feed generation (Fan-out on write vs Fan-out on read), image storage, and global scaling.',
    keyTakeaways: [
      'Handling celebrity follower problem (hybrid push/pull feed generation)',
      'Blob storage for billions of photos (S3 + CDN) and metadata storage (Cassandra/Postgres)',
      'Distributed Snowflake ID generator ensuring chronologically sorted unique IDs'
    ],
    associatedChapterTitle: 'Production Case Studies: Instagram Architecture',
    associatedChapterId: 'case-studies',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Instagram+System+Design+Explained+How+Instagram+Works`,
    searchQuery: 'Gate Smashers Instagram System Design Explained How Instagram Works',
    isPopular: true
  },
  {
    id: 'gs-lec-irctc',
    lectureNumber: 29,
    title: 'How IRCTC Handle Lakhs of Tatkal Bookings at Once? 🚆 | System Design',
    duration: '12:50',
    category: 'Real-World Systems',
    summary: 'How IRCTC handles massive thundering herd spikes at 10 AM Tatkal booking window without database deadlock or inventory overselling.',
    keyTakeaways: [
      'Thundering herd concurrency control and seat reservation locking',
      'Distributed locks using Redis Redlock / optimistic locking with version checks',
      'Asynchronous payment queue processing and state machine for ticket confirmation'
    ],
    associatedChapterTitle: 'Production Case Studies: High-Concurrency Booking Engine',
    associatedChapterId: 'case-studies',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+How+IRCTC+Handle+Lakhs+of+Tatkal+Bookings+at+Once`,
    searchQuery: 'Gate Smashers How IRCTC Handle Lakhs of Tatkal Bookings at Once System Design',
    isPopular: true
  },
  {
    id: 'gs-lec-session-jwt',
    lectureNumber: 30,
    title: 'Session vs JWT: What’s the Difference? | Authentication Explained',
    duration: '8:15',
    category: 'Security & Auth',
    summary: 'Stateful Session-based authentication (Cookies + Redis session store) versus Stateless JWT token-based authentication.',
    keyTakeaways: [
      'Sessions: Stateful on server, instant revocation possible by deleting session key, higher DB lookup overhead',
      'JWT: Stateless, validated cryptographically by public key, fast microservice verification, harder immediate revocation',
      'Hybrid approach: Short-lived access JWT (15 mins) + Long-lived refresh token in Redis'
    ],
    associatedChapterTitle: 'Part 15: SaaS Authentication, Identity & Multi-Tenancy',
    associatedChapterId: 'ch-part15',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+Session+vs+JWT+What+is+the+Difference+Authentication+Explained`,
    searchQuery: 'Gate Smashers Session vs JWT What is the Difference Authentication Explained',
    isPopular: true
  },
  {
    id: 'gs-lec-jwt',
    lectureNumber: 31,
    title: 'What is JWT? | JSON Web Token Explained',
    duration: '7:10',
    category: 'Security & Auth',
    summary: 'Anatomy of a JSON Web Token: Header (algorithm), Payload (claims), and Signature (cryptographic hash), with security best practices.',
    keyTakeaways: [
      'The three components separated by dots: Header.Payload.Signature (Base64Url encoded)',
      'Why the payload is readable by anyone (not encrypted) and must never contain sensitive passwords or secrets',
      'Validating HMAC SHA-256 vs RSA public/private key verification'
    ],
    associatedChapterTitle: 'Part 15: SaaS Authentication, Identity & Multi-Tenancy',
    associatedChapterId: 'ch-part15',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+What+is+JWT+JSON+Web+Token+Explained`,
    searchQuery: 'Gate Smashers What is JWT JSON Web Token Explained',
    isPopular: false
  },
  {
    id: 'gs-lec-sql-nosql',
    lectureNumber: 32,
    title: 'SQL vs NoSQL: Which One Should You Use?',
    duration: '9:05',
    category: 'Databases & Sharding',
    summary: 'The ultimate comparison between Relational SQL databases and NoSQL databases to decide correctly in system design interviews.',
    keyTakeaways: [
      'SQL (PostgreSQL, MySQL): Structured tabular data, strict schema, ACID compliance, complex relational queries',
      'NoSQL (MongoDB, Cassandra, DynamoDB): Unstructured/semi-structured, flexible schema, horizontal scalability, high write velocity',
      'Polyglot persistence: Using SQL for financial ledgers and NoSQL for analytics/feeds in the same organization'
    ],
    associatedChapterTitle: 'Part 3: Relational Databases & Sharding',
    associatedChapterId: 'ch-part3',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+SQL+vs+NoSQL+Which+One+Should+You+Use`,
    searchQuery: 'Gate Smashers SQL vs NoSQL Which One Should You Use',
    isPopular: true
  },
  {
    id: 'gs-lec-solid',
    lectureNumber: 33,
    title: 'SOLID Principles in System Design | Complete Explanation',
    duration: '11:40',
    category: 'Design Principles',
    summary: 'Deep explanation of the 5 SOLID software engineering principles (SRP, OCP, LSP, ISP, DIP) applied to large-scale system architectures.',
    keyTakeaways: [
      'Single Responsibility Principle: Microservices and classes should have one, and only one, reason to change',
      'Open/Closed Principle: Open for extension via interfaces, closed for modification of core logic',
      'Dependency Inversion: High-level modules should depend upon abstractions rather than concrete database/network implementations'
    ],
    associatedChapterTitle: 'Part 19: Performance Engineering, Capacity Math & Laws',
    associatedChapterId: 'ch-part19',
    youtubeUrl: `https://www.youtube.com/results?search_query=Gate+Smashers+SOLID+Principles+in+System+Design+Complete+Explanation`,
    searchQuery: 'Gate Smashers SOLID Principles in System Design Complete Explanation',
    isPopular: true
  }
];
