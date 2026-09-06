import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowRight, 
  Loader2, 
  RefreshCw, 
  BookOpen,
  Cpu,
  Layers,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResearchSource {
  title: string;
  url: string;
}

interface ResearchResult {
  answer: string;
  searchQueries: string[];
  sources: ResearchSource[];
  topic: string;
}

interface LiveResearchViewProps {
  initialTopic?: string;
  onNavigateChapter?: (chapterId: string) => void;
}

const PRESET_QUERIES = [
  {
    label: 'Kafka vs Redpanda',
    prompt: 'Compare Apache Kafka and Redpanda performance benchmarks, hardware requirements, p99 latency, and Raft vs KRaft architecture trade-offs in 2025/2026.',
    badge: 'Event Streaming'
  },
  {
    label: 'Redis vs Dragonfly',
    prompt: 'Explain the architectural differences between Redis 7/8 and Dragonfly / KeyDB in multithreading, memory overhead, cache eviction, and lock-free execution.',
    badge: 'Caching'
  },
  {
    label: 'Major Cloud Outages',
    prompt: 'Summarize the root cause analysis and systemic learnings from recent high-profile cloud outages (such as AWS us-east-1, Cloudflare, or Azure BGP / DNS incidents).',
    badge: 'Reliability'
  },
  {
    label: 'Postgres 17 vs 16',
    prompt: 'What are the most impactful performance optimizations in PostgreSQL 17 for high-concurrency OLTP, vacuuming, and logical replication?',
    badge: 'Databases'
  },
  {
    label: 'HTTP/3 vs gRPC',
    prompt: 'Break down HTTP/3 (QUIC) vs gRPC (HTTP/2) for mobile-to-backend vs internal microservice-to-microservice traffic, including head-of-line blocking and TLS 1.3 handshake overhead.',
    badge: 'Protocols'
  },
  {
    label: 'Distributed Locks',
    prompt: 'Analyze Redlock (Redis) vs etcd/ZooKeeper (Raft consensus) for distributed locks. Why did Martin Kleppmann criticize Redlock, and what is the current production consensus?',
    badge: 'Consensus'
  }
];

export const LiveResearchView: React.FC<LiveResearchViewProps> = ({ initialTopic = '' }) => {
  const [query, setQuery] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (searchPrompt?: string) => {
    const promptToUse = searchPrompt || query;
    if (!promptToUse.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: promptToUse.trim(),
          chapterContext: initialTopic || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search-grounded research data.');
      }

      setResult({
        answer: data.answer,
        searchQueries: data.searchQueries || [],
        sources: data.sources || [],
        topic: promptToUse
      });
    } catch (err: any) {
      console.error('Research error:', err);
      setError(err.message || 'An error occurred while connecting to the grounded search engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-8 rounded-lg border border-[#232634] bg-gradient-to-r from-[#12141c] via-[#161924] to-[#12141c] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3b3f54] bg-[#1a1d2b] px-3 py-1 text-xs font-medium text-[#d4af37]">
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Google Search Grounding Active &bull; Gemini 3.5 Flash</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#f1f5f9]">
              Live Distributed Systems Research Engine
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
              Verify latest 2025/2026 production benchmarks, real-world outage post-mortems, and technology trade-offs grounded in live Google Search web citations and primary technical documents.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="flex items-center gap-2 rounded-md border border-[#2a2e40] bg-[#141620] px-3.5 py-2 text-xs text-[#a0aec0]">
              <Globe className="h-4 w-4 text-[#38bdf8]" />
              <span>Real-Time Web Citations</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-[#2a2e40] bg-[#141620] px-3.5 py-2 text-xs text-[#a0aec0]">
              <Cpu className="h-4 w-4 text-[#d4af37]" />
              <span>gemini-3.5-flash</span>
            </div>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="mt-6">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
              <input
                id="research-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any distributed systems query (e.g., Kafka vs Redpanda latency, Redis 8 features, AWS S3 outage)..."
                className="w-full rounded-md border border-[#2e3347] bg-[#0b0c11] py-3.5 pl-11 pr-4 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
            </div>
            <button
              id="execute-research-btn"
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d4af37] px-6 py-3.5 text-sm font-semibold text-[#0e0f14] hover:bg-[#e6c158] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching Google...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Ground with Search</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-2.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Suggested Research Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                id={`preset-research-btn-${idx}`}
                onClick={() => {
                  setQuery(preset.prompt);
                  handleSearch(preset.prompt);
                }}
                disabled={loading}
                className="group flex items-center gap-2 rounded-md border border-[#252838] bg-[#141620] px-3 py-1.5 text-xs text-[#cbd5e1] hover:border-[#d4af37]/60 hover:bg-[#1a1d2b] hover:text-[#fff] transition-all"
              >
                <span className="text-[#38bdf8] font-mono text-[10px]">{preset.badge}</span>
                <span>{preset.label}</span>
                <ArrowRight className="h-3 w-3 text-[#64748b] group-hover:text-[#d4af37] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-8 rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-300 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Search Grounding Service Notice</p>
            <p className="mt-1 text-red-300/90">{error}</p>
            <p className="mt-2 text-xs text-red-400/80">
              Tip: Verify that the GEMINI_API_KEY is configured in the AI Studio Settings menu.
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-lg border border-[#232634] bg-[#12141c] p-8 text-center animate-pulse">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1e2230] text-[#d4af37] mb-4">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-[#f1f5f9]">Querying Google Search & Synthesizing Findings...</h3>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-md mx-auto">
            Gemini 3.5 Flash is actively executing search queries, evaluating web evidence, and cross-referencing distributed systems engineering literature.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#d4af37] animate-ping" />
            <span className="inline-block h-2 w-2 rounded-full bg-[#38bdf8] animate-ping delay-100" />
            <span className="inline-block h-2 w-2 rounded-full bg-[#a855f7] animate-ping delay-200" />
          </div>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Grounding Metadata / Sources Bar */}
          <div className="rounded-lg border border-[#232634] bg-[#12141c] p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2230] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                  Grounding Verification
                </span>
                <h3 className="text-base font-semibold text-[#f1f5f9] mt-0.5">
                  Live Sources & Search Queries
                </h3>
              </div>
              <button
                id="copy-research-btn"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-md border border-[#2d3144] bg-[#181a24] px-3 py-1.5 text-xs font-medium text-[#cbd5e1] hover:bg-[#222533] hover:text-[#fff] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied Analysis</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#94a3b8]" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>

            {/* Queries executed */}
            {result.searchQueries.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-medium text-[#64748b] block mb-2">
                  Google Search queries executed by model:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.searchQueries.map((q, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#262a3a] bg-[#0c0d12] px-2.5 py-1 text-xs text-[#94a3b8]"
                    >
                      <Search className="h-3 w-3 text-[#d4af37]" />
                      <span>{q}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Web citations */}
            {result.sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#1a1d2a]">
                <span className="text-xs font-medium text-[#64748b] block mb-2">
                  Grounding Web References ({result.sources.length} verified):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {result.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 rounded-md border border-[#212433] bg-[#0e1017] p-2.5 text-xs text-[#cbd5e1] hover:border-[#38bdf8]/60 hover:bg-[#151824] hover:text-[#fff] transition-colors group"
                    >
                      <span className="truncate font-medium">{src.title || src.url}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#64748b] group-hover:text-[#38bdf8] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rendered Markdown Body */}
          <div className="rounded-lg border border-[#232634] bg-[#12141c] p-6 sm:p-8 shadow-xl">
            <div className="prose prose-invert max-w-none prose-headings:text-[#f1f5f9] prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-[#232634] prose-h2:pb-2 prose-h3:text-lg prose-p:text-[#cbd5e1] prose-p:leading-relaxed prose-li:text-[#cbd5e1] prose-strong:text-[#f8fafc] prose-code:text-[#d4af37] prose-code:bg-[#0c0d12] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#090a0f] prose-pre:border prose-pre:border-[#232634] prose-pre:p-4 prose-a:text-[#38bdf8] prose-a:underline hover:prose-a:text-[#7dd3fc]">
              <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State */}
      {!result && !loading && (
        <div className="rounded-lg border border-[#232634] bg-[#12141c]/60 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#2a2e40] bg-[#171a25] text-[#d4af37] mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#f1f5f9]">Search Grounded Systems Architecture</h3>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-lg mx-auto">
            Select one of the suggested topics above or type any custom architectural question to get deep, real-world verified insights backed by Google Search citations.
          </p>
        </div>
      )}
    </div>
  );
};
