import { Chapter } from '../../types';

export const PART15_CHAPTER: Chapter = {
  id: 'part15-auth-identity',
  part: 15,
  partTitle: 'Part 15 — Authentication & Identity Platform',
  chapterNumber: 15,
  title: 'Authentication & Enterprise Identity Platform',
  subtitle: 'Enterprise SSO (SAML 2.0 / OIDC), SCIM Directory Sync, RBAC, ABAC & Token Architecture',
  summary: 'In enterprise B2B SaaS, identity management is the primary gatekeeper of corporate trust. Enterprise IT departments mandate Single Sign-On (SSO) via Okta, Microsoft Entra ID (Azure AD), automated employee lifecycle provisioning via SCIM, and fine-grained authorization via Role-Based (RBAC) and Attribute-Based Access Control (ABAC).',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                       ENTERPRISE SAML 2.0 SSO AUTHENTICATION FLOW                                |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. User navigates to "app.saas.com" and enters corporate email "alice@corp.com"                 |
|          |                                                                                       |
|          v                                                                                       |
|   2. SaaS SP (Service Provider) looks up domain "corp.com" -> Identity Provider (IdP: Okta)     |
|      Generates SAML AuthnRequest (Base64 + Signed with SP Private Key)                           |
|          |                                                                                       |
|          v                                                                                       |
|   3. Browser redirects to Okta IdP Login: HTTP 302 with SAMLRequest                              |
|          |                                                                                       |
|          v                                                                                       |
|   4. User authenticates on Okta (Password + MFA Push Notification)                               |
|          |                                                                                       |
|          v                                                                                       |
|   5. Okta generates signed XML SAML Assertion (SAMLResponse)                                     |
|      Contains: NameID (alice@corp.com), Groups (["Engineering", "Admins"]), Signature            |
|          |                                                                                       |
|          v                                                                                       |
|   6. Browser HTTP POST (SAMLResponse) back to SaaS SP Assertion Consumer Service (ACS)           |
|          |                                                                                       |
|          v                                                                                       |
|   7. SaaS SP verifies Okta X.509 Certificate & Signature                                         |
|      Extracts user attributes, auto-provisions user row, issues session JWT                      |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Enterprise SSO: SAML 2.0 vs. OpenID Connect (OIDC)',
      confidence: 'stable',
      simpleDefinition: 'SAML 2.0 uses XML messages to federate enterprise logins; OIDC uses JSON and OAuth 2.0 REST flows for modern web and mobile authentication.',
      whyItExists: 'Enterprise IT requires central control over user access. When an employee is fired, disabling their Okta account must instantly revoke access to all corporate SaaS tools.',
      analogy: 'SAML is a wax-sealed diplomatic letter in archaic parchment (XML). OIDC is a modern digital ID card with a QR code and cryptographic chip (JSON). Both prove who you are, but OIDC is easier for mobile and web apps to read.',
      technicalExplanation: 'SAML 2.0 (Security Assertion Markup Language): Service Provider (SP, your SaaS) redirects user to Identity Provider (IdP, Okta/Azure AD) with `SAMLRequest`. IdP authenticates user, generates a signed XML `SAMLResponse`, and POSTs it to the SP Assertion Consumer Service (ACS) endpoint. The SP verifies the XML signature using the IdP’s X.509 public cert. OIDC (OpenID Connect): Built on OAuth 2.0. SP redirects to IdP `/authorize`; user logs in; IdP returns an authorization code; SP backend exchanges code for an `id_token` (JWT signed via RS256/ES256) and `access_token`. Public keys are retrieved dynamically from `/.well-known/jwks.json`.',
      example: 'Enterprise customers in the Fortune 500 will not purchase your SaaS unless you support SAML SSO and SCIM provisioning (often known as the "SSO Tax").',
      whenToUse: [
        'Support SAML 2.0 for legacy enterprise Identity Providers (Active Directory Federation Services / ADFS, Okta).',
        'Support OIDC for modern cloud identity providers (Google Workspace, Auth0, Microsoft Entra ID).'
      ],
      whenNotToUse: [
        'Never roll your own raw XML cryptographic parser for SAML—XML signature wrapping attacks (XSW) are notoriously easy to exploit. Use audited libraries (Passport-SAML, Box SAML).'
      ],
      commonMistakes: [
        'Failing to validate SAML Audience Restriction and Recipient URLs, allowing an attacker to replay a SAML assertion intended for a different application.'
      ],
      interviewQuestion: {
        question: 'What is an XML Signature Wrapping (XSW) attack in SAML 2.0, and how do you prevent it?',
        answer: 'In an XSW attack, an adversary intercepts a legitimate SAML assertion, modifies the user identity (e.g., changes `alice@corp.com` to `admin@corp.com`), and inserts the modified assertion into a cloned XML tree while leaving the original signed assertion intact elsewhere in the payload. If the service provider’s XML parser validates the signature against the original block but evaluates business logic on the cloned forged block, the attacker gains unauthorized admin access. Prevent it by using strict XML schema validation and hardened parsers that ensure the signed element is identical to the evaluated element.'
      }
    },
    {
      title: 'Automated Lifecycle Management: SCIM 2.0',
      confidence: 'stable',
      simpleDefinition: 'SCIM (System for Cross-domain Identity Management) is an HTTP REST standard that allows Okta or Azure AD to automatically create, update, and deactivate users in your SaaS app.',
      whyItExists: 'Without SCIM, IT admins must manually create user accounts in your app when employees are hired, and manually click "Delete" when they leave—a major security compliance violation.',
      analogy: 'An automated HR sync: when HR adds an employee in their central payroll system, the employee automatically gets an email account, a Slack account, and a SaaS login without anyone touching a keyboard.',
      technicalExplanation: 'SCIM 2.0 (RFC 7643 / RFC 7644) standardizes REST endpoints: `GET/POST /scim/v2/Users`, `PUT/PATCH /scim/v2/Users/{id}`, `GET/POST /scim/v2/Groups`. When an employee joins, Okta sends `POST /scim/v2/Users` with name, email, department, and role. When the employee is terminated, Okta sends `PATCH /scim/v2/Users/{id}` with `active: false`. Your app immediately deactivates the user and revokes all active session tokens.',
      example: 'An IT admin assigns the "Sales Team" group in Okta to your CRM SaaS. SCIM automatically provisions accounts for 50 sales reps in your database within seconds.',
      whenToUse: ['Implement SCIM 2.0 when selling to mid-market and enterprise B2B customers requiring SOC2 and ISO27001 compliance.'],
      whenNotToUse: ['Not required for consumer B2C or early self-serve prosumer SaaS.'],
      commonMistakes: [
        'Hard-deleting user records on SCIM deactivation: deleting rows destroys historical foreign key audit references (e.g., invoices generated by that user). Always soft-delete (`status = \'DEACTIVATED\'`).'
      ],
      interviewQuestion: {
        question: 'How do you handle SCIM PATCH requests that modify user group memberships efficiently in SQL?',
        answer: 'SCIM PATCH operations often send group membership deltas (adding 2 members, removing 1 member from a group of 5,000 users). If the app attempts to delete all group rows and re-insert 5,000 rows, it triggers heavy lock contention and performance degradation. The correct approach is to parse the SCIM PATCH `Operations` array: execute targeted `INSERT ... ON CONFLICT DO NOTHING` for additions and `DELETE ... WHERE user_id IN (...)` for removals inside a single transaction.'
      }
    },
    {
      title: 'Authorization Engines: RBAC vs. ABAC & Policy as Code',
      confidence: 'stable',
      simpleDefinition: 'RBAC grants permissions based on user roles (Admin, Editor, Viewer); ABAC grants permissions based on dynamic attributes (user department, document security level, IP location, time of day).',
      whyItExists: 'Simple RBAC breaks down when permissions depend on context: "A Doctor can only view Patient records if they are currently on duty in the same hospital ward."',
      analogy: 'RBAC is an all-access backstage pass labeled "VIP". ABAC is a smart biometric door that checks: Is your pass VIP? Are you wearing safety goggles? Is the laboratory in an emergency lockdown? Is it between 9 AM and 5 PM?',
      technicalExplanation: 'RBAC (Role-Based Access Control): User -> Roles -> Permissions. Easy to model in SQL (`user_roles`, `role_permissions`). Suffers from "Role Explosion" when custom rules proliferate (e.g., `Billing_Admin_NorthAmerica_Read_Only`). ABAC (Attribute-Based Access Control): Evaluates Boolean logic over attributes: `Subject` (user attributes), `Resource` (document attributes), `Action` (read, write), `Environment` (IP, time). Modern systems decouple authorization into Policy Engines (Open Policy Agent / OPA, AWS Cedar, Zanzibar) using Policy-as-Code (Rego).',
      example: 'Google Zanzibar is the global authorization system powering Google Drive ("Alice can view doc if Alice has read permission OR doc is shared with Alice’s group OR doc is public").',
      whenToUse: [
        'Use RBAC for straightforward SaaS permissions (Owner, Admin, Member, Guest).',
        'Use ABAC / Policy Engines (OPA, Cedar, Permit.io) for complex multi-attribute enterprise compliance.'
      ],
      whenNotToUse: [
        'Do not build a complex Zanzibar-scale distributed graph authorization engine when your app only has 3 static roles.'
      ],
      commonMistakes: [
        'Hardcoding authorization checks deep in business logic (`if (user.role === "admin" || user.department === "sales")`): this makes audits impossible and prevents enterprise customers from customizing roles.'
      ],
      interviewQuestion: {
        question: 'What is Google Zanzibar and how does it achieve sub-10ms distributed authorization at global scale?',
        answer: 'Google Zanzibar (USENIX ATC 2019) is a global relationship-based access control (ReBAC) system. It models permissions as a directed graph of entity-relation tuples: `(object, relation, user)`. Zanzibar achieves ultra-low latency and global consistency by: (1) Storing ACL tuples in Google Spanner; (2) Using "Zookies" (consistency tokens based on TrueTime) to prevent the "new enemy" authorization bug without holding global locks; (3) Aggressively caching graph traversal evaluations in-memory with Leopard indexing; (4) Concurrent graph evaluation with deduplication of sub-queries.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Role-Based Access Control (RBAC)',
    technologyB: 'Attribute-Based Access Control (ABAC / Policy-as-Code)',
    comparisonDimensions: [
      {
        dimension: 'Implementation Complexity',
        optionA: 'Trivial. 3 relational database tables in PostgreSQL.',
        optionB: 'High. Requires dedicated policy engine (OPA), Rego syntax, DSL testing.',
        verdict: 'RBAC wins for 80% of standard SaaS applications.'
      },
      {
        dimension: 'Expressiveness & Granularity',
        optionA: 'Rigid. Hard to express contextual or time-based rules.',
        optionB: 'Virtually unlimited. Can evaluate any JSON attribute or environmental factor.',
        verdict: 'ABAC wins for complex healthcare, legal, and financial platforms.'
      },
      {
        dimension: 'Maintainability at Scale',
        optionA: 'Suffers from Role Explosion (hundreds of custom roles).',
        optionB: 'Centralized policies version-controlled in Git.',
        verdict: 'ABAC wins as enterprise permission complexity grows.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Enterprise SSO uses SAML 2.0 (XML) or OIDC (JSON) to delegate auth to corporate IdPs (Okta).',
      'SCIM 2.0 automates user provisioning and deactivation directly from the corporate identity directory.',
      'Never hard-delete user records on SCIM deactivation; soft-delete to preserve audit trails.',
      'RBAC assigns permissions to roles; ABAC evaluates dynamic attributes of subject, resource, and environment.',
      'Decouple authorization logic from business code using Policy-as-Code engines (OPA, Cedar).'
    ],
    conceptualQuestions: [
      {
        id: 'q15-1',
        question: 'What is the "New Enemy" problem in distributed authorization systems?',
        answer: 'Suppose Alice revokes Bob’s access to a document, then shares the document with Charlie. If Charlie reads a fresh copy of the document while Bob’s revocation is delayed due to replication lag, Bob could read the document after Alice intended to revoke him. Zanzibar solves this using cryptographic tokens (Zookies) that ensure authorization checks are evaluated at a timestamp equal to or greater than the revocation timestamp.'
      },
      {
        id: 'q15-2',
        question: 'What is the difference between an ID Token and an Access Token in OIDC?',
        answer: 'An ID Token is a JWT meant for the CLIENT application to consume; it contains profile identity assertions (name, email, avatar). An Access Token is an opaque or structured token meant for the RESOURCE SERVER (API); it authorizes the bearer to access specific API scopes.'
      },
      {
        id: 'q15-3',
        question: 'What is Just-In-Time (JIT) provisioning in SAML SSO?',
        answer: 'JIT provisioning automatically creates a new user account in the SaaS application the very first time an employee logs in via SAML SSO, using attributes from the SAML assertion, without requiring prior manual invitation.'
      }
    ],
    designExercises: [
      {
        id: 'de15-1',
        scenario: 'A B2B SaaS platform wants to support multi-tenant Enterprise SSO where each corporate customer uses their own independent Okta or Azure AD identity provider.',
        task: 'Design the identity provider discovery and authentication routing architecture.',
        solutionGuide: '1. On login screen, prompt user for email address. 2. Extract domain (`@nike.com`). 3. Look up domain in Tenant SSO Directory: find `IdP_Entity_ID`, `SSO_URL`, and `X509_Certificate`. 4. If SSO is configured, generate a signed `SAMLRequest` specifying the customer’s dedicated Entity ID and redirect the browser to the customer’s Okta login. 5. When Okta posts the SAML response to `/sso/saml/acs`, look up the matching tenant cert, verify signature, extract email and groups, and establish a session.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq15-1',
        question: 'How do you design a secure API key generation and authentication service for third-party developers?',
        answer: '1. Generate high-entropy 256-bit random keys with a distinguishable prefix (e.g., `sk_live_2f8a...`). 2. Store only the cryptographically salted hash (SHA-256 or bcrypt) in the database. 3. Display the full key to the user ONCE upon creation. 4. In the database, store `key_prefix` (first 6 characters) and `key_suffix` (last 4 characters) for UI identification. 5. On incoming API calls, extract the key from `Authorization: Bearer <key>`, hash it, and query `WHERE key_hash = SHA256(incoming_key)`. 6. Cache valid key hashes in Redis with a 5-minute TTL to bypass database lookups.'
      }
    ],
    practicalTask: {
      title: 'Verify SAML Assertion Invariants',
      instructions: 'List the 5 mandatory security checks a Service Provider must execute before accepting a SAML 2.0 Assertion.',
      verification: '1. Verify XML digital signature using IdP public X.509 cert; 2. Verify current timestamp is within `[NotBefore, NotOnOrAfter]`; 3. Verify `AudienceRestriction` matches SP Entity ID; 4. Verify `Recipient` attribute matches SP Assertion Consumer Service (ACS) URL; 5. Verify `InResponseTo` matches the original AuthnRequest ID to prevent replay attacks.'
    }
  },
  sources: [
    {
      title: 'RFC 7644: SCIM Protocol Specification',
      url: 'https://datatracker.ietf.org/doc/html/rfc7644',
      type: 'RFC / Standard',
      whatItSupports: 'Standard REST API endpoints, operations, and schemas for automated identity provisioning.'
    },
    {
      title: 'Zanzibar: Google’s Consistent, Global Authorization System',
      url: 'https://research.google/pubs/pub48190/',
      type: 'Research Paper',
      whatItSupports: 'Pang et al. (USENIX ATC 2019): Global relation-based access control, Zookies, and TrueTime consistency.'
    }
  ],
  videos: [
    {
      title: 'OAuth 2.0 and OpenID Connect (in plain English)',
      creator: 'OktaDev (Nate Barbettini)',
      duration: '55m',
      difficulty: 'Beginner',
      whatYouWillLearn: 'Clear, comprehensive explanation of OAuth 2.0 flows, tokens, and OIDC identity federation.',
      url: 'https://www.youtube.com/watch?v=996OiexHze0'
    }
  ]
};

export const PART16_CHAPTER: Chapter = {
  id: 'part16-observability',
  part: 16,
  partTitle: 'Part 16 — Observability & Telemetry Engineering',
  chapterNumber: 16,
  title: 'Observability: Metrics, Logs, Traces & SLO Engineering',
  subtitle: 'OpenTelemetry, Prometheus, Grafana, Distributed Tracing, RED Method & Error Budgets',
  summary: 'Observability is the ability to infer the internal state of a complex system based on its external outputs. In distributed microservices, traditional server monitoring (CPU/RAM graphs) is inadequate. Modern observability unifies the Three Pillars of Telemetry—Metrics, Distributed Tracing, and Structured Logging—anchored by Google SRE Service Level Objectives (SLOs).',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                           OPENTELEMETRY DISTRIBUTED TRACING PIPELINE                             |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Frontend Browser (W3C traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01)    |
|          |                                                                                       |
|          v                                                                                       |
|   +------------------------------------------------------------------------------------------+   |
|   | API GATEWAY: SPAN 1 (Duration: 120ms)                                                    |   |
|   |   - Authenticates JWT (10ms)                                                             |   |
|   |   - Routes to Order Service (traceparent injected into HTTP headers)                     |   |
|   +------------------------------------------------------------------------------------------+   |
|          |                                                                                       |
|          v                                                                                       |
|   +------------------------------------------------------------------------------------------+   |
|   | ORDER SERVICE: SPAN 2 (Child of Span 1, Duration: 95ms)                                  |   |
|   |   - Query PostgreSQL (Span 3: 15ms)                                                      |   |
|   |   - gRPC Call Payment Service (Span 4: 70ms)                                             |   |
|   +------------------------------------------------------------------------------------------+   |
|          |                                                                                       |
|          v                                                                                       |
|   +------------------------------------------------------------------------------------------+   |
|   | PAYMENT SERVICE: SPAN 4 (Child of Span 2, Duration: 70ms)                                |   |
|   |   - Calls Stripe API (Span 5: 65ms - Identifies exact bottleneck!)                       |   |
|   +------------------------------------------------------------------------------------------+   |
|                                                                                                  |
|   Telemetry Pipeline:                                                                            |
|   App Pods -> [ OpenTelemetry Collector (OTel) ] -> OTLP Export -> [ Prometheus / Jaeger / Loki ]|
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'The Three Pillars: Metrics vs. Logs vs. Traces',
      confidence: 'stable',
      simpleDefinition: 'Metrics track aggregate numbers over time (counters, gauges, histograms); Logs record discrete text events with context; Traces track the end-to-end journey of a single request across multiple microservices.',
      whyItExists: 'Metrics tell you THAT something is wrong. Traces show you WHERE it is wrong. Logs show you WHY it is wrong.',
      analogy: 'Metrics are the dashboard gauges in your car (speedometer, engine temperature). Traces are the GPS tracking breadcrumbs showing your exact travel route through the city. Logs are the black box flight recorder storing exact sensor readings at the moment of an accident.',
      technicalExplanation: 'Metrics (Prometheus, Datadog): Highly aggregatable, low storage footprint, constant storage size regardless of traffic volume. Best for alerting. Formats: Counters (monotonically increasing), Gauges (fluctuating value), Histograms (distribution of values into buckets, essential for p95/p99 latency). Logs (Fluentd, Loki, Elasticsearch): Structured JSON containing timestamp, severity, message, and metadata (`tenant_id`, `user_id`). High cardinality, expensive storage. Distributed Traces (OpenTelemetry, Jaeger): Context-propagated DAG (Directed Acyclic Graph) of Spans. Each span has a name, start/end time, attributes, and events. Tracing is the ONLY pillar that reveals network fan-out and downstream RPC dependencies.',
      example: 'A user’s checkout times out. Alert fires on Metric (`p99_latency > 2s`). Engineer opens Trace for the slow request ID and sees that Span 4 (`PaymentService -> Stripe`) took 1.95s. Engineer checks Log for Span 4 and sees: `Stripe API connection timeout; retrying`.',
      whenToUse: ['Unify all three pillars using OpenTelemetry (OTel) standards rather than proprietary vendor SDKs.'],
      whenNotToUse: ['Do not use high-cardinality values (e.g., raw UUIDs or email addresses) as Prometheus metric labels—it causes a cardinality explosion that crashes Prometheus memory.'],
      commonMistakes: [
        'Logging unstructured plaintext (`console.log("error in query: " + err)`): unsearchable at scale. Always output structured JSON with consistent schema.'
      ],
      interviewQuestion: {
        question: 'What is metric cardinality explosion in Prometheus and how do you prevent it?',
        answer: 'In Prometheus, every unique combination of key-value label pairs creates a separate time-series in memory. If an engineer adds a label with unbounded unique values—such as `user_id`, `order_id`, or `email`—to a metric (e.g., `http_requests_total{user_id="uuid-1234"}`), 10 million users create 10 million distinct time-series. This saturates Prometheus RAM, causes severe thrashing, and crashes the monitoring server. Prevent it by strictly restricting metric labels to low-cardinality enums (e.g., `http_status`, `method`, `handler_name`) and keeping high-cardinality IDs exclusively in Traces and Logs.'
      }
    },
    {
      title: 'SLIs, SLOs, SLAs, and Error Budgets (Google SRE)',
      confidence: 'stable',
      simpleDefinition: 'An SLI is what you measure; an SLO is your internal reliability goal; an SLA is the legal contract with customers; an Error Budget is the allowable room for failure (100% - SLO).',
      whyItExists: '100% uptime is mathematically impossible and financially ruinous to pursue. Error budgets establish a rational contract between product velocity and system reliability.',
      analogy: 'SLI is a thermometer reading 98.6°F. SLO is your personal health goal to stay under 100°F 99% of the days. SLA is your work contract: if your temperature exceeds 102°F for 3 days, you get fired. Error budget is your allowable sick days.',
      technicalExplanation: 'Service Level Indicator (SLI): A quantifiable metric: `Good Events / Total Valid Events * 100`. Example: `(Count of HTTP requests where status < 500 AND latency < 200ms) / Total HTTP requests`. Service Level Objective (SLO): Target percentage over a compliance window (e.g., 99.9% over rolling 30 days). Service Level Agreement (SLA): External contractual commitment with financial penalties/credits (e.g., 99.5%). Error Budget: `100% - SLO` (for 99.9% SLO, error budget is 0.1% = 43.8 minutes downtime per month). If the error budget is exhausted, deployments are frozen and all engineering effort pivots to reliability hardening.',
      example: 'Google SRE uses Error Budget Burn Rate alerts: an alert fires if the service is burning through 5% of its monthly error budget within a 1-hour window.',
      whenToUse: ['Define SLOs for user-facing user journeys (checkout, login, search) rather than individual low-level infrastructure components.'],
      whenNotToUse: ['Do not set internal SLOs equal to customer SLAs—always maintain an internal safety buffer (e.g., SLO = 99.9%, SLA = 99.5%).'],
      commonMistakes: [
        'Measuring availability from inside the cluster rather than from the user’s perspective: if the internal pods report 100% uptime but the external CDN or DNS is misconfigured, users experience an outage that internal SLIs completely miss.'
      ],
      interviewQuestion: {
        question: 'What is Multi-Window Multi-Burn-Rate Alerting in Google SRE practice?',
        answer: 'Traditional alerting on single threshold spikes causes alert fatigue from brief transient blips, while long-window alerts detect real outages too late. Multi-window multi-burn-rate alerting monitors both short-term windows (e.g., 1 hour, 14.4x burn rate = 2% budget consumed in 1 hour) AND long-term windows (e.g., 6 hours, 6x burn rate = 5% budget consumed) simultaneously. An alert only pages an on-call engineer if BOTH the short-term and long-term burn rates exceed thresholds, achieving rapid incident detection with near-zero false alarms.'
      }
    },
    {
      title: 'OpenTelemetry (OTel) & Context Propagation',
      confidence: 'stable',
      simpleDefinition: 'OpenTelemetry is the vendor-neutral open-source standard for instrumenting, generating, collecting, and exporting metrics, logs, and traces.',
      whyItExists: 'Proprietary vendor agent SDKs (Datadog, New Relic, Dynatrace) lock your codebase into a single commercial platform. OTel allows you to switch backends with zero code changes.',
      analogy: 'A universal USB-C port: any accessory can connect, and any charger can provide power. OTel is the universal connector for all observability data.',
      technicalExplanation: 'OpenTelemetry consists of: (1) OTel API: Standard language interfaces to create traces and metrics in code. (2) OTel SDK: Implements batching, sampling (Head-based vs Tail-based), and exporting. (3) Context Propagation: Injects and extracts W3C Trace Context headers (`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`) across HTTP/gRPC boundaries. (4) OTel Collector: A proxy binary that receives telemetry via OTLP (OpenTelemetry Protocol over gRPC/Protobuf), processes/filters it, and exports to backends (Jaeger, Prometheus, ClickHouse, Datadog).',
      example: 'A Go microservice instruments its HTTP handler with OTel middleware. The trace context is forwarded to a Node.js microservice, which forwards to PostgreSQL. The OTel Collector exports the unified trace to Jaeger.',
      whenToUse: ['Always instrument application code using OpenTelemetry API rather than proprietary vendor SDKs.'],
      whenNotToUse: ['Do not collect 100% of all traces in high-volume systems (100,000 RPS)—use adaptive sampling (e.g., sample 1% of successful requests and 100% of errors).'],
      commonMistakes: [
        'Breaking context propagation in asynchronous worker tasks: if an asynchronous job runner drops the `traceparent` metadata, the trace is cut in half and downstream spans appear as disconnected orphan traces.'
      ],
      interviewQuestion: {
        question: 'What is the difference between Head-based sampling and Tail-based sampling in distributed tracing?',
        answer: 'Head-based sampling makes the sampling decision at the very beginning of a request (at the API gateway). It is simple and fast, but completely blind to the outcome: if you sample 1% of traffic, you only capture 1% of your errors, missing 99% of debugging data. Tail-based sampling buffers ALL spans across all microservices until the entire trace completes. The collector evaluates the finished trace: if any span returned an error (HTTP 500) or high latency (duration > 1s), the entire trace is retained 100%; standard fast requests are sampled down to 1%. It captures 100% of interesting anomalies at low storage cost.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Prometheus Pull-Based Metric Scraping',
    technologyB: 'StatsD / OpenTelemetry Push-Based Metric Emission',
    comparisonDimensions: [
      {
        dimension: 'Target Discovery & Health',
        optionA: 'Built-in. Prometheus discovers pods via K8s API; if scrape fails, host is dead.',
        optionB: 'Blind. Cannot distinguish between a dead service and an idle service.',
        verdict: 'Pull model wins for cluster infrastructure monitoring.'
      },
      {
        dimension: 'Ephemeral Serverless Workloads',
        optionA: 'Poor. Lambda functions finish before Prometheus can scrape them.',
        optionB: 'Seamless. Serverless function pushes metrics before terminating.',
        verdict: 'Push model wins for AWS Lambda and short-lived batch jobs.'
      },
      {
        dimension: 'Network Firewall Traversal',
        optionA: 'Requires opening inbound firewall ports on application pods.',
        optionB: 'Standard outbound network traffic over port 4317.',
        verdict: 'Push model wins across strict multi-VPC corporate firewalls.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Metrics tell you THAT; Traces tell you WHERE; Logs tell you WHY.',
      'Never use high-cardinality values (UUIDs, emails) as Prometheus metric labels.',
      'SLI = Actual measurement; SLO = Internal target; SLA = External legal contract.',
      'Error Budget = 100% - SLO; freeze feature releases when budget is exhausted.',
      'OpenTelemetry provides vendor-neutral instrumentation with W3C context propagation.'
    ],
    conceptualQuestions: [
      {
        id: 'q16-1',
        question: 'What is the RED Method in microservice monitoring?',
        answer: 'The RED Method (Tom Wilkie) focuses on user-facing service metrics: Rate (number of requests per second), Errors (number of failing requests per second), and Duration (distribution of request latency, specifically p50, p90, and p99 percentiles).'
      },
      {
        id: 'q16-2',
        question: 'What is the USE Method in infrastructure monitoring?',
        answer: 'The USE Method (Brendan Gregg) focuses on hardware and server resources: Utilization (percentage of time resource was busy, e.g., CPU busy time), Saturation (extra work queued, e.g., run queue length, memory swap), and Errors (hardware error counts).'
      },
      {
        id: 'q16-3',
        question: 'How do you structure JSON application logs for optimal indexing?',
        answer: 'Every log line should be valid JSON containing: `timestamp` (ISO 8601 UTC), `level` (INFO, WARN, ERROR), `service` (name), `trace_id` (OTel W3C trace), `span_id`, `tenant_id`, `message`, and structured `context` objects.'
      }
    ],
    designExercises: [
      {
        id: 'de16-1',
        scenario: 'A distributed e-commerce platform with 40 microservices experiences intermittent checkout delays during peak hours.',
        task: 'Design an end-to-end OpenTelemetry observability architecture.',
        solutionGuide: '1. Instrument all services with OpenTelemetry SDK using auto-instrumentation for HTTP, gRPC, and database drivers. 2. Propagate W3C `traceparent` headers across all RPC calls. 3. Deploy OpenTelemetry Collector DaemonSets on all Kubernetes worker nodes. 4. Configure Tail-based sampling on the collectors: retain 100% of traces with HTTP status >= 500 or latency > 1,000ms, and 1% of normal 200 OK traces. 5. Export metrics to Prometheus and traces to Jaeger. 6. Build Grafana dashboards showing RED metrics per service with one-click drill-down to trace spans.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq16-1',
        question: 'How would you define meaningful SLIs and SLOs for an asynchronous message processing pipeline?',
        answer: 'For an async message pipeline (e.g., order processing via Kafka): (1) Consumer Latency SLI: Time elapsed from when the message was published to when processing completes. SLO: 99% of messages processed in < 5 seconds over 30 days. (2) Processing Success SLI: `Count(Successfully processed messages) / Count(Total messages pulled from queue)`. SLO: 99.99% success rate. (3) Queue Lag SLI: Maximum message offset lag. SLO: Queue lag < 1,000 messages for 99% of 1-minute intervals.'
      }
    ],
    practicalTask: {
      title: 'Calculate Monthly Error Budget Consumption',
      instructions: 'A service handles 50,000,000 HTTP requests per month. Its target SLO is 99.95% availability. During an incident, the service returned 15,000 HTTP 500 errors. Calculate: (A) Total allowable monthly failed requests, (B) Number of failed requests during the incident, (C) Percentage of the monthly error budget consumed by this single incident.',
      verification: 'Allowable error budget rate = 100% - 99.95% = 0.05% = 0.0005. (A) Total Allowable Failed Requests = 50,000,000 * 0.0005 = 25,000 failures. (B) Failed Requests = 15,000. (C) Error Budget Consumed = (15,000 / 25,000) * 100 = 60.0%. This single incident consumed 60% of the entire monthly error budget.'
    }
  },
  sources: [
    {
      title: 'Google Site Reliability Engineering: Service Level Objectives',
      url: 'https://sre.google/sre-book/service-level-objectives/',
      type: 'Official Documentation',
      whatItSupports: 'SRE principles, defining SLIs/SLOs, choosing appropriate metrics, and managing error budgets.'
    },
    {
      title: 'OpenTelemetry Specification & Architecture',
      url: 'https://opentelemetry.io/docs/concepts/what-is-opentelemetry/',
      type: 'Official Documentation',
      whatItSupports: 'Data models for traces, metrics, logs, context propagation, and collector pipelines.'
    }
  ],
  videos: [
    {
      title: 'Distributed Systems 4.1: Clock synchronization',
      creator: 'Martin Kleppmann (University of Cambridge)',
      duration: '40m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'NTP synchronization, clock drift, and why timestamp ordering in distributed logging is inherently imprecise.',
      url: 'https://www.youtube.com/watch?v=mOHX12bsy-I'
    }
  ]
};
