import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Database, 
  HardDrive, 
  Activity, 
  Globe, 
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export type FlowScenarioId = 'cache-hit' | 'cache-miss' | 'write-wal' | 'stream-event';

interface FlowScenario {
  id: FlowScenarioId;
  title: string;
  tag: string;
  durationMs: number;
  description: string;
  steps: {
    from: string;
    to: string;
    label: string;
    timestampMs: number;
    explanation: string;
    packetColor: string;
  }[];
}

const FLOW_SCENARIOS: FlowScenario[] = [
  {
    id: 'cache-hit',
    title: 'High-Speed Read (Cache Hit)',
    tag: 'Sub-2ms Path',
    durationMs: 4000,
    description: 'Incoming client request resolves in Anycast CDN and L7 Redis cache without touching disk or microservice fleet.',
    steps: [
      { from: 'client', to: 'cdn', label: 'HTTPS Request', timestampMs: 300, explanation: 'Client initiates TLS 1.3 handshake to nearest Edge POP.', packetColor: '#38bdf8' },
      { from: 'cdn', to: 'gateway', label: 'Route & Auth', timestampMs: 1200, explanation: 'API Gateway validates JWT token and rate-limiting quota.', packetColor: '#d4af37' },
      { from: 'gateway', to: 'cache', label: 'GET /item:42', timestampMs: 2100, explanation: 'Direct sub-millisecond memory lookup against Redis cluster shard.', packetColor: '#4ade80' },
      { from: 'cache', to: 'gateway', label: 'Cache Hit 200 OK', timestampMs: 3000, explanation: 'Object found in RAM, serialized JSON returned immediately.', packetColor: '#4ade80' },
      { from: 'gateway', to: 'client', label: 'Response Delivered', timestampMs: 3700, explanation: 'Client receives response in 1.8ms total end-to-end RTT.', packetColor: '#22c55e' }
    ]
  },
  {
    id: 'cache-miss',
    title: 'Cache Miss & DB Read Hydration',
    tag: 'Cold Path',
    durationMs: 5500,
    description: 'Redis cache misses, triggering microservice execution, read replica database query, and cache backfill.',
    steps: [
      { from: 'client', to: 'gateway', label: 'HTTP Query', timestampMs: 300, explanation: 'Client request routes through Anycast gateway.', packetColor: '#38bdf8' },
      { from: 'gateway', to: 'services', label: 'gRPC Invoke', timestampMs: 1200, explanation: 'Microservice container dispatches catalog lookup.', packetColor: '#c084fc' },
      { from: 'services', to: 'cache', label: 'Cache Query', timestampMs: 2000, explanation: 'Cache probe returns NULL (Key Miss).', packetColor: '#f87171' },
      { from: 'services', to: 'database', label: 'SQL Index Seek', timestampMs: 2900, explanation: 'Queries primary PostgreSQL B-tree index on NVMe storage.', packetColor: '#38bdf8' },
      { from: 'database', to: 'services', label: 'Row Visible', timestampMs: 3800, explanation: 'MVCC read committed snapshot yields current record.', packetColor: '#4ade80' },
      { from: 'services', to: 'cache', label: 'SETEX (Backfill)', timestampMs: 4600, explanation: 'Populates Redis cache with 300s TTL to prevent stampedes.', packetColor: '#d4af37' },
      { from: 'services', to: 'client', label: '200 OK Response', timestampMs: 5200, explanation: 'Final response returned to client in ~18ms.', packetColor: '#22c55e' }
    ]
  },
  {
    id: 'write-wal',
    title: 'ACID Write & WAL Persistence',
    tag: 'Strict Consistency',
    durationMs: 5000,
    description: 'Client mutation committed via Two-Phase Commit with Write-Ahead Log fsync and replica acknowledgment.',
    steps: [
      { from: 'client', to: 'gateway', label: 'POST /orders', timestampMs: 300, explanation: 'Client submits idempotent checkout payload.', packetColor: '#d4af37' },
      { from: 'gateway', to: 'services', label: 'Transaction Begin', timestampMs: 1100, explanation: 'Order service initiates transactional boundary.', packetColor: '#c084fc' },
      { from: 'services', to: 'database', label: 'Append WAL', timestampMs: 2100, explanation: 'Database appends transaction entry to sequential Write-Ahead Log.', packetColor: '#f59e0b' },
      { from: 'database', to: 'storage', label: 'WAL Archive Backup', timestampMs: 3200, explanation: 'Continuous replication stream pushed to durable S3 bucket.', packetColor: '#38bdf8' },
      { from: 'database', to: 'services', label: 'Commit ACK (fsync)', timestampMs: 4000, explanation: 'Disk confirms fsync on primary NVMe; RPO=0 guaranteed.', packetColor: '#4ade80' },
      { from: 'services', to: 'client', label: '201 Created', timestampMs: 4800, explanation: 'Order confirmation transmitted back to client.', packetColor: '#22c55e' }
    ]
  },
  {
    id: 'stream-event',
    title: 'Event-Driven Async Stream (Kafka)',
    tag: 'Decoupled Fan-out',
    durationMs: 5200,
    description: 'Synchronous write generates an immutable domain event streamed via Kafka topic partitions to downstream workers.',
    steps: [
      { from: 'services', to: 'messaging', label: 'Produce Event', timestampMs: 400, explanation: 'Service emits OrderPlaced event to Kafka topic partition 3.', packetColor: '#f59e0b' },
      { from: 'messaging', to: 'messaging', label: 'ISR Replication', timestampMs: 1500, explanation: 'Kafka replicates record across 3 in-sync brokers (min.insync.replicas=2).', packetColor: '#d4af37' },
      { from: 'messaging', to: 'services', label: 'Consume Group', timestampMs: 2700, explanation: 'Billing and Analytics consumer workers poll records with offset tracking.', packetColor: '#c084fc' },
      { from: 'services', to: 'database', label: 'Materialize View', timestampMs: 3800, explanation: 'Analytics worker updates materialized summary table.', packetColor: '#38bdf8' },
      { from: 'services', to: 'storage', label: 'Parquet Lake Export', timestampMs: 4700, explanation: 'Batch writer compresses micro-batches into columnar cloud storage.', packetColor: '#4ade80' }
    ]
  }
];

interface NodePosition {
  id: string;
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  icon: React.ElementType;
  tech: string;
}

const TOPOLOGY_NODES: NodePosition[] = [
  { id: 'client', name: 'Clients', x: 8, y: 50, icon: Globe, tech: 'Web / App' },
  { id: 'cdn', name: 'Edge CDN', x: 22, y: 25, icon: ShieldCheck, tech: 'Anycast POP' },
  { id: 'gateway', name: 'API Gateway', x: 38, y: 50, icon: Layers, tech: 'Envoy / ALB' },
  { id: 'cache', name: 'Redis Cache', x: 55, y: 18, icon: Zap, tech: 'Cluster RAM' },
  { id: 'services', name: 'Microservices', x: 55, y: 65, icon: Cpu, tech: 'K8s Cluster' },
  { id: 'messaging', name: 'Kafka Stream', x: 73, y: 30, icon: Activity, tech: 'Commit Log' },
  { id: 'database', name: 'Distributed DB', x: 75, y: 75, icon: Database, tech: 'PostgreSQL / Raft' },
  { id: 'storage', name: 'Object Storage', x: 92, y: 50, icon: HardDrive, tech: 'S3 / Glacier' }
];

interface FlowAnimatorProps {
  chapterVisualUrl?: string;
  chapterTitle?: string;
}

export const FlowAnimator: React.FC<FlowAnimatorProps> = ({
  chapterVisualUrl,
  chapterTitle
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<FlowScenarioId>('cache-hit');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progressMs, setProgressMs] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const scenario = FLOW_SCENARIOS.find(s => s.id === selectedScenarioId) || FLOW_SCENARIOS[0];

  // Active step in scenario
  const currentStep = scenario.steps.slice().reverse().find(step => progressMs >= step.timestampMs) || scenario.steps[0];
  const stepIndex = scenario.steps.indexOf(currentStep);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) * speedMultiplier;
        setProgressMs(prev => {
          const next = prev + delta;
          if (next >= scenario.durationMs) {
            return 0; // loop
          }
          return next;
        });
      }
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, speedMultiplier, scenario.durationMs]);

  // Calculate packet position between 'from' and 'to'
  const fromNode = TOPOLOGY_NODES.find(n => n.id === currentStep.from) || TOPOLOGY_NODES[0];
  const toNode = TOPOLOGY_NODES.find(n => n.id === currentStep.to) || TOPOLOGY_NODES[1];

  // Find step start & end timestamps to interpolate packet
  const nextStep = scenario.steps[stepIndex + 1];
  const stepStart = currentStep.timestampMs;
  const stepEnd = nextStep ? nextStep.timestampMs : scenario.durationMs;
  const stepRatio = Math.max(0, Math.min(1, (progressMs - stepStart) / (stepEnd - stepStart || 1)));

  const packetX = fromNode.x + (toNode.x - fromNode.x) * stepRatio;
  const packetY = fromNode.y + (toNode.y - fromNode.y) * stepRatio;

  const handleScenarioChange = (id: FlowScenarioId) => {
    setSelectedScenarioId(id);
    setProgressMs(0);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-md border border-[#232634] bg-[#0c0d13] p-4 sm:p-6 lg:p-7 space-y-6 shadow-xl">
      {/* Header bar */}
      <div className="border-b border-[#1f2230] pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#1c1910] text-[#d4af37] border border-[#d4af37]/40">
            <Sparkles className="h-3 w-3 text-[#d4af37] animate-pulse" />
            Dynamic Flow Engine
          </span>
          <span className="text-xs font-mono text-[#94a3b8]">60fps Simulation</span>
        </div>
        <h3 className="text-base sm:text-xl font-serif font-medium text-[#ffffff] mt-1">
          System Request &amp; Packet Flow Simulator
        </h3>
        <p className="text-xs text-[#94a3b8] mt-0.5">
          Watch live request lifecycle traversal across distributed networking, compute, cache, and storage tiers.
        </p>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {FLOW_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`flex flex-col p-3 rounded-sm border text-left transition-all cursor-pointer min-h-[64px] ${
                isSelected
                  ? 'border-[#d4af37] bg-[#1a1c27] ring-1 ring-[#d4af37]/40 shadow-sm'
                  : 'border-[#232634] bg-[#12141c] hover:border-[#38bdf8]/50 hover:bg-[#151722]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[9px] uppercase font-mono tracking-wider font-semibold ${
                  isSelected ? 'text-[#d4af37]' : 'text-[#64748b]'
                }`}>
                  {sc.tag}
                </span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-ping" />}
              </div>
              <span className="text-xs font-medium text-[#ffffff] mt-1 line-clamp-1">
                {sc.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas Topology Flow Animator Stage */}
      <div className="relative w-full h-80 sm:h-96 rounded-md border border-[#1f2230] bg-[#08090d] overflow-hidden">
        {/* Background grid pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Static connection lines between tiers */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="flowLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connect client to CDN & Gateway */}
          <line x1="8%" y1="50%" x2="22%" y2="25%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="8%" y1="50%" x2="38%" y2="50%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="22%" y1="25%" x2="38%" y2="50%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="38%" y1="50%" x2="55%" y2="18%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="38%" y1="50%" x2="55%" y2="65%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="55%" y1="18%" x2="55%" y2="65%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="55%" y1="65%" x2="73%" y2="30%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="55%" y1="65%" x2="75%" y2="75%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="75%" y1="75%" x2="92%" y2="50%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="73%" y1="30%" x2="92%" y2="50%" stroke="#272a3a" strokeWidth="2" strokeDasharray="4 4" />

          {/* Active Flow Vector Line */}
          <line 
            x1={`${fromNode.x}%`} 
            y1={`${fromNode.y}%`} 
            x2={`${toNode.x}%`} 
            y2={`${toNode.y}%`} 
            stroke={currentStep.packetColor} 
            strokeWidth="3" 
            strokeLinecap="round"
            filter="url(#glow)"
            opacity="0.85"
          />

          {/* Animated Glowing Packet Node */}
          <circle 
            cx={`${packetX}%`} 
            cy={`${packetY}%`} 
            r="7" 
            fill={currentStep.packetColor} 
            filter="url(#glow)"
          />
          <circle 
            cx={`${packetX}%`} 
            cy={`${packetY}%`} 
            r="12" 
            fill="none" 
            stroke={currentStep.packetColor} 
            strokeWidth="1.5"
            opacity="0.6"
            className="animate-ping"
          />
        </svg>

        {/* Render Node Cards on Stage */}
        {TOPOLOGY_NODES.map((node) => {
          const isFrom = node.id === currentStep.from;
          const isTo = node.id === currentStep.to;
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute flex flex-col items-center select-none transition-all duration-300 z-10 ${
                isFrom || isTo ? 'scale-110' : 'scale-95 opacity-80 hover:opacity-100'
              }`}
            >
              <div className={`p-2.5 rounded-sm border shadow-lg transition-all flex items-center justify-center ${
                isFrom 
                  ? 'border-[#38bdf8] bg-[#162238] text-[#38bdf8] shadow-[#38bdf8]/20 ring-2 ring-[#38bdf8]/40'
                  : isTo 
                  ? 'border-[#d4af37] bg-[#221f14] text-[#d4af37] shadow-[#d4af37]/20 ring-2 ring-[#d4af37]/40'
                  : 'border-[#272a38] bg-[#11131c] text-[#94a3b8]'
              }`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#ffffff] mt-1 whitespace-nowrap drop-shadow-md">
                {node.name}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-[#64748b] whitespace-nowrap">
                {node.tech}
              </span>
            </div>
          );
        })}

        {/* Live Packet Telemetry Badge floating on Stage */}
        <div className="absolute top-3 left-3 bg-[#0c0e15]/90 backdrop-blur-md border border-[#272a38] rounded-xs px-3 py-1.5 text-xs text-[#cbd5e1] font-mono flex items-center gap-2 z-20">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentStep.packetColor }}></span>
          <span className="font-semibold text-white">{currentStep.label}</span>
          <span className="text-[#64748b]">&bull;</span>
          <span className="text-[#94a3b8]">{fromNode.name} &rarr; {toNode.name}</span>
        </div>

        {/* Progress scrub bar at bottom of stage */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a1c27] z-20">
          <div 
            className="h-full bg-gradient-to-r from-[#38bdf8] via-[#d4af37] to-[#4ade80] transition-all"
            style={{ width: `${(progressMs / scenario.durationMs) * 100}%` }}
          />
        </div>
      </div>

      {/* Real-Time Explanatory Commentary Box */}
      <div className="rounded-sm border border-[#2d3142] bg-[#141620] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] shrink-0 mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#d4af37]">
              Step {stepIndex + 1} of {scenario.steps.length}: {currentStep.label}
            </div>
            <p className="text-xs sm:text-sm text-[#e2e8f0] mt-0.5 leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-sm border border-[#2d3142] bg-[#1a1c28] text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer"
            title={isPlaying ? 'Pause Flow' : 'Play Flow'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setProgressMs(0)}
            className="p-2.5 rounded-sm border border-[#2d3142] bg-[#1a1c28] text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer"
            title="Restart Scenario"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
            className="px-2.5 py-1.5 rounded-sm border border-[#2d3142] bg-[#1a1c28] text-xs font-mono font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer min-w-[48px] text-center"
            title="Change Simulation Speed"
          >
            {speedMultiplier}x
          </button>
        </div>
      </div>
    </div>
  );
};
