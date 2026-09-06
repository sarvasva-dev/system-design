import React, { useState } from 'react';
import { 
  Zap, 
  Database, 
  Server, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  Sliders, 
  ArrowRight, 
  ShieldAlert,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

export const CachingDiagram: React.FC = () => {
  const [pattern, setPattern] = useState<'cache_aside' | 'write_through' | 'write_back'>('cache_aside');
  const [scenario, setScenario] = useState<'hit' | 'miss'>('hit');
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stampedeMode, setStampedeMode] = useState<'none' | 'xfetch'>('none');

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);

    if (pattern === 'cache_aside') {
      if (scenario === 'hit') {
        // Step 1: App checks Redis -> Hit! -> returns data in 0.4ms
        setTimeout(() => {
          setActiveStep(2); // Cache Hit
          setTimeout(() => {
            setIsSimulating(false);
            setActiveStep(null);
          }, 1500);
        }, 600);
      } else {
        // Cache Miss: Step 1 App checks Redis -> Miss -> Step 2 Query DB -> Step 3 Write back to Redis
        setTimeout(() => {
          setActiveStep(2); // Cache Miss
          setTimeout(() => {
            setActiveStep(3); // Query DB (15ms)
            setTimeout(() => {
              setActiveStep(4); // Backfill Redis with TTL
              setTimeout(() => {
                setIsSimulating(false);
                setActiveStep(null);
              }, 1200);
            }, 800);
          }, 700);
        }, 600);
      }
    } else if (pattern === 'write_through') {
      // Write Through: App writes to Cache, Cache synchronously writes to DB
      setTimeout(() => {
        setActiveStep(2); // Write Cache
        setTimeout(() => {
          setActiveStep(3); // Sync DB write
          setTimeout(() => {
            setIsSimulating(false);
            setActiveStep(null);
          }, 1200);
        }, 800);
      }, 600);
    } else {
      // Write Back: App writes to Cache, returns immediately, async worker flushes to DB
      setTimeout(() => {
        setActiveStep(2); // Write Cache & Return
        setTimeout(() => {
          setActiveStep(3); // Async batch queue flush to DB
          setTimeout(() => {
            setIsSimulating(false);
            setActiveStep(null);
          }, 1200);
        }, 800);
      }, 600);
    }
  };

  return (
    <div className="rounded-md border border-[#232634] bg-[#0c0d13] p-4 sm:p-6 lg:p-7 space-y-6 text-[#cbd5e1] font-sans">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f2230] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xs bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#ffffff] flex items-center gap-2">
              Distributed Caching &amp; Invalidation Strategies
              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#1b1911] text-[#d4af37] border border-[#d4af37]/30">
                Sub-Millisecond Engine
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Simulating Cache-Aside (Lazy Loading), Write-Through, Write-Back, and XFetch probabilistic stampede mitigation.
          </p>
        </div>

        {/* Pattern & Scenario Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-sm bg-[#141622] p-1 border border-[#232634]">
            <button
              onClick={() => setPattern('cache_aside')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                pattern === 'cache_aside'
                  ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              Cache-Aside
            </button>
            <button
              onClick={() => setPattern('write_through')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                pattern === 'write_through'
                  ? 'bg-[#38bdf8] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              Write-Through
            </button>
            <button
              onClick={() => setPattern('write_back')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                pattern === 'write_back'
                  ? 'bg-[#a855f7] text-[#0b0c10] font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#ffffff]'
              }`}
            >
              Write-Back (Behind)
            </button>
          </div>

          {pattern === 'cache_aside' && (
            <div className="flex items-center rounded-sm bg-[#141622] p-1 border border-[#232634]">
              <button
                onClick={() => setScenario('hit')}
                className={`px-2 py-1 text-xs font-mono rounded-xs transition-colors cursor-pointer ${
                  scenario === 'hit'
                    ? 'bg-[#22c55e] text-[#000] font-bold'
                    : 'text-[#94a3b8] hover:text-[#fff]'
                }`}
              >
                Cache Hit (0.3ms)
              </button>
              <button
                onClick={() => setScenario('miss')}
                className={`px-2 py-1 text-xs font-mono rounded-xs transition-colors cursor-pointer ${
                  scenario === 'miss'
                    ? 'bg-[#ef4444] text-[#fff] font-bold'
                    : 'text-[#94a3b8] hover:text-[#fff]'
                }`}
              >
                Cache Miss (15ms)
              </button>
            </div>
          )}

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 rounded-sm bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-[#0b0c10] hover:bg-[#e6c158] active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Play className={`h-3 w-3 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Executing...' : 'Run Cache Flow'}</span>
          </button>
        </div>
      </div>

      {/* Main Visual Flow Canvas */}
      <div className="relative rounded-md border border-[#212433] bg-[#08090d] p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[720px] flex items-center justify-between gap-6 py-4">

          {/* Node 1: Application Service */}
          <div className="w-56 shrink-0 space-y-2">
            <div className={`p-4 rounded-md border text-center transition-all ${
              activeStep === 1 || activeStep === 4 
                ? 'border-[#38bdf8] bg-[#38bdf8]/15 ring-2 ring-[#38bdf8]' 
                : 'border-[#2d3142] bg-[#12141c]'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase text-[#38bdf8] font-bold">
                <Server className="h-3.5 w-3.5" /> App Microservice
              </div>
              <div className="text-sm font-semibold text-[#ffffff] mt-1">Read: user_profile:8192</div>
              <div className="text-[10px] font-mono text-[#94a3b8] mt-1 bg-[#090a0f] p-1.5 rounded-xs border border-[#1f2230]">
                Key: <span className="text-[#d4af37]">CRC16(k) % 16384</span>
              </div>
            </div>
            <div className="text-[10px] text-[#64748b] font-mono text-center">
              Stateless Node Pod
            </div>
          </div>

          {/* Middle: Redis Cache Cluster */}
          <div className="flex-1 flex flex-col items-center justify-center relative px-4">
            {/* Arrows */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono mb-2">
              <span className={activeStep === 1 ? 'text-[#38bdf8] font-bold' : 'text-[#64748b]'}>
                1. GET key &rarr;
              </span>
              <span className={activeStep === 4 ? 'text-[#22c55e] font-bold' : 'text-[#64748b]'}>
                &larr; 4. SET key EX 3600
              </span>
            </div>

            {/* Redis Box */}
            <div className={`w-full p-4 rounded-md border text-center relative transition-all ${
              activeStep === 2 
                ? scenario === 'hit' 
                  ? 'border-[#22c55e] bg-[#22c55e]/15 ring-2 ring-[#22c55e]' 
                  : 'border-[#ef4444] bg-[#ef4444]/15 ring-2 ring-[#ef4444]'
                : 'border-[#33384c] bg-[#141624]'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#d4af37] mb-1">
                <span>Redis Cluster (DDR5 RAM)</span>
                <span className="text-[#22c55e]">p99: 250µs</span>
              </div>
              <div className="text-sm font-semibold text-[#ffffff]">
                In-Memory Key-Value Store
              </div>

              {/* Status Pill */}
              <div className="mt-2.5 flex items-center justify-center gap-2">
                {activeStep === 2 && (
                  scenario === 'hit' ? (
                    <span className="px-2 py-0.5 rounded-xs bg-[#22c55e] text-[#000] text-xs font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> CACHE HIT! Return Data
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-xs bg-[#ef4444] text-[#fff] text-xs font-mono font-bold flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> CACHE MISS! Fallback to DB
                    </span>
                  )
                )}
                {!activeStep && (
                  <span className="text-[10px] font-mono text-[#94a3b8]">
                    MaxMemory: 64GB &bull; Eviction: volatile-lru
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Node 3: Primary Relational Database */}
          <div className="w-56 shrink-0 space-y-2">
            <div className={`p-4 rounded-md border text-center transition-all ${
              activeStep === 3
                ? 'border-[#d4af37] bg-[#d4af37]/15 ring-2 ring-[#d4af37]' 
                : 'border-[#2d3142] bg-[#12141c]'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase text-[#d4af37] font-bold">
                <Database className="h-3.5 w-3.5" /> Primary Database
              </div>
              <div className="text-sm font-semibold text-[#ffffff] mt-1">PostgreSQL NVMe SSD</div>
              <div className="text-[10px] font-mono text-[#94a3b8] mt-1 bg-[#090a0f] p-1.5 rounded-xs border border-[#1f2230]">
                Disk Seek: <span className="text-[#f59e0b]">8-15ms IOPS</span>
              </div>
            </div>
            <div className="text-[10px] text-[#64748b] font-mono text-center">
              Source of Truth (ACID)
            </div>
          </div>

        </div>
      </div>

      {/* Strategies Deep Explanation */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#d4af37] font-semibold">
            <Layers className="h-3.5 w-3.5 text-[#d4af37]" />
            Cache-Aside (Lazy Loading) Invariant
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Application requests data from cache first. On miss, application loads data from database and writes back to cache with TTL. Only requested keys occupy RAM; handles node restarts gracefully without cold load crashes.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#ef4444] font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-[#ef4444]" />
            Thundering Herd (Stampede) Defense
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            When a viral key expires, 10,000 concurrent threads experience a cache miss and hit the database simultaneously. Solution: <strong>Distributed Mutex (Redlock)</strong> to let 1 worker rebuild, or <strong>XFetch probabilistic early recomputation</strong> before TTL expiration.
          </p>
        </div>

        <div className="rounded-sm border border-[#232634] bg-[#12141c] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#22c55e] font-semibold">
            <Clock className="h-3.5 w-3.5 text-[#22c55e]" />
            Write Invalidation Order: Delete vs Update
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Always <strong>Update Database first, then Delete Cache key</strong>. Never update cache directly during database writes (avoids out-of-order race conditions where an old write overwrites a newer cached value).
          </p>
        </div>
      </div>
    </div>
  );
};
