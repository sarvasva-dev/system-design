import { Chapter } from '../../types';

export const PART0_CHAPTER: Chapter = {
  id: 'part0-mindset',
  part: 0,
  partTitle: 'Part 0 — System Design Mindset',
  chapterNumber: 0,
  title: 'The System Design Mindset',
  subtitle: 'From Writing Code to Architecting Resilient, Large-Scale Distributed Engines',
  summary: 'System design is the disciplined craft of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified operational and business requirements. Unlike algorithmic problem solving, system design rarely presents a single "correct" answer—it is an exercise in evaluating trade-offs across cost, latency, availability, consistency, and organizational velocity.',
  diagramAscii: `
+-----------------------------------------------------------------------+
|                    THE SYSTEM DESIGN REASONING LOOP                   |
+-----------------------------------------------------------------------+
|                                                                       |
|   1. CLARIFY REQUIREMENTS                                             |
|      [ Functional Scope ]  <=======>  [ Non-Functional Constraints ]  |
|               |                                      |                |
|               v                                      v                |
|   2. SCALE & CAPACITY ESTIMATION                                      |
|      [ QPS / RPS ] ===> [ Storage / 5 Yrs ] ===> [ Network I/O ]      |
|               |                                                       |
|               v                                                       |
|   3. HIGH-LEVEL TOPOLOGY & CONTRACTS                                  |
|      [ Client ] -> [ CDN / WAF ] -> [ Load Balancer ] -> [ Gateway ]  |
|               |                                                       |
|               v                                                       |
|   4. DATA MODEL & STORAGE ENGINE SELECTION                            |
|      [ Relational ACID ]  <--- Trade-offs --->  [ NoSQL Horizontal ]  |
|               |                                                       |
|               v                                                       |
|   5. BOTTLENECK IDENTIFICATION & MITIGATION                           |
|      [ Single Point of Failure ] -> [ Caching / Replicas / Queues ]   |
|               |                                                       |
|               v                                                       |
|   6. FAILURE RESILIENCE & OBSERVABILITY                               |
|      [ Chaos / Health Checks / Circuit Breakers / OTel Telemetry ]    |
|                                                                       |
+-----------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Functional vs. Non-Functional Requirements',
      confidence: 'stable',
      simpleDefinition: 'Functional requirements define WHAT a system must do (features); non-functional requirements define HOW WELL it must perform (qualities like speed, uptime, and security).',
      whyItExists: 'Systems that only satisfy functional requirements frequently collapse in production under real-world traffic, network latency, or hardware failures.',
      analogy: 'Building a car: functional requirements are that it accelerates, turns, and brakes. Non-functional requirements are that it gets 45 miles per gallon, withstands a 60 mph crash, and starts reliably at -20°C.',
      technicalExplanation: 'Functional requirements map directly to user stories and API contracts (e.g., `POST /api/v1/documents`, `POST /api/v1/billing/charge`). Non-functional requirements (NFRs) impose architectural invariants: p99 latency < 50ms, 99.99% availability (maximum 52.6 minutes downtime/year), RPO = 0 (zero data loss on database crash), and compliance with SOC2 Type II isolation.',
      example: 'In a SaaS invoicing app: Functional = "Users can generate PDF invoices and email them." Non-Functional = "The system must generate up to 500 invoices per second with p95 < 2s, ensure zero cross-tenant data leakage, and store invoices with 99.999999999% durability over 7 years."',
      whenToUse: ['Always establish both functional and non-functional requirements before proposing any architectural diagram or choosing technologies.'],
      whenNotToUse: ['Never skip NFRs even in fast prototyping, because choosing an unscalable storage engine early creates crippling migration debt.'],
      commonMistakes: [
        'Assuming non-functional requirements without asking the customer or interviewer.',
        'Over-engineering non-functional targets (e.g., demanding five-nines 99.999% availability for an internal batch report generator, ballooning infrastructure costs 10x).'
      ],
      interviewQuestion: {
        question: 'How do you begin a system design interview when given an ambiguous prompt like "Design Twitter"?',
        answer: 'I immediately split the problem into Functional and Non-Functional scopes: First, clarify core user actions (Tweet, Follow, View Timeline). Second, establish scale and performance metrics (DAU, Read/Write ratio, p99 latency target, availability target). Third, explicitly scope out features not relevant to the core system (e.g., direct messaging or ad targeting) to prevent scope creep.'
      },
      codeSnippet: {
        language: 'typescript',
        title: 'Requirements Contract Interface',
        code: `interface SystemRequirements {
  functional: {
    coreCapabilities: string[];
    userRoles: ('TENANT_ADMIN' | 'STANDARD_USER' | 'AUDITOR')[];
    apiEndpoints: string[];
  };
  nonFunctional: {
    targetSLA: 0.999 | 0.9999 | 0.99999;
    p99LatencyMs: number;
    peakQps: number;
    rpoSeconds: number; // Recovery Point Objective (allowable data loss)
    rtoMinutes: number; // Recovery Time Objective (allowable downtime)
    dataRetentionYears: number;
  };
}`
      }
    },
    {
      title: 'Scalability: Vertical vs. Horizontal',
      confidence: 'stable',
      simpleDefinition: 'Vertical scaling (Scale Up) means adding more power (CPU, RAM) to an existing machine; Horizontal scaling (Scale Out) means adding more machines to a distributed pool.',
      whyItExists: 'A single physical server has strict hardware ceilings (maximum sockets, memory channels, PCIe bus capacity). Once exceeded, horizontal distribution is mathematically mandatory.',
      analogy: 'Vertical scaling is replacing your delivery van with a massive cargo semi-truck. Horizontal scaling is hiring a fleet of 50 delivery vans working in parallel.',
      technicalExplanation: 'Vertical scaling is simpler because it introduces zero network latency between components and preserves local ACID database guarantees without distributed consensus. However, it suffers from diminishing returns, high costs at the enterprise hardware tier, and creates a critical Single Point of Failure (SPOF). Horizontal scaling achieves near-linear capacity expansion but introduces distributed complexity: network partitions, RPC latency, data sharding, distributed transactions, and eventual consistency challenges.',
      example: 'Stack Overflow famously ran on a small cluster of massive multi-socket SQL Server machines for over a decade (vertical scaling). In contrast, Google Search and Amazon Dynamo were architected from day one to run on tens of thousands of cheap commodity servers (horizontal scaling).',
      whenToUse: [
        'Use vertical scaling for early-stage MVPs, relational databases with low to moderate write QPS, and developer workstations.',
        'Use horizontal scaling for stateless application servers, event-driven worker fleets, and globally distributed key-value data stores.'
      ],
      whenNotToUse: [
        'Do not prematurely split a monolithic database into 50 horizontally sharded nodes before hitting indexing or IOPS limits on high-memory hardware.',
        'Do not rely solely on vertical scaling when 99.99% high availability is required, because hardware maintenance requires reboot downtime.'
      ],
      commonMistakes: [
        'Assuming horizontal scaling is always cheaper (managing 200 small micro-instances often incurs higher operational and network overhead than 4 large instances).',
        'Failing to make stateless backend services truly stateless (e.g., storing user session objects in local process memory instead of Redis).'
      ],
      interviewQuestion: {
        question: 'When should you choose vertical scaling over horizontal scaling for a primary database?',
        answer: 'You choose vertical scaling when your database working set fits comfortably in RAM (e.g., < 512GB) and write throughput is within single-node IOPS capabilities. It avoids cross-shard joins, distributed two-phase commits, and operational maintenance of sharding routers. Only shard horizontally when hardware limits (RAM, NVMe write saturation) or geographic data sovereignty laws make single-node hosting impossible.'
      }
    },
    {
      title: 'Availability, Reliability, and Durability',
      confidence: 'stable',
      simpleDefinition: 'Availability is the percentage of time a system is operational; Reliability is the probability it performs without failure over a given duration; Durability is the guarantee that stored data is never lost or corrupted.',
      whyItExists: 'These three metrics are often mistakenly conflated, leading to catastrophic design oversights where a system is online but silently losing user data.',
      analogy: 'Availability is a bank teller being at their desk 99.9% of the day. Reliability is the teller never giving you the wrong withdrawal amount. Durability is the bank vault never burning down and destroying your gold.',
      technicalExplanation: 'Availability is calculated as MTBF / (MTBF + MTTR), where MTBF is Mean Time Between Failures and MTTR is Mean Time To Repair. A system can have 99.999% availability ("five nines" = 5.26 minutes downtime/year) while having terrible reliability if it fails every 10 minutes for 3 milliseconds. Durability measures permanent data survival, typically expressed in AWS S3 as "11 nines" (99.999999999% per year), achieved via erasure coding and replication across multiple independent availability zones.',
      example: 'A cache server like Redis has high availability (instant failover via Sentinel) but low durability unless configured with Append-Only File (AOF) fsync=always or backed by persistent block storage.',
      whenToUse: ['Explicitly separate durability requirements (e.g., financial ledger records must never be lost) from availability requirements (e.g., user profile view can degrade gracefully).'],
      whenNotToUse: ['Do not use high-durability distributed consensus write paths for temporary transient data like typing indicators or session heartbeats.'],
      commonMistakes: [
        'Assuming 99.99% availability guarantees zero lost transactions.',
        'Neglecting MTTR: improving automated failover and rollback speed often boosts availability much faster than trying to prevent every failure.'
      ],
      interviewQuestion: {
        question: 'What is the mathematical difference between 99.9% ("three nines") and 99.99% ("four nines") availability in allowable downtime?',
        answer: '99.9% availability allows approximately 8.76 hours of total downtime per year (or 43.8 minutes per month). 99.99% availability permits only 52.6 minutes per year (or 4.38 minutes per month). Achieving four nines requires fully automated multi-AZ failover and zero-downtime rolling/canary deployments, whereas three nines can tolerate human-supervised manual failover.'
      }
    },
    {
      title: 'Latency vs. Throughput',
      confidence: 'stable',
      simpleDefinition: 'Latency is the time taken to complete a single operation (delay); Throughput is the number of operations completed per unit of time (bandwidth).',
      whyItExists: 'Optimizing for one often hurts the other. Batching requests increases throughput dramatically but increases latency for individual operations.',
      analogy: 'A high-speed bullet train has low latency (gets 1 passenger from city A to B in 30 minutes). A cargo container ship has high latency (takes 14 days) but astronomical throughput (transports 20,000 containers at once).',
      technicalExplanation: 'Latency is commonly measured in percentiles: p50 (median), p90, p99, and p99.9. In microservice architectures, p99 latency dominates user experience because a single user request often fans out to 20+ backend RPC calls concurrently. Little’s Law governs the relationship between throughput (L), latency (W), and concurrency (λ): L = λ * W. To increase throughput while latency is fixed, you must scale concurrency.',
      example: 'In Apache Kafka, configuring `linger.ms=20` and `batch.size=65536` allows the producer to group events together, raising throughput from 5,000 msgs/sec to 150,000 msgs/sec at the expense of adding up to 20ms of artificial latency per event.',
      whenToUse: ['Measure p99 and p99.9 latencies instead of arithmetic averages, which hide crippling tail-latency degradation experienced by your most active users.'],
      whenNotToUse: ['Do not apply aggressive micro-batching to interactive real-time user endpoints like multiplayer gaming or high-frequency trading.'],
      commonMistakes: [
        'Reporting average latency: 95% of users might enjoy 10ms response times while 5% suffer 10,000ms timeouts, yet the average looks deceptively healthy at 510ms.',
        'Ignoring the tail at scale: if a page load triggers 100 backend services each with p99 = 100ms, over 63% of user page loads will experience the slow p99 delay.'
      ],
      interviewQuestion: {
        question: 'Why is the p99 latency metric critical in a microservices architecture with fan-out calls?',
        answer: 'If a frontend API gateway calls 50 downstream microservices in parallel to render a single dashboard, the overall request latency is bounded by the SLOWEST response. The probability that all 50 services respond in less than their p99 latency is (0.99)^50 ≈ 60.5%. That means nearly 40% of all user dashboard loads will experience tail p99 latency unless mitigated with timeouts, hedged requests, or caching.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Monolithic Single-Node System',
    technologyB: 'Distributed Horizontally Scaled System',
    comparisonDimensions: [
      {
        dimension: 'Operational Complexity',
        optionA: 'Very Low. Single process, single database, simple CI/CD pipeline.',
        optionB: 'High. Service meshes, distributed tracing, container orchestration, network debugging.',
        verdict: 'Monolith wins for small teams and early MVP phases.'
      },
      {
        dimension: 'Failure Isolation',
        optionA: 'Poor. A memory leak or segmentation fault in one module crashes the entire system.',
        optionB: 'High. Failure in notification worker does not crash checkout service.',
        verdict: 'Distributed architecture wins for high-blast-radius enterprise systems.'
      },
      {
        dimension: 'Consistency Guarantees',
        optionA: 'Strong ACID transactions supported out-of-the-box via single RDBMS engine.',
        optionB: 'Eventual consistency, Saga patterns, or complex distributed consensus required.',
        verdict: 'Monolith wins for core transactional ledgers.'
      },
      {
        dimension: 'Scale Ceiling',
        optionA: 'Hard hardware limit (max CPU cores, RAM channels, PCIe lanes).',
        optionB: 'Virtually unlimited horizontal elasticity.',
        verdict: 'Distributed system is mandatory at hyper-scale.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'System design is the engineering of trade-offs under constraints, not finding single dogmatic answers.',
      'Functional requirements answer WHAT; Non-functional requirements answer HOW WELL.',
      'Availability = Uptime ratio; Reliability = Error-free execution; Durability = Permanent data survival.',
      'Three nines (99.9%) allows ~44 mins downtime/month; Four nines (99.99%) allows ~4.4 mins downtime/month.',
      'Little’s Law (L = λ * W) dictates that system concurrency equals arrival rate multiplied by latency.',
      'Never rely on arithmetic average latency; always design for p95, p99, and p99.9 tail percentiles.'
    ],
    conceptualQuestions: [
      {
        id: 'q0-1',
        question: 'What is the primary difference between RPO and RTO in disaster recovery?',
        answer: 'RPO (Recovery Point Objective) is the maximum acceptable age of data lost when a disaster strikes (measures data loss in time). RTO (Recovery Time Objective) is the maximum acceptable duration of system downtime before service restoration (measures business interruption in time).'
      },
      {
        id: 'q0-2',
        question: 'Why does batching increase throughput while degrading latency?',
        answer: 'Batching combines multiple records into a single network transmission or disk flush, amortizing protocol header, context switch, and disk seek overhead. However, earlier records in the batch must wait in a memory buffer until the batch fills or times out, adding artificial latency.'
      },
      {
        id: 'q0-3',
        question: 'Explain why a system with 99.99% uptime can still have unacceptable reliability for financial transactions.',
        answer: 'If the system is technically reachable (online) 99.99% of the time, but during that uptime 2% of financial settlement requests fail due to internal deadlock or unhandled race conditions, the system has high availability but poor reliability.'
      },
      {
        id: 'q0-4',
        question: 'What is a Single Point of Failure (SPOF)? Give two common examples.',
        answer: 'An SPOF is any component whose individual failure halts the operation of the entire system. Common examples: a single un-replicated primary database server, or a DNS server lacking redundant nameservers.'
      },
      {
        id: 'q0-5',
        question: 'How does tail latency amplification occur in microservices?',
        answer: 'When a parent request issues parallel requests to N downstream services and waits for all of them, the parent response time is determined by the max latency among all N calls. As N grows, the probability of hitting tail latency approaches 100%.'
      },
      {
        id: 'q0-6',
        question: 'What is graceful degradation?',
        answer: 'Graceful degradation is the design practice where a system maintains core functionality when auxiliary components fail (e.g., showing cached recommendations or empty recommendations if the AI ML scoring engine is down, rather than displaying an HTTP 500 error page).'
      },
      {
        id: 'q0-7',
        question: 'Why is over-provisioning availability considered an architectural failure?',
        answer: 'Each additional "nine" of availability (e.g., from 99.9% to 99.99% to 99.999%) exponentially increases capital expenditure, operational complexity, multi-region licensing, and consensus latency. Providing five-nines for a service whose users only need two-nines is a waste of engineering resources.'
      },
      {
        id: 'q0-8',
        question: 'What is the role of backpressure in distributed systems?',
        answer: 'Backpressure is a flow-control mechanism where a downstream consumer signals to an upstream producer that it is overwhelmed, forcing the producer to slow down or buffer requests, preventing out-of-memory crashes.'
      },
      {
        id: 'q0-9',
        question: 'Define MTBF and MTTR.',
        answer: 'MTBF (Mean Time Between Failures) is the average elapsed operational time between inherent system failures. MTTR (Mean Time To Repair) is the average time taken to detect, troubleshoot, fix, and restore the system to full operation.'
      },
      {
        id: 'q0-10',
        question: 'How do service level indicators (SLIs), objectives (SLOs), and agreements (SLAs) differ?',
        answer: 'An SLI is a quantifiable metric of service performance (e.g., request latency). An SLO is an internal target for that metric (e.g., 99% of requests < 100ms). An SLA is an explicit legal contract with customers specifying penalties if the SLO is breached.'
      }
    ],
    designExercises: [
      {
        id: 'de0-1',
        scenario: 'A B2B SaaS analytics platform wants to offer a 99.99% uptime SLA to enterprise clients.',
        task: 'Define the allowable annual downtime, identify the mandatory architectural building blocks, and define RPO/RTO targets.',
        solutionGuide: 'Allowable downtime: 52.6 minutes/year. Mandatory blocks: Multi-AZ database clustering with automatic failover (failover time < 60s), multi-instance stateless web tier behind an Application Load Balancer, health checks with automated unhealthy host replacement, and blue-green deployment pipeline to prevent deployment downtime. Target RPO < 1 minute, RTO < 5 minutes.'
      },
      {
        id: 'de0-2',
        scenario: 'A video streaming platform’s recommendation microservice experiences severe p99 latency spikes during evening peak hours.',
        task: 'Design a fallback strategy that prevents user homepages from timing out.',
        solutionGuide: 'Implement a circuit breaker pattern (e.g., Resilience4j or Envoy) around the ML recommendation service with a 150ms timeout. If the service trips or times out, immediately return a pre-computed or globally cached static fallback list of "Trending Videos" without blocking the user interface.'
      },
      {
        id: 'de0-3',
        scenario: 'An e-commerce flash sale site receives 100x baseline traffic for 10 minutes.',
        task: 'Determine whether horizontal or vertical scaling is appropriate and specify queueing controls.',
        solutionGuide: 'Vertical scaling cannot adapt dynamically within minutes without rebooting; horizontal autoscaling is required. Combine pre-warmed auto-scaling compute groups with a high-throughput message queue (AWS SQS / Kafka) and a virtual waiting room (rate limiting / token bucket) at the API Gateway to decouple burst arrivals from backend database writes.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq0-1',
        question: 'Explain the trade-off between Consistency and Latency in a globally distributed storage system.',
        idealAnswer: 'Under the PACELC theorem, even when no network partition occurs (Else), a system must trade off Latency (L) versus Consistency (C). Enforcing strong consistency across geographical regions requires cross-datacenter round-trip network hops (speed-of-light propagation latency, e.g., 70ms between New York and London) to achieve consensus (Raft/Paxos). To achieve sub-10ms write latency, the system must compromise by acknowledging writes locally and replicating asynchronously, yielding eventual consistency.'
      },
      {
        id: 'iq0-2',
        question: 'How do you determine if a feature should be synchronous or asynchronous?',
        idealAnswer: 'If the caller cannot proceed without the immediate result (e.g., authentication verification, credit card authorization validation), the request must be synchronous. If the task is long-running, non-critical to the immediate response, or can be deferred (e.g., video transcoding, welcome email delivery, analytics aggregation), it should be processed asynchronously via message queues or background worker pools.'
      },
      {
        id: 'iq0-3',
        question: 'What is tail-tolerance and what mechanisms are used in production to achieve it?',
        idealAnswer: 'Tail-tolerance (Dean & Barroso, Google) refers to techniques that mitigate worst-case latency variations. Mechanisms include: (1) Hedged requests: sending the same read request to a replica after a brief delay if the primary has not answered, taking whichever finishes first; (2) Tied requests: enqueuing the request on multiple workers simultaneously and cancelling upon completion; (3) Micro-level timeouts and rapid circuit breaking.'
      },
      {
        id: 'iq0-4',
        question: 'Why is fault tolerance not the same as high availability?',
        idealAnswer: 'Fault tolerance means the system continues operating without ANY interruption or degradation despite hardware failure (often requiring zero-downtime hot-standby hardware and synchronized lockstep execution). High availability guarantees that the system is operational for a high percentage of time, but permits brief automated failover interruptions (e.g., 10-30 seconds of dropped connections during DB master failover).'
      },
      {
        id: 'iq0-5',
        question: 'How would you explain the concept of Error Budgets to an engineering executive?',
        idealAnswer: 'An error budget is the allowable room for unreliability (100% minus the SLO). For a 99.9% SLO, the error budget is 0.1% downtime or failures. When the budget is intact, product teams can innovate rapidly and ship risky new features. If the budget is exhausted due to incidents, deployments are frozen and all engineering effort pivots to reliability, testing, and infrastructure hardening.'
      }
    ],
    practicalTask: {
      title: 'Audit and Calculate Service Availability & Downtime Budget',
      instructions: 'Given a multi-tiered architecture (CDN -> Load Balancer -> API Gateway -> Service -> Database) with individual SLAs of 99.99%, 99.99%, 99.95%, 99.9%, and 99.95% respectively in series, calculate the composite overall availability and total allowable downtime per month.',
      verification: 'Overall composite availability = 0.9999 * 0.9999 * 0.9995 * 0.9990 * 0.9995 ≈ 99.78%. Allowable monthly downtime = 30 days * 24 hrs * 60 mins * (1 - 0.9978) ≈ 95 minutes. This demonstrates why serial dependencies degrade availability rapidly.'
    }
  },
  sources: [
    {
      title: 'Google Site Reliability Engineering: Embracing Risk & Service Level Objectives',
      url: 'https://sre.google/sre-book/embracing-risk/',
      type: 'Official Documentation',
      whatItSupports: 'SRE fundamentals, error budgets, defining meaningful SLIs and SLOs, and balancing feature velocity against reliability.'
    },
    {
      title: 'The Tail at Scale (Jeffrey Dean & Luiz André Barroso, Google)',
      url: 'https://dl.acm.org/doi/10.1145/2408776.2408794',
      type: 'Research Paper',
      whatItSupports: 'How tail latencies compound in large fan-out distributed systems and production mechanisms (hedged requests, tied requests) to tame latency variability.'
    }
  ],
  videos: [
    {
      title: 'Distributed Systems 1.1: Introduction',
      creator: 'Martin Kleppmann (University of Cambridge)',
      duration: '1h 10m',
      difficulty: 'Beginner',
      whatYouWillLearn: 'Foundations of distributed systems, why single computers are insufficient, and the inherent challenges of partial failure.',
      url: 'https://www.youtube.com/watch?v=UEAMfLPZZhE'
    }
  ]
};
