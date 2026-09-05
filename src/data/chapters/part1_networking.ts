import { Chapter } from '../../types';

export const PART1_CHAPTER: Chapter = {
  id: 'part1-networking',
  part: 1,
  partTitle: 'Part 1 — Computer & Networking Foundations',
  chapterNumber: 1,
  title: 'Computer & Networking Foundations',
  subtitle: 'From Silicon Registers to Global Anycast Networks',
  summary: 'Every distributed system is fundamentally constrained by the laws of physics: CPU clock cycles, memory bus speeds, disk seek times, and the speed of light in fiber optic cables. Understanding hardware bottlenecks and networking protocols is the prerequisite to diagnosing high latency, packet drops, and throughput ceilings.',
  diagramAscii: `
+----------------------------------------------------------------------------------------------------+
|                         COMPLETE REQUEST LIFECYCLE: URL TO PIXELS                                 |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
| 1. Browser Address Bar: User inputs "https://app.saasplatform.com/dashboard"                      |
|       |                                                                                            |
| 2. DNS Resolution: Browser Cache -> OS Cache -> Local Resolver -> Authoritative NS (Geo-DNS)       |
|       | -> Returns Edge Anycast IP: 198.51.100.24                                                  |
|       v                                                                                            |
| 3. TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK (1 RTT) [Overridden by QUIC in HTTP/3]              |
|       |                                                                                            |
| 4. TLS 1.3 Cryptographic Handshake: ClientHello -> ServerHello + Cert + ECDH Key Exchange (1 RTT) |
|       | -> Symmetric AES-256-GCM Session Established                                              |
|       v                                                                                            |
| 5. Edge CDN / Anycast POP: Inspects HTTP Request, checks cache for static assets                   |
|       |                                                                                            |
| 6. Cloud WAF & L4/L7 Load Balancer: DDoS mitigation, TLS Termination, Path Routing (/dashboard)   |
|       |                                                                                            |
| 7. API Gateway: JWT Verification, Tenant Identification, Rate Limiting (Token Bucket)              |
|       |                                                                                            |
| 8. App Service (Stateless): Business logic, gRPC call to internal microservices, DB query          |
|       |                                                                                            |
| 9. Database Engine: Index seek in B-Tree, MVCC row visibility check, returns JSON payload          |
|       |                                                                                            |
| 10. Response Streaming: Compressed via Brotli/Gzip -> Browser DOM Parsing -> Layout & Render       |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
`,
  concepts: [
    {
      title: 'CPU, RAM, SSD, and IOPS Hierarchy',
      confidence: 'stable',
      simpleDefinition: 'A computer organizes memory in a pyramid: fast, expensive, small storage sits near the CPU (Registers, L1/L2/L3 cache, RAM); slower, cheap, persistent storage sits at the bottom (NVMe SSD, HDD).',
      whyItExists: 'Physical proximity to the CPU dictates latency. Light and electricity travel roughly 20 cm per nanosecond in copper; fetching data from remote disk or network takes millions of times longer than reading CPU registers.',
      analogy: 'CPU registers are what is in your immediate thought right now (1 nanosecond). RAM is a notepad on your desk (100 nanoseconds). An NVMe SSD is a book in your office bookcase (100 microseconds). A spinning HDD is walking to a library across town (10 milliseconds). A cross-country network call is flying to Japan to ask a question (100 milliseconds).',
      technicalExplanation: 'Latency numbers every architect must know: L1 cache reference: ~0.5-1 ns; L2 cache: ~3-4 ns; L3 cache: ~10-20 ns; Main memory (RAM) access: ~100 ns; NVMe SSD read: ~10-100 µs; HDD seek: ~5-10 ms; Cross-datacenter network round-trip (e.g., California to Virginia): ~60-80 ms. IOPS (Input/Output Operations Per Second) measures storage throughput. A SATA HDD delivers ~75-150 IOPS; an enterprise NVMe SSD delivers 500,000 to 1,000,000+ IOPS.',
      example: 'A database doing a full table scan on 10 million rows on spinning disk requires thousands of random seek operations (taking minutes), whereas an in-memory database like Redis scans those rows from DDR4/DDR5 RAM in milliseconds.',
      whenToUse: ['Keep hot working datasets (active session keys, frequently accessed tenant configurations) in RAM (Redis, Memcached) to bypass disk I/O bottlenecks entirely.'],
      whenNotToUse: ['Do not store multi-gigabyte cold audit logs or video blobs in memory; offload immediately to cost-effective object storage (S3).'],
      commonMistakes: [
        'Ignoring memory allocation churn: creating thousands of transient objects per request causes frequent garbage collection (GC) stop-the-world pauses in Java/Node.js, destroying p99 latency.',
        'Believing SSDs have infinite IOPS: saturated SSD write queues cause write amplification and latency spikes.'
      ],
      interviewQuestion: {
        question: 'Why is random disk I/O significantly slower than sequential disk I/O even on modern NVMe SSDs?',
        answer: 'While SSDs lack physical moving heads, NAND flash memory cannot overwrite data in place; it can only write in pages (e.g., 4KB-16KB) and must erase in entire blocks (e.g., 2MB-8MB). Random writes scatter updates across blocks, forcing the Flash Translation Layer (FTL) to execute continuous garbage collection and write amplification. Sequential I/O writes contiguous blocks cleanly, fully saturating the PCIe bus bandwidth.'
      },
      codeSnippet: {
        language: 'typescript',
        title: 'Latency Number Approximations in Code',
        code: `export const LATENCY_COSTS = {
  CPU_CYCLE: 0.3e-9,          // ~0.3 nanoseconds
  L1_CACHE: 1e-9,             // 1 ns
  L2_CACHE: 4e-9,             // 4 ns
  RAM_READ: 100e-9,           // 100 ns
  NVME_SSD_READ: 100e-6,      // 100 microseconds (1,000x slower than RAM)
  HDD_SEEK: 10e-3,            // 10 milliseconds (100,000x slower than RAM)
  CROSS_DC_ROUNDTRIP: 70e-3,  // 70 ms (700,000x slower than RAM)
};`
      }
    },
    {
      title: 'TCP vs. UDP in Distributed Systems',
      confidence: 'stable',
      simpleDefinition: 'TCP provides reliable, ordered, error-checked byte streams via connection handshakes and retransmissions; UDP sends lightweight datagrams without handshakes, ordering, or delivery guarantees.',
      whyItExists: 'Not all applications need guaranteed delivery. For live streaming, VoIP, and gaming, a late packet is useless and waiting for retransmission causes unacceptable jitter.',
      analogy: 'TCP is a registered courier who requires a signature for every document, calls you if a page is missing, and redelivers. UDP is a megaphone announcement: fast, cheap, but if you sneeze and miss a word, it will not repeat it.',
      technicalExplanation: 'TCP implements a 3-way handshake (SYN, SYN-ACK, ACK), sequence numbers, sliding window flow control, and congestion avoidance algorithms (CUBIC, BBR). When packet loss occurs, TCP stalls the entire byte stream until the missing packet is retransmitted—a phenomenon known as Head-of-Line (HoL) blocking. UDP has a minimal 8-byte header (source port, dest port, length, checksum) and zero connection state. Modern protocols like QUIC run over UDP in user space to provide reliable streams WITHOUT TCP HoL blocking.',
      example: 'HTTP/1.1 and HTTP/2 rely on TCP. DNS lookups, WebRTC media streams, and multiplayer game position updates rely on UDP. HTTP/3 runs on top of QUIC (which is built on UDP).',
      whenToUse: [
        'Use TCP for financial transactions, API requests, database queries, and file downloads where data corruption or lost bytes cannot be tolerated.',
        'Use UDP (or QUIC) for real-time video/audio streaming, IoT telemetry heartbeats, DNS lookups, and latency-critical game loops.'
      ],
      whenNotToUse: [
        'Do not use raw UDP for payment webhooks or critical database commit logs without an application-level reliability protocol.',
        'Do not use TCP over high-loss satellite links without modern BBR congestion control, as CUBIC will throttle throughput to near zero.'
      ],
      commonMistakes: [
        'Assuming UDP is always faster: on a stable fiber connection with zero packet loss, TCP achieves identical raw throughput once the initial handshake completes.',
        'Neglecting TCP SYN backlog and socket exhaustion (TIME_WAIT states) on high-throughput backend proxy servers.'
      ],
      interviewQuestion: {
        question: 'What is TCP Head-of-Line blocking, and how did HTTP/3 resolve it?',
        answer: 'In HTTP/2, multiple logical requests are multiplexed over a single TCP connection. If a single TCP packet is dropped by the network, the operating system kernel must hold all subsequent packets in buffer until the dropped packet is retransmitted and acknowledged, even if those subsequent packets belong to completely independent HTTP requests. HTTP/3 solves this by replacing TCP with QUIC over UDP: streams in QUIC are independent, so packet loss on Stream A does not block Stream B.'
      }
    },
    {
      title: 'DNS Architecture & Geo-Routing',
      confidence: 'stable',
      simpleDefinition: 'DNS (Domain Name System) translates human-readable domain names (api.company.com) into machine-routable IP addresses (192.0.2.1).',
      whyItExists: 'Humans remember names, but internet routers only know binary IP addresses. DNS also acts as the first global layer of traffic steering and load balancing.',
      analogy: 'DNS is the global contacts app of the internet. You look up "Alice", and it returns her current phone number so your phone can dial it.',
      technicalExplanation: 'The DNS hierarchy consists of: Root nameservers (.) -> Top-Level Domain (TLD) servers (.com, .org) -> Authoritative nameservers (ns1.route53.aws). Resolvers use recursive lookup caching governed by Time-To-Live (TTL) values. Advanced DNS patterns include: Geo-DNS (returning the IP of the closest datacenter based on the client resolver IP subnet / EDNS Client Subnet), Latency-based routing, and Anycast DNS (advertising the same IP address from hundreds of BGP locations worldwide).',
      example: 'When a user in Tokyo resolves `netflix.com`, GeoDNS returns an AWS ap-northeast-1 IP address. When a user in London resolves the exact same URL, GeoDNS returns an eu-west-1 IP address.',
      whenToUse: ['Use Geo-DNS and Anycast DNS at the outer perimeter of global SaaS applications to terminate user connections at the geographically nearest edge POP.'],
      whenNotToUse: ['Do not rely on DNS for rapid (< 5 seconds) failover: ISP resolvers frequently ignore low TTLs and cache expired IPs for minutes or hours.'],
      commonMistakes: [
        'Setting TTL too high (e.g., 86400 seconds / 24 hours) during a major infrastructure migration, preventing traffic from shifting to the new cluster.',
        'Setting TTL too low (e.g., 1 second) in steady-state, creating massive DNS query amplification and vendor billing bills.'
      ],
      interviewQuestion: {
        question: 'Why should you NOT use DNS round-robin as your primary application load balancer?',
        answer: 'DNS round-robin has three fatal flaws: (1) It lacks real-time health checking—if one server crashes, DNS continues serving its IP until TTL expires; (2) Client and ISP caching creates severe traffic imbalances (one ISP might cache IP #1 and send 100,000 corporate users to that single server); (3) It cannot balance traffic based on server CPU load or active connection counts. Proper design places a dedicated L4/L7 load balancer behind DNS.'
      }
    },
    {
      title: 'HTTP Evolution: HTTP/1.1 vs. HTTP/2 vs. HTTP/3 (QUIC)',
      confidence: 'stable',
      simpleDefinition: 'HTTP is the application protocol of the web: v1.1 is plain text with one request per connection; v2 introduced binary multiplexing over single TCP; v3 runs over UDP/QUIC to eliminate packet loss stalling.',
      whyItExists: 'Modern web pages require loading hundreds of assets (scripts, styles, images). In HTTP/1.1, each asset required a separate TCP connection or suffered from sequential waiting.',
      analogy: 'HTTP/1.1 is a one-lane road where cars must drive one at a time. HTTP/2 is a multi-lane highway, but if one car gets a flat tire, all lanes freeze. HTTP/3 is a fleet of airborne drones: each package flies independently through the air.',
      technicalExplanation: 'HTTP/1.1 supported persistent connections (`Keep-Alive`) and pipelining (which failed in practice due to proxy bugs). HTTP/2 (RFC 9113) replaced text with binary framing (headers and data frames), introduced HPACK header compression, and enabled bidirectional multiplexing over a single TCP connection. HTTP/3 (RFC 9114) runs over QUIC (RFC 9000), a transport protocol built on UDP that integrates TLS 1.3 natively, enables 0-RTT connection resumption, and provides independent streams that eliminate TCP Head-of-Line blocking.',
      example: 'A user on a mobile train transitioning from 5G cellular to station Wi-Fi experiences dropped connections in HTTP/1.1 and HTTP/2 because the client IP changes (breaking the 4-tuple TCP socket). In HTTP/3/QUIC, the connection persists uninterrupted due to Connection IDs.',
      whenToUse: [
        'Use HTTP/2 and HTTP/3 for all public customer-facing SaaS web and mobile applications.',
        'Use HTTP/2 or gRPC for high-throughput internal microservice communication.'
      ],
      whenNotToUse: [
        'Do not expose internal legacy microservices directly to HTTP/3 without terminating TLS/QUIC at the edge reverse proxy (Envoy, Cloudflare).'
      ],
      commonMistakes: [
        'Domain sharding in the HTTP/2 era: In HTTP/1.1, developers split assets across `cdn1.site.com` and `cdn2.site.com` to bypass browser 6-connection limits. In HTTP/2, this anti-pattern hurts performance by breaking single-connection multiplexing and HPACK compression.'
      ],
      interviewQuestion: {
        question: 'How does QUIC achieve 0-RTT connection establishment in HTTP/3?',
        answer: 'In traditional HTTP/2 over TLS 1.3, a client requires 1 RTT for the TCP handshake plus 1 RTT for the TLS handshake (or 1 RTT total in optimized TLS 1.3). In QUIC, transport and cryptographic handshakes are combined into a single exchange. When a client reconnects to a previously visited server, it uses cached cryptographic keys and token parameters to send encrypted application payload data in its very first flight of packets (0-RTT).'
      }
    },
    {
      title: 'Reverse Proxies vs. Load Balancers (L4 vs. L7)',
      confidence: 'stable',
      simpleDefinition: 'A reverse proxy sits in front of web servers to handle security, SSL termination, and caching; a load balancer distributes incoming network traffic across multiple backend servers.',
      whyItExists: 'Exposing raw application servers to the public internet creates severe security risks, lacks automatic failure routing, and requires every server to handle expensive cryptographic handshakes.',
      analogy: 'A reverse proxy is the receptionist at an office building who checks your ID and takes your coat. A load balancer is the dispatcher who directs you to whichever representative currently has an open desk.',
      technicalExplanation: 'L4 Load Balancers (Transport layer: AWS NLB, IPVS) operate at the IP and TCP/UDP level. They inspect only IP addresses and ports, routing packets at line speed without decrypting TLS or inspecting HTTP headers. L7 Load Balancers (Application layer: NGINX, HAProxy, Envoy, AWS ALB) terminate TLS, inspect HTTP paths, cookies, and headers, and route traffic intelligently (e.g., `/api/v1/billing` to billing service, `/ws` to WebSocket cluster). L7 consumes more CPU per request but allows smart routing, rate limiting, and tenant-based routing.',
      example: 'In a production SaaS platform: An L4 AWS Network Load Balancer ingests 10 Gbps of raw traffic and distributes it across a fleet of Envoy L7 proxies. The Envoy proxies terminate TLS, inspect the JWT tenant ID, and forward the request to the correct tenant microservice.',
      whenToUse: [
        'Use L4 load balancing when raw network throughput, ultra-low latency (< 1ms), and UDP handling are the top priorities.',
        'Use L7 load balancing when you need path-based routing, header-based tenant routing, sticky sessions, or WAF security integration.'
      ],
      whenNotToUse: [
        'Do not place an L7 proxy in front of raw binary database connections unless the proxy explicitly understands the database protocol (e.g., PgBouncer for PostgreSQL).'
      ],
      commonMistakes: [
        'Forgetting that L7 load balancers replace the client’s source IP with their own IP in the TCP packet unless configured to pass `X-Forwarded-For` headers or PROXY protocol.',
        'Running heavy compression or image transformation directly on app servers instead of offloading to the reverse proxy.'
      ],
      interviewQuestion: {
        question: 'What are the trade-offs between Round Robin, Least Connections, and Consistent Hashing load balancing algorithms?',
        answer: 'Round Robin is trivial and fast but fails when requests have wildly varying processing times (leading to hot servers). Least Connections routes to the host with the fewest active TCP/HTTP streams, ideal for long-lived transactions or WebSocket connections. Consistent Hashing routes requests based on a hash of a key (e.g., User ID or URL), ensuring the same user repeatedly hits the same backend server (maximizing local in-memory cache hit rates) with minimal key re-mapping when nodes are added or removed.'
      }
    }
  ],
  tradeOffAnalysis: {
    technologyA: 'Layer 4 Load Balancing (e.g., AWS NLB, Linux IPVS)',
    technologyB: 'Layer 7 Load Balancing (e.g., Envoy, AWS ALB, NGINX)',
    comparisonDimensions: [
      {
        dimension: 'Latency Overhead',
        optionA: 'Sub-millisecond (does not parse application payloads).',
        optionB: '1-5ms (must decrypt TLS and parse HTTP/2 frames).',
        verdict: 'L4 wins for high-frequency trading and low-latency gaming.'
      },
      {
        dimension: 'Routing Intelligence',
        optionA: 'None. Only routes by Source/Destination IP and Port.',
        optionB: 'Rich. Routes by URL path, Host header, Cookies, HTTP methods.',
        verdict: 'L7 is mandatory for modern microservice API gateways.'
      },
      {
        dimension: 'CPU Consumption',
        optionA: 'Extremely low (packet forwarding in kernel or eBPF/DPDK).',
        optionB: 'High (SSL termination, decompression, buffer management).',
        verdict: 'L4 can handle millions of packets/sec per node at fraction of CPU.'
      }
    ]
  },
  exercises: {
    quickRevision: [
      'RAM latency (~100ns) is 1,000x faster than NVMe SSD (~100µs) and 100,000x faster than HDD (~10ms).',
      'TCP provides ordered, reliable delivery but suffers from Head-of-Line blocking; UDP is connectionless and fast.',
      'HTTP/2 multiplexes streams over single TCP; HTTP/3 uses QUIC over UDP to eliminate TCP HoL blocking.',
      'DNS translates names to IPs; GeoDNS and Anycast route users to the geographically nearest edge.',
      'L4 Load Balancers route by IP:Port at wire speed; L7 Load Balancers parse HTTP headers, paths, and cookies.',
      'A reverse proxy protects backend servers, terminates TLS, and enforces edge rate limiting.'
    ],
    conceptualQuestions: [
      {
        id: 'q1-1',
        question: 'What is BGP Anycast and how does it improve CDN latency?',
        answer: 'Anycast assigns the same single IP address to hundreds of servers across worldwide datacenters. Internet routers use Border Gateway Protocol (BGP) to naturally route the user’s packets to the topologically closest datacenter (lowest AS hop count), slashing round-trip latency.'
      },
      {
        id: 'q1-2',
        question: 'Why does TLS 1.3 require only 1 RTT compared to TLS 1.2’s 2 RTTs?',
        answer: 'TLS 1.2 required a ClientHello/ServerHello exchange followed by a key exchange round trip. TLS 1.3 combines key exchange into the very first ClientHello message by guessing the server’s supported cryptographic curve, reducing the handshake from 2 round trips to 1.'
      },
      {
        id: 'q1-3',
        question: 'Explain what happens during a TCP 3-way handshake.',
        answer: '1. Client sends SYN (Synchronize) with an initial sequence number (ISN). 2. Server responds with SYN-ACK, acknowledging client ISN and providing its own ISN. 3. Client sends ACK, completing the connection.'
      },
      {
        id: 'q1-4',
        question: 'What is the purpose of the `X-Forwarded-For` HTTP header?',
        answer: 'Because reverse proxies and L7 load balancers terminate the incoming client TCP connection and open a new TCP connection to backend app servers, the backend sees the proxy’s IP as the remote address. `X-Forwarded-For` preserves the original client’s public IP.'
      },
      {
        id: 'q1-5',
        question: 'Why are WebSockets preferred over HTTP polling for real-time chat?',
        answer: 'HTTP polling requires repeatedly opening TCP/TLS connections and sending heavy HTTP headers (often 500-1000 bytes) even when no new messages exist. WebSockets upgrade a single HTTP connection into a persistent, full-duplex TCP stream with minimal 2-10 byte framing overhead.'
      },
      {
        id: 'q1-6',
        question: 'What is Server-Sent Events (SSE) and when is it better than WebSockets?',
        answer: 'SSE is a standardized one-way communication protocol over standard HTTP where the server streams updates to the client. It is better than WebSockets when communication is strictly unidirectional (e.g., AI LLM text generation tokens, stock ticker prices), as it works over standard HTTP/2 without custom firewall rules and includes automatic reconnection.'
      },
      {
        id: 'q1-7',
        question: 'What is an Ephemeral Port and why can high-traffic proxies run out of them?',
        answer: 'An ephemeral port is a temporary port (typically ranges 32768-60999) allocated by the OS for outbound connections. A proxy connecting to a single backend IP can only open ~28,000 concurrent sockets before exhausting available ports, causing connection refusal errors.'
      },
      {
        id: 'q1-8',
        question: 'What is the difference between gRPC and REST?',
        answer: 'REST typically uses JSON over HTTP/1.1 with human-readable payloads and loose typing. gRPC uses Protocol Buffers (compact binary serialization) over HTTP/2 with strict code-generated contracts, supporting client, server, and bidirectional streaming with up to 7-10x lower CPU serialization overhead.'
      },
      {
        id: 'q1-9',
        question: 'What is MTU (Maximum Transmission Unit) and what happens when a packet exceeds it?',
        answer: 'MTU is the largest packet size (typically 1500 bytes for standard Ethernet) that a network interface can transmit without fragmenting. If a packet exceeds MTU and the Don’t Fragment (DF) flag is set, routers drop it and send an ICMP "Fragmentation Needed" error (Path MTU Discovery).'
      },
      {
        id: 'q1-10',
        question: 'What is the difference between a forward proxy and a reverse proxy?',
        answer: 'A forward proxy sits in front of a group of clients (e.g., inside a corporate office) to regulate outbound access to the internet and disguise client IPs. A reverse proxy sits in front of backend servers to regulate inbound access from the internet and disguise server IPs.'
      }
    ],
    designExercises: [
      {
        id: 'de1-1',
        scenario: 'A global SaaS enterprise application has customers in North America, Europe, and Australia complaining of 300ms+ API latency when editing documents.',
        task: 'Design a network topology that minimizes cross-continental round trips.',
        solutionGuide: 'Deploy an Anycast network with Cloudflare/AWS Global Accelerator at the edge. Terminate TLS and TCP connections at the edge POP nearest to the user, then route over AWS/provider private fiber backbone to backend region. For read-heavy document metadata, deploy read-only edge replicas or CDN caching.'
      },
      {
        id: 'de1-2',
        scenario: 'An AI coding assistant streams tokens in real time to web browsers.',
        task: 'Select between HTTP Polling, WebSockets, and Server-Sent Events (SSE). Justify your choice.',
        solutionGuide: 'Choose Server-Sent Events (SSE). The stream is strictly server-to-client (unidirectional token emission), uses standard HTTP/2, traverses corporate corporate firewalls easily, and supports built-in browser EventSource auto-reconnect without managing duplex WebSocket state.'
      },
      {
        id: 'de1-3',
        scenario: 'A financial trading platform needs to process 500,000 orders/second with p99 < 2ms.',
        task: 'Choose the transport protocol, serialization format, and load balancer layer.',
        solutionGuide: 'Use L4 load balancing (IPVS or AWS NLB) to bypass L7 HTTP parsing. Use raw TCP or UDP with Protocol Buffers or FlatBuffers for zero-copy binary deserialization, bypassing JSON parsing and reducing GC overhead.'
      }
    ],
    interviewQuestions: [
      {
        id: 'iq1-1',
        question: 'Walk through every step of what happens when you type "https://app.google.com" into a web browser and hit Enter.',
        idealAnswer: '1. Browser checks HSTS list (enforces HTTPS). 2. DNS lookup (browser cache -> OS hosts file -> local recursive resolver -> Root -> .com TLD -> Google authoritative nameserver). 3. TCP 3-way handshake with target IP (SYN -> SYN-ACK -> ACK). 4. TLS 1.3 handshake (ClientHello with key share -> ServerHello with certificate and server key share -> symmetric encryption keys derived). 5. Browser sends HTTP GET request. 6. Edge CDN/Load Balancer intercepts, terminates TLS, inspects WAF rules. 7. L7 router forwards to internal gateway. 8. Auth service verifies session cookie/token. 9. App server executes controller, queries database/cache. 10. Server sends HTTP 200 with HTML/JSON response. 11. Browser parses DOM, requests CSS/JS, builds render tree, and paints pixels.'
      },
      {
        id: 'iq1-2',
        question: 'Why does gRPC use HTTP/2 instead of raw TCP sockets?',
        idealAnswer: 'Raw TCP requires engineers to reinvent multiplexing, flow control, stream cancellation, connection health checks, and metadata headers from scratch. HTTP/2 already standardizes binary framing, multiplexing multiple logical RPC calls over a single connection, flow control windows, and HPACK header compression, allowing gRPC to focus purely on high-performance serialization (Protobuf) and language-agnostic RPC abstractions.'
      },
      {
        id: 'iq1-3',
        question: 'What causes connection resets (TCP RST packets) in production?',
        idealAnswer: 'Common causes include: (1) Packet arrives for a port where no process is listening; (2) Firewall or load balancer idle timeout closed the connection, but client attempted to send data; (3) Application closed socket while unread data remained in the receive buffer; (4) Backend host ran out of memory and was killed by Linux OOM killer; (5) Half-open TCP state due to intermediate NAT router state eviction.'
      },
      {
        id: 'iq1-4',
        question: 'How does consistent hashing prevent cascading cache failure when adding a new server?',
        idealAnswer: 'Traditional modulo hashing (hash(key) % N) causes almost 100% of all keys to re-map to different servers when N changes to N+1, causing an instant 0% cache hit rate and crushing the database. Consistent hashing places both servers and keys on a virtual 360° ring. Adding a server only migrates keys located between the new server and its predecessor on the ring (approximately 1/N of total keys), leaving the remaining (N-1)/N keys completely undisturbed.'
      },
      {
        id: 'iq1-5',
        question: 'What is the difference between connection pooling and HTTP keep-alive?',
        idealAnswer: 'HTTP Keep-Alive allows a single client to reuse an existing TCP connection for multiple sequential or multiplexed requests to a server. Connection Pooling is an architectural pattern on the client or server (e.g., PgBouncer or an HTTP client pool) that maintains a pool of pre-warmed, authenticated connections ready to be checked out by concurrent worker threads, avoiding the latency of repeated handshakes.'
      }
    ],
    practicalTask: {
      title: 'Analyze Network Round-Trip Penalties across Protocols',
      instructions: 'Calculate the total latency elapsed from zero state to receiving the first byte of data (TTFB) for: (A) HTTP/1.1 over TLS 1.2, (B) HTTP/2 over TLS 1.3, and (C) HTTP/3 over QUIC, assuming a network RTT of 50ms and 10ms server processing time.',
      verification: 'Case A: TCP (1 RTT) + TLS 1.2 (2 RTT) + HTTP GET (1 RTT) + 10ms = (4 * 50ms) + 10ms = 210ms. Case B: TCP (1 RTT) + TLS 1.3 (1 RTT) + HTTP GET (1 RTT) + 10ms = (3 * 50ms) + 10ms = 160ms. Case C: QUIC 1-RTT handshake (1 RTT) + HTTP GET (0-1 RTT) + 10ms = 110ms (or 60ms on 0-RTT reconnection). This proves why HTTP/3 significantly reduces mobile connection latency.'
    }
  },
  sources: [
    {
      title: 'RFC 9110: HTTP Semantics',
      url: 'https://datatracker.ietf.org/doc/html/rfc9110',
      type: 'RFC / Standard',
      whatItSupports: 'Standard HTTP method definitions, idempotent guarantees, status code definitions, and header caching rules.'
    },
    {
      title: 'RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport',
      url: 'https://datatracker.ietf.org/doc/html/rfc9000',
      type: 'RFC / Standard',
      whatItSupports: 'Technical specification of QUIC transport protocol, stream multiplexing, and zero-RTT handshakes.'
    }
  ],
  videos: [
    {
      title: 'Distributed Systems 1.2: Computer networking',
      creator: 'Martin Kleppmann (University of Cambridge)',
      duration: '45m',
      difficulty: 'Beginner',
      whatYouWillLearn: 'Packet switching, IP routing, TCP byte streams vs. UDP datagrams, and physical constraints of network links.',
      url: 'https://www.youtube.com/watch?v=1F3DEq8ML1U'
    },
    {
      title: 'Distributed Systems 1.3: RPC (Remote Procedure Call)',
      creator: 'Martin Kleppmann (University of Cambridge)',
      duration: '42m',
      difficulty: 'Beginner',
      whatYouWillLearn: 'Serialization, RPC semantics, at-most-once vs. at-least-once invocation, and handling network timeouts.',
      url: 'https://www.youtube.com/watch?v=S2osKiqQG9s'
    }
  ]
};
