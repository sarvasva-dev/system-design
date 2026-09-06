import React, { useState } from 'react';
import { 
  Network, 
  ShieldCheck, 
  Server, 
  Cpu, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Lock, 
  Sliders, 
  Play,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export const LoadBalancerDiagram: React.FC = () => {
  const [layerMode, setLayerMode] = useState<'l4' | 'l7'>('l7');
  const [algorithm, setAlgorithm] = useState<'round_robin' | 'least_conn' | 'ip_hash'>('round_robin');
  const [selectedServerId, setSelectedServerId] = useState<string>('srv-1');
  const [activeRequestStep, setActiveRequestStep] = useState<number | null>(null);
  const [routedServerId, setRoutedServerId] = useState<string>('srv-1');
  const [isSimulating, setIsSimulating] = useState(false);

  // Server pool state
  const servers = [
    {
      id: 'srv-1',
      name: 'Backend Pod A-01',
      ip: '10.244.1.14:8080',
      az: 'us-east-1a',
      connections: 142,
      weight: 100,
      cpu: '34%',
      status: 'healthy',
      p99: '4.2ms'
    },
    {
      id: 'srv-2',
      name: 'Backend Pod A-02',
      ip: '10.244.2.88:8080',
      az: 'us-east-1b',
      connections: 87,
      weight: 100,
      cpu: '21%',
      status: 'healthy',
      p99: '3.8ms'
    },
    {
      id: 'srv-3',
      name: 'Backend Pod A-03',
      ip: '10.244.3.42:8080',
      az: 'us-east-1c',
      connections: 210,
      weight: 80,
      cpu: '68%',
      status: 'healthy',
      p99: '6.1ms'
    },
    {
      id: 'srv-4',
      name: 'Backend Pod A-04',
      ip: '10.244.1.99:8080',
      az: 'us-east-1a',
      connections: 12,
      weight: 50,
      cpu: '89%',
      status: 'degraded',
      p99: '24.5ms'
    }
  ];

  const handleSimulateRequest = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveRequestStep(1);

    // Determine destination server based on selected algorithm
    let target = 'srv-1';
    if (algorithm === 'round_robin') {
      const healthyOnes = servers.filter(s => s.status === 'healthy');
      const nextIdx = (healthyOnes.findIndex(s => s.id === routedServerId) + 1) % healthyOnes.length;
      target = healthyOnes[nextIdx]?.id || 'srv-1';
    } else if (algorithm === 'least_conn') {
      const minConn = servers.filter(s => s.status === 'healthy').reduce((prev, curr) => 
        curr.connections < prev.connections ? curr : prev, servers[0]
      );
      target = minConn.id;
    } else {
      // IP Hash - deterministic to srv-2
      target = 'srv-2';
    }

    setRoutedServerId(target);
    setSelectedServerId(target);

    setTimeout(() => setActiveRequestStep(2), 500);
    setTimeout(() => setActiveRequestStep(3), 1100);
    setTimeout(() => {
      setActiveRequestStep(4);
      setTimeout(() => {
        setIsSimulating(false);
        setActiveRequestStep(null);
      }, 1200);
    }, 1800);
  };

  const selectedServer = servers.find(s => s.id === selectedServerId) || servers[0];

  return (
    <div className="rounded-md border border-[#232634] bg-[#0c0d13] p-4 sm:p-6 lg:p-7 space-y-6 text-[#cbd5e1] font-sans">
      {/* Diagram Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2230] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xs bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]">
              <Network className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#ffffff] flex items-center gap-2">
              High-Availability Load Balancing Architecture
              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#1b1911] text-[#d4af37] border border-[#d4af37]/30">
                L4 vs L7 Engine
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Interactive traffic dispatch simulation comparing L4 (TCP/UDP Packet Level) vs L7 (HTTP/gRPC Contextual Routing).
          </p>
        </div>

        {/* Controls: Mode & Algorithm Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* L4 vs L7 Toggle */}
          <div className="flex items-center rounded-sm bg-[#141622] p-1 border border-[#232634]">
            <button
              onClick={() => setLayerMode('l7')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                layerMode === 'l7'
                  ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              Layer 7 (HTTP / Path)
            </button>
            <button
              onClick={() => setLayerMode('l4')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                layerMode === 'l4'
                  ? 'bg-[#38bdf8] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              Layer 4 (TCP / IP)
            </button>
          </div>

          {/* Algorithm Toggle */}
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as any)}
            className="rounded-sm bg-[#141622] border border-[#232634] px-3 py-1 text-xs font-mono text-[#e2e8f0] focus:border-[#d4af37] focus:outline-hidden cursor-pointer"
          >
            <option value="round_robin">Algo: Round Robin</option>
            <option value="least_conn">Algo: Weighted Least Connections</option>
            <option value="ip_hash">Algo: Consistent IP Hash</option>
          </select>

          {/* Simulate Button */}
          <button
            onClick={handleSimulateRequest}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 rounded-sm bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-[#0b0c10] hover:bg-[#e6c158] active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Play className={`h-3 w-3 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Routing Request...' : 'Dispatch Request'}</span>
          </button>
        </div>
      </div>

      {/* Main Architectural Canvas */}
      <div className="relative rounded-md border border-[#212433] bg-[#08090d] p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between gap-3 relative py-4">

          {/* Step 1: Internet & Client Ingress */}
          <div className="flex flex-col items-center gap-2 w-40 shrink-0">
            <div className={`w-full rounded-sm border p-3 text-center transition-all ${
              activeRequestStep === 1 
                ? 'border-[#38bdf8] bg-[#38bdf8]/15 shadow-lg shadow-[#38bdf8]/20 ring-1 ring-[#38bdf8]' 
                : 'border-[#232634] bg-[#12141c]'
            }`}>
              <div className="flex items-center justify-center mb-1">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-ping mr-1.5"></span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#38bdf8] font-bold">Client Ingress</span>
              </div>
              <div className="text-xs font-semibold text-[#ffffff]">100k Req/sec</div>
              <div className="text-[10px] font-mono text-[#94a3b8] mt-0.5">TLS 1.3 / QUIC</div>
            </div>
            <div className="text-[10px] text-[#64748b] font-mono text-center">
              Client IP: 198.51.100.42
            </div>
          </div>

          {/* Connecting Arrow 1 */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-full h-0.5 bg-[#232634] relative">
              {activeRequestStep === 1 && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#38bdf8] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
              )}
            </div>
            <span className="text-[9px] font-mono text-[#64748b] mt-1">BGP Anycast Edge</span>
          </div>

          {/* Step 2: Load Balancer Node */}
          <div className="flex flex-col items-center gap-2 w-56 shrink-0">
            <div className={`w-full rounded-md border p-4 text-center relative transition-all ${
              activeRequestStep === 2
                ? 'border-[#d4af37] bg-[#d4af37]/15 shadow-xl shadow-[#d4af37]/20 ring-2 ring-[#d4af37]'
                : 'border-[#303446] bg-[#141624]'
            }`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-1 rounded-xs bg-[#0b0c10] border border-[#2d3142] px-2 py-0.5 text-[9px] font-mono text-[#d4af37] font-semibold mb-2">
                <ShieldCheck className="h-3 w-3 text-[#d4af37]" />
                <span>{layerMode === 'l7' ? 'Layer 7 ALB / Nginx' : 'Layer 4 NLB / IPVS'}</span>
              </div>

              <div className="text-sm font-semibold text-[#ffffff]">
                {layerMode === 'l7' ? 'Application Proxy' : 'TCP Connection Proxy'}
              </div>

              <div className="mt-2 text-[10px] font-mono text-[#cbd5e1] space-y-1 text-left bg-[#0b0c10]/80 p-2 rounded-xs border border-[#1f2230]">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Inspection:</span>
                  <span className={layerMode === 'l7' ? 'text-[#d4af37]' : 'text-[#38bdf8]'}>
                    {layerMode === 'l7' ? 'URL Path + Cookies' : 'IP:Port Tuples'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">SSL Term:</span>
                  <span className="text-[#22c55e]">Hardware ECDH Offload</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Active Algo:</span>
                  <span className="text-[#cbd5e1]">{algorithm.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-[#94a3b8] font-mono text-center flex items-center gap-1">
              <Lock className="h-3 w-3 text-[#22c55e]" /> Mutual TLS Upstream
            </div>
          </div>

          {/* Connecting Arrow 2 */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-full h-0.5 bg-[#232634] relative">
              {activeRequestStep === 2 && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#d4af37] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
              )}
            </div>
            <span className="text-[9px] font-mono text-[#d4af37] mt-1">Health Check Filter</span>
          </div>

          {/* Step 3: Upstream Target Group / Backend Pods */}
          <div className="flex flex-col gap-2 w-64 shrink-0">
            <div className="text-[10px] uppercase tracking-wider font-mono text-[#94a3b8] flex items-center justify-between px-1">
              <span>Upstream Pool (K8s Service)</span>
              <span className="text-[#22c55e]">3/4 Healthy</span>
            </div>

            <div className="space-y-1.5">
              {servers.map((srv) => {
                const isTarget = routedServerId === srv.id && activeRequestStep === 3;
                const isSelected = selectedServerId === srv.id;
                const isHealthy = srv.status === 'healthy';

                return (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedServerId(srv.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xs border text-left transition-all cursor-pointer ${
                      isTarget
                        ? 'border-[#22c55e] bg-[#22c55e]/20 ring-1 ring-[#22c55e]'
                        : isSelected
                        ? 'border-[#d4af37] bg-[#1a1c27]'
                        : 'border-[#232634] bg-[#10121a] hover:border-[#38bdf8]/60 hover:bg-[#141622]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${
                        isHealthy ? 'bg-[#22c55e]' : 'bg-[#ef4444] animate-pulse'
                      }`} />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[#ffffff] truncate flex items-center gap-1.5">
                          {srv.name}
                          {isTarget && (
                            <span className="px-1 py-0.2 rounded-xs bg-[#22c55e] text-[#000] text-[8px] font-mono uppercase font-bold">
                              Routed
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] font-mono text-[#94a3b8]">{srv.ip} ({srv.az})</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10px] shrink-0">
                      <div className="text-[#cbd5e1]">{srv.connections} conn</div>
                      <div className={srv.cpu.startsWith('8') ? 'text-[#ef4444]' : 'text-[#64748b]'}>{srv.cpu} CPU</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Selected Node Deep Inspector */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#d4af37] font-semibold">
            <Sliders className="h-3.5 w-3.5 text-[#d4af37]" />
            Routing Decision Logic
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            {layerMode === 'l7'
              ? 'Parsing HTTP request line, evaluating Host header & URL path (/api/v1/* vs /static/*), injecting X-Forwarded-For and X-Request-ID headers before proxying.'
              : 'Direct kernel-level IP packet rewrites (DNAT/SNAT or Direct Server Return). Skips HTTP buffer parsing, preserving high packet-per-second (PPS) line rate.'}
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#38bdf8] font-semibold">
            <Activity className="h-3.5 w-3.5 text-[#38bdf8]" />
            Synthetic Health Checking
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Active probe: <code className="text-[#38bdf8] font-mono text-[11px]">GET /healthz</code> every 5s. 2 consecutive 5xx errors or timeouts (&gt;2000ms) transition state to Degraded, immediately stopping new connection allocations.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#22c55e] font-semibold">
            <Zap className="h-3.5 w-3.5 text-[#22c55e]" />
            Inspector: {selectedServer.name}
          </div>
          <div className="text-xs space-y-1 font-mono text-[#cbd5e1]">
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">p99 Latency:</span>
              <span className="text-[#22c55e]">{selectedServer.p99}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Avail Zone:</span>
              <span>{selectedServer.az}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Status:</span>
              <span className={selectedServer.status === 'healthy' ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                {selectedServer.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
