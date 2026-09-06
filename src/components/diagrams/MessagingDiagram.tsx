import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  Layers, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Server, 
  Database,
  Sliders,
  Sparkles
} from 'lucide-react';

export const MessagingDiagram: React.FC = () => {
  const [selectedPartition, setSelectedPartition] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deliveryGuarantee, setDeliveryGuarantee] = useState<'at_least_once' | 'exactly_once'>('exactly_once');

  const partitions = [
    { id: 0, leader: 'Broker 1 (10.0.1.10)', isr: 'Brokers 1, 2', offset: 148902, lag: 0 },
    { id: 1, leader: 'Broker 2 (10.0.1.11)', isr: 'Brokers 2, 3', offset: 142104, lag: 2 },
    { id: 2, leader: 'Broker 3 (10.0.1.12)', isr: 'Brokers 3, 1', offset: 156991, lag: 0 }
  ];

  const handlePublishMessage = () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2); // Kafka Broker Partition Append
      setTimeout(() => {
        setActiveStep(3); // In-Sync Replica (ISR) Ack
        setTimeout(() => {
          setActiveStep(4); // Consumer Group receives message & commits offset
          setTimeout(() => {
            setIsPublishing(false);
            setActiveStep(null);
          }, 1200);
        }, 800);
      }, 700);
    }, 600);
  };

  return (
    <div className="rounded-md border border-[#232634] bg-[#0c0d13] p-4 sm:p-6 lg:p-7 space-y-6 text-[#cbd5e1] font-sans">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2230] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xs bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#ffffff] flex items-center gap-2">
              Apache Kafka &amp; Event Streaming Architecture
              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#1b1911] text-[#d4af37] border border-[#d4af37]/30">
                Log-Based Broker
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Visualizing partitioned append-only commit logs, In-Sync Replicas (ISR), and consumer group offset management.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-sm bg-[#141622] p-1 border border-[#232634]">
            <button
              onClick={() => setDeliveryGuarantee('exactly_once')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                deliveryGuarantee === 'exactly_once'
                  ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              Exactly-Once (Idempotent)
            </button>
            <button
              onClick={() => setDeliveryGuarantee('at_least_once')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                deliveryGuarantee === 'at_least_once'
                  ? 'bg-[#38bdf8] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              At-Least-Once (Standard)
            </button>
          </div>

          <button
            onClick={handlePublishMessage}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 rounded-sm bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-[#0b0c10] hover:bg-[#e6c158] active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Play className={`h-3 w-3 ${isPublishing ? 'animate-spin' : ''}`} />
            <span>{isPublishing ? 'Emitting Event...' : 'Produce Event'}</span>
          </button>
        </div>
      </div>

      {/* Main Visual Flow Canvas */}
      <div className="relative rounded-md border border-[#212433] bg-[#08090d] p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[760px] flex items-center justify-between gap-4 py-4">

          {/* Producer Box */}
          <div className="w-48 shrink-0 space-y-2">
            <div className={`p-4 rounded-md border text-center transition-all ${
              activeStep === 1 
                ? 'border-[#38bdf8] bg-[#38bdf8]/15 ring-2 ring-[#38bdf8]' 
                : 'border-[#232634] bg-[#12141c]'
            }`}>
              <div className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold">Event Producer</div>
              <div className="text-xs font-semibold text-[#ffffff] mt-1">Order Service Pod</div>
              <div className="text-[9px] font-mono text-[#94a3b8] mt-1 bg-[#0a0b10] p-1.5 rounded-xs border border-[#1f2230]">
                acks = all (ISR=2)
              </div>
            </div>
            <div className="text-[10px] text-[#64748b] font-mono text-center">
              Murmur2(key) Partitioning
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full h-0.5 bg-[#232634] relative">
              {activeStep === 1 && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#38bdf8] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
              )}
            </div>
            <span className="text-[9px] font-mono text-[#64748b] mt-1">TCP Direct to Leader</span>
          </div>

          {/* Middle: Kafka Cluster & Topic Partitions */}
          <div className="w-80 shrink-0 space-y-2">
            <div className="p-4 rounded-md border border-[#33384c] bg-[#141624] text-center space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#d4af37]">
                <span>Topic: orders.created.v1</span>
                <span className="text-[#22c55e]">3 Partitions</span>
              </div>

              {/* Partition Blocks */}
              <div className="space-y-1.5 text-left">
                {partitions.map((p) => {
                  const isTarget = selectedPartition === p.id && (activeStep === 2 || activeStep === 3);
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPartition(p.id)}
                      className={`p-2 rounded-xs border text-xs font-mono transition-all cursor-pointer ${
                        isTarget
                          ? 'border-[#22c55e] bg-[#22c55e]/20 ring-1 ring-[#22c55e]'
                          : selectedPartition === p.id
                          ? 'border-[#d4af37] bg-[#1b1e2c]'
                          : 'border-[#232634] bg-[#0c0e16] hover:border-[#38bdf8]/60'
                      }`}
                    >
                      <div className="flex justify-between font-semibold text-[#ffffff]">
                        <span>Partition #{p.id}</span>
                        <span className="text-[10px] text-[#38bdf8]">Offset: {p.offset + (isTarget ? 1 : 0)}</span>
                      </div>
                      <div className="text-[9px] text-[#94a3b8] flex justify-between mt-0.5">
                        <span>{p.leader}</span>
                        <span className="text-[#22c55e]">ISR: OK</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full h-0.5 bg-[#232634] relative">
              {activeStep === 3 && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#22c55e] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
              )}
            </div>
            <span className="text-[9px] font-mono text-[#22c55e] mt-1">Pull Stream (Long Poll)</span>
          </div>

          {/* Consumer Group */}
          <div className="w-56 shrink-0 space-y-2">
            <div className={`p-4 rounded-md border text-center transition-all ${
              activeStep === 4 
                ? 'border-[#22c55e] bg-[#22c55e]/15 ring-2 ring-[#22c55e]' 
                : 'border-[#232634] bg-[#12141c]'
            }`}>
              <div className="text-[10px] font-mono uppercase text-[#22c55e] font-bold">Consumer Group</div>
              <div className="text-xs font-semibold text-[#ffffff] mt-1">Payment &amp; Inventory Workers</div>
              <div className="text-[9px] font-mono text-[#94a3b8] mt-1 bg-[#0a0b10] p-1.5 rounded-xs border border-[#1f2230]">
                Auto-Commit: Offset sync
              </div>
            </div>
            <div className="text-[10px] text-[#64748b] font-mono text-center">
              Temporal Decoupling
            </div>
          </div>

        </div>
      </div>

      {/* Kafka Technical Deep Principles */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#d4af37] font-semibold">
            <Layers className="h-3.5 w-3.5 text-[#d4af37]" />
            Partition Key Ordering Guarantee
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Kafka guarantees total strict ordering <strong>within a single partition only</strong>, not globally across the entire topic. By providing an entity key (e.g. <code className="text-[#d4af37]">order_id</code>), all updates for that specific order land on the identical partition in exact timestamp sequence.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#38bdf8] font-semibold">
            <Database className="h-3.5 w-3.5 text-[#38bdf8]" />
            Transactional Outbox Pattern
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Never write to a relational database and publish to Kafka in two separate operations (dual-write vulnerability). Write both business state and an outbox record inside the <strong>same ACID local database transaction</strong>, then have a CDC daemon (Debezium) tail the WAL into Kafka.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#22c55e] font-semibold">
            <Radio className="h-3.5 w-3.5 text-[#22c55e]" />
            In-Sync Replicas (ISR) Durability
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Setting <code className="text-[#22c55e]">acks=all</code> with <code className="text-[#22c55e]">min.insync.replicas=2</code> ensures the producer does not receive an acknowledgement until the write is safely flushed to both the partition leader and at least one follower, avoiding message loss during leader elections.
          </p>
        </div>
      </div>
    </div>
  );
};
