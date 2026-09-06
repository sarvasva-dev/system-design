import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Smartphone, 
  Monitor,
  Code2,
  Eye
} from 'lucide-react';

interface SeoWebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoWebsitePreviewModal: React.FC<SeoWebsitePreviewModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'twitter' | 'linkedin' | 'slack' | 'code'>('google');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('System Design for SaaS & IaaS');
  const [customDesc, setCustomDesc] = useState(
    'A comprehensive reference textbook and interactive study guide covering SaaS multi-tenancy, IaaS cloud platforms, distributed systems, capacity planning, 20 real-world case studies, and 250 interview questions.'
  );

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://system-design-reference.app';
  const domain = 'system-design.dev';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const metaTagsCode = `<!-- Primary Meta Tags -->
<title>${customTitle}</title>
<meta name="title" content="${customTitle}">
<meta name="description" content="${customDesc}">
<meta name="keywords" content="system design, saas architecture, iaas, distributed systems, cap theorem, raft, capacity planning">

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:url" content="${currentUrl}">
<meta property="og:title" content="${customTitle}">
<meta property="og:description" content="${customDesc}">
<meta property="og:image" content="/og-preview.svg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${currentUrl}">
<meta property="twitter:title" content="${customTitle}">
<meta property="twitter:description" content="${customDesc}">
<meta property="twitter:image" content="/og-preview.svg">`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#000000]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg border border-[#272a38] bg-[#12141c] text-[#cbd5e1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232634] px-5 py-4 bg-[#141622]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-medium text-[#ffffff] flex items-center gap-2">
                SEO &amp; Social Website Preview
                <span className="text-[10px] font-sans uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40">
                  Live
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Real-time SERP snippet and social card preview across Google, Twitter/X, LinkedIn, and Slack.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-[#ffffff] hover:bg-[#1f2230] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1 border-b border-[#1f2230] px-5 bg-[#0f1118] overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('google')}
            className={`px-3 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'google'
                ? 'border-[#d4af37] text-[#ffffff] font-semibold'
                : 'border-transparent text-[#94a3b8] hover:text-[#cbd5e1]'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-[#38bdf8]" />
            Google SERP
          </button>
          <button
            onClick={() => setActiveTab('twitter')}
            className={`px-3 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'twitter'
                ? 'border-[#d4af37] text-[#ffffff] font-semibold'
                : 'border-transparent text-[#94a3b8] hover:text-[#cbd5e1]'
            }`}
          >
            <Share2 className="h-3.5 w-3.5 text-[#38bdf8]" />
            Twitter / X Card
          </button>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`px-3 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'linkedin'
                ? 'border-[#d4af37] text-[#ffffff] font-semibold'
                : 'border-transparent text-[#94a3b8] hover:text-[#cbd5e1]'
            }`}
          >
            <Share2 className="h-3.5 w-3.5 text-[#3b82f6]" />
            LinkedIn / OpenGraph
          </button>
          <button
            onClick={() => setActiveTab('slack')}
            className={`px-3 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'slack'
                ? 'border-[#d4af37] text-[#ffffff] font-semibold'
                : 'border-transparent text-[#94a3b8] hover:text-[#cbd5e1]'
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-[#22c55e]" />
            Slack / Discord
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-[#d4af37] text-[#ffffff] font-semibold'
                : 'border-transparent text-[#94a3b8] hover:text-[#cbd5e1]'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-[#d4af37]" />
            HTML Meta Tags
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Active Preview Display */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                <span>Google Search Desktop Snippet Preview</span>
                <span className="font-mono text-[11px] text-[#22c55e]">Rank #1 Mocked Simulation</span>
              </div>

              {/* Google Result Box */}
              <div className="rounded-md border border-[#232634] bg-[#1a1c26] p-4 sm:p-6 space-y-2 max-w-2xl font-sans">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                  <div className="h-6 w-6 rounded-full bg-[#0b0c10] border border-[#272a38] flex items-center justify-center text-[10px] text-[#d4af37] font-bold">
                    SD
                  </div>
                  <div className="truncate">
                    <span className="text-[#e2e8f0] font-medium">{domain}</span>
                    <span className="text-[#64748b]"> &rsaquo; system-design &rsaquo; guide</span>
                  </div>
                </div>

                {/* Title link */}
                <h3 className="text-base sm:text-lg text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug">
                  {customTitle}
                </h3>

                {/* Description snippet */}
                <p className="text-xs sm:text-sm text-[#bdc1c6] leading-relaxed">
                  <span className="text-[#9aa0a6] text-[11px] font-mono mr-1">Sep 5, 2026 —</span>
                  {customDesc}
                </p>

                {/* Rich Sitelinks */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#272a38] text-xs">
                  <div>
                    <span className="text-[#8ab4f8] hover:underline cursor-pointer font-medium block">
                      Multi-Tenant Architecture
                    </span>
                    <span className="text-[#9aa0a6] text-[11px]">Database pooling &amp; row-level tenant isolation</span>
                  </div>
                  <div>
                    <span className="text-[#8ab4f8] hover:underline cursor-pointer font-medium block">
                      CAP &amp; Raft Consensus
                    </span>
                    <span className="text-[#9aa0a6] text-[11px]">Leader election, heartbeat, &amp; quorum math</span>
                  </div>
                  <div>
                    <span className="text-[#8ab4f8] hover:underline cursor-pointer font-medium block">
                      20 Production Case Studies
                    </span>
                    <span className="text-[#9aa0a6] text-[11px]">Hyperscale WhatsApp, Netflix, Stripe designs</span>
                  </div>
                  <div>
                    <span className="text-[#8ab4f8] hover:underline cursor-pointer font-medium block">
                      250 Staff Interview Questions
                    </span>
                    <span className="text-[#9aa0a6] text-[11px]">Evaluator rubrics, failure modes, trade-offs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'twitter' && (
            <div className="space-y-4">
              <div className="text-xs text-[#94a3b8]">Twitter / X Summary Card with Large Image (1200 &times; 630)</div>

              {/* Twitter Card Mockup */}
              <div className="rounded-xl border border-[#2f3336] bg-[#000000] overflow-hidden max-w-lg shadow-xl">
                <div className="relative aspect-[1.91/1] w-full bg-[#0b0c10] border-b border-[#2f3336] overflow-hidden flex items-center justify-center">
                  <img 
                    src="/og-preview.svg" 
                    alt="System Design Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3.5 space-y-1 bg-[#000000]">
                  <div className="text-[11px] text-[#71767b] font-mono">{domain}</div>
                  <div className="text-sm font-bold text-[#e7e9ea] line-clamp-1">{customTitle}</div>
                  <div className="text-xs text-[#71767b] line-clamp-2 leading-relaxed">{customDesc}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'linkedin' && (
            <div className="space-y-4">
              <div className="text-xs text-[#94a3b8]">LinkedIn / Facebook OpenGraph Social Share Preview</div>

              <div className="rounded-md border border-[#272a38] bg-[#161824] overflow-hidden max-w-lg shadow-xl">
                <div className="aspect-[1.91/1] w-full bg-[#0b0c10] overflow-hidden border-b border-[#272a38]">
                  <img 
                    src="/og-preview.svg" 
                    alt="OpenGraph Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-semibold">{domain}</div>
                  <div className="text-sm font-bold text-[#ffffff] line-clamp-1">{customTitle}</div>
                  <div className="text-xs text-[#cbd5e1] line-clamp-2">{customDesc}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slack' && (
            <div className="space-y-4">
              <div className="text-xs text-[#94a3b8]">Slack / Discord Message Unfurl Preview</div>

              <div className="rounded-md border border-[#232634] bg-[#1a1d28] p-4 max-w-lg">
                <div className="flex gap-3">
                  {/* Vertical indicator bar */}
                  <div className="w-1 rounded-full bg-[#d4af37] shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#ffffff]">
                      <span className="text-[#d4af37]">System Design for SaaS &amp; IaaS</span>
                    </div>
                    <a href="#" className="text-sm font-bold text-[#38bdf8] hover:underline block leading-snug">
                      {customTitle}
                    </a>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      {customDesc}
                    </p>
                    <div className="rounded-sm border border-[#272a38] overflow-hidden aspect-[1.91/1] max-w-xs">
                      <img src="/og-preview.svg" alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                <span>Generated HTML &lt;head&gt; SEO Tags</span>
                <button
                  onClick={() => copyToClipboard(metaTagsCode, 'meta-tags')}
                  className="inline-flex items-center gap-1 text-xs text-[#d4af37] hover:text-[#ffffff] transition-colors cursor-pointer"
                >
                  {copiedCode === 'meta-tags' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#22c55e]" />
                      <span className="text-[#22c55e]">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Meta Tags</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="rounded-md border border-[#232634] bg-[#0b0c10] p-4 text-xs font-mono text-[#cbd5e1] overflow-x-auto leading-relaxed">
                <code>{metaTagsCode}</code>
              </pre>
            </div>
          )}

          {/* Live Content Editor */}
          <div className="rounded-md border border-[#232634] bg-[#141622] p-4 space-y-3">
            <div className="text-xs font-semibold text-[#ffffff] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                Customize Live Preview Metadata
              </span>
              <span className="text-[11px] text-[#94a3b8]">Changes reflect in cards above instantly</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[#cbd5e1]">Page Title Tag</label>
                <span className={`text-[11px] font-mono ${customTitle.length > 60 ? 'text-[#f87171]' : 'text-[#22c55e]'}`}>
                  {customTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full rounded-sm border border-[#272a38] bg-[#0b0c10] px-3 py-2 text-xs text-[#ffffff] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[#cbd5e1]">Meta Description</label>
                <span className={`text-[11px] font-mono ${customDesc.length > 160 ? 'text-[#f87171]' : 'text-[#22c55e]'}`}>
                  {customDesc.length}/160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="w-full rounded-sm border border-[#272a38] bg-[#0b0c10] px-3 py-2 text-xs text-[#ffffff] focus:border-[#d4af37] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#232634] px-5 py-3.5 bg-[#141622] text-xs">
          <div className="flex items-center gap-2">
            <a
              href="/og-preview.svg"
              download="system-design-og-preview.svg"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#2d3142] bg-[#161824] px-3 py-1.5 text-xs text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-[#d4af37]" />
              Download OG Banner (.SVG)
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(metaTagsCode, 'footer-copy')}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#d4af37] bg-[#1c1910] px-3 py-1.5 text-xs font-medium text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b0c10] transition-colors cursor-pointer"
            >
              {copiedCode === 'footer-copy' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode === 'footer-copy' ? 'Copied!' : 'Copy All Meta Tags'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-sm border border-[#272a38] px-3 py-1.5 text-xs text-[#94a3b8] hover:text-[#ffffff] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
