import React, { useState } from 'react';
import { Calculator, Activity, Wifi, Cpu, Layers } from 'lucide-react';

export const CapacityCalculator: React.FC = () => {
  // Input parameters with sensible defaults (50M DAU)
  const [dau, setDau] = useState<number>(50); // in Millions
  const [readsPerUser, setReadsPerUser] = useState<number>(20);
  const [writesPerUser, setWritesPerUser] = useState<number>(2);
  const [readPayloadKb, setReadPayloadKb] = useState<number>(50); // KB
  const [writePayloadKb, setWritePayloadKb] = useState<number>(200); // KB
  const [peakFactor, setPeakFactor] = useState<number>(3);
  const [latencyMs, setLatencyMs] = useState<number>(60); // ms
  const [parallelFraction, setParallelFraction] = useState<number>(85); // %
  const [numCores, setNumCores] = useState<number>(16);

  // Math derivations
  const totalDailyReads = dau * 1_000_000 * readsPerUser;
  const totalDailyWrites = dau * 1_000_000 * writesPerUser;

  // Average & Peak QPS (using 86,400s per day)
  const avgReadQps = Math.round(totalDailyReads / 86400);
  const peakReadQps = Math.round(avgReadQps * peakFactor);
  const avgWriteQps = Math.round(totalDailyWrites / 86400);
  const peakWriteQps = Math.round(avgWriteQps * peakFactor);
  const totalPeakQps = peakReadQps + peakWriteQps;

  // Little's Law: L = λ * W (in seconds)
  const littlesLawConcurrency = Math.round(totalPeakQps * (latencyMs / 1000));

  // Network Bandwidth
  const egressMbPerSec = (peakReadQps * readPayloadKb) / 1024;
  const egressGbps = (egressMbPerSec * 8) / 1024;
  const ingressMbPerSec = (peakWriteQps * writePayloadKb) / 1024;
  const ingressGbps = (ingressMbPerSec * 8) / 1024;

  // Storage Growth
  const dailyStorageGb = (totalDailyWrites * writePayloadKb) / (1024 * 1024);
  const dailyStorageTb = dailyStorageGb / 1024;
  const yearlyStorageTb = dailyStorageTb * 365;
  const fiveYearStorageTbWithReplication = yearlyStorageTb * 5 * 3;
  const fiveYearStoragePb = fiveYearStorageTbWithReplication / 1024;

  // Cache RAM (80/20 Pareto rule: 20% of daily reads cached, with 25% Redis metadata overhead)
  const cacheItems20Pct = totalDailyReads * 0.20;
  const rawCacheGb = (cacheItems20Pct * readPayloadKb) / (1024 * 1024);
  const recommendedCacheGb = Math.round(rawCacheGb * 1.25);

  // Amdahl's Law: Speedup = 1 / ((1 - P) + (P / N))
  const p = parallelFraction / 100;
  const serialFraction = 1 - p;
  const amdahlSpeedup = 1 / (serialFraction + (p / numCores));
  const maxTheoreticalSpeedup = serialFraction > 0 ? 1 / serialFraction : 1000;

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10 pb-24">
      {/* Title */}
      <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 lg:p-10 shadow-lg">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
          <Calculator className="h-4 w-4" />
          Interactive System Design Math Engine
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#ffffff]">
          Capacity Planning &amp; Estimation
        </h1>
        <p className="mt-2 text-xs sm:text-sm lg:text-base text-[#94a3b8] font-normal leading-relaxed">
          Dynamic calculations for peak QPS, network throughput sizing, Little’s Law concurrency, and Amdahl’s Law limits.
        </p>
      </div>

      {/* Grid: Inputs on Left / Live Outputs on Right */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-6 space-y-5">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
              Traffic &amp; Scale Inputs
            </h2>

            {/* DAU */}
            <div>
              <div className="flex justify-between text-xs text-[#cbd5e1] mb-1.5 font-medium">
                <span>Daily Active Users (DAU)</span>
                <span className="font-mono text-[#d4af37] font-semibold">{dau} Million</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={dau}
                onChange={(e) => setDau(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#232634] rounded-lg"
              />
            </div>

            {/* Reads Per User */}
            <div>
              <div className="flex justify-between text-xs text-[#cbd5e1] mb-1.5 font-medium">
                <span>Reads per User / Day</span>
                <span className="font-mono text-[#ffffff] font-semibold">{readsPerUser} queries</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={readsPerUser}
                onChange={(e) => setReadsPerUser(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#232634] rounded-lg"
              />
            </div>

            {/* Writes Per User */}
            <div>
              <div className="flex justify-between text-xs text-[#cbd5e1] mb-1.5 font-medium">
                <span>Writes per User / Day</span>
                <span className="font-mono text-[#ffffff] font-semibold">{writesPerUser} mutations</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={writesPerUser}
                onChange={(e) => setWritesPerUser(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#232634] rounded-lg"
              />
            </div>

            {/* Read & Write Payload */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold block mb-1.5">Read Size (KB)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={readPayloadKb}
                  onChange={(e) => setReadPayloadKb(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-sm border border-[#272a38] bg-[#161824] px-3 py-2 text-xs text-[#ffffff] font-mono focus:border-[#d4af37] focus:outline-none min-h-[42px]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold block mb-1.5">Write Size (KB)</label>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  value={writePayloadKb}
                  onChange={(e) => setWritePayloadKb(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-sm border border-[#272a38] bg-[#161824] px-3 py-2 text-xs text-[#ffffff] font-mono focus:border-[#d4af37] focus:outline-none min-h-[42px]"
                />
              </div>
            </div>

            {/* Peak Factor & Latency */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold block mb-1.5">Peak Multiplier</label>
                <select
                  value={peakFactor}
                  onChange={(e) => setPeakFactor(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#272a38] bg-[#161824] px-3 py-2 text-xs text-[#ffffff] focus:border-[#d4af37] focus:outline-none cursor-pointer min-h-[42px]"
                >
                  <option value={2}>2x Average</option>
                  <option value={3}>3x Standard Peak</option>
                  <option value={5}>5x High Spike</option>
                  <option value={10}>10x Flash Sale</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold block mb-1.5">Latency SLA (ms)</label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-sm border border-[#272a38] bg-[#161824] px-3 py-2 text-xs text-[#ffffff] font-mono focus:border-[#d4af37] focus:outline-none min-h-[42px]"
                />
              </div>
            </div>
          </div>

          {/* Amdahl's Law Controls */}
          <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-6 space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
              Amdahl’s Law Parameters
            </h2>

            <div>
              <div className="flex justify-between text-xs text-[#cbd5e1] mb-1.5 font-medium">
                <span>Parallelizable Code (P)</span>
                <span className="font-mono text-[#d4af37] font-semibold">{parallelFraction}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={parallelFraction}
                onChange={(e) => setParallelFraction(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#232634] rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#cbd5e1] mb-1.5 font-medium">
                <span>Compute Cores (N)</span>
                <span className="font-mono text-[#ffffff] font-semibold">{numCores} Cores</span>
              </div>
              <input
                type="range"
                min="2"
                max="128"
                value={numCores}
                onChange={(e) => setNumCores(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#232634] rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Live Mathematical Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Throughput QPS & Little's Law */}
          <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#232634] pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                <Activity className="h-4 w-4 text-[#d4af37]" />
                Throughput &amp; Concurrency (Little’s Law)
              </div>
              <span className="font-mono text-xs text-[#94a3b8]">L = λ &times; W</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3.5 sm:p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Avg Read QPS</div>
                <div className="mt-1 font-serif text-xl sm:text-2xl text-[#ffffff] font-semibold">{avgReadQps.toLocaleString()}</div>
                <div className="text-[10px] text-[#64748b] mt-1 font-mono">queries / sec</div>
              </div>

              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3.5 sm:p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">Peak Read QPS</div>
                <div className="mt-1 font-serif text-xl sm:text-2xl text-[#d4af37] font-semibold">{peakReadQps.toLocaleString()}</div>
                <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">{peakFactor}x multiplier</div>
              </div>

              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3.5 sm:p-4 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Peak Write QPS</div>
                <div className="mt-1 font-serif text-xl sm:text-2xl text-[#ffffff] font-semibold">{peakWriteQps.toLocaleString()}</div>
                <div className="text-[10px] text-[#64748b] mt-1 font-mono">mutations / sec</div>
              </div>
            </div>

            {/* Little's Law Result Callout */}
            <div className="rounded-sm border border-[#382b14] bg-[#1b1509] p-4 sm:p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-1">
                Active In-Flight Connections Required (L)
              </div>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="font-serif text-2xl sm:text-3xl text-[#ffffff] font-bold">{littlesLawConcurrency.toLocaleString()}</span>
                <span className="text-xs text-[#cbd5e1]">concurrent sockets at {latencyMs}ms response time</span>
              </div>
              <p className="mt-2 text-xs text-[#94a3b8] leading-relaxed">
                Formula: Peak QPS ({totalPeakQps.toLocaleString()}) &times; Latency ({latencyMs / 1000}s) = {littlesLawConcurrency.toLocaleString()} threads. Connection pools must provision at least this capacity.
              </p>
            </div>
          </div>

          {/* Card 2: Network Bandwidth & Storage Horizon */}
          <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#232634] pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                <Wifi className="h-4 w-4 text-[#d4af37]" />
                Network Bandwidth &amp; Storage Growth
              </div>
              <span className="font-mono text-xs text-[#94a3b8]">Bytes vs Bits</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3.5 sm:p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Peak Egress (Reads)</div>
                <div className="mt-1 font-serif text-xl sm:text-2xl text-[#ffffff] font-semibold">{egressGbps.toFixed(2)} Gbps</div>
                <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">({egressMbPerSec.toFixed(1)} MB/sec)</div>
              </div>

              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3.5 sm:p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Peak Ingress (Writes)</div>
                <div className="mt-1 font-serif text-xl sm:text-2xl text-[#ffffff] font-semibold">{ingressGbps.toFixed(2)} Gbps</div>
                <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">({ingressMbPerSec.toFixed(1)} MB/sec)</div>
              </div>
            </div>

            {/* Storage Growth */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3 text-center">
                <div className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-semibold">Daily Writes</div>
                <div className="mt-1 font-serif text-base sm:text-lg text-[#ffffff] font-semibold">{dailyStorageGb >= 1024 ? `${dailyStorageTb.toFixed(1)} TB` : `${dailyStorageGb.toFixed(0)} GB`}</div>
              </div>
              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3 text-center">
                <div className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-semibold">1-Year Horizon</div>
                <div className="mt-1 font-serif text-base sm:text-lg text-[#d4af37] font-semibold">{yearlyStorageTb.toFixed(1)} TB</div>
              </div>
              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3 text-center">
                <div className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-semibold">5-Yr (3x Repl.)</div>
                <div className="mt-1 font-serif text-base sm:text-lg text-[#4ade80] font-semibold">{fiveYearStoragePb >= 1 ? `${fiveYearStoragePb.toFixed(1)} PB` : `${fiveYearStorageTbWithReplication.toFixed(0)} TB`}</div>
              </div>
            </div>

            {/* Cache Sizing */}
            <div className="rounded-sm border border-[#232634] bg-[#161824] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#d4af37]">
                  In-Memory Cache Sizing (80/20 Pareto Rule)
                </div>
                <div className="text-xs text-[#94a3b8] mt-0.5">
                  Caching top 20% of daily read queries + 25% Redis metadata headroom
                </div>
              </div>
              <div className="font-serif text-xl sm:text-2xl text-[#ffffff] font-semibold shrink-0">
                {recommendedCacheGb >= 1024 ? `${(recommendedCacheGb / 1024).toFixed(1)} TB RAM` : `${recommendedCacheGb} GB RAM`}
              </div>
            </div>
          </div>

          {/* Card 3: Amdahl's Law Speedup */}
          <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232634] pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                <Cpu className="h-4 w-4 text-[#d4af37]" />
                Amdahl’s Law Parallelization Limit
              </div>
              <span className="font-mono text-xs text-[#94a3b8]">Speedup = 1 / ((1-P) + P/N)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3.5 sm:p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Speedup ({numCores} Cores)</div>
                <div className="mt-1 font-serif text-2xl sm:text-3xl text-[#d4af37] font-semibold">{amdahlSpeedup.toFixed(2)}x</div>
                <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">with {parallelFraction}% parallel code</div>
              </div>

              <div className="rounded-sm border border-[#232634] bg-[#161824] p-3.5 sm:p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">Theoretical Max Limit</div>
                <div className="mt-1 font-serif text-2xl sm:text-3xl text-[#ffffff] font-semibold">{maxTheoreticalSpeedup.toFixed(2)}x</div>
                <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">from {(100 - parallelFraction)}% serial bottleneck</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
