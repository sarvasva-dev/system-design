import { Chapter } from '../../types';

export const PART13_CHAPTER: Chapter = {
  id: 'part13-multitenant-db',
  part: 13,
  partTitle: 'Part 13 — Multi-Tenant Database Design',
  chapterNumber: 13,
  title: 'Multi-Tenant Database Design & Sharding',
  subtitle: 'Row-Level Security, Schema-per-Tenant, Database-per-Tenant, and Sharding to Millions of Tenants',
  summary: 'Architecting multi-tenant databases requires choosing between shared tables, separate schemas, or dedicated databases—and scaling that architecture as the platform grows from 10 tenants to 100,000 to millions. Designing for multi-tenancy involves balancing operational complexity, query performance, noisy neighbor isolation, and tenant-level data destruction.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                   MULTI-TENANT DATABASE ARCHITECTURE COMPARISON                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   APPROACH 1: SHARED DATABASE + SHARED SCHEMA (Pooled Tables + RLS)                              |
|   +------------------------------------------------------------------------------------------+   |
|   | PostgreSQL Database: "production_db"                                                     |   |
|   |   Table: orders                                                                          |   |
|   |   [ tenant_id | order_id | amount | customer_name ]                                      |   |
|   |   [ 'acme'    | ord_001  | $40.00 | John Doe      ]  <-- Row-Level Security (RLS) Filter |   |
|   |   [ 'globex'  | ord_002  | $85.00 | Jane Smith    ]                                      |   |
|   +------------------------------------------------------------------------------------------+   |
|   - Pros: Simplest migrations, lowest cost, supports millions of tenants.                        |
|   - Cons: Requires strict RLS, potential noisy neighbor performance impact.                      |
|                                                                                                  |
|   APPROACH 2: SHARED DATABASE + SEPARATE SCHEMAS (Schema-per-Tenant)                             |
|   +------------------------------------------------------------------------------------------+   |
|   | PostgreSQL Database: "production_db"                                                     |   |
|   |   Schema "tenant_acme":   [ orders ] [ customers ] [ invoices ]                          |   |
|   |   Schema "tenant_globex": [ orders ] [ customers ] [ invoices ]                          |   |
|   +------------------------------------------------------------------------------------------+   |
|   - Pros: Logical separation, tenant-specific table extensions.                                  |
|   - Cons: PostgreSQL performance degrades past 10,000 schemas (DDL locking, catalog bloat).      |
|                                                                                                  |
|   APPROACH 3: DATABASE-PER-TENANT / SHARDED POOL                                                 |
|   +-------------------+       +-------------------+       +-------------------+                  |
|   | RDS Instance 1    |       | RDS Instance 2    |       | RDS Instance 3    |                  |
|   | (Tenants 0-33k)   |       | (Tenants 33k-66k) |       | (Tenants 66k-100k)|                  |
|   +-------------------+       +-------------------+       +-------------------+                  |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'The Three Multi-Tenant Database Patterns',
      confidence: 'stable',
      simpleDefinition: 'Pattern 1 shares tables using a `tenant_id` column; Pattern 2 uses separate PostgreSQL schemas inside one database; Pattern 3 gives each tenant a completely separate database instance.',
      whyItExists: 'There is a direct trade-off between infrastructure cost (lowest in shared tables) and physical isolation/backup granularity (highest in dedicated databases).',
      analogy: 'Shared table is students writing on the same whiteboard separated by colored markers. Schema-per-tenant is students having their own notebooks inside the same backpack. Database-per-tenant is each student having their own private locker and backpack.',
      technicalExplanation: 'Shared Table (Pooled): Every query filters by `tenant_id`. Handled via PostgreSQL RLS or application ORM middleware. Indexes MUST be composite: `CREATE INDEX idx_orders_tenant ON orders (tenant_id, created_at)`. Schema-per-Tenant: The app executes `SET search_path TO tenant_acme;`. Works well up to 1,000-2,000 schemas, but PostgreSQL system catalogs (`pg_class`, `pg_attribute`) bloat, and running `ALTER TABLE` across 20,000 schemas takes hours and locks the catalog. Database-per-Tenant: Absolute physical isolation, per-tenant point-in-time backups, but connection pooling is difficult and resource costs are high for small tenants.',
      example: 'Modern SaaS unicorns (Datadog, Notion, Stripe) use the Shared Table with Composite Sharding model to scale to millions of tenants on partitioned clusters.',
      whenToUse: [
        'Use Shared Tables with RLS for 95% of standard B2B SaaS applications.',
        'Use Database-per-Tenant for large enterprise tiers paying $50,000+/year requiring custom encryption keys and compliance isolation.'
      ],
      whenNotToUse: [
        'Do NOT use Schema-per-Tenant if you plan to scale past 5,000 tenants in PostgreSQL—catalog memory pressure and migration bottlenecks will degrade database stability.'
      ],
      commonMistakes: [
        'Creating single-column indexes on `tenant_id` alone: a single index on `tenant_id` is virtually useless when a tenant has 500,000 rows. Always build composite indexes: `(tenant_id, secondary_column)`.'
      ],
      interviewQuestion: {
        question: 'Why does the Schema-per-Tenant pattern break down in PostgreSQL when scaling to tens of thousands of tenants?',
        answer: 'PostgreSQL stores metadata for every table, index, and constraint in system catalog tables (`pg_class`, `pg_attribute`). If you have 50 tables per schema and 10,000 schemas, the database must track 500,000 tables and millions of attributes. This causes: (1) Severe system catalog cache bloat in RAM; (2) Shared memory lock contention during query planning; (3) DDL migrations (`ALTER TABLE`) must execute 10,000 times, holding catalog locks for hours; (4) Autovacuum background workers struggle to inspect hundreds of thousands of table files.'
      }
    },
    {
      title: 'PostgreSQL Row-Level Security (RLS) Deep Dive',
      confidence: 'stable',
      simpleDefinition: 'Row-Level Security is a PostgreSQL kernel feature that automatically filters rows returned by queries based on a security policy and the current session identity.',
      whyItExists: 'Preventing cross-tenant data leaks by relying solely on developers remembering to add `WHERE tenant_id = ?` to every SQL query in application code is a recipe for catastrophic data breach.',
      analogy: 'Tinted privacy glasses: whenever the application looks at the database, the glasses automatically make all rows belonging to other tenants completely invisible.',
      technicalExplanation: 'When RLS is enabled on a table (`ALTER TABLE orders ENABLE ROW LEVEL SECURITY;`), PostgreSQL rewrites every incoming SQL query inside the query planner to inject the security policy expression before executing the query plan. The application checks out a connection from PgBouncer and sets a session configuration parameter: `SET LOCAL app.current_tenant = \'tenant_123\';`. The policy: `CREATE POLICY tenant_isolation ON orders USING (tenant_id = current_setting(\'app.current_tenant\'));`. Even if an engineer writes `SELECT * FROM orders;`, the database kernel transforms it into `SELECT * FROM orders WHERE tenant_id = \'tenant_123\';`.',
      example: 'Supabase and PostGraphile rely on PostgreSQL RLS to allow frontend clients to query the database directly over GraphQL/REST with 100% tenant and user safety.',
      whenToUse: ['Mandatory for all shared multi-tenant relational tables.'],
      whenNotToUse: ['RLS adds a tiny query planning CPU overhead (~1-3%); ensure proper composite indexes exist on `(tenant_id, ...)` so the RLS filter is satisfied via index seeks.'],
      commonMistakes: [
        'Running database queries as the PostgreSQL `superuser` (postgres): superusers bypass Row-Level Security policies by default! Always run application connections as a non-superuser role, or explicitly specify `ALTER TABLE orders FORCE ROW LEVEL SECURITY;`.'
      ],
      interviewQuestion: {
        question: 'What is the performance overhead of Row-Level Security and how do you optimize it?',
        answer: 'The primary overhead is query planning time and index filtering. If the database engine has to evaluate `current_setting(\'app.current_tenant\')` for every row in a sequential scan, queries will be slow. Optimize by: (1) Marking `current_setting()` as `STABLE` or casting explicitly so it is evaluated once per query rather than once per row; (2) Ensuring every table has a composite index with `tenant_id` as the leading column (`CREATE INDEX ON orders (tenant_id, status, created_at)`); (3) Using `FORCE ROW LEVEL SECURITY` to prevent accidental bypass by table owners.'
      }
    },
    {
      title: 'Sharding Evolution: 10 -> 1,000 -> 100,000 -> Millions of Tenants',
      confidence: 'stable',
      simpleDefinition: 'As tenant count and data volume grow, the database architecture must evolve from a single primary database to read replicas, then to table partitioning, and finally to distributed sharding clusters.',
      whyItExists: 'A startup cannot afford the cost or complexity of a sharded database on day one, but an enterprise platform cannot survive on a single server.',
      analogy: 'Level 1: Running a small neighborhood bakery. Level 2: Adding assistant bakers (read replicas). Level 3: Adding specialized ovens (table partitioning). Level 4: Opening a global franchise with 50 industrial commercial bakeries across the continent (sharded cluster).',
      technicalExplanation: 'Scaling Roadmap: Phase 1 (1 to 1,000 tenants): Single PostgreSQL Primary + Read Replicas. Shared tables with RLS and composite indexes. Fits on single AWS RDS db.r6g instance. Phase 2 (1,000 to 50,000 tenants): Declarative Table Partitioning by `tenant_id` or date ranges. Add Redis caching layer for hot tenant metadata. Split heavy analytical queries to a read-only replica or ClickHouse warehouse. Phase 3 (50,000 to 1,000,000+ tenants): Horizontally Sharded Database Cluster (Citus, Vitess, CockroachDB, or application-level sharding). A centralized Tenant Directory maps `tenant_id -> Shard_ID`. Massive enterprise tenants are assigned dedicated single-tenant shards (Silo), while thousands of standard tenants are pooled across shared shards.',
      example: 'Slack sharded its database by team ID. Notion migrated from a single multi-terabyte PostgreSQL instance to an application-level sharded cluster of 48 PostgreSQL instances partitioned by workspace ID.',
      whenToUse: ['Follow the evolutionary roadmap: optimize single-node indexes and pooling first before undertaking distributed sharding migrations.'],
      whenNotToUse: ['Do not implement distributed sharding when your total database size is under 200GB—you will incur massive architectural complexity for zero benefit.'],
      commonMistakes: [
        'Sharding without a Tenant Directory routing layer: hardcoding shard mapping logic in application code makes rebalancing hot shards almost impossible.'
      ],
      interviewQuestion: {
        question: 'How do you rebalance a hot shard in a sharded multi-tenant database without downtime?',
        answer: 'Suppose Shard 3 is at 95% CPU because Tenant A grew exponentially. Steps to move Tenant A to Shard 8: (1) Set up continuous logical replication (CDC via Debezium or PostgreSQL logical replication) copying Tenant A’s rows from Shard 3 to Shard 8 in the background. (2) Wait for replication lag to reach near-zero (< 10ms). (3) Initiate a brief cutover window: acquire a write lock on Tenant A at the API Gateway (rejecting or buffering writes for < 1-2 seconds). (4) Verify final WAL records have replayed to Shard 8. (5) Update the centralized Tenant Directory: set `Tenant A -> Shard 8`. (6) Release the write lock; all subsequent traffic routes to Shard 8. (7) Asynchronously purge Tenant A’s historical rows from Shard 3.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Shared Database with Row-Level Security (RLS)',
    technologyB: 'Database-per-Tenant Architecture',
    comparisonDimensions: [
      {
        dimension: 'Cost Efficiency',
        optionA: 'Maximum. Hundreds of thousands of tenants share memory/CPU pools.',
        optionB: 'Poor. Idle compute overhead for small tenants, minimum RDS costs.',
        verdict: 'Shared tables win for self-serve pricing models.'
      },
      {
        dimension: 'Backup & Restore Granularity',
        optionA: 'Complex. Restoring Tenant A requires extracting rows from a dump.',
        optionB: 'Instant. Can restore, clone, or delete Tenant A’s database independently.',
        verdict: 'Database-per-tenant wins for enterprise compliance.'
      },
      {
        dimension: 'Schema Migration Velocity',
        optionA: 'Single execution (`ALTER TABLE`) updates all tenants instantly.',
        optionB: 'Must loop through and execute migrations on thousands of databases.',
        verdict: 'Shared tables win for rapid CI/CD deployment cadence.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Shared tables with composite indexes `(tenant_id, ...)` scale to millions of tenants at lowest cost.',
      'PostgreSQL RLS rewrites queries inside the kernel to enforce tenant isolation automatically.',
      'Schema-per-tenant degrades past 5,000-10,000 schemas due to system catalog lock contention.',
      'Scale evolution: Single DB -> Read Replicas -> Partitioning -> Horizontally Sharded Cluster.',
      'Hot shard rebalancing requires logical replication CDC, a brief write pause, and a Tenant Directory update.'
    ],
    conceptualQuestions: [
      {
        id: 'q13-1',
        question: 'What is a Tenant Directory (Lookup Service) in sharded architectures?',
        answer: 'A high-speed, cached key-value lookup service (stored in DynamoDB or Redis with PostgreSQL backup) that maps `tenant_id` to its physical database shard connection string, region, and isolation tier.'
      },
      {
        id: 'q13-2',
        question: 'Why should you avoid cross-shard joins in multi-tenant databases?',
        answer: 'Cross-shard joins require pulling datasets from multiple physical database instances over the network into an application server or proxy to perform nested loop joins in memory, destroying performance and breaking ACID guarantees.'
      },
      {
        id: 'q13-3',
        question: 'How do you handle GDPR "Right to be Forgotten" (data deletion) in multi-tenant databases?',
        answer: 'In shared tables, execute `DELETE FROM table WHERE tenant_id = $1` inside an asynchronous background job, followed by an autovacuum or table reorganization. In database-per-tenant, simply terminate and delete the tenant’s database instance.'
      }
    ],
    designExercises: [
      {
        id: 'de13-1',
        scenario: 'A B2B CRM SaaS is growing from 500 to 50,000 tenants. The primary PostgreSQL database CPU utilization is at 85% during business hours.',
        task: 'Design a phased scaling roadmap to relieve database pressure.',
        solutionGuide: 'Phase 1: Implement PgBouncer transaction connection pooling to eliminate connection overhead. Phase 2: Deploy 2 Read Replicas; route all read-only dashboard queries and export jobs to replicas using sticky read routing. Phase 3: Add Redis cache for hot tenant metadata, permissions, and organization settings. Phase 4: Implement declarative range partitioning on high-volume tables (e.g., `activity_logs`) by month. Phase 5: Audit indexes and ensure all queries leverage composite indexes with `tenant_id` as leading column.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq13-1',
        question: 'How do you design a multi-tenant indexing strategy in PostgreSQL?',
        answer: 'Never create an index on `tenant_id` alone. In a shared table with 10 million rows across 5,000 tenants, an index on `tenant_id` returns an average of 2,000 rows, forcing an expensive secondary filter and heap scan. Always create composite indexes where `tenant_id` is the leading column followed by the query filter columns: `CREATE INDEX idx_tickets ON tickets (tenant_id, status, created_at DESC)`. This allows the B-Tree index scan to seek directly to the tenant’s partition and scan only the relevant status and date range in a single O(log N) traversal.'
      }
    ],
    practicalTask: {
      title: 'Analyze Shard Key Distribution and Hotspotting',
      instructions: 'Given 10 database shards and a sharding formula `hash(tenant_id) % 10`: explain why a customer base where 1 tenant generates 70% of total write operations will cause shard failure, and propose a solution.',
      verification: 'Modulo hashing blindly places the giant tenant on a single shard (e.g., Shard 4). Shard 4 receives 70% of all write traffic plus its share of standard tenants, causing CPU and disk saturation while other shards sit idle. Solution: Implement a Tenant Routing Directory. Isolate the giant tenant onto a dedicated single-tenant shard (Silo model), and distribute the remaining 99.9% of small tenants across the shared shards.'
    }
  },
  sources: [
    {
      title: 'PostgreSQL Documentation: Row Security Policies',
      url: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html',
      type: 'Official Documentation',
      whatItSupports: 'Syntax, execution semantics, and performance considerations of PostgreSQL Row-Level Security.'
    }
  ],
  videos: [
    {
      title: 'AWS re:Invent 2022 - SaaS data partitioning: Multi-tenant storage patterns (SAS304)',
      creator: 'AWS Events',
      duration: '50m',
      difficulty: 'Advanced',
      whatYouWillLearn: 'Deep dive into pooled, silo, and hybrid storage models in SQL, NoSQL, and Object storage.',
      url: 'https://www.youtube.com/watch?v=kYJj3d4b1aI'
    }
  ]
};

export const PART14_CHAPTER: Chapter = {
  id: 'part14-billing',
  part: 14,
  partTitle: 'Part 14 — SaaS Billing & Metering Engine',
  chapterNumber: 14,
  title: 'SaaS Billing: Metering, Invoicing & Subscriptions',
  subtitle: 'Usage-Based Metering, Stripe Webhooks, Idempotency, Proration & Dunning State Machines',
  summary: 'Billing is the financial engine of SaaS. Building a production billing architecture requires tracking complex multi-tier subscriptions, aggregating millions of real-time usage events, handling payment gateway webhooks idempotently, computing mid-month plan change prorations, and gracefully managing failed payment recovery (dunning).',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                    HIGH-THROUGHPUT USAGE-BASED METERING PIPELINE                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. APPLICATION EVENT EMISSION                                                                  |
|      API Gateway / Worker: "Tenant 42 generated 1,500 LLM tokens"                                 |
|          |                                                                                       |
|          v                                                                                       |
|   2. HIGH-THROUGHPUT BUFFER (Apache Kafka / AWS Kinesis)                                         |
|      Topic: "metering.events" [ Key: tenant_42 ] (Ordered by tenant)                             |
|          |                                                                                       |
|          v                                                                                       |
|   3. STREAM AGGREGATION ENGINE (Apache Flink / Redis TimeSeries)                                 |
|      - Tumbling / Sliding 1-Hour Windows                                                         |
|      - Computes: Sum(tokens), Max(storage_gb), Count(api_calls)                                  |
|          |                                                                                       |
|          v                                                                                       |
|   4. TRANSACTIONAL USAGE LEDGER (PostgreSQL TimescaleDB)                                         |
|      INSERT INTO tenant_daily_usage (tenant_id, metric, date, quantity)                         |
|             VALUES ('tenant_42', 'llm_tokens', '2026-09-05', 450000)                             |
|             ON CONFLICT (tenant_id, metric, date) DO UPDATE SET quantity = quantity + EXCLUDED.qty; |
|          |                                                                                       |
|          v                                                                                       |
|   5. BILLING ENGINE / STRIPE SYNC (End of Billing Cycle)                                         |
|      - Queries aggregated usage: 13,500,000 tokens                                               |
|      - Computes tiered billing brackets ($0.002 / 1k tokens)                                     |
|      - Calls Stripe Usage Record API / Generates Invoice                                         |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Subscription Models & State Machines',
      confidence: 'stable',
      simpleDefinition: 'A subscription state machine manages the lifecycle of a customer’s access: Trialing -> Active -> Past Due -> Canceled -> Incomplete.',
      whyItExists: 'Customer credit cards expire, bank fraud filters block renewals, and customers upgrade or cancel mid-month. A robust state machine prevents service interruption while enforcing revenue collection.',
      analogy: 'A gym membership: you sign up with a 7-day free trial. On day 8, your card is charged and you become Active. If your card expires, you enter "Past Due" with a 3-day grace period before your badge is deactivated.',
      technicalExplanation: 'The canonical subscription states (matching Stripe Billing): (1) `trialing`: User has full access without charge until trial ends; (2) `active`: Payment succeeded, current billing period is valid; (3) `past_due`: Recurring charge failed. System enters Dunning loop (automated email retries over 3-7 days); (4) `unpaid`: Dunning exhausted, service access restricted; (5) `canceled`: User voluntarily canceled; access revoked at end of period (`cancel_at_period_end = true`) or immediately; (6) `incomplete`: Initial checkout requires 3D Secure customer authentication.',
      example: 'When a customer’s monthly $99 charge fails, the system transitions subscription state from `active` to `past_due`, displays a warning banner in the UI, and schedules 3 retry attempts before downgrading them to the Free tier.',
      whenToUse: ['Model all recurring revenue products using explicit state machines with defined transitions.'],
      whenNotToUse: ['Do not rely on a boolean `is_subscribed = true` flag in your user table—it cannot handle grace periods, trials, or failed payments.'],
      commonMistakes: [
        'Cutting off customer access the exact second a recurring payment fails: 80% of failed payments succeed on retry within 48 hours; instant cutoff causes unnecessary customer churn.'
      ],
      interviewQuestion: {
        question: 'How do you design a Dunning management system for failed SaaS subscription renewals?',
        answer: 'Dunning handles payment recovery: (1) When a payment fails (`invoice.payment_failed` webhook), transition subscription to `past_due` without disabling access; (2) Schedule automated smart retries (using Stripe Smart Retries or exponential retry on days 1, 3, 5, and 7); (3) Trigger automated transactional emails prompting the user to update their payment method; (4) Display an in-app persistent banner; (5) If all retries fail after 14 days, transition state to `canceled` or `unpaid` and revoke premium access.'
      }
    },
    {
      title: 'High-Throughput Usage-Based Metering Architecture',
      confidence: 'stable',
      simpleDefinition: 'Usage-based metering tracks and aggregates consumable metrics (API requests, compute minutes, gigabytes stored) in real time to bill customers accurately.',
      whyItExists: 'Modern SaaS (Snowflake, OpenAI, AWS) bills by consumption rather than flat monthly seats. Storing every raw event directly in a relational billing database crashes the database.',
      analogy: 'The electric meter on your house: it constantly measures kilowatt-hours as appliances run, but the electric company doesn’t send an invoice every time you turn on a light bulb; they bill you once a month for the total monthly kilowatt-hours.',
      technicalExplanation: 'Usage metering pipeline: (1) Emission: Services emit lightweight JSON telemetry events (`{tenant_id, metric, quantity, timestamp, idempotency_key}`); (2) Ingestion: Ingested into high-throughput append-only streams (Kafka / AWS Kinesis); (3) Stream Aggregation: Apache Flink, Redis, or TimescaleDB aggregates events into tumbling hourly time windows (`SUM(quantity) GROUP BY tenant_id, metric`); (4) Usage Ledger: Compacted hourly totals are written to a transactional SQL ledger; (5) Billing Synchronization: At the end of the billing cycle, the billing worker sums the ledger totals, applies tiered pricing curves (graduated pricing, volume pricing), and reports usage to the payment processor.',
      example: 'Twilio processes billions of SMS messages per day, meters each message through Kafka and stream aggregators, and updates the customer’s monthly balance ledger.',
      whenToUse: ['Use stream aggregation when event volume exceeds 100 events/second per tenant.'],
      whenNotToUse: ['Do not write raw unaggregated metering events directly to Stripe’s Metering API in real time—Stripe has strict API rate limits.'],
      commonMistakes: [
        'Failing to make metering events idempotent: if network retries cause the same 500 token usage event to be counted twice, the customer is overcharged, causing billing disputes.'
      ],
      interviewQuestion: {
        question: 'How do you guarantee that usage-based metering events are neither lost nor counted twice?',
        answer: 'You combine at-least-once delivery with end-to-end idempotency: (1) The client/worker assigns each usage event a deterministic UUID v4 `event_id` based on `hash(tenant_id, resource_id, timestamp_window)`; (2) The event is written to Kafka using transactional producers; (3) The stream consumer or database writes events using atomic upserts: `INSERT INTO usage_events (event_id, tenant_id, quantity) VALUES (...) ON CONFLICT (event_id) DO NOTHING;`; (4) If a worker crashes and replays Kafka events, the duplicate `event_id` is silently ignored by the database constraint, guaranteeing exactly-once billing integrity.'
      }
    },
    {
      title: 'Stripe Webhook Processing & Idempotency',
      confidence: 'stable',
      simpleDefinition: 'Webhooks are asynchronous HTTP POST notifications sent by payment gateways (Stripe) to alert your backend of billing events (payment succeeded, subscription canceled).',
      whyItExists: 'Customer payments often complete outside your app (e.g., bank redirects, 3D Secure SMS codes, automated bank debits). Webhooks are the only authoritative source of truth for payment completion.',
      analogy: 'A registered postal delivery: the mail carrier rings your doorbell, hands you the signed delivery receipt, and you stamp your internal ledger.',
      technicalExplanation: 'Webhook security and resilience invariants: (1) Signature Verification: Verify the `Stripe-Signature` HTTP header using the webhook signing secret and HMAC-SHA256 to prevent spoofed fake payments. (2) Idempotency Layer: Payment gateways retry webhooks for up to 72 hours if your server fails to respond. Store incoming `event.id` in a database `processed_webhooks` table. If the ID exists, immediately return HTTP 200 OK without re-executing logic. (3) Asynchronous Processing: Never execute long-running business logic (PDF invoice generation, database provisioning) inside the webhook handler; immediately acknowledge HTTP 200 OK to Stripe within 2 seconds and push the event to an internal background queue (RabbitMQ / SQS) for worker processing.',
      example: 'Stripe sends `customer.subscription.deleted`. Your webhook handler verifies signature, checks `event.id`, saves event to queue, and returns HTTP 200. A background worker picks up the job and revokes the tenant’s access.',
      whenToUse: ['Mandatory for all payment gateway integrations (Stripe, Adyen, Paddle, PayPal).'],
      whenNotToUse: ['Never update subscription access solely based on the frontend client browser callback—users can close their browser or tamper with JavaScript.'],
      commonMistakes: [
        'Executing heavy synchronous tasks in the webhook HTTP handler: if your server takes > 5 seconds to answer, Stripe times out and marks the webhook failed, triggering infinite retry storms.'
      ],
      interviewQuestion: {
        question: 'What happens if your Stripe webhook handler returns an HTTP 500 error, and how do you recover?',
        answer: 'If your server returns non-2xx or times out, Stripe considers the delivery failed. Stripe uses exponential backoff to retry webhook delivery for up to 72 hours (retrying at increasing intervals: 1hr, 2hr, 4hr, etc.). To recover: (1) Fix the application bug or database connection issue causing the 500 error; (2) The next Stripe retry will deliver the event; (3) For any webhooks that exhausted their 72-hour retry window, engineers can trigger automated manual redelivery via the Stripe Dashboard or API (`POST /v1/events/{id}/retry`).'
      }
    },
    {
      title: 'Proration & Mid-Cycle Plan Changes',
      confidence: 'stable',
      simpleDefinition: 'Proration calculates the financial credit or charge when a customer upgrades, downgrades, or cancels their subscription mid-billing cycle.',
      whyItExists: 'If a customer upgrades from a $30/month plan to a $300/month plan on day 15 of a 30-day month, they should only pay the difference for the remaining 15 days.',
      analogy: 'Moving to a nicer apartment mid-month: the landlord credits you for the unused days in your old apartment and charges you only for the remaining days in the luxury apartment.',
      technicalExplanation: 'Proration formula: (1) Calculate unused time on old plan: `Credit = (Old_Plan_Price / Total_Days_In_Period) * Remaining_Days`. (2) Calculate cost of new plan for remaining time: `Debit = (New_Plan_Price / Total_Days_In_Period) * Remaining_Days`. (3) Net Proration Amount = `Debit - Credit`. If upgrading, the net difference is charged immediately or added to the next monthly invoice. If downgrading, the customer receives a credit balance applied to future invoices.',
      example: 'A customer switches from Starter ($10/mo) to Pro ($100/mo) exactly halfway through the month (15 days remaining in a 30-day month). Unused Starter credit = $5. Pro charge for 15 days = $50. Net upgrade cost charged immediately = $50 - $5 = $45.',
      whenToUse: ['Apply proration logic to all SaaS subscription tiers when plans or seat counts change.'],
      whenNotToUse: ['Some enterprise contracts specify "no mid-term downgrades" or "annual non-refundable terms", in which case proration is disabled.'],
      commonMistakes: [
        'Calculating proration using a fixed 30-day assumption: calendar months have 28, 29, 30, or 31 days; always calculate based on exact seconds or exact calendar period days.'
      ],
      interviewQuestion: {
        question: 'How do you handle seat-based billing proration when a team adds 5 new members mid-month?',
        answer: 'Suppose a team pays $20/seat/month and adds 5 seats 10 days before the month ends. The system: (1) Checks current subscription anchor date; (2) Calculates remaining fraction of the cycle: `10 days / 30 days = 0.333`; (3) Computes prorated charge: `5 seats * $20 * 0.333 = $33.33`; (4) Updates Stripe subscription quantity from N to N+5 with `proration_behavior = \'always_invoice\'` (which immediately creates an invoice for $33.33 and charges the card on file).'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Third-Party Billing Platform (Stripe Billing / Paddle)',
    technologyB: 'In-House Custom Billing Engine',
    comparisonDimensions: [
      {
        dimension: 'Global Tax Compliance',
        optionA: 'Automated. Handles EU VAT, US state sales tax, GST automatically.',
        optionB: 'Nightmare. Must integrate Avalara/TaxJar and monitor tax law changes globally.',
        verdict: 'Stripe Billing wins decisively on international tax.'
      },
      {
        dimension: 'Payment Gateway Fees',
        optionA: 'High. Stripe charges ~2.9% + 30¢ plus 0.5%-0.8% for Billing.',
        optionB: 'Lower transaction fees via direct merchant acquirers (Adyen/Chase).',
        verdict: 'Custom engine wins only at massive scale ($100M+ ARR).'
      },
      {
        dimension: 'Time to Market',
        optionA: 'Days to weeks to launch subscriptions, customer portal, invoices.',
        optionB: '6 to 12 months of dedicated engineering time.',
        verdict: 'Third-party billing wins for virtually all startups.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Model subscriptions as formal state machines: Trialing -> Active -> Past Due -> Canceled.',
      'Never cut off customer access the exact second a payment fails; use smart Dunning retries.',
      'Usage metering requires stream aggregation (Kafka/Flink) before writing to billing ledgers.',
      'Stripe webhooks must verify cryptographic signatures and enforce idempotent event processing.',
      'Proration computes the net difference between unused old plan credits and new plan debits.'
    ],
    conceptualQuestions: [
      {
        id: 'q14-1',
        question: 'What is 3D Secure (3DS) and SCA in European payments?',
        answer: 'Strong Customer Authentication (SCA) under European PSD2 regulation requires multi-factor authentication (3D Secure) for online card payments. If a recurring charge requires 3DS, the subscription enters `incomplete` or `past_due`, and the customer must be prompted to authenticate via their mobile banking app.'
      },
      {
        id: 'q14-2',
        question: 'What is the difference between Graduated Pricing and Volume Pricing in usage tiers?',
        answer: 'In Volume Pricing, the tier reached by total usage applies to ALL units consumed (e.g., hitting 10,000 units drops the price of all 10,000 units to $0.05). In Graduated Pricing (Brackets), units are priced in tiers: the first 1,000 cost $0.10, the next 9,000 cost $0.08, and units beyond cost $0.05.'
      },
      {
        id: 'q14-3',
        question: 'Why should webhook endpoints return HTTP 200 before executing business logic?',
        answer: 'Payment gateways have short timeout windows (typically 2-5 seconds). If your server performs PDF generation or third-party CRM syncing synchronously, the gateway will timeout and repeatedly retry, causing duplicate processing.'
      }
    ],
    designExercises: [
      {
        id: 'de14-1',
        scenario: 'An AI API SaaS provides LLM inferences. Users pay $0.002 per 1,000 input tokens and $0.006 per 1,000 output tokens. The platform handles 200 million tokens per day.',
        task: 'Design the real-time token metering and monthly billing aggregation architecture.',
        solutionGuide: 'Each LLM worker emits a JSON event to Kafka topic `metering.tokens` containing `{tenant_id, input_tokens, output_tokens, timestamp, idempotency_key}`. A stream aggregation worker (Flink / Node.js with Redis) maintains hourly sliding windows summing tokens per tenant. Hourly compacted totals are written to a PostgreSQL `tenant_hourly_usage` table with a unique constraint on `(tenant_id, metric, hour)`. At midnight on the monthly billing anchor, a billing cron job queries total monthly tokens, computes tiered cost, and calls Stripe Usage Records API.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq14-1',
        question: 'How do you design a zero-loss, tamper-proof audit trail for enterprise billing disputes?',
        answer: 'Implement an immutable, append-only Double-Entry Bookkeeping Ledger: (1) Every financial transaction creates at least two ledger entries: a Debit and a Credit whose sum is exactly zero; (2) The ledger table is strictly append-only (no `UPDATE` or `DELETE` SQL permissions granted to any service); (3) To correct a billing mistake, append a new offsetting compensating transaction; (4) Cryptographically hash entries in a Merkle chain (each row stores `SHA256(previous_row_hash + row_data)`) so any manual tampering with historical rows is immediately detectable.'
      }
    ],
    practicalTask: {
      title: 'Calculate Mid-Month Proration for Subscription Upgrade',
      instructions: 'A customer on a $60/month plan upgrades to a $180/month plan on day 20 of a 30-day billing cycle. Calculate: (A) Unused credit from old plan, (B) Cost of new plan for remaining period, (C) Net upgrade amount charged immediately.',
      verification: 'Remaining days in period = 30 - 20 = 10 days. Fraction of period remaining = 10 / 30 = 1/3. (A) Unused Old Plan Credit = $60 * (1/3) = $20. (B) New Plan Cost for remaining period = $180 * (1/3) = $60. (C) Net Upgrade Amount = $60 - $20 = $40 charged immediately.'
    }
  },
  sources: [
    {
      title: 'Stripe Documentation: Designing a Subscription State Machine',
      url: 'https://docs.stripe.com/billing/subscriptions/overview',
      type: 'Official Documentation',
      whatItSupports: 'Subscription lifecycle states, webhook event handling, proration, and dunning.'
    }
  ],
  videos: [
    {
      title: 'Designing Events-First Microservices with Apache Kafka • David Higgins • GOTO 2020',
      creator: 'GOTO Conferences',
      duration: '43m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Event streaming, high-throughput event logging, and transaction state synchronization.',
      url: 'https://www.youtube.com/watch?v=1F3DEq8ML1U'
    }
  ]
};
