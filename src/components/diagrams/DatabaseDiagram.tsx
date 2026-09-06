import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Play, 
  HardDrive, 
  Cpu, 
  Activity, 
  ShieldCheck,
  Zap,
  Repeat
} from 'lucide-react';

export const DatabaseDiagram: React.FC = () => {
  const [viewMode, setViewMode] = useState<'replication' | 'sharding'>('replication');
  const [activeReplicationStep, setActiveReplicationStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [shardingKey, setShardingKey] = useState<string>('tenant_492');

  const handleSimulateWrite = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveReplicationStep(1);

    setTimeout(() => {
      setActiveReplicationStep(2); // WAL Log write on primary
      setTimeout(() => {
        setActiveReplicationStep(3); // Network WAL stream to replicas
        setTimeout(() => {
          setActiveReplicationStep(4); // Standby applies WAL to local storage
          setTimeout(() => {
            setIsSimulating(false);
            setActiveReplicationStep(null);
          }, 1200);
        }, 800);
      }, 700);
    }, 600);
  };

  // Hash helper for consistent hashing demo
  const getHashValue = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 360;
  };

  const keyAngle = getHashValue(shardingKey);
  const targetShard = keyAngle < 120 ? 'Shard A (us-east)' : keyAngle < 240 ? 'Shard B (eu-central)' : 'Shard C (ap-south)';

  return (
    <div className="rounded-md border border-[#232634] bg-[#0c0d13] p-4 sm:p-6 lg:p-7 space-y-6 text-[#cbd5e1] font-sans">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2230] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xs bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#ffffff] flex items-center gap-2">
              Database Replication &amp; Consistent Hashing Architecture
              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#1b1911] text-[#d4af37] border border-[#d4af37]/30">
                ACID &bull; WAL &bull; Sharding
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Visualizing Write-Ahead Log (WAL) streaming, MVCC concurrency, and horizontal Consistent Hashing rings.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-sm bg-[#141622] p-1 border border-[#232634]">
            <button
              onClick={() => setViewMode('replication')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                viewMode === 'replication'
                  ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              WAL Streaming Replication
            </button>
            <button
              onClick={() => setViewMode('sharding')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                viewMode === 'sharding'
                  ? 'bg-[#38bdf8] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              Consistent Hashing Ring
            </button>
          </div>

          {viewMode === 'replication' ? (
            <button
              onClick={handleSimulateWrite}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-[#0b0c10] hover:bg-[#e6c158] active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Play className={`h-3 w-3 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Streaming WAL...' : 'Simulate Write Commit'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-[#94a3b8]">Key:</span>
              <input
                type="text"
                value={shardingKey}
                onChange={(e) => setShardingKey(e.target.value)}
                placeholder="tenant_id"
                className="w-28 rounded-sm bg-[#141622] border border-[#232634] px-2 py-1 text-xs font-mono text-[#e2e8f0] focus:border-[#38bdf8] focus:outline-hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Visual Canvas */}
      {viewMode === 'replication' ? (
        <div className="relative rounded-md border border-[#212433] bg-[#08090d] p-4 sm:p-6 overflow-x-auto">
          <div className="min-w-[700px] flex items-center justify-between gap-6 py-4">

            {/* Writer App */}
            <div className="w-48 shrink-0 space-y-2">
              <div className={`p-4 rounded-md border text-center transition-all ${
                activeReplicationStep === 1 
                  ? 'border-[#38bdf8] bg-[#38bdf8]/15 ring-2 ring-[#38bdf8]' 
                  : 'border-[#232634] bg-[#12141c]'
              }`}>
                <div className="text-[10px] font-mono uppercase text-[#38bdf8] font-semibold">Write Client</div>
                <div className="text-xs font-semibold text-[#ffffff] mt-1">INSERT INTO orders</div>
                <div className="text-[9px] font-mono text-[#94a3b8] mt-1">Serializable Isolation</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-0.5 bg-[#232634] relative">
                {activeReplicationStep === 1 && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#38bdf8] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
                )}
              </div>
              <span className="text-[9px] font-mono text-[#64748b] mt-1">Port 5432 (PgBouncer)</span>
            </div>

            {/* Primary Writer Node */}
            <div className="w-64 shrink-0 space-y-2">
              <div className={`p-4 rounded-md border text-center relative transition-all ${
                activeReplicationStep === 2
                  ? 'border-[#d4af37] bg-[#d4af37]/15 ring-2 ring-[#d4af37]'
                  : 'border-[#2d3142] bg-[#151722]'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#d4af37] mb-1">
                  <span>Primary Instance (RW)</span>
                  <span className="text-[#22c55e]">Active Leader</span>
                </div>
                <div className="text-sm font-semibold text-[#ffffff]">PostgreSQL 16 Cluster</div>

                <div className="mt-3 p-2 bg-[#090a0f] rounded-xs border border-[#1f2230] text-left text-[10px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Buffer Pool:</span>
                    <span className="text-[#cbd5e1]">Shared Buffers 32GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">WAL Append:</span>
                    <span className={activeReplicationStep === 2 ? 'text-[#22c55e] font-bold' : 'text-[#d4af37]'}>
                      LSN: 0/1A49B00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Replication Stream Arrow */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-0.5 bg-[#232634] relative">
                {activeReplicationStep === 3 && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 w-4 bg-[#22c55e] rounded-full animate-[moveRight_0.6s_linear_infinite]" />
                )}
              </div>
              <span className="text-[9px] font-mono text-[#22c55e] mt-1">walsender streaming (TCP)</span>
            </div>

            {/* Read Replica Pool */}
            <div className="w-64 shrink-0 space-y-2">
              <div className="text-[10px] uppercase font-mono text-[#94a3b8] flex justify-between px-1">
                <span>Read Replicas (RO)</span>
                <span className="text-[#38bdf8]">Repl Lag: &lt;10ms</span>
              </div>

              <div className="space-y-1.5">
                {['Replica Node 01 (us-east-1b)', 'Replica Node 02 (us-east-1c)'].map((name, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xs border text-left transition-all ${
                      activeReplicationStep === 4
                        ? 'border-[#22c55e] bg-[#22c55e]/15 ring-1 ring-[#22c55e]'
                        : 'border-[#232634] bg-[#10121a]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#ffffff]">
                      <span>{name}</span>
                      <span className="text-[9px] font-mono text-[#22c55e]">walreceiver</span>
                    </div>
                    <div className="text-[9px] font-mono text-[#94a3b8] mt-0.5">
                      Hot Standby &bull; Serves Read Traffic
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Consistent Hashing Ring Visualizer */
        <div className="relative rounded-md border border-[#212433] bg-[#08090d] p-6 text-center space-y-4">
          <div className="max-w-md mx-auto space-y-2">
            <div className="text-xs font-mono text-[#94a3b8]">
              Hash Ring: <span className="text-[#38bdf8]">SHA-256(key) mod 360&deg;</span>
            </div>
            
            {/* Visual Dial representation */}
            <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-[#232634] flex items-center justify-center bg-[#0d0e15] shadow-inner">
              {/* Shard marks */}
              <div className="absolute top-2 text-[10px] font-mono text-[#38bdf8]">Shard A (0&deg;)</div>
              <div className="absolute right-2 text-[10px] font-mono text-[#d4af37]">Shard B (120&deg;)</div>
              <div className="absolute bottom-2 text-[10px] font-mono text-[#22c55e]">Shard C (240&deg;)</div>

              {/* Central Key Pointer */}
              <div 
                className="absolute w-1 h-20 bg-[#f59e0b] origin-bottom rounded-full transition-transform duration-500"
                style={{ transform: `rotate(${keyAngle}deg)`, bottom: '50%' }}
              />
              <div className="h-4 w-4 rounded-full bg-[#f59e0b] z-10 shadow-lg" />
            </div>

            <div className="p-3 bg-[#12141c] rounded-sm border border-[#232634] text-xs font-mono text-[#cbd5e1] space-y-1">
              <div>Key: <strong className="text-[#ffffff]">{shardingKey}</strong></div>
              <div>Calculated Ring Slot: <strong className="text-[#f59e0b]">{keyAngle}&deg; / 360&deg;</strong></div>
              <div>Assigned Destination: <strong className="text-[#22c55e]">{targetShard}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Database Deep Principles */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#d4af37] font-semibold">
            <HardDrive className="h-3.5 w-3.5 text-[#d4af37]" />
            Write-Ahead Log (WAL) Durability
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Transactions append serialized delta operations to the append-only Write-Ahead Log (WAL) on disk before modifying dirty pages in RAM. On crash or sudden power loss, recovery replays the WAL sequence to guarantee zero committed data loss.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#38bdf8] font-semibold">
            <Repeat className="h-3.5 w-3.5 text-[#38bdf8]" />
            Consistent Hashing with Virtual Nodes
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Standard modular hashing (<code className="text-[#38bdf8]">key % N</code>) remaps virtually 100% of keys when a server is added or removed. Consistent hashing assigns each physical server 256 virtual positions on the hash ring, moving only <code className="text-[#38bdf8]">K/N</code> keys on scaling.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#22c55e] font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-[#22c55e]" />
            Replication Lag &amp; Read-Your-Own-Writes
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Asynchronous replication introduces 5-50ms of replica lag. To prevent users from editing a profile and seeing outdated data on refresh, route user read queries to the Primary for 5 seconds following any write operation.
          </p>
        </div>
      </div>
    </div>
  );
};
