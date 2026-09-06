import React, { useState } from 'react';
import { 
  Network, 
  Globe, 
  Cpu, 
  Zap, 
  Database, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Lock,
  HardDrive,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';

interface ConceptVisualizerProps {
  title: string;
  technicalExplanation?: string;
  simpleDefinition?: string;
}

export const ConceptArchitectureVisualizer: React.FC<ConceptVisualizerProps> = ({
  title,
  technicalExplanation = '',
  simpleDefinition = ''
}) => {
  const normalized = (title + ' ' + technicalExplanation + ' ' + simpleDefinition).toLowerCase();

  // Pattern detection
  const isCDN = normalized.includes('cdn') || normalized.includes('content delivery network') || normalized.includes('edge caching');
  const isLoadBalancer = !isCDN && (normalized.includes('load balancer') || normalized.includes('l4 vs') || normalized.includes('reverse prox'));
  const isMicroservices = normalized.includes('microservice') || normalized.includes('service mesh') || normalized.includes('modular monolith');
  const isCaching = !isCDN && (normalized.includes('cache-aside') || normalized.includes('caching') || normalized.includes('eviction') || normalized.includes('redis'));
  const isDatabase = normalized.includes('sharding') || normalized.includes('replication') || normalized.includes('consistent hash') || normalized.includes('wal');
  const isEventStreaming = normalized.includes('kafka') || normalized.includes('message queue') || normalized.includes('event stream') || normalized.includes('pub/sub');
  const isRateLimiter = normalized.includes('rate limit') || normalized.includes('token bucket') || normalized.includes('leaky bucket');
  const isDns = normalized.includes('dns') || normalized.includes('anycast') || normalized.includes('geo-routing');

  if (isCDN) return <CdnConceptDiagram />;
  if (isLoadBalancer) return <LoadBalancerConceptDiagram />;
  if (isMicroservices) return <MicroservicesConceptDiagram />;
  if (isCaching) return <CachingConceptDiagram />;
  if (isDatabase) return <DatabaseShardingConceptDiagram />;
  if (isEventStreaming) return <EventStreamingConceptDiagram />;
  if (isRateLimiter) return <RateLimiterConceptDiagram />;
  if (isDns) return <DnsAnycastConceptDiagram />;

  // Default generic architecture pipeline if no specific match
  return <GenericArchitecturePipelineDiagram title={title} />;
};

/* =========================================================================
   1. CDN & Edge Caching Architecture Diagram (SVG + CSS Grid)
   ========================================================================= */
const CdnConceptDiagram: React.FC = () => {
  const [cacheScenario, setCacheScenario] = useState<'hit' | 'miss'>('hit');

  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      {/* Diagram Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8]">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
              Content Delivery Network (CDN) &amp; Edge Hierarchy Architecture
              <span className="text-[9px] font-mono uppercase bg-[#162738] text-[#38bdf8] px-2 py-0.5 rounded-full border border-[#38bdf8]/30">
                Anycast POPs
              </span>
            </h4>
            <p className="text-[11px] text-[#94a3b8]">
              Edge Point of Presence (POP) terminates TLS, caches static assets, and shields origin servers.
            </p>
          </div>
        </div>

        {/* Interactive Scenario Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xs bg-[#12141c] border border-[#232634] self-start sm:self-auto">
          <button
            onClick={() => setCacheScenario('hit')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-all cursor-pointer ${
              cacheScenario === 'hit'
                ? 'bg-[#22c55e] text-[#0b0c10] font-bold shadow-xs'
                : 'text-[#94a3b8] hover:text-[#ffffff]'
            }`}
          >
            Edge Cache Hit (12ms)
          </button>
          <button
            onClick={() => setCacheScenario('miss')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-all cursor-pointer ${
              cacheScenario === 'miss'
                ? 'bg-[#d4af37] text-[#0b0c10] font-bold shadow-xs'
                : 'text-[#94a3b8] hover:text-[#ffffff]'
            }`}
          >
            Edge Cache Miss (85ms)
          </button>
        </div>
      </div>

      {/* Main Visual Topology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative py-2">
        {/* Tier 1: Client Layer */}
        <div className="rounded-sm border border-[#232634] bg-[#10131d] p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
            <span>1. USER TIER</span>
            <span className="text-[#38bdf8]">Client Device</span>
          </div>
          <div className="space-y-1.5 py-2">
            <div className="h-9 rounded-xs bg-[#161a27] border border-[#282d40] flex items-center px-3 gap-2">
              <div className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
              <div className="text-xs text-[#cbd5e1] font-mono truncate">User in Frankfurt</div>
            </div>
            <div className="text-[10px] font-mono text-[#64748b]">DNS Anycast: 104.16.24.5</div>
          </div>
          <div className="text-[9px] font-mono bg-[#0b0d14] p-1.5 rounded-xs text-[#94a3b8] border border-[#1a1e2d]">
            TLS 1.3 Handshake: 1 RTT
          </div>
        </div>

        {/* Tier 2: Edge POP (Point of Presence) */}
        <div className={`rounded-sm border transition-all p-3 flex flex-col justify-between space-y-2 ${
          cacheScenario === 'hit' 
            ? 'border-[#22c55e] bg-[#22c55e]/10 ring-1 ring-[#22c55e]/40' 
            : 'border-[#232634] bg-[#10131d]'
        }`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
            <span>2. EDGE POP</span>
            <span className={cacheScenario === 'hit' ? 'text-[#22c55e] font-bold' : 'text-[#d4af37]'}>
              {cacheScenario === 'hit' ? 'HIT: FAST RETURN' : 'MISS: FORWARD'}
            </span>
          </div>
          <div className="space-y-1.5 py-2">
            <div className="h-9 rounded-xs bg-[#161a27] border border-[#282d40] flex items-center justify-between px-3">
              <span className="text-xs font-semibold text-[#ffffff] flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#38bdf8]" /> Cloudflare POP
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
                cacheScenario === 'hit' ? 'bg-[#22c55e] text-[#000]' : 'bg-[#d4af37] text-[#000]'
              }`}>
                {cacheScenario === 'hit' ? 'HIT' : 'MISS'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#64748b]">Local SSD Cache Ring</div>
          </div>
          <div className="text-[9px] font-mono bg-[#0b0d14] p-1.5 rounded-xs text-[#cbd5e1] border border-[#1a1e2d]">
            {cacheScenario === 'hit' ? 'Response: max-age=86400 (Hit)' : 'Cache-Control: revalidate'}
          </div>
        </div>

        {/* Tier 3: Origin Shield Layer */}
        <div className={`rounded-sm border transition-all p-3 flex flex-col justify-between space-y-2 ${
          cacheScenario === 'miss' 
            ? 'border-[#d4af37] bg-[#d4af37]/10 ring-1 ring-[#d4af37]/40' 
            : 'border-[#232634] bg-[#10131d] opacity-60'
        }`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
            <span>3. ORIGIN SHIELD</span>
            <span className="text-[#d4af37]">Central Cache</span>
          </div>
          <div className="space-y-1.5 py-2">
            <div className="h-9 rounded-xs bg-[#161a27] border border-[#282d40] flex items-center justify-between px-3">
              <span className="text-xs font-semibold text-[#ffffff] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#d4af37]" /> Regional Shield
              </span>
              <span className="text-[9px] font-mono text-[#94a3b8]">Ashburn DC</span>
            </div>
            <div className="text-[10px] font-mono text-[#64748b]">Request Collapsing (De-dupe)</div>
          </div>
          <div className="text-[9px] font-mono bg-[#0b0d14] p-1.5 rounded-xs text-[#94a3b8] border border-[#1a1e2d]">
            Protects Origin from Stampedes
          </div>
        </div>

        {/* Tier 4: Origin Datacenter */}
        <div className={`rounded-sm border transition-all p-3 flex flex-col justify-between space-y-2 ${
          cacheScenario === 'miss' 
            ? 'border-[#38bdf8] bg-[#38bdf8]/10 ring-1 ring-[#38bdf8]/40' 
            : 'border-[#232634] bg-[#10131d] opacity-50'
        }`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
            <span>4. ORIGIN SERVER</span>
            <span className="text-[#38bdf8]">Core Datacenter</span>
          </div>
          <div className="space-y-1.5 py-2">
            <div className="h-9 rounded-xs bg-[#161a27] border border-[#282d40] flex items-center justify-between px-3">
              <span className="text-xs font-semibold text-[#ffffff] flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-[#22c55e]" /> Origin Cluster
              </span>
              <span className="text-[9px] font-mono text-[#64748b]">AWS us-east-1</span>
            </div>
            <div className="text-[10px] font-mono text-[#64748b]">Compute &amp; Static S3 Bucket</div>
          </div>
          <div className="text-[9px] font-mono bg-[#0b0d14] p-1.5 rounded-xs text-[#94a3b8] border border-[#1a1e2d]">
            Dynamic Byte Generation
          </div>
        </div>
      </div>

      {/* SVG Flow Vector Overlay */}
      <div className="rounded-sm border border-[#1f2230] bg-[#07080d] p-3 text-[11px] font-mono text-[#cbd5e1] space-y-2">
        <div className="flex items-center justify-between text-[10px] text-[#94a3b8] uppercase">
          <span>Protocol &amp; Packet Flow Path:</span>
          <span className="text-[#d4af37]">Anycast BGP Steering</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="px-2 py-0.5 rounded-xs bg-[#162738] text-[#38bdf8] border border-[#38bdf8]/30 shrink-0">Client (HTTPS/3)</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#64748b] shrink-0" />
          <span className="px-2 py-0.5 rounded-xs bg-[#162738] text-[#38bdf8] border border-[#38bdf8]/30 shrink-0">Edge Anycast POP</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#64748b] shrink-0" />
          {cacheScenario === 'hit' ? (
            <span className="px-2 py-0.5 rounded-xs bg-[#122216] text-[#4ade80] border border-[#22c55e]/30 font-bold shrink-0">
              Return Cached Object (HTTP 200 / HIT)
            </span>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded-xs bg-[#221c10] text-[#d4af37] border border-[#d4af37]/30 shrink-0">Origin Shield</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#64748b] shrink-0" />
              <span className="px-2 py-0.5 rounded-xs bg-[#1f162c] text-[#c084fc] border border-[#c084fc]/30 shrink-0">Origin S3/API</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. Load Balancer (L4 vs L7) Concept Architecture Diagram (SVG + CSS Grid)
   ========================================================================= */
const LoadBalancerConceptDiagram: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'l4' | 'l7'>('l7');

  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
              Load Balancer Core Dispatcher Architecture
              <span className="text-[9px] font-mono uppercase bg-[#221c10] text-[#d4af37] px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                L4 vs L7 Engine
              </span>
            </h4>
            <p className="text-[11px] text-[#94a3b8]">
              Comparing Transport (TCP/IPVS) line-rate forwarding with Application (HTTP/Envoy) path routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xs bg-[#12141c] border border-[#232634] self-start sm:self-auto">
          <button
            onClick={() => setActiveLayer('l4')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-all cursor-pointer ${
              activeLayer === 'l4'
                ? 'bg-[#38bdf8] text-[#0b0c10] font-bold shadow-xs'
                : 'text-[#94a3b8] hover:text-[#ffffff]'
            }`}
          >
            Layer 4 (Transport / TCP)
          </button>
          <button
            onClick={() => setActiveLayer('l7')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-all cursor-pointer ${
              activeLayer === 'l7'
                ? 'bg-[#d4af37] text-[#0b0c10] font-bold shadow-xs'
                : 'text-[#94a3b8] hover:text-[#ffffff]'
            }`}
          >
            Layer 7 (Application / HTTP)
          </button>
        </div>
      </div>

      {/* Architecture Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Ingress Inflow */}
        <div className="rounded-sm border border-[#232634] bg-[#10131d] p-3 space-y-2">
          <div className="text-[10px] font-mono text-[#94a3b8] uppercase">1. Ingress Flow</div>
          <div className="p-2.5 rounded-xs bg-[#161a27] border border-[#24293a] space-y-1.5">
            <div className="text-xs font-semibold text-[#ffffff] flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#38bdf8]" /> Virtual IP (VIP)
            </div>
            <div className="text-[10px] font-mono text-[#94a3b8]">Port: 443 (HTTPS)</div>
            <div className="text-[9px] font-mono text-[#64748b]">BGP Anycast Advertisement</div>
          </div>
          <div className="text-[10px] font-mono text-[#cbd5e1] bg-[#07090e] p-2 rounded-xs border border-[#1b1e2b]">
            {activeLayer === 'l4' ? 'Inspects: IP:Port 4-tuple only' : 'Inspects: Host, URL Path, Cookies, JWT'}
          </div>
        </div>

        {/* Load Balancer Engine Core */}
        <div className="rounded-sm border border-[#d4af37]/40 bg-[#151310] p-3 space-y-2">
          <div className="text-[10px] font-mono text-[#d4af37] uppercase font-bold">2. LB Routing Engine</div>
          <div className="p-2.5 rounded-xs bg-[#1f1a14] border border-[#3e3422] space-y-1.5">
            <div className="text-xs font-semibold text-[#d4af37] flex items-center justify-between">
              <span>{activeLayer === 'l4' ? 'Linux IPVS / NLB' : 'Envoy / NGINX Plus'}</span>
              <span className="text-[9px] font-mono text-[#22c55e]">Healthy</span>
            </div>
            <div className="text-[10px] font-mono text-[#cbd5e1]">
              Algorithm: {activeLayer === 'l4' ? 'Consistent 5-Tuple Hash' : 'Weighted Least Request + Path Match'}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#94a3b8] bg-[#0b0c10] p-2 rounded-xs border border-[#1f2230]">
            {activeLayer === 'l4' 
              ? 'Zero TLS decryption -> 0.2ms latency' 
              : 'TLS Termination + WAF Filter -> 2.5ms latency'}
          </div>
        </div>

        {/* Target Backend Pools */}
        <div className="rounded-sm border border-[#232634] bg-[#10131d] p-3 space-y-2">
          <div className="text-[10px] font-mono text-[#94a3b8] uppercase">3. Backend Target Pools</div>
          <div className="space-y-1.5">
            <div className="p-1.5 rounded-xs bg-[#161a27] border border-[#24293a] flex items-center justify-between text-xs">
              <span className="font-mono text-[#cbd5e1]">Pod #1 (Payments)</span>
              <span className="text-[9px] font-mono text-[#22c55e]">Active</span>
            </div>
            <div className="p-1.5 rounded-xs bg-[#161a27] border border-[#24293a] flex items-center justify-between text-xs">
              <span className="font-mono text-[#cbd5e1]">Pod #2 (Auth Service)</span>
              <span className="text-[9px] font-mono text-[#22c55e]">Active</span>
            </div>
            <div className="p-1.5 rounded-xs bg-[#161a27] border border-[#24293a] flex items-center justify-between text-xs">
              <span className="font-mono text-[#cbd5e1]">Pod #3 (Search)</span>
              <span className="text-[9px] font-mono text-[#d4af37]">Degraded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. Microservices & Service Mesh Concept Architecture Diagram (SVG + CSS Grid)
   ========================================================================= */
const MicroservicesConceptDiagram: React.FC = () => {
  const [showMesh, setShowMesh] = useState(true);

  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#c084fc]/15 border border-[#c084fc]/40 text-[#c084fc]">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
              Microservices &amp; Service Mesh Ingress Architecture
              <span className="text-[9px] font-mono uppercase bg-[#231733] text-[#c084fc] px-2 py-0.5 rounded-full border border-[#c084fc]/30">
                Envoy Sidecars
              </span>
            </h4>
            <p className="text-[11px] text-[#94a3b8]">
              Independent bounded domains communicating over gRPC with mTLS, circuit breaking, and distributed tracing.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowMesh(!showMesh)}
          className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-all cursor-pointer border ${
            showMesh 
              ? 'bg-[#c084fc] text-[#0b0c10] font-bold border-[#c084fc]' 
              : 'bg-[#141622] text-[#94a3b8] border-[#232634]'
          }`}
        >
          {showMesh ? 'Sidecar Mesh: Active' : 'Direct Inter-Service'}
        </button>
      </div>

      {/* Grid: Ingress -> Microservices -> Data Stores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Ingress Gateway */}
        <div className="rounded-sm border border-[#232634] bg-[#10131d] p-3 space-y-2">
          <div className="text-[10px] font-mono text-[#94a3b8] uppercase">1. API GATEWAY</div>
          <div className="p-3 rounded-xs bg-[#161a27] border border-[#24293a] space-y-2">
            <div className="text-xs font-semibold text-[#ffffff] flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c084fc]" /> Envoy API Gateway
            </div>
            <div className="space-y-1 text-[10px] font-mono text-[#cbd5e1]">
              <div className="text-[#38bdf8]">&bull; JWT Verification</div>
              <div className="text-[#d4af37]">&bull; Rate Limit (10k req/s)</div>
              <div className="text-[#22c55e]">&bull; Routing Table by Host/Path</div>
            </div>
          </div>
          <div className="text-[9px] font-mono text-[#64748b]">W3C traceparent Injector</div>
        </div>

        {/* Mesh Services Pods */}
        <div className="rounded-sm border border-[#c084fc]/40 bg-[#161220] p-3 space-y-2">
          <div className="text-[10px] font-mono text-[#c084fc] uppercase font-bold">2. DOMAIN MICROSERVICES</div>
          <div className="space-y-2">
            {/* Service A */}
            <div className="p-2 rounded-xs bg-[#1d162d] border border-[#372652] text-xs">
              <div className="flex justify-between font-semibold text-[#ffffff]">
                <span>Order Service (Go)</span>
                {showMesh && <span className="text-[9px] font-mono text-[#c084fc]">Envoy Sidecar</span>}
              </div>
              <div className="text-[10px] font-mono text-[#94a3b8] mt-0.5">mTLS Protocol Buffer (gRPC)</div>
            </div>

            {/* Service B */}
            <div className="p-2 rounded-xs bg-[#1d162d] border border-[#372652] text-xs">
              <div className="flex justify-between font-semibold text-[#ffffff]">
                <span>Payment Service (Java)</span>
                {showMesh && <span className="text-[9px] font-mono text-[#22c55e]">Circuit: Closed</span>}
              </div>
              <div className="text-[10px] font-mono text-[#94a3b8] mt-0.5">Idempotency Key Verifier</div>
            </div>
          </div>
        </div>

        {/* Database Per Service */}
        <div className="rounded-sm border border-[#232634] bg-[#10131d] p-3 space-y-2">
          <div className="text-[10px] font-mono text-[#94a3b8] uppercase">3. ISOLATED DATA STORES</div>
          <div className="space-y-2">
            <div className="p-2 rounded-xs bg-[#161a27] border border-[#24293a] flex items-center justify-between text-xs">
              <span className="font-mono text-[#cbd5e1] flex items-center gap-1.5">
                <Database className="h-3 w-3 text-[#38bdf8]" /> Orders DB (Postgres)
              </span>
              <span className="text-[9px] font-mono text-[#64748b]">Private Schema</span>
            </div>
            <div className="p-2 rounded-xs bg-[#161a27] border border-[#24293a] flex items-center justify-between text-xs">
              <span className="font-mono text-[#cbd5e1] flex items-center gap-1.5">
                <Database className="h-3 w-3 text-[#d4af37]" /> Ledger DB (Cassandra)
              </span>
              <span className="text-[9px] font-mono text-[#64748b]">Append Only</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-[#ef4444] bg-[#1a0f12] p-1.5 rounded-xs border border-[#3e181e]">
            Rule: Strict No Cross-Service Direct SQL Queries
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. Caching & Invalidation Architecture Diagram (SVG + CSS Grid)
   ========================================================================= */
const CachingConceptDiagram: React.FC = () => {
  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      <div className="flex items-center gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="p-1 rounded-xs bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e]">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
            Distributed Caching &amp; Invalidation Flow
            <span className="text-[9px] font-mono uppercase bg-[#122216] text-[#22c55e] px-2 py-0.5 rounded-full border border-[#22c55e]/30">
              Cache-Aside Pattern
            </span>
          </h4>
          <p className="text-[11px] text-[#94a3b8]">
            Application mediates between memory (Redis Cluster) and durable storage (PostgreSQL) to minimize read latency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-2">
          <div className="text-[10px] font-mono text-[#38bdf8] uppercase">1. Application Read Flow</div>
          <p className="text-xs text-[#cbd5e1]">
            1. Query Redis for key <code className="text-[#d4af37]">user:1042</code>.<br />
            2. If <strong>Hit</strong>: Return payload in &lt; 1ms.<br />
            3. If <strong>Miss</strong>: Query PostgreSQL, write to Redis with TTL + Jitter, return to client.
          </p>
        </div>

        <div className="p-3 rounded-sm border border-[#22c55e]/40 bg-[#111c14] space-y-2">
          <div className="text-[10px] font-mono text-[#22c55e] uppercase font-bold">2. Redis In-Memory Cluster</div>
          <div className="text-xs font-mono text-[#cbd5e1] space-y-1">
            <div>&bull; MaxMemory: 64GB</div>
            <div>&bull; Eviction: <span className="text-[#22c55e]">allkeys-lru</span></div>
            <div>&bull; Cluster Hash Slots: 16,384</div>
          </div>
          <div className="text-[9px] font-mono text-[#64748b]">Replication: Asynchronous Sentinel</div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-2">
          <div className="text-[10px] font-mono text-[#d4af37] uppercase">3. Invalidation Invariant</div>
          <p className="text-xs text-[#cbd5e1]">
            On database write, <strong>DELETE the cache key</strong> rather than updating it to prevent race condition staleness.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. Database Sharding & Consistent Hashing Concept Diagram
   ========================================================================= */
const DatabaseShardingConceptDiagram: React.FC = () => {
  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      <div className="flex items-center gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="p-1 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
          <Database className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
            Database Sharding &amp; Consistent Hashing Ring
            <span className="text-[9px] font-mono uppercase bg-[#221c10] text-[#d4af37] px-2 py-0.5 rounded-full border border-[#d4af37]/30">
              Horizontal Partitioning
            </span>
          </h4>
          <p className="text-[11px] text-[#94a3b8]">
            Distributing millions of tenant records across independent physical database clusters without re-shuffling all data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1.5">
          <div className="text-[10px] font-mono text-[#d4af37]">Shard Key: tenant_id</div>
          <div className="text-xs text-[#cbd5e1]">
            MD5 or MurmurHash3 maps incoming keys to a continuous 360&deg; coordinate ring (0 to 2<sup>32</sup>-1).
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1.5">
          <div className="text-[10px] font-mono text-[#38bdf8]">Virtual Nodes (V-Nodes)</div>
          <div className="text-xs text-[#cbd5e1]">
            Each physical server manages 100-256 virtual positions on the ring to prevent data skew and hotspots.
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1.5">
          <div className="text-[10px] font-mono text-[#22c55e]">Failover &amp; Resharding</div>
          <div className="text-xs text-[#cbd5e1]">
            Adding a new database node only moves 1/N of existing records, leaving 90%+ of keys completely untouched.
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. Event Streaming & Kafka Concept Diagram
   ========================================================================= */
const EventStreamingConceptDiagram: React.FC = () => {
  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      <div className="flex items-center gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="p-1 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
            Event-Driven Architecture &amp; Kafka Log Partitions
            <span className="text-[9px] font-mono uppercase bg-[#221c10] text-[#d4af37] px-2 py-0.5 rounded-full border border-[#d4af37]/30">
              Append-Only Log
            </span>
          </h4>
          <p className="text-[11px] text-[#94a3b8]">
            Producers publish immutable event records; consumer groups process independent offsets concurrently.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1.5">
          <div className="text-[10px] font-mono text-[#38bdf8]">Event Producer</div>
          <div className="text-xs text-[#cbd5e1]">
            Publishes events with <code className="text-[#38bdf8]">acks=all</code> and idempotency keys to guarantee strictly once delivery into Kafka.
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1.5">
          <div className="text-[10px] font-mono text-[#d4af37]">Partitioned Topic</div>
          <div className="text-xs text-[#cbd5e1]">
            Strict ordering is guaranteed <strong>within each partition</strong>. Parallelism scales directly with partition count.
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1.5">
          <div className="text-[10px] font-mono text-[#22c55e]">Consumer Group</div>
          <div className="text-xs text-[#cbd5e1]">
            Multiple worker pods pull messages at their own pace, committing offsets upon successful transaction completion.
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. Rate Limiter (Token Bucket / Sliding Window) Concept Diagram
   ========================================================================= */
const RateLimiterConceptDiagram: React.FC = () => {
  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      <div className="flex items-center gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="p-1 rounded-xs bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b]">
          <Sliders className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
            Distributed Rate Limiting Engine
            <span className="text-[9px] font-mono uppercase bg-[#2b1e10] text-[#f59e0b] px-2 py-0.5 rounded-full border border-[#f59e0b]/30">
              Token Bucket &amp; Sliding Window
            </span>
          </h4>
          <p className="text-[11px] text-[#94a3b8]">
            Protects backend services against denial-of-service and runaway client retry storms with atomic Lua scripts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1">
          <div className="text-[10px] font-mono text-[#f59e0b]">Token Refill Rate</div>
          <div className="text-xs text-[#cbd5e1]">
            Tokens are added at rate <code className="text-[#f59e0b]">R</code> up to capacity <code className="text-[#f59e0b]">C</code>. Incoming requests consume 1 token.
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1">
          <div className="text-[10px] font-mono text-[#38bdf8]">Atomic Redis Lua Execution</div>
          <div className="text-xs text-[#cbd5e1]">
            Evaluates tokens and updates timestamps in a single atomic script, preventing race conditions across multi-pod gateways.
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1">
          <div className="text-[10px] font-mono text-[#ef4444]">HTTP 429 Response</div>
          <div className="text-xs text-[#cbd5e1]">
            When bucket is dry, immediately returns <code className="text-[#ef4444]">429 Too Many Requests</code> with <code className="text-[#cbd5e1]">Retry-After: 30</code>.
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   8. DNS & Geo-Routing Concept Diagram
   ========================================================================= */
const DnsAnycastConceptDiagram: React.FC = () => {
  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 sm:p-5 space-y-4 font-sans">
      <div className="flex items-center gap-2 border-b border-[#1b1e2a] pb-3">
        <div className="p-1 rounded-xs bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8]">
          <Globe className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#ffffff] font-serif flex items-center gap-2">
            DNS Hierarchy &amp; Anycast BGP Routing
            <span className="text-[9px] font-mono uppercase bg-[#162738] text-[#38bdf8] px-2 py-0.5 rounded-full border border-[#38bdf8]/30">
              Global Traffic Steering
            </span>
          </h4>
          <p className="text-[11px] text-[#94a3b8]">
            Translates hostnames to optimal IP addresses using Anycast BGP routing and geographic latency policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1">
          <div className="text-[10px] font-mono text-[#38bdf8]">1. Recursive Resolver</div>
          <div className="text-xs text-[#cbd5e1]">
            Local ISP or Public DNS (8.8.8.8) checks cache; on miss queries Root (.) -&gt; TLD (.com) -&gt; Authoritative.
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1">
          <div className="text-[10px] font-mono text-[#d4af37]">2. Geo-DNS &amp; EDNS Subnet</div>
          <div className="text-xs text-[#cbd5e1]">
            Inspects client IP subnet to return the IP address of the geographically closest regional datacenter.
          </div>
        </div>

        <div className="p-3 rounded-sm border border-[#232634] bg-[#10131d] space-y-1">
          <div className="text-[10px] font-mono text-[#22c55e]">3. BGP Anycast Advantage</div>
          <div className="text-xs text-[#cbd5e1]">
            Single IP address announced from 300+ edge POPs simultaneously. Internet routers steer to the lowest AS-hop destination.
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   9. Generic Architecture Pipeline Diagram (Fallback)
   ========================================================================= */
const GenericArchitecturePipelineDiagram: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="my-4 rounded-md border border-[#232634] bg-[#0a0c12] p-4 space-y-3 font-sans">
      <div className="flex items-center gap-2 border-b border-[#1b1e2a] pb-2.5">
        <div className="p-1 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
          <Layers className="h-3.5 w-3.5" />
        </div>
        <div className="text-xs font-semibold text-[#ffffff] font-serif flex items-center gap-2">
          Architectural Schematic: {title}
          <span className="text-[9px] font-mono uppercase bg-[#1a1c27] text-[#94a3b8] px-2 py-0.5 rounded-full border border-[#232634]">
            System Pattern
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xs bg-[#10131d] border border-[#232634] space-y-1">
          <div className="text-[9px] font-mono uppercase text-[#38bdf8]">Client / Ingress</div>
          <div className="text-[#cbd5e1] text-[11px]">User request ingress with TLS termination and signature validation.</div>
        </div>
        <div className="p-2.5 rounded-xs bg-[#10131d] border border-[#232634] space-y-1">
          <div className="text-[9px] font-mono uppercase text-[#d4af37]">Core Processing Unit</div>
          <div className="text-[#cbd5e1] text-[11px]">Domain logic execution with memory caching and transaction isolation.</div>
        </div>
        <div className="p-2.5 rounded-xs bg-[#10131d] border border-[#232634] space-y-1">
          <div className="text-[9px] font-mono uppercase text-[#22c55e]">Persistence &amp; Streams</div>
          <div className="text-[#cbd5e1] text-[11px]">Durable write-ahead logging, secondary replicas, and event publishing.</div>
        </div>
      </div>
    </div>
  );
};
