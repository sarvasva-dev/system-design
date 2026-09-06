import React, { useState } from 'react';
import { 
  Server, 
  Globe, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Layers, 
  Zap, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  Info,
  Maximize2
} from 'lucide-react';

interface TierNode {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  tech: string;
  latency: string;
  protocol: string;
  description: string;
  resilience: string;
}

export const VisualArchitectureDiagram: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('gateway');

  const nodes: TierNode[] = [
    {
      id: 'client',
      name: 'Client Applications',
      category: 'Tier 1: Ingress & Edge',
      icon: Globe,
      tech: 'Browser, iOS, Android, Desktop',
      latency: '< 1ms Local',
      protocol: 'HTTPS / WSS / QUIC',
      description: 'Global end-users initiating requests via DNS Geo-routing to nearest Anycast Point of Presence (POP).',
      resilience: 'Client-side exponential backoff, request deduplication, optimistic UI updates.'
    },
    {
      id: 'cdn',
      name: 'Anycast CDN & WAF',
      category: 'Tier 2: Edge Security',
      icon: ShieldCheck,
      tech: 'Cloudflare, CloudFront, Envoy',
      latency: '5 - 15ms RTT',
      protocol: 'TLS 1.3 / BGP Anycast',
      description: 'Terminates TLS cryptographic handshake, mitigates L3/L4 DDoS attacks, and caches static asset blobs.',
      resilience: 'Anycast BGP automatic rerouting on transit fiber cable cuts.'
    },
    {
      id: 'gateway',
      name: 'API Gateway & L7 LB',
      category: 'Tier 3: Ingress Control',
      icon: Layers,
      tech: 'Kong, AWS ALB, Nginx Pingora',
      latency: '1 - 3ms Overhead',
      protocol: 'HTTP/2 to gRPC Transcoding',
      description: 'Enforces token-bucket rate limiting per tenant, validates RS256 JWT signatures, and routes paths to internal services.',
      resilience: 'Active-active multi-AZ clustering with automated health check eviction.'
    },
    {
      id: 'services',
      name: 'Microservice Fleet',
      category: 'Tier 4: Business Compute',
      icon: Cpu,
      tech: 'Kubernetes Pods, Go, Rust, Node.js',
      latency: '10 - 25ms Execution',
      protocol: 'Internal gRPC / Protobuf',
      description: 'Stateless containers executing domain business logic, coordinating database transactions and message dispatches.',
      resilience: 'Horizontal Pod Autoscaler (HPA), circuit breakers, graceful SIGTERM termination.'
    },
    {
      id: 'cache',
      name: 'In-Memory Cache Cluster',
      category: 'Tier 5: Acceleration',
      icon: Zap,
      tech: 'Redis Cluster 7.x, Memcached',
      latency: '< 1.5ms Sub-millisecond',
      protocol: 'RESP3 / TCP Direct',
      description: 'Sharded in-memory key-value cache holding active session tokens, hot catalog queries, and distributed mutex locks.',
      resilience: 'Master-replica async replication with Redis Sentinel / cluster raft failover.'
    },
    {
      id: 'messaging',
      name: 'Event Bus & Stream',
      category: 'Tier 6: Async Decoupling',
      icon: Activity,
      tech: 'Apache Kafka, RabbitMQ, AWS SQS',
      latency: '2 - 5ms Append',
      protocol: 'Kafka Binary Protocol',
      description: 'Immutable partitioned append-only log decoupling synchronous requests from asynchronous background workers.',
      resilience: '3x in-sync replicas (ISR) with min.insync.replicas=2 for zero data loss.'
    },
    {
      id: 'database',
      name: 'Distributed Database',
      category: 'Tier 7: Persistent State',
      icon: Database,
      tech: 'PostgreSQL, CockroachDB, Spanner',
      latency: '3 - 8ms NVMe SSD Seek',
      protocol: 'Postgres Wire / Raft Consensus',
      description: 'Primary ACID state store with MVCC isolation, connection pooling (PgBouncer), and automated read replica fan-out.',
      resilience: 'Synchronous standby multi-AZ replication with RPO=0, RTO < 30s.'
    },
    {
      id: 'storage',
      name: 'Object & Blob Storage',
      category: 'Tier 8: Cold Storage',
      icon: HardDrive,
      tech: 'AWS S3, Google Cloud Storage, Ceph',
      latency: '50 - 150ms First Byte',
      protocol: 'RESTful S3 API',
      description: 'Content-addressed store for media files, PDF exports, and database write-ahead log (WAL) snapshot archives.',
      resilience: 'Erasure coding (Reed-Solomon 8+4) yielding 99.999999999% durability.'
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[2];

  return (
    <div className="rounded-md border border-[#232634] bg-[#0d0e14] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2230] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#ffffff] flex items-center gap-2">
              Interactive System Topology Map
              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#1c1910] text-[#d4af37] border border-[#d4af37]/30">
                Live Interactive
              </span>
            </h3>
            <p className="text-[11px] text-[#94a3b8]">
              Click any architecture node to inspect protocols, p99 latency boundaries, and failover mechanics.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#64748b] flex items-center gap-1.5 self-start sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse"></span>
          <span>Traffic Flow: Ingress &rarr; Storage</span>
        </div>
      </div>

      {/* Interactive Topology Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = node.id === selectedNodeId;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`relative flex flex-col justify-between p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#d4af37] bg-[#1a1c27] shadow-md ring-1 ring-[#d4af37]/50'
                  : 'border-[#232634] bg-[#12141c] hover:border-[#38bdf8]/60 hover:bg-[#161824]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-xs border ${
                    isSelected 
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' 
                      : 'bg-[#181a26] border-[#2d3142] text-[#94a3b8]'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-[9px] text-[#94a3b8]">
                    {node.latency}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#ffffff] leading-tight">
                    {node.name}
                  </div>
                  <div className="text-[10px] text-[#94a3b8] truncate mt-0.5 font-mono">
                    {node.tech}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-[#d4af37]/30 flex items-center justify-between text-[9px] font-mono text-[#d4af37]">
                  <span>Active Inspector</span>
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Node Inspector Panel */}
      <div className="rounded-sm border border-[#2d3142] bg-[#151722] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232634] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs bg-[#1f2230] text-[#d4af37] border border-[#2d3142]">
              {selectedNode.category}
            </span>
            <h4 className="text-sm font-semibold text-[#ffffff]">
              {selectedNode.name}
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#cbd5e1]">
            <span className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-[#22c55e]" />
              <strong>Latency:</strong> {selectedNode.latency}
            </span>
            <span className="text-[#475569]">&bull;</span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-[#38bdf8]" />
              <strong>Protocol:</strong> {selectedNode.protocol}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#94a3b8]">
              Operational Responsibility &amp; Flow
            </div>
            <p className="text-[#cbd5e1] leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#4ade80]">
              High Availability &amp; Disaster Recovery
            </div>
            <p className="text-[#cbd5e1] leading-relaxed">
              {selectedNode.resilience}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
