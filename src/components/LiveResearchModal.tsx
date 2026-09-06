import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Loader2, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LiveResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

interface ResearchSource {
  title: string;
  url: string;
}

export const LiveResearchModal: React.FC<LiveResearchModalProps> = ({
  isOpen,
  onClose,
  initialTopic = ''
}) => {
  const [query, setQuery] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [sources, setSources] = useState<ResearchSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && initialTopic) {
      setQuery(initialTopic);
      // Auto-trigger search if no answer yet
      if (!answer) {
        handleSearch(initialTopic);
      }
    }
  }, [isOpen, initialTopic]);

  if (!isOpen) return null;

  const handleSearch = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || query;
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
          chapterContext: initialTopic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search-grounded research data.');
      }

      setAnswer(data.answer);
      setSearchQueries(data.searchQueries || []);
      setSources(data.sources || []);
    } catch (err: any) {
      console.error('Modal research error:', err);
      setError(err.message || 'Error executing Google Search grounding.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div 
        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-xl border border-[#2e3347] bg-[#0e1017] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232634] bg-[#141622] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3b3f54] bg-[#1a1d2b] text-[#d4af37]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#f1f5f9]">
                  Live Research & Grounded Benchmarks
                </h3>
                <span className="rounded bg-[#d4af37]/10 px-2 py-0.5 text-[10px] font-mono font-medium text-[#d4af37] border border-[#d4af37]/30">
                  gemini-3.5-flash
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Real-time technical ground truth via Google Search Tool
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#202433] hover:text-[#fff] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="border-b border-[#1f2230] bg-[#11131c] p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about live benchmarks, outage post-mortems, production trade-offs..."
                className="w-full rounded-md border border-[#2e3347] bg-[#090a0f] py-2.5 pl-10 pr-4 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#d4af37] px-4 py-2.5 text-xs font-semibold text-[#0e0f14] hover:bg-[#e6c158] disabled:opacity-50 transition-colors shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Research</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="py-12 text-center animate-pulse">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1f2d] text-[#d4af37] mb-3">
                <RefreshCw className="h-5 w-5 animate-spin" />
              </div>
              <p className="text-sm font-medium text-[#f1f5f9]">Querying Google Search & Synthesizing Findings...</p>
              <p className="text-xs text-[#94a3b8] mt-1">Cross-referencing live web sources, benchmarks, and engineering documentation.</p>
            </div>
          )}

          {answer && !loading && (
            <div className="space-y-4">
              {/* Citations and Queries Bar */}
              {(sources.length > 0 || searchQueries.length > 0) && (
                <div className="rounded-lg border border-[#232634] bg-[#141622] p-4 text-xs">
                  {searchQueries.length > 0 && (
                    <div className="mb-3">
                      <span className="font-medium text-[#64748b] block mb-1.5">
                        Search queries executed:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {searchQueries.map((q, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded bg-[#0b0c11] border border-[#2a2e40] px-2 py-0.5 text-[11px] text-[#94a3b8]"
                          >
                            <Search className="h-2.5 w-2.5 text-[#d4af37]" />
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sources.length > 0 && (
                    <div>
                      <span className="font-medium text-[#64748b] block mb-1.5">
                        Verified Sources ({sources.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-1.5 rounded border border-[#212433] bg-[#0c0d12] p-2 text-[11px] text-[#cbd5e1] hover:border-[#38bdf8] hover:text-[#fff] transition-colors"
                          >
                            <span className="truncate">{src.title}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 text-[#64748b]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex justify-end">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded border border-[#2e3347] bg-[#161824] px-2.5 py-1 text-xs text-[#cbd5e1] hover:bg-[#202333] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#94a3b8]" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Markdown */}
              <div className="rounded-lg border border-[#232634] bg-[#12141c] p-5">
                <div className="prose prose-invert max-w-none text-xs sm:text-sm prose-headings:text-[#f1f5f9] prose-p:text-[#cbd5e1] prose-code:text-[#d4af37] prose-code:bg-[#0c0d12] prose-code:px-1 prose-code:py-0.5 prose-pre:bg-[#08090d] prose-pre:border prose-pre:border-[#232634]">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {!answer && !loading && !error && (
            <div className="py-8 text-center text-xs text-[#64748b]">
              Enter a query above to initiate real-time Google Search grounding.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#232634] bg-[#11131c] px-6 py-3 flex items-center justify-between text-xs text-[#64748b]">
          <span>Grounded with Google Search tool</span>
          <button
            onClick={onClose}
            className="rounded px-3 py-1 bg-[#1e2230] text-[#cbd5e1] hover:bg-[#282d40] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
