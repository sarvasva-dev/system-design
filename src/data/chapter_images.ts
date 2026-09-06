export interface ChapterVisualAsset {
  bannerUrl: string;
  thumbnailUrl: string;
  caption: string;
  architecturalElements: string[];
}

export const CHAPTER_IMAGES: Record<string, ChapterVisualAsset> = {
  'part0-mindset': {
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    caption: 'Silicon micro-architecture, instruction pipelines, and CPU register hierarchies governing compute limits.',
    architecturalElements: ['CPU Registers', 'Clock Frequencies', 'L1/L2/L3 Latencies', 'SLA Boundaries']
  },
  'part1-networking': {
    bannerUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
    caption: 'High-density fiber optic patch panels and optical transceivers powering global Anycast and edge POPs.',
    architecturalElements: ['BGP Anycast', 'TCP/QUIC Handshakes', 'TLS 1.3 Key Exchange', 'Geo-DNS Resolution']
  },
  'part2-protocols': {
    bannerUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    caption: 'Modern enterprise server racks terminating high-throughput gRPC, HTTP/3, and bidirectional WebSocket streams.',
    architecturalElements: ['HTTP/2 Multiplexing', 'Protobuf Serialization', 'Full-Duplex WebSockets', 'Idempotency Keys']
  },
  'part3-databases': {
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    caption: 'High-speed solid-state enterprise arrays sustaining hundreds of thousands of random write IOPS under ACID guarantees.',
    architecturalElements: ['B-Tree Index Seeks', 'WAL (Write-Ahead Log)', 'MVCC Row Visibility', 'Read Replicas']
  },
  'part4-nosql': {
    bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    caption: 'Decentralized distributed nodes exchanging gossip protocols and maintaining partition tolerance under CAP constraints.',
    architecturalElements: ['Consistent Hashing Ring', 'LSM-Trees (SSTables)', 'Vector Clocks', 'Quorum Writes (W + R > N)']
  },
  'part5-caching': {
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    caption: 'High-frequency DDR5 memory modules and in-memory key-value data structures serving sub-millisecond reads.',
    architecturalElements: ['Cache-Aside Pattern', 'Redis Cluster Sharding', 'Thundering Herd Mitigation', 'Probabilistic Early Expiration']
  },
  'part6-messaging': {
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    caption: 'Distributed commit-log event streams processing millions of real-time messages across decoupled consumer groups.',
    architecturalElements: ['Partition Offsets', 'Consumer Group Rebalancing', 'Dead-Letter Queues (DLQ)', 'Transactional Outbox']
  },
  'part7-storage': {
    bannerUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=400&q=80',
    caption: 'Hyperscale object storage clusters delivering 11 nines of durability with multi-part uploads and erasure coding.',
    architecturalElements: ['Erasure Coding (Reed-Solomon)', 'Presigned S3 URLs', 'Content-Addressed Storage', 'Cold Tier Archival']
  },
  'part8-search': {
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    caption: 'Distributed inverted indices and vector embedding clusters delivering semantic and full-text search across billions of docs.',
    architecturalElements: ['Inverted Indexing', 'HNSW Vector Graphs', 'BM25 Scoring', 'Near-Real-Time Segment Merging']
  },
  'part9-compute': {
    bannerUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    caption: 'Automated container orchestration, Kubernetes pods, and declarative control plane controllers managing elasticity.',
    architecturalElements: ['Horizontal Pod Autoscaler (HPA)', 'cgroups & Namespaces', 'Service Mesh (Envoy)', 'Rolling Deployments']
  },
  'part10-reliability': {
    bannerUrl: 'https://images.unsplash.com/photo-1510519138111-5778b4081c7e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510519138111-5778b4081c7e?auto=format&fit=crop&w=400&q=80',
    caption: 'High availability multi-region disaster recovery switches and automated circuit breaker tripping mechanisms.',
    architecturalElements: ['Circuit Breaker Pattern', 'Exponential Backoff + Jitter', 'Bulkheading', 'Chaos Engineering & Failover']
  },
  'part11-security': {
    bannerUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
    caption: 'Zero-trust network architectures, hardware security modules (HSM), and cryptographic token verification pipelines.',
    architecturalElements: ['mTLS Mutual Auth', 'RS256 JWT Verification', 'KMS Envelope Encryption', 'OWASP Top 10 Defenses']
  },
  'part12-observability': {
    bannerUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
    caption: 'Real-time telemetry streams, OpenTelemetry distributed trace graphs, and Prometheus metric aggregators.',
    architecturalElements: ['Distributed Trace Context (W3C)', 'p99 / p99.9 Latency Metrics', 'Structured Log Aggregation', 'SLO Burn Rate Alerts']
  },
  'part13-multitenancy': {
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    caption: 'Strict corporate data boundaries, tenant isolation barriers, and noisy neighbor mitigation in enterprise SaaS.',
    architecturalElements: ['Row-Level Security (RLS)', 'Schema-per-Tenant Isolation', 'Tenant Rate Limiting', 'Cross-Tenant Guardrails']
  },
  'part14-billing': {
    bannerUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
    caption: 'Immutable double-entry financial ledgers and meter-based usage billing engines handling recurring SaaS transactions.',
    architecturalElements: ['Double-Entry Accounting', 'Stripe Webhook Verification', 'Idempotent Charge Keys', 'Dunning & Grace Periods']
  },
  'part15-auth': {
    bannerUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=400&q=80',
    caption: 'Enterprise federated identity providers, SAML 2.0 assertions, and SCIM directory synchronization pipelines.',
    architecturalElements: ['SAML 2.0 Assertion Consumer', 'OIDC Authorization Code Flow with PKCE', 'SCIM 2.0 Provisioning', 'RBAC vs ABAC Engine']
  },
  'part16-iaas-compute': {
    bannerUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
    caption: 'Bare-metal virtualization hypervisors, KVM, and SR-IOV network pass-through powering cloud compute fleets.',
    architecturalElements: ['KVM / QEMU Hypervisor', 'NUMA Node Topology', 'Overcommit Ratio Management', 'Live VM Migration']
  },
  'part17-iaas-networking': {
    bannerUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
    caption: 'Software Defined Networking (SDN), VXLAN overlays, and distributed virtual routers connecting private VPC subnets.',
    architecturalElements: ['VXLAN Encapsulation', 'Open vSwitch (OVS)', 'BGP Route Reflectors', 'VPC Peering Mesh']
  },
  'part18-iaas-storage': {
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    caption: 'Distributed block storage fabrics, NVMe-oF (NVMe over Fabrics), and snapshot delta trees providing virtual disks.',
    architecturalElements: ['NVMe-oF Low Latency', 'Ceph CRUSH Algorithm', 'Copy-on-Write Snapshots', 'Volume Thin Provisioning']
  },
  'part19-control-plane': {
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    caption: 'Distributed consensus state machines (Raft/Paxos) maintaining continuous declarative reconciliation loops.',
    architecturalElements: ['Raft Leader Election', 'etcd MVCC Key-Value', 'Declarative Reconcile Loops', 'Split-Brain Protection']
  }
};

export const CASE_STUDY_IMAGES: Record<string, { bannerUrl: string; logoUrl: string; topologySummary: string }> = {
  'cs-saas-multitenant': {
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
    topologySummary: 'Real-time WebSocket connection fleet with Redis Pub/Sub, document block trees in PostgreSQL, and CRDT sync.'
  },
  'cs-global-cdn': {
    bannerUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=100&q=80',
    topologySummary: 'BGP Anycast routing to 300+ Edge POPs with Nginx/Pingora cache, origin shields, and tiered caching.'
  },
  'cs-iaas-hypervisor': {
    bannerUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=100&q=80',
    topologySummary: 'KVM/QEMU hypervisor nodes, SR-IOV 100GbE networking, Ceph block storage volumes, and gRPC agents.'
  },
  'cs-distributed-cache': {
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=100&q=80',
    topologySummary: 'Consistent hashing ring with 256 virtual nodes per server, rendezvous hashing, and async master-replica sync.'
  },
  'cs-payment-ledger': {
    bannerUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=100&q=80',
    topologySummary: 'Immutable append-only double-entry financial ledger in CockroachDB with idempotent payment dispatch.'
  }
};
