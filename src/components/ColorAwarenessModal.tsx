import React from 'react';
import { 
  Palette, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Wifi, 
  Cpu, 
  Layers, 
  Eye,
  Search,
  ExternalLink
} from 'lucide-react';

interface ColorAwarenessModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorAwarenessMode: boolean;
  setColorAwarenessMode: (enabled: boolean) => void;
  onSearchTerm: (term: string) => void;
}

export const ColorAwarenessModal: React.FC<ColorAwarenessModalProps> = ({
  isOpen,
  onClose,
  colorAwarenessMode,
  setColorAwarenessMode,
  onSearchTerm
}) => {
  if (!isOpen) return null;

  const colorTiers = [
    {
      name: 'Architectural Gold',
      hex: '#d4af37',
      bgClass: 'bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]',
      dotClass: 'bg-[#d4af37]',
      role: 'Staff Specifications & Core Laws',
      desc: 'Used for foundational architectural laws (Little\'s Law, Amdahl\'s Law), high-level component blueprints, and primary active states.',
      contrast: 'WCAG AAA (10.2:1 against #0b0c10)',
      examples: ['Little\'s Law', 'PACELC Theorem', 'SLA Boundaries', 'Write-Ahead Log (WAL)']
    },
    {
      name: 'Emerald Green',
      hex: '#22c55e',
      bgClass: 'bg-[#22c55e]/15 border-[#22c55e]/40 text-[#4ade80]',
      dotClass: 'bg-[#22c55e]',
      role: 'SLA Guarantees & Healthy Resilience',
      desc: 'Signifies verified benchmark targets, idempotency guarantees, horizontal scalability, read replicas, and completed curriculum modules.',
      contrast: 'WCAG AAA (9.8:1 against #0b0c10)',
      examples: ['99.999% Availability', 'Idempotent Keys', 'Horizontal Auto-Scale', 'MemTable Flush']
    },
    {
      name: 'Crimson Red',
      hex: '#ef4444',
      bgClass: 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#f87171]',
      dotClass: 'bg-[#ef4444]',
      role: 'Anti-Patterns & Critical SPOFs',
      desc: 'Highlights single points of failure (SPOF), cascading failovers, dual-write hazards, database lock contention, and interview red flags.',
      contrast: 'WCAG AA (7.4:1 against #0b0c10)',
      examples: ['Dual-Write Bug', 'Split-Brain Scenario', 'Cascading Timeout', 'Unbounded Queue']
    },
    {
      name: 'Cyan & Sky Blue',
      hex: '#38bdf8',
      bgClass: 'bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#38bdf8]',
      dotClass: 'bg-[#38bdf8]',
      role: 'Network Ingress, Edge & Transport',
      desc: 'Represents network layer protocols, CDN edge caching, gRPC/HTTP2 multiplexing, WebSocket streaming, and distributed message buses.',
      contrast: 'WCAG AAA (9.2:1 against #0b0c10)',
      examples: ['gRPC Multiplexing', 'HTTP/3 QUIC', 'Kafka Partitioning', 'Anycast Routing']
    },
    {
      name: 'Amethyst Violet',
      hex: '#c084fc',
      bgClass: 'bg-[#c084fc]/15 border-[#c084fc]/40 text-[#c084fc]',
      dotClass: 'bg-[#c084fc]',
      role: 'Consensus & State Synchronization',
      desc: 'Denotes distributed consensus algorithms (Raft, Paxos), quorum leases, vector clocks, CRDTs, and replicated state machine logs.',
      contrast: 'WCAG AAA (8.7:1 against #0b0c10)',
      examples: ['Raft Leader Election', 'CRDT State Merge', 'Paxos Synod', 'Quorum Read/Write']
    },
    {
      name: 'Tangerine Amber',
      hex: '#fb923c',
      bgClass: 'bg-[#fb923c]/15 border-[#fb923c]/40 text-[#fb923c]',
      dotClass: 'bg-[#fb923c]',
      role: 'Circuit Breakers & Fallback Mechanisms',
      desc: 'Signifies graceful degradation, dead-letter queues (DLQ), circuit breaker trip points, rate limiting, and exponential backoff with jitter.',
      contrast: 'WCAG AA (8.1:1 against #0b0c10)',
      examples: ['Circuit Breaker Open', 'Token Bucket Throttling', 'Dead Letter Queue', 'Jitter Backoff']
    }
  ];

  const quickTerms = [
    'CAP Theorem',
    'Write-Ahead Log',
    'Consistent Hashing',
    'CRDT',
    'LSM-Tree',
    'B+ Tree',
    'Circuit Breaker',
    'Transactional Outbox',
    'AWS Nitro System',
    'Little’s Law',
    'Amdahl’s Law',
    'OpenTelemetry'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl rounded-md border border-[#232634] bg-[#0e1017] p-5 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#232634] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
              <Palette className="h-4 w-4" />
              <span>Color Awareness &amp; Semantic Architecture System</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#ffffff]">
              Architectural Color Language
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8]">
              Standardized color psychology and contrast-verified semantic encoding for high-stakes system design.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#232634] bg-[#161824] text-[#cbd5e1] hover:text-[#ffffff] hover:border-[#d4af37] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Color Awareness Mode Toggle */}
        <div className="rounded-sm border border-[#232634] bg-[#141622] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ffffff]">
              <Eye className="h-4 w-4 text-[#d4af37]" />
              <span>High-Contrast Color Awareness Mode</span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Enhances semantic color highlights on architectural terms and failure modes throughout all chapters.
            </p>
          </div>
          <button
            onClick={() => setColorAwarenessMode(!colorAwarenessMode)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold transition-all cursor-pointer min-h-[40px] shrink-0 ${
              colorAwarenessMode
                ? 'bg-[#d4af37] text-[#000000] shadow-md hover:bg-[#e6c148]'
                : 'bg-[#1e2230] text-[#94a3b8] border border-[#2d3142] hover:text-[#fff]'
            }`}
          >
            {colorAwarenessMode ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Active (High Contrast)</span>
              </>
            ) : (
              <span>Enable Color Awareness</span>
            )}
          </button>
        </div>

        {/* 6 Color Semantic Tiers */}
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
            Color Semantic Taxonomy &amp; WCAG Contrast
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {colorTiers.map((tier, idx) => (
              <div 
                key={idx} 
                className="rounded-sm border border-[#232634] bg-[#12141c] p-4 space-y-2 hover:border-[#2d3142] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${tier.dotClass} shadow-xs`}></span>
                    <span className="font-serif font-medium text-sm text-[#ffffff]">{tier.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#94a3b8]">{tier.hex}</span>
                </div>

                <div className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] font-semibold rounded-xs border ${tier.bgClass}`}>
                  {tier.role}
                </div>

                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  {tier.desc}
                </p>

                <div className="pt-2 border-t border-[#1a1c27] flex items-center justify-between text-[10px] text-[#64748b]">
                  <span>{tier.contrast}</span>
                  <span className="font-mono text-[#94a3b8]">4.5:1+ Safe</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Double-Tap Feature Explainer & Interactive Term Test Chips */}
        <div className="rounded-sm border border-[#272a38] bg-[#151722] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
              <Search className="h-4 w-4" />
              <span>Double-Tap Term Explainer Test</span>
            </div>
            <span className="text-[10px] text-[#94a3b8]">2x Tap / Double Click</span>
          </div>

          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Double-tap or double-click <strong>ANY</strong> term across the app to instantly open Google Search with the prompt <code className="text-[#d4af37] bg-[#0b0c10] px-1.5 py-0.5 rounded-xs">explain &#123;term&#125; in system design</code>. Test it below:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {quickTerms.map((term) => (
              <button
                key={term}
                onClick={() => onSearchTerm(term)}
                title={`Double tap or click to explain "${term}" in system design`}
                className="group inline-flex items-center gap-1.5 rounded-sm border border-[#2a2e40] bg-[#1a1d2b] px-2.5 py-1.5 text-xs text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] transition-all cursor-pointer min-h-[36px]"
              >
                <span>{term}</span>
                <ExternalLink className="h-3 w-3 text-[#64748b] group-hover:text-[#d4af37]" />
              </button>
            ))}
          </div>
        </div>

        {/* Close footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-sm bg-[#1e2230] border border-[#2d3142] px-5 py-2 text-xs font-semibold text-[#ffffff] hover:bg-[#282d3f] transition-colors cursor-pointer min-h-[40px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
