import { Chapter } from '../../types';

export const PART19_CHAPTER: Chapter = {
  id: 'part19-performance-math',
  part: 19,
  partTitle: 'Part 19 — Performance Engineering & System Math',
  chapterNumber: 19,
  title: 'Performance Engineering & Capacity Estimation Math',
  subtitle: 'Back-of-the-Envelope Formulas, Latency Numbers Every Engineer Must Know, Little’s Law & Amdahl’s Law',
  summary: 'In system design interviews and senior engineering architecture, qualitative hand-waving is disqualifying. System design requires rigorous quantitative estimation: converting daily active users into queries per second, sizing cache memory via the 80/20 Pareto distribution, calculating disk IOPS and network bandwidth bottlenecks, and applying Little’s Law and Amdahl’s Law.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                    LATENCY NUMBERS EVERY PROGRAMMER SHOULD KNOW                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Operation                                 Time (ns)       Human Scale Comparison (1ns = 1s)    |
|   --------------------------------------------------------------------------------------------   |
|   L1 Cache Reference                        0.5 ns          0.5 seconds                          |
|   Branch Mispredict                         5 ns            5 seconds                            |
|   L2 Cache Reference                        7 ns            7 seconds                            |
|   Mutex Lock / Unlock                       25 ns           25 seconds                           |
|   Main Memory (RAM) Reference               100 ns          1.7 minutes                          |
|   Compress 1KB with Snappy                  1,000 ns (1 µs) 17 minutes                           |
|   Send 2KB over 1 Gbps Network              20,000 ns (20 µs) 5.5 hours                          |
|   Read 1MB sequentially from SSD / NVMe     50,000 ns (50 µs) 14 hours                           |
|   Read 1MB sequentially from Memory         250,000 ns (250 µs) 3 days                           |
|   Round-trip within same Datacenter         500,000 ns (0.5 ms) 6 days                           |
|   Read 1MB sequentially from Magnetic Disk  10,000,000 ns (10 ms) 4 months                       |
|   Send packet California -> Netherlands     150,000,000 ns (150 ms) 5 years                      |
|                                                                                                  |
|   KEY TAKEAWAYS:                                                                                 |
|   - RAM is ~1,000x faster than SSD.                                                              |
|   - SSD is ~200x faster than Mechanical Disk.                                                    |
|   - Network round-trip across datacenters is the dominant latency bottleneck in distributed apps.|
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'The Canonical Capacity Estimation Framework',
      confidence: 'stable',
      simpleDefinition: 'A standardized step-by-step mathematical method to calculate QPS, Peak QPS, Network Bandwidth, Storage Capacity, and Cache RAM from high-level user metrics.',
      whyItExists: 'Architects must size clusters, provision databases, and budget infrastructure costs before writing a single line of code.',
      analogy: 'A structural engineer calculating the total load-bearing capacity, concrete tonnage, and steel rebar required before pouring the foundation of a skyscraper.',
      technicalExplanation: 'The 5-Step Formula: (1) Daily Active Users (DAU) & Actions per Day. (2) Average Queries Per Second: `QPS = Total_Daily_Requests / 86,400`. Rule of thumb: `86,400 ≈ 100,000`, so `100 Million requests/day ≈ 1,000 to 1,200 QPS`. (3) Peak QPS: Traffic is never uniformly distributed. Peak factor is typically 2x to 5x average: `Peak_QPS = Average_QPS * 2 (or 3)`. (4) Ingress & Egress Bandwidth: `Bandwidth = QPS * Average_Payload_Size`. (5) Storage Growth (5 Years): `Daily_Storage = Writes_Per_Day * Record_Size`. `5_Year_Storage = Daily_Storage * 365 * 5 * Replication_Factor (e.g. 3x)`.',
      example: 'A photo app has 50M DAU. Each user views 20 photos (100KB each) and uploads 2 photos (2MB each) per day. Read QPS = `(50M * 20) / 100,000 = 10,000 QPS`. Read Bandwidth = `10,000 * 100KB = 1 GB/s`. Write Storage/Day = `50M * 2 * 2MB = 200 Terabytes/day`.',
      whenToUse: ['Always perform step-by-step capacity estimation in the first 5 minutes of any system design interview.'],
      whenNotToUse: ['Do not compute numbers to 6 decimal places—system design math is back-of-the-envelope order-of-magnitude estimation (powers of 10).'],
      commonMistakes: [
        'Confusing bits and bytes: Network bandwidth is measured in bits (Gbps); storage and memory are measured in bytes (GB). 1 Byte = 8 bits. 1 Gbps network connection can transfer at most 125 MB/s of data.'
      ],
      interviewQuestion: {
        question: 'Calculate the cache memory required to store the top 20% of daily read queries for a system handling 500 million read requests per day, where each cached record is 2 Kilobytes.',
        answer: 'Step 1: Unique daily read queries = 500,000,000. Step 2: Apply the 80/20 Pareto rule (20% of unique items generate 80% of read traffic): `Cached_Items = 500,000,000 * 0.20 = 100,000,000 items`. Step 3: Raw cache memory = `100,000,000 * 2 KB = 200,000,000 KB = 200 Gigabytes`. Step 4: Add 25% memory overhead for Redis internal metadata and jemalloc pointers: `Total_RAM = 200 GB * 1.25 = 250 Gigabytes of RAM`. This can be provisioned as an AWS ElastiCache Redis cluster of 4 nodes with 64GB RAM each.'
      }
    },
    {
      title: 'Little’s Law & Concurrency Sizing',
      confidence: 'stable',
      simpleDefinition: 'Little’s Law is a fundamental queuing theory theorem stating that the average number of requests in a system (L) equals the arrival rate (λ) multiplied by the average response time (W): L = λ * W.',
      whyItExists: 'It tells you exactly how many concurrent worker threads, database connections, or socket buffers are required to sustain a given request throughput without queuing.',
      analogy: 'A coffee shop: if customers arrive at 2 customers per minute (λ), and each customer takes 5 minutes to order and receive coffee (W), there will on average be 10 customers waiting inside the shop (L = 2 * 5 = 10).',
      technicalExplanation: 'Formula: `L = λ * W`. Where: `L` = Concurrency (in-flight requests currently being processed); `λ` = Throughput (arrival rate in requests per second); `W` = Latency (average response time in seconds). Consequence for Server Sizing: If your microservice receives 5,000 RPS (`λ = 5,000/s`) and your database query takes 200ms (`W = 0.2s`): `L = 5,000 * 0.2 = 1,000 concurrent requests`. If your thread pool or connection pool only has 200 slots, 800 requests will be stuck in the operating system backlog queue, causing latency to explode.',
      example: 'Reducing service response time from 100ms to 20ms reduces required concurrent thread memory by 80% for the exact same throughput.',
      whenToUse: ['Use Little’s Law to size thread pools, Tomcat worker pools, and database connection pools.'],
      whenNotToUse: ['Little’s Law assumes a stable system where arrival rate does not exceed service capacity; it does not apply during unbounded queuing collapse.'],
      commonMistakes: [
        'Attempting to fix high latency by simply increasing thread pool size: if the bottleneck is a slow downstream database, increasing threads just creates more database lock contention.'
      ],
      interviewQuestion: {
        question: 'An API gateway handles 20,000 requests per second with an average backend latency of 50ms. How many concurrent open connections must the gateway maintain?',
        answer: 'Apply Little’s Law: `L = λ * W`. Here: `λ = 20,000 requests/second`; `W = 50ms = 0.05 seconds`. `L = 20,000 * 0.05 = 1,000 concurrent open connections`. The API gateway must maintain at least 1,000 concurrent active TCP sockets and memory buffers to support this load.'
      }
    },
    {
      title: 'Amdahl’s Law & The Limits of Parallelization',
      confidence: 'stable',
      simpleDefinition: 'Amdahl’s Law states that the maximum speedup of a system is strictly limited by the serial (non-parallelizable) portion of the task, no matter how many CPU cores or servers you add.',
      whyItExists: 'Adding 100 servers to a slow batch job will not make it 100x faster if 10% of the job is a single-threaded SQL lock. Amdahl’s law prevents wasteful hardware over-provisioning.',
      analogy: 'If it takes 9 months for 1 woman to carry a pregnancy, you cannot hire 9 women to produce a baby in 1 month: the biological gestation is strictly serial.',
      technicalExplanation: 'Amdahl’s Law Formula: `Speedup = 1 / ((1 - P) + (P / N))`. Where `P` = proportion of execution time that can be parallelized (0.0 to 1.0); `(1 - P)` = strictly serial fraction; `N` = number of parallel processors/servers. Universal Law of Scalability (Gunther): Adds contention and crosstalk coherency overhead: `Speedup = N / (1 + σ(N - 1) + κ * N * (N - 1))`. When inter-node communication coherency (`κ`) grows, adding more nodes eventually makes the cluster SLOWER, not faster.',
      example: 'If 95% of a distributed search query is parallelizable and 5% is a serial merge of the top 10 results: even with an infinite number of servers (`N -> ∞`), maximum possible speedup is `1 / 0.05 = 20x`. You can never exceed a 20x speedup.',
      whenToUse: ['Evaluate Amdahl’s law before embarking on costly distributed scale-out projects.'],
      whenNotToUse: ['Do not assume adding more worker nodes will linearly reduce batch runtimes without profiling the serial synchronization lock.'],
      commonMistakes: [
        'Believing horizontal scaling is infinitely linear: lock contention, network barriers, and database serialization eventually cause throughput to plateau and decline.'
      ],
      interviewQuestion: {
        question: 'What is the maximum theoretical speedup if 80% of an image transcoding job can be processed in parallel across multiple worker cores, and what is the speedup with 8 cores?',
        answer: 'Here `P = 0.80` and serial fraction `(1 - P) = 0.20`. Maximum theoretical speedup with infinite cores (`N -> ∞`): `Speedup_max = 1 / 0.20 = 5x`. For `N = 8` cores: `Speedup = 1 / (0.20 + (0.80 / 8)) = 1 / (0.20 + 0.10) = 1 / 0.30 = 3.33x`. Despite paying for 8x the compute cores, the system only runs 3.33x faster due to the 20% serial bottleneck.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Vertical Scaling (Scale Up: Bigger CPU / RAM)',
    technologyB: 'Horizontal Scaling (Scale Out: More Distributed Nodes)',
    comparisonDimensions: [
      {
        dimension: 'Architectural Complexity',
        optionA: 'Near zero. No code changes, no distributed consensus, no network hops.',
        optionB: 'High. Requires sharding, load balancers, consistency protocols, idempotency.',
        verdict: 'Scale Up wins decisively for fast early-stage iteration.'
      },
      {
        dimension: 'Upper Hardware Ceiling',
        optionA: 'Hard physical limit (e.g., AWS EC2 maxes at 448 vCPUs and 24 TB RAM).',
        optionB: 'Virtually infinite. Can add thousands of commodity nodes.',
        verdict: 'Scale Out is mandatory for internet-scale platforms (Google, Meta).'
      },
      {
        dimension: 'Cost at Mid-Scale',
        optionA: 'High. Giant single instances (e.g., `u-24tb1.metal`) cost $30+/hour.',
        optionB: 'Low. Elastic auto-scaling matches demand dynamically with spot instances.',
        verdict: 'Scale Out wins on cost optimization at scale.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      '86,400 seconds in a day: 100 Million daily requests ≈ 1,200 QPS.',
      'Peak QPS is typically 2x to 3x average QPS.',
      'Memory is ~1,000x faster than SSD; Datacenter network round-trip is ~0.5ms.',
      'Little’s Law (`L = λ * W`): Concurrency = Arrival Rate * Latency.',
      'Amdahl’s Law proves that the serial fraction strictly caps maximum parallel speedup.'
    ],
    conceptualQuestions: [
      {
        id: 'q19-1',
        question: 'Why is standard average latency (mean) a dangerous and misleading metric in system design?',
        answer: 'Average latency hides outliers. In a system where 99 requests take 10ms and 1 request takes 10,000ms, the average is ~109ms (which looks acceptable). However, in modern microservice architectures where a web page triggers 100 internal fan-out RPC calls, virtually EVERY end-user page load will encounter that 10,000ms tail latency! Engineers must always monitor 95th, 99th, and 99.9th percentile latencies (p95, p99, p99.9).'
      },
      {
        id: 'q19-2',
        question: 'What is the 80/20 Pareto rule in cache sizing?',
        answer: 'The Pareto principle states that roughly 80% of all read requests are directed toward 20% of the data items (the hot data). Sizing your in-memory cache to hold this top 20% of data will achieve an ~80% cache hit ratio, shielding the backing database from the vast majority of traffic.'
      },
      {
        id: 'q19-3',
        question: 'How do you convert Gigabits per second (Gbps) to Gigabytes per month for cloud egress billing?',
        answer: '1 Gbps = 1,000,000,000 bits/s = 125,000,000 Bytes/s = 0.125 GB/s. In 1 month (30 days = 2,592,000 seconds): `0.125 GB/s * 2,592,000 s ≈ 324,000 Gigabytes ≈ 324 Terabytes of data transfer per month` sustained at 1 Gbps.'
      }
    ],
    designExercises: [
      {
        id: 'de19-1',
        scenario: 'Design the storage and network capacity for a Twitter-like system with 300 million Daily Active Users (DAU).',
        task: 'Calculate Write QPS, Read QPS, Storage per day, and Egress Bandwidth.',
        solutionGuide: 'Assumptions: Each user posts 2 tweets/day and views 100 tweets/day. Tweet metadata = 500 bytes; 20% of tweets have a 200KB image. 1. Write QPS: `(300M * 2) / 100,000 = 6,000 Write QPS`. Peak Write = `6,000 * 2 = 12,000 QPS`. 2. Read QPS: `(300M * 100) / 100,000 = 300,000 Read QPS`. Peak Read = `600,000 QPS`. 3. Daily Storage: Text = `600M * 500 B = 300 GB/day`. Images = `600M * 0.20 * 200 KB = 24 TB/day`. Total daily storage = ~24.3 TB/day. 4. Egress Bandwidth: Read QPS (300,000) * Average payload (`500 B + (0.2 * 200 KB) = 40.5 KB`) = `300,000 * 40.5 KB = 12.15 GB/s = 97.2 Gbps`.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq19-1',
        question: 'How do you systematically size database IOPS for a write-heavy financial transaction ledger?',
        answer: '1. Calculate Peak Write QPS (e.g., 5,000 write tx/sec). 2. Determine Write Amplification: Each transaction writes 1 row to the ledger table, 1 entry to the WAL (write-ahead log), and updates 3 indexes (Primary Key, User ID, Timestamp) = 5 physical disk block writes per transaction. 3. Total required IOPS = `5,000 * 5 = 25,000 IOPS`. 4. Add 30% headroom for background checkpointing, autovacuum, and read queries: `25,000 * 1.30 = 32,500 IOPS`. 5. Provision AWS EBS `io2` with 35,000 provisioned IOPS, or use a local NVMe instance store RAID array.'
      }
    ],
    practicalTask: {
      title: 'Calculate Network Transfer Duration Across Latency Tiers',
      instructions: 'Calculate the time required to transfer a 10 Gigabyte database dump across: (A) A 1 Gbps local datacenter network link, (B) A 10 Gbps AWS Direct Connect private link, (C) A 100 Mbps standard office public internet connection.',
      verification: '10 GB = 10 * 8 = 80 Gigabits. (A) 1 Gbps link: `80 Gb / 1 Gbps = 80 seconds` (1.33 minutes). (B) 10 Gbps link: `80 Gb / 10 Gbps = 8 seconds`. (C) 100 Mbps (0.1 Gbps) link: `80 Gb / 0.1 Gbps = 800 seconds` (13.33 minutes). (Assuming 100% network utilization with no TCP packet loss).'
    }
  },
  sources: [
    {
      title: 'Latency Numbers Every Programmer Should Know (Colin Scott)',
      url: 'https://colin-scott.github.io/personal_website/research/interactive_latencies.html',
      type: 'Official Documentation',
      whatItSupports: 'Interactive human-scale visualizations of CPU, RAM, NVMe, and network round-trip latencies.'
    }
  ],
  videos: [
    {
      title: 'Little’s Law and Queueing Theory • John Ousterhout',
      creator: 'Stanford University',
      duration: '48m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Mathematical formulation of Little’s Law, response time distributions, and queue saturation.',
      url: 'https://www.youtube.com/watch?v=kYJj3d4b1aI'
    }
  ]
};
