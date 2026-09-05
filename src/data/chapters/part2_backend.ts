import { Chapter } from '../../types';

export const PART2_CHAPTER: Chapter = {
  id: 'part2-backend',
  part: 2,
  partTitle: 'Part 2 — Backend Fundamentals',
  chapterNumber: 2,
  title: 'Backend Fundamentals & API Engineering',
  subtitle: 'From Monoliths to Modular Architectures, Idempotent APIs, and Token Security',
  summary: 'The backend service layer is the core orchestration plane where business logic, data persistence, security policies, and client interfaces converge. Designing robust backend services requires mastering architectural topologies, secure authentication delegation, robust API contracts, distributed rate limiting, and fault-tolerant request semantics.',
  diagramAscii: `
+--------------------------------------------------------------------------------------------------+
|                     IDEMPOTENT REQUEST & RATE LIMITING LIFECYCLE                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   Client Request (e.g. POST /api/v1/payments)                                                    |
|   Headers: [ Authorization: Bearer <JWT> ] [ Idempotency-Key: 7b8c-9a4f-1234 ]                   |
|          |                                                                                       |
|          v                                                                                       |
|   1. API GATEWAY: AUTHENTICATION & TENANT EXTRACTION                                             |
|      - Verify JWT signature using JWKS public keys (cached in memory)                            |
|      - Extract tenant_id = "tenant_492", user_id = "user_88"                                     |
|          |                                                                                       |
|          v                                                                                       |
|   2. DISTRIBUTED RATE LIMITER (Redis Token Bucket / Sliding Window)                              |
|      - Key: "ratelimit:tenant_492:payments"                                                      |
|      - Check token count: Exceeded? -> Return HTTP 429 Too Many Requests                         |
|          |                                                                                       |
|          v                                                                                       |
|   3. IDEMPOTENCY FILTER (Redis / PostgreSQL)                                                     |
|      - Query: "idempotency:tenant_492:7b8c-9a4f-1234"                                            |
|      - IF status == "COMPLETED": Return cached response payload immediately                      |
|      - IF status == "IN_FLIGHT": Reject with HTTP 409 Conflict (Concurrent retry)               |
|      - IF NOT FOUND: Set status = "IN_FLIGHT" with 120s TTL lock                                 |
|          |                                                                                       |
|          v                                                                                       |
|   4. TRANSACTIONAL BUSINESS EXECUTION                                                            |
|      - Database write inside ACID transaction (Charges ledger, generates invoice)               |
|      - Publish Event to Kafka: "PaymentProcessed"                                                |
|          |                                                                                       |
|          v                                                                                       |
|   5. FINALIZE IDEMPOTENCY RECORD & RETURN                                                        |
|      - Update status = "COMPLETED", store response body & status code (201 Created)              |
|      - Return 201 Created to caller                                                              |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'Monolith vs. Modular Monolith vs. Microservices',
      confidence: 'stable',
      simpleDefinition: 'A monolith runs all features in a single deployment unit; a modular monolith enforces strict code boundaries in one codebase; microservices break features into independently deployed network services.',
      whyItExists: 'Teams mistakenly adopt microservices to solve code quality issues, only to trade simple code complexity for crushing network and distributed operational complexity.',
      analogy: 'A monolith is a department store in a single building. A modular monolith is the same store with clean physical partitions and strict inventory rooms. Microservices is 50 separate boutique stores across the city, requiring delivery vans, traffic dispatchers, and radio coordination for every transaction.',
      technicalExplanation: 'A standard monolith shares memory and a single relational database. A modular monolith maintains logical domain boundaries (e.g., Domain-Driven Design bounded contexts) within a single artifact, strictly forbidding cross-module SQL joins and enforcing in-process public interfaces. Microservices separate services over network boundaries (REST, gRPC), requiring independent deployment pipelines, independent databases, distributed transactions (Sagas), service discovery, distributed tracing, and fault-tolerance patterns.',
      example: 'Shopify, GitHub, and Basecamp operate world-class platforms as modular monoliths serving tens of millions of requests per minute, whereas Netflix and Uber adopted microservices to accommodate thousands of engineers committing independently.',
      whenToUse: [
        'Start with a Monolith or Modular Monolith for virtually all new SaaS startups, MVPs, and teams under 50 engineers.',
        'Use Microservices only when team scale and deployment contention (hundreds of engineers blocking the release queue) outweigh the heavy tax of distributed systems.'
      ],
      whenNotToUse: [
        'Do NOT adopt microservices to "fix spaghetti code"—if you cannot write clean modular code in one repository, splitting it across 50 network boundaries produces a distributed unmaintainable disaster.'
      ],
      commonMistakes: [
        'Creating a "distributed monolith": services deployed separately but sharing a single database or requiring synchronized lock-step deployments.',
        'Ignoring distributed transaction costs: replacing a 2ms SQL transaction with a fragile multi-service Saga that takes 500ms and requires complex compensation logic.'
      ],
      interviewQuestion: {
        question: 'What is the "distributed monolith" anti-pattern and how do you detect it?',
        answer: 'A distributed monolith has the operational pain of microservices (network latency, distributed failures, complex deployments) combined with the tight coupling of a monolith. Symptoms include: (1) Services sharing the same database tables directly; (2) Changing one service requires simultaneous coordinated deployment of three other services; (3) Cascading outages across all services when one service goes down.'
      }
    },
    {
      title: 'Sessions vs. JSON Web Tokens (JWT) & OAuth 2.0',
      confidence: 'stable',
      simpleDefinition: 'Session auth stores user state on the server (e.g., Redis) and gives the client an opaque ID; JWT auth encodes user claims and signatures directly inside a cryptographically verified token held by the client.',
      whyItExists: 'Stateful sessions require centralized database lookups on every request, creating scaling bottlenecks. JWTs enable stateless verification across distributed microservices.',
      analogy: 'Session auth is a coat-check ticket: the ticket is just a random number (#42), and the attendant must look in the closet to see what coat you own. A JWT is an official laminated passport: all your identity details and government holograms are printed directly on the card.',
      technicalExplanation: 'A standard session cookie holds an opaque random string (`sid_89a7f3...`) checked against Redis on every request. Revocation is instant (delete key in Redis). A JWT (RFC 7519) contains Header, Payload, and Signature. Verifying a JWT requires only CPU cryptographic verification of the public key (using JWKS from the Identity Provider) without touching a database. However, JWT revocation before expiration is extremely difficult, requiring token blacklists (which reintroduce state) or short lifetimes (e.g., 5-15 mins) paired with refresh tokens. OAuth 2.0 (RFC 6749) is an authorization delegation framework; OIDC (OpenID Connect) adds identity on top.',
      example: 'A B2B SaaS web app uses Redis session cookies for browser human users (instant logout, high security) and short-lived JWTs (with OAuth 2.0 Client Credentials) for machine-to-machine API integrations.',
      whenToUse: [
        'Use short-lived JWTs (10-15 min) with refresh tokens for mobile apps, SPAs, and decoupled microservice authentication.',
        'Use HttpOnly, Secure, SameSite server-side sessions for traditional browser-based web applications where instant session revocation is a hard requirement.'
      ],
      whenNotToUse: [
        'Do not issue long-lived (e.g., 30-day) stateless JWTs for sensitive financial or healthcare applications, because if stolen, an attacker retains full access until the token expires with no built-in revocation.'
      ],
      commonMistakes: [
        'Storing sensitive data (e.g., passwords or PII) inside the JWT payload: JWT payloads are only Base64URL-encoded, not encrypted, meaning anyone who views the token can read the data.',
        'Storing JWTs in browser `localStorage`, making them vulnerable to Cross-Site Scripting (XSS) token exfiltration.'
      ],
      interviewQuestion: {
        question: 'How do you handle immediate token revocation in a stateless JWT architecture?',
        answer: 'You cannot revoke a truly stateless JWT without re-introducing state. Production strategies: (1) Keep access token lifetimes extremely short (5 to 10 minutes) so stolen tokens expire quickly, using long-lived refresh tokens stored in a database where revocation is checked; (2) Maintain a centralized Redis Bloom filter or key-value blocklist of revoked token IDs (`jti`), checked at the API Gateway; (3) Maintain a `token_version` or `password_changed_at` timestamp in the user record, embedding it in the JWT claims.'
      }
    },
    {
      title: 'Rate Limiting Algorithms: Token Bucket vs. Sliding Window',
      confidence: 'stable',
      simpleDefinition: 'Rate limiting controls the rate of incoming requests to protect backend services from denial-of-service, brute force attacks, and noisy neighbor tenant starvation.',
      whyItExists: 'Without rate limits, a single misconfigured client script or malicious actor can consume 100% of database connections and CPU capacity.',
      analogy: 'Token bucket is like an arcade that drops 1 token into your bowl every second up to a maximum of 10. You can spend 5 tokens instantly in a quick burst, but once empty, you must wait for the dispenser to drop new ones.',
      technicalExplanation: 'The primary algorithms: (1) Fixed Window Counter: Counts requests in fixed time windows (e.g., 12:00-12:01). Prone to 2x traffic bursts at window boundaries. (2) Sliding Window Log: Stores timestamps of all requests in a sorted set (Redis ZSET). 100% accurate, but memory-intensive. (3) Sliding Window Counter: Blends the previous window and current window count based on time overlap. Low memory, highly accurate. (4) Token Bucket: Tokens are added at a constant fill rate up to capacity. Allows bursts up to bucket capacity. (5) Leaky Bucket: Requests enter a FIFO queue and leak out at a constant rate, smoothing traffic spikes.',
      example: 'GitHub API allows 5,000 requests per hour for authenticated users using a sliding window counter. AWS uses Token Bucket to permit temporary bursts of API requests while enforcing average sustained quotas.',
      whenToUse: [
        'Use Token Bucket for public SaaS APIs to allow healthy bursts of traffic while capping sustained consumption.',
        'Use Leaky Bucket when backend processing cannot tolerate bursts and requires smooth constant-rate queuing.'
      ],
      whenNotToUse: [
        'Do not use Sliding Window Log on high-throughput endpoints (100,000+ RPS) because storing every individual timestamp in Redis consumes massive memory.'
      ],
      commonMistakes: [
        'Failing to use atomic Redis operations (Lua scripts) for rate checks, creating race conditions where concurrent requests bypass limits.',
        'Rate limiting only by IP address in a B2B SaaS: corporate users behind a single corporate NAT proxy will share the same IP and accidentally block each other. Rate limit by authenticated `tenant_id` and `user_id` instead.'
      ],
      interviewQuestion: {
        question: 'How do you implement an atomic distributed Token Bucket rate limiter in Redis?',
        answer: 'You write a Redis Lua script to avoid network round-trip race conditions. The script stores two fields in a Redis hash: `tokens` (current count) and `last_updated` (timestamp). On each incoming request: (1) Calculate tokens to add based on `(current_time - last_updated) * fill_rate`; (2) Update token count capped at `max_capacity`; (3) If `tokens >= 1`, decrement tokens, update `last_updated`, and return allowed (1); else return rejected (0). Because Redis executes Lua scripts atomically, no distributed lock is needed.'
      },
      codeSnippet: {
        language: 'typescript',
        title: 'Redis Lua Token Bucket Script',
        code: `// Atomically evaluated inside Redis engine
export const TOKEN_BUCKET_LUA = \`
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local fill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local data = redis.call("HMGET", key, "tokens", "last_updated")
local tokens = tonumber(data[1])
local last_updated = tonumber(data[2])

if tokens == nil then
  tokens = capacity
  last_updated = now
else
  local delta = math.max(0, now - last_updated)
  tokens = math.min(capacity, tokens + delta * fill_rate)
  last_updated = now
end

if tokens >= requested then
  tokens = tokens - requested
  redis.call("HMSET", key, "tokens", tokens, "last_updated", last_updated)
  redis.call("EXPIRE", key, math.ceil(capacity / fill_rate) * 2)
  return 1 -- Allowed
else
  return 0 -- Rejected (Rate limited)
end
\`;`
      }
    },
    {
      title: 'API Idempotency Patterns',
      confidence: 'stable',
      simpleDefinition: 'An operation is idempotent if executing it multiple times produces the exact same result and side effects as executing it once.',
      whyItExists: 'In distributed systems, networks drop packets. If a client submits a $100 credit card charge and the connection drops before receiving the response, the client must retry safely without charging the card twice.',
      analogy: 'The elevator call button: pressing it once calls the elevator. Pressing it 20 times repeatedly does not summon 20 elevators or make it go 20 times faster; the result remains identical.',
      technicalExplanation: 'GET, PUT, and DELETE methods are inherently idempotent by HTTP standard (RFC 9110). POST is not idempotent. To make POST idempotent, clients generate a unique UUID v4 `Idempotency-Key` header. The server uses an atomic distributed lock (Redis or SQL unique constraint on `(tenant_id, idempotency_key)`). If the key already exists and processing is complete, the server returns the cached response status and body without re-executing business logic. If currently processing, it returns HTTP 409 Conflict.',
      example: 'Stripe’s API requires `Idempotency-Key` for all `POST /v1/charges`. If network failure occurs, the client retries with the exact same key. Stripe recognizes the key and returns the original charge receipt.',
      whenToUse: ['Mandatory for all financial payments, order placements, booking reservations, and third-party webhook dispatchers.'],
      whenNotToUse: ['Do not require idempotency keys on read-only queries or high-frequency append-only telemetry logging.'],
      commonMistakes: [
        'Saving the idempotency key BEFORE verifying that the charge actually succeeded, causing subsequent retries to return false success for a failed payment.',
        'Storing idempotency responses indefinitely without TTL, bloating storage.'
      ],
      interviewQuestion: {
        question: 'How do you design an idempotency framework that handles concurrent duplicate requests arriving at the same millisecond?',
        answer: 'You enforce a state machine: (1) Use an atomic `INSERT` or Redis `SET key in_progress NX EX 120`. (2) The first request wins the lock and transitions state to IN_FLIGHT. (3) Concurrent duplicate requests fail to acquire the lock and immediately receive HTTP 409 Conflict or are queued to wait. (4) Once the winner completes the database transaction, it updates the record to COMPLETED, stores the response payload, and sets a 24-hour TTL. Subsequent retries read the COMPLETED record and return the cached response.'
      }
    },
    {
      title: 'Pagination: Offset vs. Keyset (Cursor)',
      confidence: 'stable',
      simpleDefinition: 'Offset pagination skips rows (`OFFSET 100000`); Keyset pagination uses a sequential index value (`WHERE id > last_seen_id LIMIT 20`).',
      whyItExists: 'Offset pagination degrades quadratically on large tables because the database must read and discard all skipped rows, and it suffers from missing/duplicate items when data is inserted while scrolling.',
      analogy: 'Offset pagination is reading a 500-page book by counting every page from page 1 to 350 every single time you open it. Keyset pagination is using a physical bookmark directly on page 350.',
      technicalExplanation: 'In `SELECT * FROM orders ORDER BY created_at LIMIT 20 OFFSET 500000`, the database engine scans through 500,020 index entries, decodes them, and discards the first 500,000, causing massive disk I/O and query timeouts. In Keyset (Cursor) pagination: `SELECT * FROM orders WHERE (created_at, id) < ($cursor_time, $cursor_id) ORDER BY created_at DESC, id DESC LIMIT 20`. The database engine executes an index seek directly to the cursor coordinates in O(log N) time, consuming minimal CPU regardless of table depth.',
      example: 'Twitter and Slack infinity-scrolling feeds use cursor pagination (`since_id` / `max_id`) to ensure new tweets arriving at the top do not shift the current feed and display duplicate tweets.',
      whenToUse: [
        'Use Keyset/Cursor pagination for large datasets (> 50,000 rows), infinite-scroll mobile feeds, and public high-throughput API endpoints.',
        'Use Offset pagination only for small administrative tables (< 1,000 rows) requiring direct "Jump to page 7" UI buttons.'
      ],
      whenNotToUse: [
        'Never use Offset pagination on multi-million row tables with active write traffic.'
      ],
      commonMistakes: [
        'Using cursor pagination on a non-unique column without a tiebreaker (e.g., filtering on `created_at` alone where 50 rows share the exact same microsecond, causing rows to be skipped). Always pair with a unique column: `(created_at, id)`.'
      ],
      interviewQuestion: {
        question: 'Why does offset pagination cause "phantom items" and "missed items" in dynamic feeds?',
        answer: 'Suppose page 1 loads rows 1-10. While the user reads, 3 new rows are inserted at the top of the table. When the user requests page 2 with `OFFSET 10 LIMIT 10`, all rows have shifted down by 3 positions. Rows 8, 9, and 10 from the original page 1 now occupy positions 11, 12, and 13, appearing on page 2 again (duplicate phantom items). Conversely, if rows were deleted, items would be missed entirely. Keyset pagination anchors to the specific entity boundary, completely immune to row shifts.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Stateful Server Sessions (Redis / DB)',
    technologyB: 'Stateless JSON Web Tokens (JWT)',
    comparisonDimensions: [
      {
        dimension: 'Revocation Speed',
        optionA: 'Instantaneous. Deleting session from Redis revokes access immediately.',
        optionB: 'Delayed. Token remains valid until TTL expires unless complex blocklist is queried.',
        verdict: 'Sessions win for high-security enterprise SaaS requiring instant admin kick-out.'
      },
      {
        dimension: 'Horizontal Verification Cost',
        optionA: 'Requires network I/O round-trip to Redis on every single request.',
        optionB: 'Zero network I/O; validated locally by CPU using cached public keys.',
        verdict: 'JWT wins for microservice meshes with high request volume.'
      },
      {
        dimension: 'Payload Size',
        optionA: 'Minimal (~32-64 byte random cookie).',
        optionB: 'Heavy (~500 - 2,000 bytes sent on every HTTP header).',
        verdict: 'Sessions win for bandwidth-constrained mobile clients.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'Modular monoliths provide domain isolation without the network tax of microservices.',
      'Sessions allow instant revocation; JWTs allow stateless local verification across microservices.',
      'Token Bucket permits temporary bursts; Leaky Bucket forces smooth constant outflow.',
      'Idempotency keys prevent duplicate side effects on retries over unstable networks.',
      'Offset pagination scales O(N) with deep scan overhead; Keyset pagination scales O(log N) via B-Tree seeks.'
    ],
    conceptualQuestions: [
      {
        id: 'q2-1',
        question: 'What is the difference between Authentication (AuthN) and Authorization (AuthZ)?',
        answer: 'Authentication verifies WHO you are (e.g., username/password, biometric, MFA). Authorization verifies WHAT you are permitted to do (e.g., RBAC role, ABAC attributes, tenant ownership).'
      },
      {
        id: 'q2-2',
        question: 'What is PKCE in OAuth 2.0 and why is it required for Single Page Applications?',
        answer: 'PKCE (Proof Key for Code Exchange) protects authorization codes from interception in public clients (like SPAs or mobile apps) that cannot safely store a client secret. The client creates a secret `code_verifier` and sends its cryptographic hash `code_challenge` in the initial request, verifying the original verifier during token exchange.'
      },
      {
        id: 'q2-3',
        question: 'Explain RFC 9457 (Problem Details for HTTP APIs).',
        answer: 'RFC 9457 standardizes machine-readable JSON error responses using a consistent format containing: `type` (URI identifier), `title` (human-readable summary), `status` (HTTP status code), `detail` (specific error explanation), and `instance` (URI reference to the occurrence).'
      },
      {
        id: 'q2-4',
        question: 'How does an API Gateway perform tenant routing?',
        answer: 'The API Gateway inspects the subdomain (e.g., `tenant1.app.com`), path, or JWT claims (`tenant_id`), queries an in-memory routing table, and forwards the request to the designated tenant cluster or sets tenancy context headers for shared services.'
      },
      {
        id: 'q2-5',
        question: 'What are the risks of using JWTs for user sessions without a refresh token strategy?',
        answer: 'To avoid frequent re-logins, developers make the JWT last days or weeks. If stolen, attackers hold unrestricted access with no way for the server to invalidate the session before expiry.'
      },
      {
        id: 'q2-6',
        question: 'What is the sliding window log rate limiting algorithm?',
        answer: 'It records every request timestamp in a sorted set. When a request arrives, it removes timestamps older than `now - window_size` and checks if the set size exceeds the limit. It is perfectly accurate but consumes high memory.'
      },
      {
        id: 'q2-7',
        question: 'Why should database IDs used in keyset pagination be strictly monotonic?',
        answer: 'Keyset pagination relies on binary comparison (`WHERE id > cursor_id`). If IDs are not monotonic (e.g., random UUID v4), sorting by ID will not reflect insertion order, causing missing or skipped records.'
      },
      {
        id: 'q2-8',
        question: 'What is the role of an API versioning header versus a URI path version?',
        answer: 'URI path (`/api/v1/orders`) is explicit, easy to route in CDNs and proxies, and clear in logs. Header versioning (`Accept: application/vnd.company.v1+json`) keeps URIs clean and semantically pure according to REST theory, but makes caching and proxy routing more complex.'
      },
      {
        id: 'q2-9',
        question: 'How do you prevent race conditions when two users submit identical requests concurrently?',
        answer: 'Use distributed locks (Redis Redlock), database pessimistic row locks (`SELECT FOR UPDATE`), or optimistic concurrency control via version columns (`WHERE version = 3`).'
      },
      {
        id: 'q2-10',
        question: 'What HTTP status code should be returned when rate limits are exceeded?',
        answer: 'HTTP 429 Too Many Requests, accompanied by `Retry-After: <seconds>` header indicating when the client may retry.'
      }
    ],
    designExercises: [
      {
        id: 'de2-1',
        scenario: 'A B2B SaaS platform needs to expose public APIs with custom tiered rate limits per customer (Free: 60 req/min, Pro: 1,000 req/min, Enterprise: 10,000 req/min).',
        task: 'Design a distributed rate-limiting architecture that minimizes latency overhead.',
        solutionGuide: 'Terminate API requests at an Envoy/Kong API Gateway. The gateway extracts the customer API key, looks up their tier in local memory cache (with 60s TTL), and runs an atomic Redis Lua token-bucket script against a Redis cluster in the same AWS AZ. The Redis key is `ratelimit:{customer_id}` with capacity and refill rate dynamically passed into the Lua script based on the cached tier.'
      },
      {
        id: 'de2-2',
        scenario: 'A payment gateway receives duplicate charge requests when mobile network connections drop.',
        task: 'Design a zero-duplicate idempotency layer that guarantees no customer is charged twice.',
        solutionGuide: 'Enforce client-supplied `Idempotency-Key` headers. Use an atomic database constraint or Redis atomic transaction to set the key state to `PROCESSING` with a 120-second TTL. The payment processor checks the key: if completed, return cached response; if processing, return HTTP 409 Conflict. Once charged, commit the transaction, update the idempotency record to `COMPLETED`, and store the response for 24 hours.'
      },
      {
        id: 'de2-3',
        scenario: 'An audit logging system generates 50 million events per day. Operations teams need to browse records through an internal portal.',
        task: 'Design the pagination scheme and database indexing strategy.',
        solutionGuide: 'Reject offset pagination. Implement Keyset pagination using a composite index on `(tenant_id, created_at DESC, id DESC)`. The query seeks directly to `WHERE tenant_id = $1 AND (created_at, id) < ($cursor_time, $cursor_id) ORDER BY created_at DESC, id DESC LIMIT 50`. The cursor is returned as an opaque Base64-encoded string.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq2-1',
        question: 'How would you migrate a high-traffic monolithic application to microservices without downtime?',
        answer: 'Use the Strangler Fig pattern: (1) Deploy an API Gateway / Reverse Proxy in front of the monolith; (2) Identify a bounded context with clear boundaries (e.g., Notifications or Billing); (3) Build the new microservice independently; (4) Configure the API Gateway to route a small percentage of canary traffic (e.g., 1%) to the new service while keeping 99% on the monolith; (5) Run shadow traffic or dual-writing to verify data parity; (6) Shift 100% of traffic once verified and decommission the monolith code path.'
      },
      {
        id: 'iq2-2',
        question: 'Why should you avoid using random UUID v4 as primary keys in relational databases like PostgreSQL or MySQL?',
        answer: 'UUID v4 generates completely random 128-bit numbers. In B-Tree indexes, random keys cause continuous random page splits across the entire index tree on disk, thrashing the database buffer pool and causing severe write amplification. Monotonically increasing sequential IDs (or time-ordered UUIDs like UUID v7 or ULID) ensure new rows are appended to the rightmost leaf page of the B-Tree, maximizing cache locality.'
      },
      {
        id: 'iq2-3',
        question: 'What is the difference between optimistic and pessimistic locking?',
        answer: 'Pessimistic locking prevents concurrent conflict by locking the database row immediately (`SELECT ... FOR UPDATE`), blocking all other transactions until commit. Optimistic locking assumes conflicts are rare: it reads without locking, but includes a version column in updates (`UPDATE accounts SET balance = 50, version = version + 1 WHERE id = 1 AND version = 1`). If another transaction updated the row first, the query affects 0 rows, prompting an application-level retry.'
      },
      {
        id: 'iq2-4',
        question: 'How do you design a secure API key authentication system for a developer platform?',
        answer: 'Never store API keys in plaintext. Generate a high-entropy key with a distinguishable prefix (e.g., `sk_live_9f8a...`). The prefix allows secret scanners (like GitHub) to detect leaked keys. Store only the cryptographic hash (SHA-256 or bcrypt) in the database. When the client sends the key, hash it and query `WHERE key_hash = SHA256(input)`. Store the first 4 and last 4 characters in plaintext so users can identify keys in their dashboard.'
      },
      {
        id: 'iq2-5',
        question: 'What is the N+1 query problem and how do you prevent it?',
        answer: 'The N+1 problem occurs when an ORM queries 1 parent record (e.g., `SELECT * FROM users LIMIT 100`) and then executes N subsequent queries in a loop to fetch related child records (`SELECT * FROM posts WHERE user_id = ?`). It turns 1 fast operation into 101 slow round trips. Prevent it using eager loading (SQL `JOIN` or `WHERE user_id IN (1, 2, ... N)` batching) or DataLoader patterns in GraphQL.'
      }
    ],
    practicalTask: {
      title: 'Build and Verify an Idempotent API Middleware',
      instructions: 'Write a pseudo-code or TypeScript middleware that intercepts incoming HTTP requests with an `Idempotency-Key` header, locks the key in an atomic key-value store, handles concurrent retries with HTTP 409, and caches completed responses.',
      verification: 'Verify that when two concurrent requests arrive with identical idempotency keys, only one executes the business transaction, and the second receives HTTP 409 or the exact cached response of the first once complete.'
    }
  },
  sources: [
    {
      title: 'RFC 6749: The OAuth 2.0 Authorization Framework',
      url: 'https://datatracker.ietf.org/doc/html/rfc6749',
      type: 'RFC / Standard',
      whatItSupports: 'Standard OAuth 2.0 authorization flows, tokens, and client credentials specification.'
    },
    {
      title: 'RFC 7519: JSON Web Token (JWT)',
      url: 'https://datatracker.ietf.org/doc/html/rfc7519',
      type: 'RFC / Standard',
      whatItSupports: 'JWT data structures, cryptographic signatures, claims validation, and security considerations.'
    }
  ],
  videos: [
    {
      title: 'Microservices • Martin Fowler • GOTO 2014',
      creator: 'GOTO Conferences (Martin Fowler)',
      duration: '26m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Characteristics of microservices, boundaries, decentralized governance, and when monoliths are preferred.',
      url: 'https://www.youtube.com/watch?v=wgdBVIX9ifA'
    },
    {
      title: 'When To Use Microservices (And When Not To!) • Sam Newman & Martin Fowler',
      creator: 'GOTO Conferences',
      duration: '42m',
      difficulty: 'Intermediate',
      whatYouWillLearn: 'Evaluation criteria for microservice transitions, preventing distributed monoliths, and team alignment.',
      url: 'https://www.youtube.com/watch?v=GBTdnfD6s5Q'
    }
  ]
};
