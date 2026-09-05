import { CaseStudy } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-saas-multitenant',
    number: 1,
    title: 'Multi-Tenant Collaborative Workspace Platform (Notion / Linear)',
    problem: 'Design a high-scale multi-tenant B2B collaboration platform supporting 10 million corporate workspaces with real-time multiplayer editing, flexible document schemas, granular RBAC/ABAC permissions, and strict cross-tenant data isolation.',
    requirements: {
      functional: [
        'Real-time collaborative document editing with conflict-free sync (< 50ms latency)',
        'Hierarchical document trees and multi-attribute relational databases per workspace',
        'Strict tenant isolation preventing cross-workspace data access',
        'Enterprise SSO (SAML 2.0 / Okta) and automated audit logging',
        'Granular sharing (Workspace, Team, Guest, Public Link with password)'
      ],
      nonFunctional: [
        'Availability: 99.95% (< 21.9 minutes downtime/month)',
        'Multiplayer sync latency: p95 < 50ms within region, p99 < 150ms cross-region',
        'Scalability: 10M registered workspaces, 2M Daily Active Users (DAU), 50,000 peak concurrent editors',
        'Durability: RPO = 0 for committed edits (Multi-AZ synchronous replication)',
        'Multi-tenant noisy neighbor protection: heavy export queries from one tenant must never degrade interactive editing for other tenants'
      ]
    },
    scaleAssumptions: {
      users: '10,000,000 workspaces, 50,000,000 total users',
      dauMau: '2,000,000 DAU / 15,000,000 MAU',
      rps: 'Average 15,000 read requests/sec, 3,000 write operations/sec',
      peakRps: 'Peak 45,000 read RPS, 10,000 write RPS',
      storage: 'Average workspace data: 50MB. Total active data: 500 Terabytes. 5-year growth: 3 Petabytes.',
      bandwidth: 'Read egress: 45,000 * 15KB = 675 MB/s (5.4 Gbps). Ingress: 10,000 * 2KB = 20 MB/s.',
      readWriteRatio: '5:1 Read to Write ratio',
      calculationsStepByStep: [
        'Active Workspaces: 10M total, 2M active daily.',
        'Average active user session: 40 minutes/day, sending 20 state mutations and 100 queries.',
        'Total daily mutations = 2,000,000 * 20 = 40,000,000 operations/day.',
        'Average Write QPS = 40,000,000 / 86,400 ≈ 463 base write QPS. With fan-out and presence updates: ~3,000 QPS.',
        'Peak multiplier = 3x average = ~10,000 peak mutation QPS.',
        'Storage: 10M workspaces * 50MB average = 500,000,000 MB = 500 Terabytes.',
        'With 3x replication + S3 snapshots: ~2 Petabytes raw cloud storage.'
      ]
    },
    apiDesign: [
      {
        endpoint: '/api/v1/workspaces/{workspace_id}/documents/{doc_id}',
        method: 'GET',
        description: 'Fetch document metadata, permission mask, and recent block tree snapshot.',
        sampleResponse: '{\n  "doc_id": "doc_8841",\n  "workspace_id": "ws_acme",\n  "version": 412,\n  "root_block_id": "blk_01",\n  "user_permission": "EDITOR"\n}'
      },
      {
        endpoint: '/api/v1/workspaces/{workspace_id}/documents/{doc_id}/sync',
        method: 'POST',
        description: 'Submit an array of CRDT operations or operational transforms with vector clock.',
        sampleRequest: '{\n  "client_id": "usr_99",\n  "base_version": 412,\n  "operations": [\n    { "type": "insert", "pos": 14, "text": "Architecture", "clock": { "usr_99": 4 } }\n  ]\n}'
      },
      {
        endpoint: '/api/v1/workspaces/{workspace_id}/export',
        method: 'POST',
        description: 'Initiate asynchronous PDF/Markdown workspace export via background worker queue.'
      }
    ],
    dataModel: [
      {
        entity: 'workspaces',
        storageEngine: 'PostgreSQL Primary Cluster (Pooled with RLS)',
        schemaDefinition: 'workspace_id UUID PRIMARY KEY, name TEXT, tier TEXT, created_at TIMESTAMPTZ, sso_config JSONB',
        notes: 'Global routing directory table cached in Redis with 1-hour TTL.'
      },
      {
        entity: 'document_blocks',
        storageEngine: 'PostgreSQL Sharded Cluster (Partitioned by workspace_id)',
        schemaDefinition: 'workspace_id UUID, doc_id UUID, block_id UUID, parent_id UUID, content JSONB, version INT, updated_at TIMESTAMPTZ, PRIMARY KEY (workspace_id, doc_id, block_id)',
        notes: 'Composite primary key ensures queries seek directly within the tenant shard.'
      },
      {
        entity: 'document_deltas_log',
        storageEngine: 'Apache Kafka / ScyllaDB append-only log',
        schemaDefinition: 'doc_id UUID, delta_seq BIGINT, client_id UUID, patch BYTEA, timestamp BIGINT, PRIMARY KEY (doc_id, delta_seq)',
        notes: 'High-throughput append-only log for replaying historical document versions.'
      }
    ],
    highLevelArchitectureAscii: `
+--------------------------------------------------------------------------------------------------+
|                    NOTION / LINEAR MULTI-TENANT ARCHITECTURE                                     |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Client (Web / Desktop / Mobile)                                                                |
|      |                                                                                           |
|      +---> [ WebSocket Connection: Real-time CRDTs ] ---> ( Ws-Gateway Fleet )                   |
|      +---> [ HTTPS REST: Metadata / Auth / Queries ] ---> ( Envoy API Gateway )                   |
|                                                                 |                                |
|          +------------------------------------------------------+                                |
|          v                                                                                       |
|   [ Envoy Gateway: Tenant Resolution & Rate Limiting ]                                           |
|      - Extracts workspace_id from JWT or Hostname                                                |
|      - Validates against Redis Tenant Directory Cache                                            |
|      - Injects 'X-Workspace-ID' and routes to microservices                                      |
|          |                                                                                       |
|          +-------------------+-----------------------------------+                               |
|          v                   v                                   v                               |
|   [ Doc-Service ]     [ Auth & SSO Service ]            [ Export Worker Pool ]                   |
|          |                   |                                   |                               |
|          v                   v                                   v                               |
|   +---------------------------------------+             [ Dedicated Worker Queue ]               |
|   | SHARDED POSTGRESQL CLUSTER (Citus/Pg) |             (Fair-share queue per tenant)            |
|   | - Sharded by workspace_id             |                      |                               |
|   | - Row-Level Security (RLS) Enforced   |                      v                               |
|   | - Read Replicas for search & exports  |             [ AWS S3 Object Storage ]                |
|   +---------------------------------------+                                                      |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
    components: [
      {
        name: 'WebSocket Gateway Fleet',
        role: 'Terminates persistent user connections, multiplexes channel subscriptions, and fans out CRDT mutations.',
        scalingStrategy: 'Horizontally scaled Go/Rust servers behind an AWS Network Load Balancer (NLB) using sticky connection routing by doc_id.'
      },
      {
        name: 'Document Engine Service',
        role: 'Validates permissions, reconciles concurrent CRDT state vectors, and writes canonical blocks to PostgreSQL.',
        scalingStrategy: 'Stateless Kubernetes deployments with HPA scaling on CPU and queue depth.'
      },
      {
        name: 'Sharded PostgreSQL Storage',
        role: 'Durable ACID persistence for workspace documents, blocks, and relational views.',
        scalingStrategy: 'Horizontally partitioned across 32 database shards by `workspace_id`. Large enterprise tenants isolated on dedicated database instances.'
      }
    ],
    requestLifecycle: [
      '1. User types a sentence into a document: client computes Yjs/CRDT delta locally in 0ms.',
      '2. Client sends delta message over WebSocket to Ws-Gateway.',
      '3. Ws-Gateway publishes delta to Redis Pub/Sub topic `doc:{doc_id}`.',
      '4. Redis Pub/Sub fans out delta to other active editors on that document in < 15ms.',
      '5. In parallel, Document Service batches deltas (100ms window) and persists canonical block update to PostgreSQL shard.',
      '6. Change Data Capture (Debezium) picks up committed row and streams event to Elasticsearch for full-text indexing.'
    ],
    databaseDesign: 'PostgreSQL with composite primary key `(workspace_id, doc_id, block_id)`. Row-Level Security (RLS) enforced at the database kernel. PgBouncer transaction pooling handles 10,000+ client connections.',
    cachingStrategy: 'Multi-layer caching: Local in-memory LRU cache on Ws-Gateway for hot document state vectors (5-minute TTL); Redis cluster for workspace metadata, user permission masks, and active editor presence.',
    messagingStrategy: 'Redis Pub/Sub for sub-10ms ephemeral peer-to-peer editor updates; Apache Kafka for persistent delta streaming, audit logging, and asynchronous search index syncing.',
    scalingTechniques: [
      'Application-level sharding by workspace_id',
      'PgBouncer connection pooling to mitigate connection starvation',
      'CRDT state compaction: periodically squashing 10,000 delta events into a single snapshot block in S3',
      'Deficit Round Robin background queues for file exports to prevent noisy neighbor starvation'
    ],
    failureScenarios: [
      {
        failure: 'Primary PostgreSQL Shard 4 hardware failure',
        impact: 'Workspaces on Shard 4 experience read/write interruption.',
        mitigation: 'Multi-AZ synchronous replica promoted automatically via Patroni within 25 seconds; WebSocket gateways buffer in-flight client deltas in memory and retry with exponential backoff.'
      },
      {
        failure: 'One enterprise tenant launches an automated script generating 50,000 API requests/sec',
        impact: 'Potential CPU starvation on shared API gateways.',
        mitigation: 'Token Bucket rate limiter at Envoy Gateway throttles the offending workspace_id to its tier limit (1,000 RPS) with HTTP 429 without affecting other workspaces.'
      }
    ],
    securityThreats: [
      {
        threat: 'Cross-Tenant Data Leak via ORM query bug',
        defense: 'PostgreSQL Row-Level Security (RLS) policies enforced in the database kernel: `USING (workspace_id = current_setting(\'app.current_workspace\'))`.'
      },
      {
        threat: 'Stolen API Token replay',
        defense: 'API tokens are cryptographically hashed with SHA-256; scoped strictly to specific workspaces; can be revoked instantly via Redis blacklist.'
      }
    ],
    observabilityPlan: {
      logs: 'Structured JSON logs with workspace_id, user_id, and trace_id ingested into Grafana Loki.',
      metrics: 'Prometheus metrics tracking RED method per workspace tier: websocket_connections_active, crdt_sync_duration_seconds, db_query_duration_p99.',
      traces: 'OpenTelemetry distributed traces propagated across WebSocket -> Gateway -> Doc Service -> PostgreSQL with W3C traceparent headers.'
    },
    costDrivers: [
      'Sharded PostgreSQL RDS instances (32 instances * $450/mo = $14,400/mo)',
      'Cross-AZ data transfer between WebSocket gateways and database shards (~$3,500/mo)',
      'AWS S3 storage for document version history and media attachments (~$8,000/mo)'
    ],
    tradeOffsSacrificed: [
      'Global cross-workspace search is eventually consistent (synced to Elasticsearch via Kafka) to avoid cross-shard relational joins.',
      'Real-time CRDT updates require higher memory overhead on clients and WebSocket gateways than simple locked document editing.'
    ],
    alternativeArchitecture: 'Operational Transformation (OT) with a centralized lock server (Google Docs model). Rejected because OT requires all operations to pass through a single serialized server thread, making offline-first editing and peer-to-peer sync significantly more complex than CRDTs.',
    interviewDiscussion: [
      {
        question: 'Why did you choose CRDTs (Conflict-Free Replicated Data Types) over Operational Transformation (OT) for document sync?',
        keyTalkingPoints: [
          'CRDTs are mathematically commutative and associative: operations can be merged in ANY order without a central coordinator.',
          'Enables seamless offline editing: a user on a plane can edit for 3 hours and merge state upon landing with zero merge conflicts.',
          'OT requires a central server to establish total operational ordering; if the server connection drops, the client cannot safely resolve transforms.'
        ]
      },
      {
        question: 'How do you handle a single workspace with 500,000 documents without exceeding PostgreSQL partition performance limits?',
        keyTalkingPoints: [
          'Store document metadata (title, permissions, tree parent) in PostgreSQL, but offload the deep nested block JSON and historical delta changelogs to AWS S3 / DynamoDB.',
          'Implement virtual scrolling and windowed pagination: client queries only the active visible viewport of blocks (`LIMIT 50`) rather than loading the entire document tree.'
        ]
      }
    ]
  },
  {
    id: 'cs-iaas-compute-engine',
    number: 2,
    title: 'Cloud Virtual Machine Provisioning Platform (IaaS / AWS EC2)',
    problem: 'Design an elastic Infrastructure-as-a-Service (IaaS) compute platform capable of provisioning, scheduling, attaching storage, and running virtual machines across 100,000 physical server racks with sub-10 second boot times and absolute hardware security.',
    requirements: {
      functional: [
        'On-demand VM creation (`POST /v1/instances`) with configurable CPU, RAM, OS image, and VPC',
        'Dynamic EBS-style network block storage attachment and detachment',
        'Software-defined networking with custom VPC IP subnets and security group stateful firewalls',
        'Live VM migration for host maintenance with zero TCP disconnection (< 100ms pause)',
        'Instance lifecycle controls: start, stop, reboot, terminate, snapshot'
      ],
      nonFunctional: [
        'Provisioning latency: VM reachable via SSH in < 15 seconds',
        'Data Plane Autonomy: running VMs must NEVER be affected by control plane outages',
        'Security: Strict physical hardware and hypervisor isolation between customer VMs',
        'Scheduler scale: Able to schedule 50,000 new VMs per minute across 10 regional Availability Zones'
      ]
    },
    scaleAssumptions: {
      users: '500,000 cloud customer accounts',
      dauMau: '2,500,000 active running virtual machines concurrently',
      rps: 'Control Plane: 2,000 API requests/sec. Data Plane: Billions of network packets and disk IOPS per second.',
      peakRps: 'Peak 10,000 provisioning requests/sec during regional customer autoscaling events',
      storage: '20 Petabytes of attached network block storage; 100 Terabytes of operating system images in S3.',
      bandwidth: 'Physical datacenter fabric: 100 Gbps to each server rack using Clos (Leaf-Spine) topology.',
      readWriteRatio: 'Control Plane: 10:1 Read (describing instances) to Write (launching/terminating)',
      calculationsStepByStep: [
        'Fleet size: 50,000 physical server chassis (each with 128 physical cores, 512GB RAM).',
        'Active VMs: 2.5M VMs across 50,000 hosts = average 50 VMs per physical host.',
        'Scheduling throughput: 10,000 VM launch requests/sec during peak spikes.',
        'Scheduler latency requirement: < 100ms to evaluate host constraints and claim host capacity.'
      ]
    },
    apiDesign: [
      {
        endpoint: '/v1/instances',
        method: 'POST',
        description: 'Provision a new virtual machine instance.',
        sampleRequest: '{\n  "instance_type": "c6g.2xlarge",\n  "image_id": "ami-ubuntu-24-04",\n  "subnet_id": "subnet-088f",\n  "security_groups": ["sg-web-tier"],\n  "key_name": "prod-ssh-key"\n}',
        sampleResponse: '{\n  "instance_id": "i-09fba331",\n  "status": "pending",\n  "private_ip": "10.0.1.42",\n  "created_at": "2026-09-05T09:00:00Z"\n}'
      },
      {
        endpoint: '/v1/instances/{instance_id}/volumes',
        method: 'POST',
        description: 'Attach a remote block storage volume to a running instance.',
        sampleRequest: '{\n  "volume_id": "vol-0012ab",\n  "device": "/dev/xvdf"\n}'
      }
    ],
    dataModel: [
      {
        entity: 'physical_hosts',
        storageEngine: 'Distributed Consensus Store (etcd / Spanner)',
        schemaDefinition: 'host_id UUID PRIMARY KEY, rack_id TEXT, az_id TEXT, total_vcpus INT, free_vcpus INT, total_ram_mb INT, free_ram_mb INT, status TEXT, heartbeat TIMESTAMPTZ',
        notes: 'Continuously updated by host health agents every 5 seconds.'
      },
      {
        entity: 'instances',
        storageEngine: 'PostgreSQL Control Plane Cluster',
        schemaDefinition: 'instance_id TEXT PRIMARY KEY, tenant_id UUID, host_id UUID, instance_type TEXT, status TEXT, vpc_id UUID, private_ip INET, mac_address MACADDR',
        notes: 'State machine: pending -> scheduling -> provisioning -> booting -> running -> terminating -> terminated.'
      }
    ],
    highLevelArchitectureAscii: `
+--------------------------------------------------------------------------------------------------+
|                    IAAS COMPUTE ENGINE CONTROL & DATA PLANE                                      |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [ Customer API / Terraform ] ---> ( API Gateway / Auth / Quota Engine )                        |
|                                                    |                                             |
|                                                    v                                             |
|   +------------------------------------------------------------------------------------------+   |
|   | CONTROL PLANE                                                                            |   |
|   |   +--------------------------+       +-----------------------------------------------+   |   |
|   |   | Instance Orchestrator    | <---> | Distributed Host Placement Scheduler          |   |   |
|   |   | (Saga State Coordinator) |       | (Multi-dimensional bin packing: CPU, RAM, AZ) |   |   |
|   |   +--------------------------+       +-----------------------------------------------+   |   |
|   |                |                                      |                                  |   |
|   |                v                                      v                                  |   |
|   |   [ VPC IPAM Allocation Engine ]        [ Storage Volume Controller (EBS) ]              |   |
|   +------------------------------------------------------------------------------------------+   |
|                                    | (Async gRPC over Private Management Network)                |
|                                    v                                                             |
|   +------------------------------------------------------------------------------------------+   |
|   | DATA PLANE (Physical Host Server Rack)                                                   |   |
|   |   +----------------------------------------------------------------------------------+   |   |
|   |   | Local Host Agent Daemon (C++ / Rust)                                             |   |   |
|   |   |  - Talks to KVM / Nitro Hypervisor via /dev/kvm                                  |   |   |
|   |   |  - Programs hardware ASIC PCIe SmartNIC with customer VNI & Security Groups      |   |   |
|   |   |  - Maps NVMe-over-Fabrics remote block storage target                            |   |   |
|   |   +----------------------------------------------------------------------------------+   |   |
|   |                                                                                          |   |
|   |   [ Customer VM 1 ]    [ Customer VM 2 ]    [ Customer VM 3 ] (Zero hypervisor tax!)     |   |
|   +------------------------------------------------------------------------------------------+   |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
    components: [
      {
        name: 'Placement Scheduler',
        role: 'Evaluates multi-dimensional bin packing constraints (CPU, RAM, GPU, Anti-Affinity, Spread) to choose physical host chassis in < 50ms.',
        scalingStrategy: 'Partitioned by Availability Zone with shared-state optimistic concurrency reservation in etcd.'
      },
      {
        name: 'SmartNIC Hardware Offload (Nitro Card)',
        role: 'Executes VXLAN/Geneve network packet encapsulation, security group firewall state checking, and NVMe block storage I/O at 100 Gbps wire speed.',
        scalingStrategy: 'Hardware ASICs built into every physical server motherboard.'
      },
      {
        name: 'Block Storage Fabric Controller',
        role: 'Manages NVMe-over-TCP / NVMe-oF network connections between physical compute hosts and remote storage clusters.',
        scalingStrategy: 'Clustered controllers with automated multipath I/O (MPIO) failover.'
      }
    ],
    requestLifecycle: [
      '1. Customer sends `POST /v1/instances`. Gateway validates IAM permissions and account vCPU quotas.',
      '2. IPAM Service allocates private IP `10.0.1.42` from tenant VPC subnet pool.',
      '3. Placement Scheduler queries AZ host inventory, filters hosts lacking 8 vCPUs or 32GB RAM, scores candidates for thermal balance, and claims Host #4201.',
      '4. Orchestrator issues gRPC command to Host #4201 Local Agent.',
      '5. Host Agent calls SmartNIC to configure virtual ENI with MAC, IP, and Security Group rules in hardware.',
      '6. Host Agent calls Remote Storage Controller to attach boot volume via NVMe-oF.',
      '7. Host Agent launches KVM virtual machine using Firecracker/QEMU; vCPUs start executing Linux bootloader.',
      '8. VM boots in 4.2 seconds; cloud-init fetches instance metadata via link-local `169.254.169.254`.'
    ],
    databaseDesign: 'Spanner / CockroachDB for global cluster inventory and host state. Linearizable consistency ensures no physical host is ever double-booked for CPU or RAM.',
    cachingStrategy: 'Local memory cache on schedulers for candidate host capacity with randomized subset evaluation (scoring random 50 hosts rather than scanning 10,000).',
    messagingStrategy: 'gRPC over mutual TLS between Control Plane and Host Agents with heartbeat streams; RabbitMQ for long-running asynchronous VM snapshot workflows.',
    scalingTechniques: [
      'Hardware offloading (Nitro) to eliminate hypervisor CPU/RAM overhead',
      'Two-tier scheduling: filtering out 99% of hosts via bitmasks before scoring',
      'Pre-warmed boot volume caching: common base OS images cached on NVMe storage directly at the top-of-rack switch'
    ],
    failureScenarios: [
      {
        failure: 'Physical Host Server power supply failure',
        impact: 'All VMs running on that single physical chassis crash.',
        mitigation: 'Top-of-rack health agent detects missed heartbeat after 3 seconds; Auto-Recovery orchestrator launches replacement VMs on healthy hosts and re-attaches existing EBS volumes.'
      },
      {
        failure: 'Control Plane API Gateway outage',
        impact: 'Customers cannot create or delete VMs.',
        mitigation: 'Zero Data Plane Impact: existing running VMs, network packet flows, and attached block storage continue functioning with 100% throughput.'
      }
    ],
    securityThreats: [
      {
        threat: 'Cross-VM Side-Channel Attack (Spectre / Meltdown / Cache Timing)',
        defense: 'Hypervisor enforces core scheduling (threads of the same physical core are NEVER shared between different customer VMs) and flushes L1 cache on context switch.'
      },
      {
        threat: 'SSRF attack against Instance Metadata Service (IMDS)',
        defense: 'IMDSv2 mandates session-oriented PUT request with `X-aws-ec2-metadata-token-ttl-seconds` header, preventing SSRF credential theft.'
      }
    ],
    observabilityPlan: {
      logs: 'Host kernel dmesg and KVM hypervisor event logs streamed to central security monitoring.',
      metrics: 'Hardware counters: PCIe bus utilization, SmartNIC packet drop rate, CPU thermal throttling, ECC memory corrected errors.',
      traces: 'End-to-end VM provisioning traces tracking latency across API -> Scheduler -> IPAM -> Host Agent -> Boot.'
    },
    costDrivers: [
      'Server hardware capital expenditures (Chassis, CPUs, RAM, NVMe, SmartNICs)',
      'Datacenter power and cooling infrastructure (PUE efficiency)',
      'Dark fiber cross-datacenter interconnect lease fees'
    ],
    tradeOffsSacrificed: [
      'Over-committing CPU/RAM increases hosting margins but introduces "noisy neighbor" performance jitter; production cloud mandates zero or minimal memory overcommit.',
      'Hardware SmartNIC offload requires massive upfront silicon engineering R&D compared to standard commodity software virtualization.'
    ],
    alternativeArchitecture: 'Pure Container Hosting (Kubernetes on Bare Metal). Rejected because containers share the host Linux kernel syscall boundary, failing multi-tenant untrusted security isolation requirements demanded by public cloud customers.',
    interviewDiscussion: [
      {
        question: 'Why must the Data Plane have zero runtime dependencies on the Control Plane in IaaS design?',
        keyTalkingPoints: [
          'Customers run mission-critical 99.999% applications inside their VMs.',
          'The control plane is a complex distributed system subject to deployments, database migrations, and network blips.',
          'If hypervisors had to query the control plane to forward network packets or write disk blocks, every control plane hiccup would crash millions of running customer servers.'
        ]
      },
      {
        question: 'How does live migration transfer a running VM between physical hosts with under 100ms pause time?',
        keyTalkingPoints: [
          'Phase 1: Pre-copy memory iterations while the VM continues executing on Host A, transferring modified dirty pages over high-speed 100 Gbps network.',
          'Phase 2: Once dirty page generation rate exceeds network transfer rate, pause VM execution for < 50ms.',
          'Phase 3: Transfer final remaining dirty memory pages and CPU register state to Host B.',
          'Phase 4: Host B issues Gratuitous ARP on datacenter network, shifting VM IP mapping to the new switch port immediately.'
        ]
      }
    ]
  },
  {
    id: 'cs-saas-metering-billing',
    number: 3,
    title: 'High-Throughput Real-Time Metering & Billing Engine (Stripe / Snowflake)',
    problem: 'Design a financial-grade usage-based metering and billing engine capable of ingesting 200,000 usage events per second, computing sliding-window consumption aggregates, handling mid-cycle subscription changes, and generating penny-accurate monthly invoices.',
    requirements: {
      functional: [
        'Real-time ingestion of raw consumption events (API requests, LLM tokens, GB-hours)',
        'Sliding window and calendar billing cycle aggregation (daily, monthly)',
        'Support for complex pricing models: tiered, graduated, volume, minimum commitments, overages',
        'Mid-cycle subscription adjustments with exact second-level proration',
        'Stripe / Payment gateway webhook synchronization with automated dunning state machine'
      ],
      nonFunctional: [
        'Billing Accuracy: 100% financial correctness; zero duplicate charges, zero lost consumption',
        'Throughput: 200,000 events/sec sustained ingestion with 3x peak headroom (600k events/sec)',
        'Query Latency: In-app real-time customer usage dashboard loads in < 200ms',
        'Idempotency: Guaranteed exactly-once event processing semantics end-to-end'
      ]
    },
    scaleAssumptions: {
      users: '100,000 business tenants',
      dauMau: '200,000,000 usage events per day',
      rps: 'Average 2,300 events/sec. Peak: 15,000 events/sec. Enterprise spikes: 50,000 events/sec.',
      peakRps: 'Peak 50,000 ingestion events/sec',
      storage: '200M events/day * 200 bytes = 40 GB/day raw data. 1.2 TB/month. Aggregated usage tables: 50 GB.',
      bandwidth: 'Ingress: 50,000 * 200 B = 10 MB/s sustained. Negligible network bottleneck.',
      readWriteRatio: '100:1 Write (metering ingestion) to Read (invoice generation & dashboard queries)',
      calculationsStepByStep: [
        'Daily events: 200 Million events.',
        'Average ingestion rate = 200,000,000 / 86,400 ≈ 2,314 events/sec.',
        'Peak ingestion rate (burst during customer batch jobs) = 15,000 to 50,000 events/sec.',
        'Event size: `{tenant_id, metric, quantity, timestamp, idempotency_key}` ≈ 200 bytes.',
        'Raw daily storage = 40 GB. After stream aggregation (hourly compaction): < 200 MB/day.'
      ]
    },
    apiDesign: [
      {
        endpoint: '/api/v1/metering/events',
        method: 'POST',
        description: 'Batch ingest consumable usage events from client microservices.',
        sampleRequest: '{\n  "events": [\n    {\n      "idempotency_key": "evt_llm_9841a",\n      "tenant_id": "tenant_acme",\n      "metric": "llm_tokens",\n      "quantity": 1420,\n      "timestamp": 1757062800\n    }\n  ]\n}',
        sampleResponse: '{\n  "accepted": 1,\n  "failed": 0\n}'
      },
      {
        endpoint: '/api/v1/tenants/{tenant_id}/usage/summary',
        method: 'GET',
        description: 'Query current billing cycle aggregated usage and projected invoice total.'
      }
    ],
    dataModel: [
      {
        entity: 'usage_ledger_hourly',
        storageEngine: 'PostgreSQL TimescaleDB / ClickHouse',
        schemaDefinition: 'tenant_id UUID, metric_name TEXT, bucket_hour TIMESTAMPTZ, total_quantity NUMERIC(18, 4), PRIMARY KEY (tenant_id, metric_name, bucket_hour)',
        notes: 'Updated via atomic upserts (`ON CONFLICT DO UPDATE SET total_quantity = total_quantity + EXCLUDED.total_quantity`).'
      },
      {
        entity: 'subscriptions',
        storageEngine: 'PostgreSQL Relational DB',
        schemaDefinition: 'subscription_id UUID PRIMARY KEY, tenant_id UUID, plan_id UUID, status TEXT, current_period_start TIMESTAMPTZ, current_period_end TIMESTAMPTZ, stripe_subscription_id TEXT',
        notes: 'Core financial state machine tracking billing cycle anchors.'
      }
    ],
    highLevelArchitectureAscii: `
+--------------------------------------------------------------------------------------------------+
|                    HIGH-THROUGHPUT REAL-TIME METERING & BILLING ENGINE                           |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Application Microservices (API Gateway, Workers, LLM Proxies)                                  |
|          |                                                                                       |
|          v                                                                                       |
|   [ Ingestion Edge Fleet (Go/Rust HTTP) ] ---> Fast Buffer Acknowledgement (< 5ms)               |
|          |                                                                                       |
|          v                                                                                       |
|   [ Apache Kafka Cluster: "metering.events" ]                                                    |
|      - Partitioned by 'tenant_id' (Guarantees per-tenant order)                                  |
|      - High-throughput commit log with 7-day retention                                          |
|          |                                                                                       |
|          v                                                                                       |
|   [ Stream Aggregation Engine (Apache Flink / Redis TimeSeries) ]                                |
|      - Deduplicates events using 'idempotency_key' in sliding 1-hour Redis filter                |
|      - Aggregates events into 1-Hour Tumbling Windows: Sum(tokens), Count(calls)                |
|          |                                                                                       |
|          v                                                                                       |
|   [ TimescaleDB / ClickHouse Usage Ledger ]                                                      |
|      - Stores compacted hourly summaries: (tenant_id, metric, hour, total_quantity)              |
|          |                                                                                       |
|          v                                                                                       |
|   [ Billing Rating Engine & Invoice Generator ]                                                  |
|      - Runs at end of billing cycle: evaluates tiered pricing rules & commitments               |
|      - Generates immutable financial invoice & syncs with Stripe Billing                         |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
    components: [
      {
        name: 'Ingestion Edge Collector',
        role: 'Accepts batch event payloads over HTTPS, validates JSON schema, and publishes directly to Kafka.',
        scalingStrategy: 'Horizontally scaled Go web services behind an Application Load Balancer.'
      },
      {
        name: 'Stream Aggregation Cluster (Flink)',
        role: 'Consumes Kafka events, enforces exactly-once idempotency, and computes hourly metric totals.',
        scalingStrategy: 'Scaled by Kafka partition count (e.g., 64 partitions = 64 parallel consumer slots).'
      },
      {
        name: 'Rating & Invoicing Service',
        role: 'Executes pricing formulas (tiers, discounts, credits) against aggregated ledger rows to create finalized invoices.',
        scalingStrategy: 'Partitioned worker fleet executing scheduled jobs per tenant billing anchor.'
      }
    ],
    requestLifecycle: [
      '1. LLM Proxy service completes token generation: sends `{tenant_acme, llm_tokens, 1420, evt_9841a}` to Ingestion Collector.',
      '2. Collector validates schema and produces to Kafka topic `metering.events` with key `tenant_acme`. Returns HTTP 202 Accepted in 4ms.',
      '3. Flink worker reads event, checks Bloom filter / Redis cache for `evt_9841a`. If new, includes in current 1-hour tumbling window.',
      '4. At window close, Flink flushes aggregated delta (+1420) to PostgreSQL TimescaleDB using atomic UPSERT.',
      '5. On the 1st of the month: Invoicing engine queries total monthly tokens (12,450,000), applies graduated pricing tier ($0.002 / 1k), computes $24.90 charge.',
      '6. Rating service creates finalized PDF invoice and calls Stripe Invoicing API.'
    ],
    databaseDesign: 'Double-entry bookkeeping ledger: raw rows are immutable. Corrections are made via compensating credit/debit adjustments, never via SQL `UPDATE`.',
    cachingStrategy: 'Redis cache for active tenant plan pricing rules and current month-to-date estimated spend totals.',
    messagingStrategy: 'Apache Kafka with key-based partitioning on tenant_id; ensures all events for a given tenant are processed in strict chronological order by the same consumer thread.',
    scalingTechniques: [
      'Pre-aggregation: compacting 100,000 raw events into 1 database row per hour reduces database write IOPS by 99.99%',
      'Bloom filters at stream edge for sub-millisecond duplicate detection',
      'Partitioning database ledger by billing period month (`2026_09`, `2026_10`)'
    ],
    failureScenarios: [
      {
        failure: 'Kafka broker node crash',
        impact: 'Replication factor of 3 ensures zero data loss; Kafka partition leader re-elected in < 2 seconds.',
        mitigation: 'Producers use `acks=all` so no event is acknowledged until written to quorum replicas.'
      },
      {
        failure: 'Stripe Webhook delivery failure (Customer payment fails)',
        impact: 'Customer account should not be charged or shut down prematurely.',
        mitigation: 'System enters Dunning State Machine: transitions subscription to `past_due`, maintains service for 3-day grace period, and executes automated retries.'
      }
    ],
    securityThreats: [
      {
        threat: 'Spoofed metering events sent by malicious tenant',
        defense: 'Internal service-to-service mTLS; public API calls authenticated with signed HMAC tokens verifying tenant ownership.'
      },
      {
        threat: 'Double-charging customer during network timeout',
        defense: 'Client-provided `Idempotency-Key` passed to Stripe API; Stripe returns identical original charge without re-billing.'
      }
    ],
    observabilityPlan: {
      logs: 'Audit trail of every rating calculation and invoice status transition stored in immutable S3 Glacier archives.',
      metrics: 'Kafka consumer group lag, ingestion_events_per_second, rating_engine_calculation_seconds, failed_webhooks_total.',
      traces: 'Distributed trace from user API call -> metering event -> Kafka -> Flink -> Ledger.'
    },
    costDrivers: [
      'Managed Kafka cluster (Confluent Cloud / AWS MSK) (~$1,200/mo)',
      'Payment processor gateway transaction fees (Stripe 2.9% + 30¢)',
      'TimescaleDB / RDS database storage and IOPS (~$800/mo)'
    ],
    tradeOffsSacrificed: [
      'Dashboard usage displays a 2-minute stream processing lag rather than sub-second real-time reflection to allow tumbling window aggregation efficiency.',
      'Storing raw immutable events for 90 days increases storage costs compared to dropping raw events immediately after aggregation.'
    ],
    alternativeArchitecture: 'Synchronous Direct Updates (App calls database `UPDATE tenant SET balance = balance - 1`). Rejected because concurrent row locking on the tenant record creates catastrophic database deadlocks at 5,000 writes/second.',
    interviewDiscussion: [
      {
        question: 'How do you guarantee that a network retry does not charge a customer twice?',
        keyTalkingPoints: [
          'End-to-end idempotency key: client generates a unique UUID for the financial operation.',
          'Database enforces unique constraint on `(tenant_id, idempotency_key)`.',
          'Pass the idempotency key down to the Stripe API (`Idempotency-Key` header); Stripe caches responses for 24 hours.'
        ]
      },
      {
        question: 'How does your system handle proration when a tenant upgrades mid-month?',
        keyTalkingPoints: [
          'Calculate unused days on old plan: `Old_Price * (Remaining_Days / Total_Days)`.',
          'Calculate cost of new plan for remaining days: `New_Price * (Remaining_Days / Total_Days)`.',
          'Charge the exact net delta immediately, or apply credit to next month’s invoice.'
        ]
      }
    ]
  }
];
