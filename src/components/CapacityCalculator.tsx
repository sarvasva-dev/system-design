import React, { useState } from 'react';
import { Calculator, ArrowRight, Server, Database, Wifi, Cpu, Activity, Clock } from 'lucide-react';

export const CapacityCalculator: React.FC = () => {
  // Input parameters with sensible defaults (50M DAU photo/content app)
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
  const totalDailyRequests = totalDailyReads + totalDailyWrites;

  // Average & Peak QPS (using 86,400s per day)
  const avgReadQps = Math.round(totalDailyReads / 86400);
  const peakReadQps = Math.round(avgReadQps * peakFactor);
  const avgWriteQps = Math.round(totalDailyWrites / 86400);
  const peakWriteQps = Math.round(avgWriteQps * peakFactor);
  const totalPeakQps = peakReadQps + peakWriteQps;

  // Little's Law: L = λ * W (in seconds)
  const littlesLawConcurrency = Math.round(totalPeakQps * (latencyMs / 1000));

  // Network Bandwidth
  // Egress (Reads): Read QPS * Read Payload
  const egressMbPerSec = (peakReadQps * readPayloadKb) / 1024;
  const egressGbps = (egressMbPerSec * 8) / 1024;
  // Ingress (Writes): Write QPS * Write Payload
  const ingressMbPerSec = (peakWriteQps * writePayloadKb) / 1024;
  const ingressGbps = (ingressMbPerSec * 8) / 1024;

  // Storage Growth
  const dailyStorageGb = (totalDailyWrites * writePayloadKb) / (1024 * 1024);
  const dailyStorageTb = dailyStorageGb / 1024;
  const yearlyStorageTb = dailyStorageTb * 365;
  // 5 Year with 3x replication
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
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Title */}
      <div className="rounded-sm border border-[#222] bg-[#111] p-8 sm:p-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
          <Calculator className="h-4 w-4" />
          Interactive System Design Math Engine
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-serif text-[#fff]">
          Capacity Planning &amp; Estimation
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#888] font-light leading-relaxed">
          Back-of-the-envelope formulas, network throughput sizing, Little’s Law concurrency, and Amdahl’s Law limits.
        </p>
      </div>

      {/* Grid: Inputs on Left / Live Outputs on Right */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-sm border border-[#222] bg-[#111] p-6 space-y-5">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              Traffic &amp; Storage Parameters
            </h2>

            {/* DAU */}
            <div>
              <div className="flex justify-between text-xs text-[#bbb] mb-1">
                <span>Daily Active Users (DAU)</span>
                <span className="font-mono text-[#c5a059] font-medium">{dau} Million</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={dau}
                onChange={(e) => setDau(Number(e.target.value))}
                className="w-full accent-[#c5a059] cursor-pointer"
              />
            </div>

            {/* Reads Per User */}
            <div>
              <div className="flex justify-between text-xs text-[#bbb] mb-1">
                <span>Reads per User / Day</span>
                <span className="font-mono text-[#fff] font-medium">{readsPerUser} queries</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={readsPerUser}
                onChange={(e) => setReadsPerUser(Number(e.target.value))}
                className="w-full accent-[#c5a059] cursor-pointer"
              />
            </div>

            {/* Writes Per User */}
            <div>
              <div className="flex justify-between text-xs text-[#bbb] mb-1">
                <span>Writes per User / Day</span>
                <span className="font-mono text-[#fff] font-medium">{writesPerUser} posts</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={writesPerUser}
                onChange={(e) => setWritesPerUser(Number(e.target.value))}
                className="w-full accent-[#c5a059] cursor-pointer"
              />
            </div>

            {/* Read & Write Payload */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#777] block mb-1">Read Size (KB)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={readPayloadKb}
                  onChange={(e) => setReadPayloadKb(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-sm border border-[#222] bg-[#0c0c0c] px-3 py-1.5 text-xs text-[#fff] font-mono focus:border-[#c5a059] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#777] block mb-1">Write Size (KB)</label>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  value={writePayloadKb}
                  onChange={(e) => setWritePayloadKb(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-sm border border-[#222] bg-[#0c0c0c] px-3 py-1.5 text-xs text-[#fff] font-mono focus:border-[#c5a059] focus:outline-none"
                />
              </div>
            </div>

            {/* Peak Factor & Latency */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#777] block mb-1">Peak Factor</label>
                <select
                  value={peakFactor}
                  onChange={(e) => setPeakFactor(Number(e.target.value))}
                  className="w-full rounded-sm border border-[#222] bg-[#0c0c0c] px-3 py-1.5 text-xs text-[#fff] focus:border-[#c5a059] focus:outline-none cursor-pointer"
                >
                  <option value={2}>2x Average</option>
                  <option value={3}>3x Average</option>
                  <option value={5}>5x Average (Spiky)</option>
                  <option value={10}>10x Flash Sale</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#777] block mb-1">Service Latency (ms)</label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-sm border border-[#222] bg-[#0c0c0c] px-3 py-1.5 text-xs text-[#fff] font-mono focus:border-[#c5a059] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Amdahl's Law Controls */}
          <div className="rounded-sm border border-[#222] bg-[#111] p-6 space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              Amdahl’s Law Scale Parameters
            </h2>

            <div>
              <div className="flex justify-between text-xs text-[#bbb] mb-1">
                <span>Parallelizable Task Fraction (P)</span>
                <span className="font-mono text-[#c5a059] font-medium">{parallelFraction}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={parallelFraction}
                onChange={(e) => setParallelFraction(Number(e.target.value))}
                className="w-full accent-[#c5a059] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#bbb] mb-1">
                <span>Available Compute Cores (N)</span>
                <span className="font-mono text-[#fff] font-medium">{numCores} Cores</span>
              </div>
              <input
                type="range"
                min="2"
                max="128"
                value={numCores}
                onChange={(e) => setNumCores(Number(e.target.value))}
                className="w-full accent-[#c5a059] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Mathematical Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Throughput QPS & Little's Law */}
          <div className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
                <Activity className="h-4 w-4 text-[#c5a059]" />
                Throughput &amp; Concurrency (Little’s Law)
              </div>
              <span className="font-mono text-xs text-[#666]">L = λ * W</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#666]">Avg Read QPS</div>
                <div className="mt-1 font-serif text-2xl text-[#fff]">{avgReadQps.toLocaleString()}</div>
                <div className="text-[10px] text-[#555] mt-1 font-mono">req / sec</div>
              </div>

              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#c5a059]">Peak Read QPS</div>
                <div className="mt-1 font-serif text-2xl text-[#c5a059]">{peakReadQps.toLocaleString()}</div>
                <div className="text-[10px] text-[#777] mt-1 font-mono">{peakFactor}x multiplier</div>
              </div>

              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-4 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase tracking-wider text-[#666]">Peak Write QPS</div>
                <div className="mt-1 font-serif text-2xl text-[#fff]">{peakWriteQps.toLocaleString()}</div>
                <div className="text-[10px] text-[#555] mt-1 font-mono">mutations / sec</div>
              </div>
            </div>

            {/* Little's Law Result Callout */}
            <div className="rounded-sm border border-[#2a2215] bg-[#0e0b07] p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] mb-1">
                Active In-Flight Connections Required (L)
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl text-[#fff]">{littlesLawConcurrency.toLocaleString()}</span>
                <span className="text-xs text-[#aaa]">concurrent threads / TCP sockets at {latencyMs}ms latency</span>
              </div>
              <p className="mt-2 text-xs text-[#777] leading-relaxed">
                Formula: Peak QPS ({totalPeakQps.toLocaleString()}) &times; Latency ({latencyMs / 1000}s) = {littlesLawConcurrency.toLocaleString()} in-flight connections. Your connection pool and thread pool must hold at least this capacity.
              </p>
            </div>
          </div>

          {/* Card 2: Network Bandwidth & Storage Horizon */}
          <div className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
                <Wifi className="h-4 w-4 text-[#c5a059]" />
                Network Bandwidth &amp; 5-Year Storage Horizon
              </div>
              <span className="font-mono text-xs text-[#666]">Bytes vs Bits</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#666]">Peak Egress (Reads)</div>
                <div className="mt-1 font-serif text-2xl text-[#fff]">{egressGbps.toFixed(2)} Gbps</div>
                <div className="text-[10px] text-[#555] font-mono mt-1">({egressMbPerSec.toFixed(1)} MB/sec)</div>
              </div>

              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#666]">Peak Ingress (Writes)</div>
                <div className="mt-1 font-serif text-2xl text-[#fff]">{ingressGbps.toFixed(2)} Gbps</div>
                <div className="text-[10px] text-[#555] font-mono mt-1">({ingressMbPerSec.toFixed(1)} MB/sec)</div>
              </div>
            </div>

            {/* Storage Growth */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-sm border border-[#1e1e1e] bg-[#080808] p-3 text-center">
                <div className="text-[9px] uppercase tracking-widest text-[#666]">Daily Raw Writes</div>
                <div className="mt-1 font-serif text-lg text-[#fff]">{dailyStorageGb >= 1024 ? `${dailyStorageTb.toFixed(1)} TB` : `${dailyStorageGb.toFixed(0)} GB`}</div>
              </div>
              <div className="rounded-sm border border-[#1e1e1e] bg-[#080808] p-3 text-center">
                <div className="text-[9px] uppercase tracking-widest text-[#666]">1-Year Horizon</div>
                <div className="mt-1 font-serif text-lg text-[#c5a059]">{yearlyStorageTb.toFixed(1)} TB</div>
              </div>
              <div className="rounded-sm border border-[#1e1e1e] bg-[#080808] p-3 text-center">
                <div className="text-[9px] uppercase tracking-widest text-[#666]">5-Year (3x Replicated)</div>
                <div className="mt-1 font-serif text-lg text-[#4ade80]">{fiveYearStoragePb >= 1 ? `${fiveYearStoragePb.toFixed(1)} PB` : `${fiveYearStorageTbWithReplication.toFixed(0)} TB`}</div>
              </div>
            </div>

            {/* Cache Sizing */}
            <div className="rounded-sm border border-[#222] bg-[#0a0a0a] p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#c5a059]">
                  In-Memory Cache Sizing (80/20 Pareto)
                </div>
                <div className="text-xs text-[#777] mt-0.5">
                  Caching top 20% of daily read queries + 25% Redis metadata headroom
                </div>
              </div>
              <div className="font-serif text-2xl text-[#fff] text-right shrink-0 ml-4">
                {recommendedCacheGb >= 1024 ? `${(recommendedCacheGb / 1024).toFixed(1)} TB RAM` : `${recommendedCacheGb} GB RAM`}
              </div>
            </div>
          </div>

          {/* Card 3: Amdahl's Law Speedup */}
          <div className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
                <Cpu className="h-4 w-4 text-[#c5a059]" />
                Amdahl’s Law Parallelization Limit
              </div>
              <span className="font-mono text-xs text-[#666]">Speedup = 1 / ((1-P) + P/N)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#666]">Actual Speedup ({numCores} Cores)</div>
                <div className="mt-1 font-serif text-3xl text-[#c5a059]">{amdahlSpeedup.toFixed(2)}x</div>
                <div className="text-[10px] text-[#555] mt-1 font-mono">with {parallelFraction}% parallel code</div>
              </div>

              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-4">
                <div className="text-[10px] uppercase tracking-wider text-[#666]">Absolute Max (Infinite Cores)</div>
                <div className="mt-1 font-serif text-3xl text-[#fff]">{maxTheoreticalSpeedup.toFixed(2)}x</div>
                <div className="text-[10px] text-[#555] mt-1 font-mono">Hard limit from {(100 - parallelFraction)}% serial lock</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
