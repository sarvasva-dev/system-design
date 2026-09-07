export interface EasyExplainGuide {
  chapterId: string;
  simpleTitle: string;
  oneLiner: string;
  whyItMatters: string;
  realWorldAnalogy: {
    scenario: string;
    explanation: string;
  };
  threeGoldenRules: string[];
  keyTermsSimplified: {
    term: string;
    professionalMeaning: string;
    plainEnglish: string;
    realWorldExample: string;
  }[];
  conceptNotes: Record<string, {
    plainTitle: string;
    plainEnglishExplanation: string;
    everydayAnalogy: string;
    interviewTakeaway: string;
  }>;
}

export interface PlainEnglishJargonItem {
  term: string;
  category: string;
  plainDefinition: string;
  professionalContext: string;
  everydayAnalogy: string;
  howToExplainInInterview: string;
}

export const PLAIN_ENGLISH_JARGON_BUSTER: PlainEnglishJargonItem[] = [
  {
    term: 'Latency',
    category: 'Core Performance',
    plainDefinition: 'The time delay between sending a request and getting a response back (measured in milliseconds).',
    professionalContext: 'Network transit time + queue wait time + server execution time.',
    everydayAnalogy: 'The wait time between ordering your burger at the drive-thru window and receiving your bag.',
    howToExplainInInterview: 'Always distinguish between average latency and tail latency (p99/p99.9). Users experience tail latency when traffic spikes.'
  },
  {
    term: 'Throughput (QPS / RPS)',
    category: 'Core Performance',
    plainDefinition: 'How many requests or transactions a system can handle in one single second.',
    professionalContext: 'Queries Per Second (QPS) or Requests Per Second (RPS).',
    everydayAnalogy: 'How many cars can drive through a highway toll gate per minute.',
    howToExplainInInterview: 'Throughput is capacity over time; latency is the turnaround time for a single item. Optimizing one can sometimes degrade the other.'
  },
  {
    term: 'Horizontal Scaling vs Vertical Scaling',
    category: 'Infrastructure',
    plainDefinition: 'Vertical scaling means buying a bigger, more expensive machine. Horizontal scaling means adding more standard machines to share the workload.',
    professionalContext: 'Scale-Up (larger CPU/RAM on a single node) vs Scale-Out (stateless replica nodes behind a load balancer).',
    everydayAnalogy: 'Vertical: Hiring a giant bodybuilder who can carry 10 boxes. Horizontal: Hiring 10 normal workers who each carry 1 box together.',
    howToExplainInInterview: 'Vertical hits hardware limits quickly and introduces a single point of failure. Horizontal provides elastic growth and high availability, but requires distributed state management.'
  },
  {
    term: 'Load Balancer',
    category: 'Traffic Routing',
    plainDefinition: 'A smart digital traffic cop that distributes incoming user requests evenly across multiple healthy servers.',
    professionalContext: 'Layer 4 (TCP/UDP IP hash) or Layer 7 (HTTP/HTTPS path routing, SSL termination, health checks).',
    everydayAnalogy: 'The host at a busy restaurant who seats incoming parties at different open tables so no single waiter gets overwhelmed.',
    howToExplainInInterview: 'A load balancer performs health checks to route around dead servers. For high availability, always deploy active-passive or DNS-anycast load balancers so the balancer itself is not a SPOF.'
  },
  {
    term: 'Caching',
    category: 'Performance & Storage',
    plainDefinition: 'Storing frequently requested data in ultra-fast temporary memory (like RAM) so you never have to re-compute or query the slower database.',
    professionalContext: 'In-memory key-value stores (Redis, Memcached) or CDN edge caches with TTL policies.',
    everydayAnalogy: 'Keeping your car keys and wallet in a tray on the front table by your doorway instead of searching through the attic every morning.',
    howToExplainInInterview: 'Caching gives sub-millisecond reads, but introduces cache invalidation challenges. Pick cache-aside, write-through, or write-back based on read-vs-write ratios.'
  },
  {
    term: 'Idempotency',
    category: 'Reliability',
    plainDefinition: 'Doing the exact same action multiple times produces the same final result without causing accidental duplicates or side effects.',
    professionalContext: 'Ensuring network retries (e.g. credit card charging or order placement) do not double-bill the user.',
    everydayAnalogy: 'The elevator call button: pressing it 10 times does not summon 10 different elevators; the elevator just arrives once.',
    howToExplainInInterview: 'Clients send an Idempotency-Key header. The server checks a Redis/database lock before processing. If already seen, it returns the previous saved receipt.'
  },
  {
    term: 'CAP Theorem',
    category: 'Distributed Systems',
    plainDefinition: 'When a network connection breaks between servers (Partition), you are forced to choose between returning 100% accurate data (Consistency) or answering immediately even if slightly outdated (Availability).',
    professionalContext: 'Consistency (Linearizability) + Availability (Non-error response) + Partition Tolerance (Network drops/delays). In real networks, P is unavoidable.',
    everydayAnalogy: 'ATM vs Social Media: If bank wires are cut, the ATM freezes to prevent negative balances (CP - Consistency). If Twitter wires flicker, it still lets you post tweets and syncs later (AP - Availability).',
    howToExplainInInterview: 'Never say a distributed system is "CA". Networks are physically prone to fiber cuts and packet drops, so P is non-negotiable. The true tradeoff is CP vs AP.'
  },
  {
    term: 'PACELC Theorem',
    category: 'Distributed Systems',
    plainDefinition: 'CAP only applies when the network breaks. PACELC explains what happens during the 99.9% of time when the network is normal: you still have to choose between Latency (speed) and Consistency (exactness).',
    professionalContext: 'If Partition (P): choose Availability (A) or Consistency (C); Else (E): choose Latency (L) or Consistency (C).',
    everydayAnalogy: 'Sending a quick text message to 1 friend (low latency, fast) vs waiting for all 5 friends on a group call to verbally confirm before moving on (strong consistency, higher latency).',
    howToExplainInInterview: 'DynamoDB default is PA/EL (favors speed and availability). If you request strongly consistent reads, it shifts to PC/EC at the cost of higher latency and higher read cost.'
  },
  {
    term: 'Database Sharding (Partitioning)',
    category: 'Databases',
    plainDefinition: 'Splitting one massive database table across multiple independent database servers using a shard key.',
    professionalContext: 'Horizontal database partitioning based on a partition key (e.g. user_id hash).',
    everydayAnalogy: 'A massive 1,000-page dictionary split into 26 smaller booklets (A-Z) so 26 people can read different sections at the same time.',
    howToExplainInInterview: 'Sharding solves storage and write capacity bottlenecks. The major challenges are handling cross-shard joins, re-balancing hot shards, and selecting a uniform partition key.'
  },
  {
    term: 'Consistent Hashing',
    category: 'Distributed Systems',
    plainDefinition: 'A mathematical technique to map data to servers arranged in a circular ring. When servers are added or removed, only a tiny fraction of data needs to move.',
    professionalContext: 'Virtual nodes mapped on a hash ring [0 to 2^32-1] preventing massive cache/data stampedes during scaling events.',
    everydayAnalogy: 'Musical chairs where removing one chair only requires the nearest person to shift to the next chair, rather than everyone in the room shuffling seats.',
    howToExplainInInterview: 'Standard `hash(key) % N` remaps nearly 100% of keys whenever N changes, destroying cache hit rates. Consistent hashing with virtual nodes only remaps k/N keys and prevents hot spots.'
  },
  {
    term: 'Message Queue (Pub/Sub)',
    category: 'Messaging',
    plainDefinition: 'A digital buffer where one system drops off jobs or messages so another system can process them later at its own pace.',
    professionalContext: 'Asynchronous event streaming and decoupled inter-service communication (Kafka, RabbitMQ, SQS).',
    everydayAnalogy: 'The ticket spindle in a restaurant kitchen: the waiter drops order slips on the spindle and returns to customers immediately; the chef cooks orders sequentially without holding up the dining room.',
    howToExplainInInterview: 'Queues decouple producers from consumers, smooth out traffic spikes, and allow retry mechanisms when downstream workers fail.'
  },
  {
    term: 'Write-Ahead Log (WAL)',
    category: 'Databases',
    plainDefinition: 'An append-only file on disk where database operations are recorded before anything is modified in memory or index trees.',
    professionalContext: 'Guarantees durability (ACID) and crash recovery via sequential disk writes.',
    everydayAnalogy: 'An accountant who writes down every single transaction into a physical spiral ledger before touching the cash box or filing cabinet.',
    howToExplainInInterview: 'Sequential disk append is orders of magnitude faster than random I/O updates to B-tree leaves. If the machine loses power, the database replays the WAL to recover state.'
  },
  {
    term: 'Circuit Breaker',
    category: 'Resilience',
    plainDefinition: 'A safety mechanism that automatically stops calling a failing downstream service so your own application does not hang or crash waiting on timeouts.',
    professionalContext: 'Three states: Closed (normal), Open (fast-failing immediately), and Half-Open (testing sample requests to check if recovery occurred).',
    everydayAnalogy: 'The electrical fuse box in your home: if a wire shorts out, the fuse trips immediately to prevent an electrical fire instead of letting current burn down the house.',
    howToExplainInInterview: 'Circuit breakers prevent cascading failures and thread pool exhaustion across microservices by failing fast and returning a fallback response.'
  },
  {
    term: 'Single Point of Failure (SPOF)',
    category: 'Reliability',
    plainDefinition: 'A single component or server that, if it dies, takes the entire system down with it.',
    professionalContext: 'Any un-replicated architecture piece (e.g. single primary database, single DNS server, un-clustered load balancer).',
    everydayAnalogy: 'A car with only one key: if you lose that single key, the entire vehicle is useless until replaced.',
    howToExplainInInterview: 'Eliminate SPOFs with redundancy: active-active or active-passive failover, multi-region replication, and automated health checks.'
  },
  {
    term: 'Split-Brain Problem',
    category: 'Distributed Consensus',
    plainDefinition: 'When network communication drops between two halves of a server cluster, and both halves mistakenly believe the other half is dead, causing both to elect themselves as the master.',
    professionalContext: 'Dual active masters executing conflicting writes to the same storage state, resulting in permanent data corruption.',
    everydayAnalogy: 'A divorced couple who do not talk to each other, and both book separate summer vacations for the child on the exact same week using the family credit card.',
    howToExplainInInterview: 'Avoid split-brain by requiring a strict Quorum majority (N/2 + 1) using consensus algorithms like Raft, Paxos, or ZooKeeper. A cluster partition with less than half the nodes cannot elect a master.'
  }
];

export const EASY_EXPLAIN_GUIDES: Record<string, EasyExplainGuide> = {
  'part0-mindset': {
    chapterId: 'part0-mindset',
    simpleTitle: 'The Architectural Mindset — How to Think at Scale',
    oneLiner: 'Anyone can build an app for 10 users; system design is how you keep it running smoothly when 10 million users show up at once.',
    whyItMatters: 'Writing code on your laptop is predictable. Production environments are chaotic: hard drives fail, networks fluctuate, databases get overwhelmed, and traffic spikes without warning.',
    realWorldAnalogy: {
      scenario: 'A Solo Coffee Shop vs A Busy Airport Food Court',
      explanation: 'If 5 people want coffee, a single barista can take orders, grind beans, and brew coffee. If 5,000 travelers arrive at once, that single barista will collapse! You need a queue manager (Load Balancer), pre-brewed coffee pots ready to pour (Cache), and multiple independent stations (Sharding).'
    },
    threeGoldenRules: [
      'Clarify Requirements First: Never start drawing boxes until you know functional features (what it does) and non-functional requirements (throughput, latency, availability).',
      'There Are No Silver Bullets: Every architectural decision is a tradeoff. You are trading money, latency, consistency, or operational complexity.',
      'Design for Inevitable Failure: Hard disks die, networks drop packets, and servers reboot. Build resilient systems that heal automatically rather than praying nothing breaks.'
    ],
    keyTermsSimplified: [
      {
        term: 'Throughput (QPS / RPS)',
        professionalMeaning: 'Number of discrete transactions processed per second.',
        plainEnglish: 'How many requests your servers can handle every single second.',
        realWorldExample: 'How many customers can clear the checkout lanes at Walmart each second.'
      },
      {
        term: 'Latency',
        professionalMeaning: 'Time elapsed between request submission and complete response delivery.',
        plainEnglish: 'The turnaround delay between clicking a button and seeing the result.',
        realWorldExample: 'The time between tapping "Place Order" and seeing the green confirmation checkmark.'
      },
      {
        term: 'High Availability (Uptime)',
        professionalMeaning: 'Operational readiness percentage (e.g. 99.99% "four nines").',
        plainEnglish: 'The system runs 24/7/365 without unexpected outages or "Site Down" errors.',
        realWorldExample: 'An emergency room that never locks its doors, regardless of power outages or weather.'
      }
    ],
    conceptNotes: {
      'Latency vs Throughput': {
        plainTitle: 'Latency vs Throughput — Speed vs Capacity',
        plainEnglishExplanation: 'Latency is how fast a single job finishes (speed). Throughput is how many total jobs you complete in a minute (capacity). An ambulance is low latency; a cargo train is high throughput.',
        everydayAnalogy: 'A sports car takes 1 passenger across town in 10 minutes (low latency, low throughput). A subway train takes 1,000 passengers across town in 20 minutes (higher latency, massive throughput).',
        interviewTakeaway: 'Always measure both. If you batch requests to improve throughput, you often increase latency for individual requests.'
      },
      'Horizontal vs Vertical Scaling': {
        plainTitle: 'Scaling — Bigger Machine vs More Machines',
        plainEnglishExplanation: 'Vertical scaling means replacing your server with a bigger, more expensive CPU. Horizontal scaling means deploying multiple standard servers behind a load balancer.',
        everydayAnalogy: 'Vertical: Hiring one super-heavyweight champion to carry 20 bags. Horizontal: Hiring 20 normal delivery couriers who each carry 1 bag simultaneously.',
        interviewTakeaway: 'Always prioritize horizontal scaling for web and application tiers. Use vertical scaling only for temporary fixes or specialized database instances.'
      },
      'Failure Modes and Resilience': {
        plainTitle: 'Failure Modes — Everything Will Break',
        plainEnglishExplanation: 'In distributed systems, servers will crash, cables will get cut, and third-party APIs will timeout. Resilience means the app keeps working even when parts fail.',
        everydayAnalogy: 'Modern passenger airplanes have multiple engines. If one engine fails mid-flight, the plane can safely fly and land on the remaining engine.',
        interviewTakeaway: 'Always identify Single Points of Failure (SPOFs) and explain your automatic failover mechanism.'
      }
    }
  },

  'part1-scale': {
    chapterId: 'part1-scale',
    simpleTitle: 'System Metrics, Latency Numbers & Capacity Planning',
    oneLiner: 'Before designing a system, do "back-of-the-envelope" math so you know how much storage, RAM, and bandwidth you actually need.',
    whyItMatters: 'If you guess your system requirements without doing the math, you will either waste millions of dollars on unused servers or your app will crash on launch day.',
    realWorldAnalogy: {
      scenario: 'Catering a Wedding Reception',
      explanation: 'You do not just buy random amounts of food. You count the guest list (daily active users), multiply by meal portions (payload size), and calculate how many waiters you need per table (throughput & concurrency).'
    },
    threeGoldenRules: [
      'Know Your Power-of-Two Math: Remember that 1 million seconds is about 11.5 days, and 1 billion requests/day is roughly 12,000 QPS.',
      'Memory is 100x Faster Than Disk: Reading from RAM takes nanoseconds; reading from SSD/NVMe takes microseconds; reading from spinning disk or network takes milliseconds.',
      'Provision for Peak, Not Average: If average traffic is 1,000 QPS but evening spikes hit 10,000 QPS, sizing for average will take you down every night.'
    ],
    keyTermsSimplified: [
      {
        term: 'p99 Latency (Tail Latency)',
        professionalMeaning: 'The response time percentile under which 99% of requests fall.',
        plainEnglish: 'The worst experience felt by 1 out of every 100 users.',
        realWorldExample: 'If 99 people get their coffee in 30 seconds, but 1 person waits 5 minutes because the milk ran out, p99 is 5 minutes.'
      },
      {
        term: 'QPS (Queries Per Second)',
        professionalMeaning: 'Average and peak rate of requests sent to a service per second.',
        plainEnglish: 'How many database queries or API hits land on your server in one tick of the clock.',
        realWorldExample: 'How many search queries Google receives globally every second (~100,000 QPS).'
      }
    ],
    conceptNotes: {
      'Back-of-the-Envelope Estimation': {
        plainTitle: 'Back-of-the-Envelope Math — Fast Estimation',
        plainEnglishExplanation: 'A systematic method to calculate Storage, Memory, Bandwidth, and QPS in under 3 minutes using round numbers.',
        everydayAnalogy: 'Estimating fuel cost for a road trip: distance divided by mileage times price per gallon. You do not need exact cents, just the right ballpark.',
        interviewTakeaway: 'In interviews, write down: DAU -> Read/Write Ratio -> QPS -> Bandwidth (MB/s) -> Storage over 5 years. Interviewers look for structured thinking, not calculator precision.'
      }
    }
  },

  'part2-networking': {
    chapterId: 'part2-networking',
    simpleTitle: 'Networking, DNS, Load Balancing & Proxies',
    oneLiner: 'How user clicks travel across the internet, resolve server IP addresses, and get routed to healthy machines.',
    whyItMatters: 'The best backend code is useless if user requests get dropped in transit, slowed by TLS handshakes, or choke a single entry point.',
    realWorldAnalogy: {
      scenario: 'Postal Delivery & Airport Traffic Control',
      explanation: 'DNS is the national directory translating names into street addresses. Load balancers are the airport runways assigning landing slots so planes do not crash into each other.'
    },
    threeGoldenRules: [
      'DNS Maps Names to IPs: DNS is like your phone contacts: you tap "Mom" (google.com) and the phone dials her 10-digit number (142.250.190.46).',
      'Terminate TLS Early at the Edge: Decrypt HTTPS traffic at the Load Balancer or CDN edge so internal microservices do not waste CPU decrypting every packet.',
      'Use Anycast and CDNs for Speed: Place static assets (images, CSS, videos) on CDN edge nodes close to the user to avoid roundtrips across oceans.'
    ],
    keyTermsSimplified: [
      {
        term: 'DNS (Domain Name System)',
        professionalMeaning: 'Hierarchical decentralized naming system for computers connected to the Internet.',
        plainEnglish: 'The Internet address book that turns website names into machine IP numbers.',
        realWorldExample: 'Typing "netflix.com" instead of memorizing "54.239.28.85".'
      },
      {
        term: 'Reverse Proxy',
        professionalMeaning: 'An intermediary proxy server that retrieves resources on behalf of a client from backend servers.',
        plainEnglish: 'A protective front desk guard that shields your backend servers from direct public access.',
        realWorldExample: 'A hotel concierge who receives incoming deliveries and takes them up to guest rooms.'
      }
    ],
    conceptNotes: {
      'Load Balancing Algorithms': {
        plainTitle: 'Load Balancing Strategies — Round Robin, Least Connections, IP Hash',
        plainEnglishExplanation: 'Round Robin hands tasks out sequentially in a circle. Least Connections picks the server with the fewest active jobs. IP Hash ensures a specific user always lands on the same server.',
        everydayAnalogy: 'Bank tellers: Round Robin sends customer 1 to teller A, customer 2 to teller B. Least Connections sends the next customer to the teller whose line is shortest.',
        interviewTakeaway: 'Use Least Connections for long-lived WebSocket or video connections. Use Round Robin or Weighted Round Robin for standard stateless HTTP requests.'
      }
    }
  },

  'part3-storage': {
    chapterId: 'part3-storage',
    simpleTitle: 'Databases, Storage Engines & Caching Layers',
    oneLiner: 'How to store, index, and retrieve data without melting your servers under heavy read or write loads.',
    whyItMatters: 'Computers crash and restart; storage engines ensure your customer orders and bank balances survive forever without data loss.',
    realWorldAnalogy: {
      scenario: 'Filing Cabinet vs Quick Sticky Notes',
      explanation: 'The relational database is a locked, formal steel filing cabinet with strict cross-referenced folders (ACID). The cache (Redis) is a bulletin board with sticky notes for things you need right this second.'
    },
    threeGoldenRules: [
      'Relational (SQL) for Structured Consistency: If you need financial transactions, foreign key constraints, and multi-table joins, pick PostgreSQL or MySQL.',
      'NoSQL for Massive Scale and Flexible Schemas: If you need petabytes of documents, key-value lookups, or append-only time-series, pick Cassandra, DynamoDB, or MongoDB.',
      'Cache-Aside is the Universal Pattern: Check the cache first. If found (Cache Hit), return immediately. If not (Cache Miss), read database, write into cache with TTL, and return.'
    ],
    keyTermsSimplified: [
      {
        term: 'ACID Transactions',
        professionalMeaning: 'Atomicity, Consistency, Isolation, Durability guarantees in transactional databases.',
        plainEnglish: 'A money transfer either completely finishes or completely rolls back; no half-way states.',
        realWorldExample: 'Transferring $100: money is deducted from Account A AND added to Account B. If power cuts mid-transfer, neither account is altered.'
      },
      {
        term: 'Cache Invalidation',
        professionalMeaning: 'Purging or updating stale cache entries when primary records change.',
        plainEnglish: 'Throwing away outdated notes as soon as the real document gets updated.',
        realWorldExample: 'Erasing the price tag on the shelf the moment a new promotional price starts.'
      }
    ],
    conceptNotes: {
      'SQL vs NoSQL Decision Framework': {
        plainTitle: 'SQL vs NoSQL — How to Choose Confidently',
        plainEnglishExplanation: 'Pick SQL when data relationships are tightly interconnected and data integrity is paramount. Pick NoSQL when you need massive horizontal write scale or flexible schema attributes.',
        everydayAnalogy: 'SQL is like an Excel workbook with strict column types. NoSQL is like a folder of JSON text files that can have different fields per document.',
        interviewTakeaway: 'In interviews, do not say "NoSQL is faster". Modern PostgreSQL is extraordinarily fast. Frame your choice around data access patterns and scaling dimensions.'
      }
    }
  },

  'part4-distributed': {
    chapterId: 'part4-distributed',
    simpleTitle: 'Distributed Systems, Consensus & Partitioning',
    oneLiner: 'How multiple independent computers agree on truth even when network cables get cut or servers crash.',
    whyItMatters: 'Single servers have hard limits on CPU and memory. To handle global applications, you must distribute data across dozens of nodes that stay synchronized.',
    realWorldAnalogy: {
      scenario: 'A Jury in a Courtroom',
      explanation: 'A single juror can get sick or bribed. A distributed consensus system (like Raft or Paxos) requires a majority quorum (e.g. 7 out of 12 jurors) to vote yes before any verdict is recorded as official law.'
    },
    threeGoldenRules: [
      'Partitions (P) Are Unavoidable: Network fiber cables will get severed by construction backhoes. Design systems knowing network partitions are guaranteed to happen.',
      'Quorum Prevents Split-Brain: Always configure an odd number of voting nodes (e.g. 3 or 5). A majority (N/2 + 1) is required to elect leaders or accept writes.',
      'Eventual Consistency Trades Immediate Sync for High Availability: If a user likes a photo, showing the updated like count 2 seconds later in another continent is completely fine.'
    ],
    keyTermsSimplified: [
      {
        term: 'Consistent Hashing',
        professionalMeaning: 'Hash partitioning on a virtual ring minimizing key migration during node topology changes.',
        plainEnglish: 'Spreading data across servers in a circle so adding a new server only moves a tiny slice of data.',
        realWorldExample: 'Adding a new lane at a supermarket checkout only pulls customers from the adjacent lane, not the entire store.'
      },
      {
        term: 'Raft Consensus',
        professionalMeaning: 'A leader-based consensus algorithm designed for understandability, managing a replicated log.',
        plainEnglish: 'A reliable election process where servers vote on a leader, and the leader ensures everyone has identical logs.',
        realWorldExample: 'Electing a team captain who takes notes during meetings and gives identical copies to all players.'
      }
    ],
    conceptNotes: {
      'CAP Theorem Applied': {
        plainTitle: 'CAP Theorem in Everyday Practice',
        plainEnglishExplanation: 'When network wires break between servers, you choose between Accuracy (CP) and continuous Uptime (AP).',
        everydayAnalogy: 'A bank ledger chooses CP (block ATM withdrawals until verified). Instagram chooses AP (let you like pictures even if the European server is temporarily out of sync).',
        interviewTakeaway: 'Always state: "In any physical network, Partition Tolerance (P) is mandatory. So in failure states, we choose between Consistency (CP) or Availability (AP) based on business impact."'
      }
    }
  }
};

/**
 * Helper to retrieve easy English notes for any chapter
 */
export function getEasyExplainGuideForChapter(chapter: { id: string; title: string; part: number }): EasyExplainGuide {
  if (EASY_EXPLAIN_GUIDES[chapter.id]) {
    return EASY_EXPLAIN_GUIDES[chapter.id];
  }

  // Sensible default fallback for other parts
  return {
    chapterId: chapter.id,
    simpleTitle: `${chapter.title} — Plain English Executive Notes`,
    oneLiner: `Master the fundamental mechanics and production trade-offs of ${chapter.title} without unnecessary academic jargon.`,
    whyItMatters: `In production systems, understanding ${chapter.title} prevents outages, lowers infrastructure costs, and ensures your system survives unexpected traffic spikes.`,
    realWorldAnalogy: {
      scenario: `Real-World Operation of ${chapter.title}`,
      explanation: `Think of this like an organized airport terminal: every process has dedicated lanes, safety protocols, and backup plans so that if one gate closes, the rest of the airport continues operating smoothly.`
    },
    threeGoldenRules: [
      'Define clear Service Level Objectives (SLOs) before choosing your architectural design.',
      'Eliminate single points of failure with automated health checking and redundancy.',
      'Measure tail latency (p99) rather than averages to ensure all users enjoy a consistent experience.'
    ],
    keyTermsSimplified: [
      {
        term: 'High Availability',
        professionalMeaning: 'Percentage of time a service operates without unexpected interruption.',
        plainEnglish: 'Your service stays online 24/7 without failing your users.',
        realWorldExample: 'A utility company providing continuous electricity through storm seasons.'
      },
      {
        term: 'Horizontal Scalability',
        professionalMeaning: 'The ability to increase throughput by provisioning additional compute or storage nodes.',
        plainEnglish: 'Adding more standard machines side-by-side to share heavy workloads.',
        realWorldExample: 'Opening additional checkout registers during holiday shopping crowds.'
      }
    ],
    conceptNotes: {}
  };
}
