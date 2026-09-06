import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { 
  HelpCircle, 
  Search, 
  Lightbulb, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Copy, 
  Check,
  Palette
} from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const categories = [
    'All', 
    'Distributed Systems', 
    'Databases', 
    'Messaging', 
    'SaaS Architecture', 
    'IaaS & Cloud', 
    'Security', 
    'Performance Engineering', 
    'Observability', 
    'Reliability'
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Distributed Systems':
        return {
          badge: 'bg-[#c084fc]/15 text-[#c084fc] border-[#c084fc]/40',
          dot: 'bg-[#c084fc]',
          cardHover: 'hover:border-[#c084fc]/50'
        };
      case 'Databases':
        return {
          badge: 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/40',
          dot: 'bg-[#d4af37]',
          cardHover: 'hover:border-[#d4af37]/50'
        };
      case 'Messaging':
      case 'IaaS & Cloud':
        return {
          badge: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40',
          dot: 'bg-[#38bdf8]',
          cardHover: 'hover:border-[#38bdf8]/50'
        };
      case 'SaaS Architecture':
      case 'Reliability':
        return {
          badge: 'bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/40',
          dot: 'bg-[#22c55e]',
          cardHover: 'hover:border-[#22c55e]/50'
        };
      case 'Security':
        return {
          badge: 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40',
          dot: 'bg-[#a78bfa]',
          cardHover: 'hover:border-[#a78bfa]/50'
        };
      case 'Performance Engineering':
      case 'Observability':
        return {
          badge: 'bg-[#fb923c]/15 text-[#fb923c] border-[#fb923c]/40',
          dot: 'bg-[#fb923c]',
          cardHover: 'hover:border-[#fb923c]/50'
        };
      default:
        return {
          badge: 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/40',
          dot: 'bg-[#d4af37]',
          cardHover: 'hover:border-[#d4af37]/50'
        };
    }
  };

  const handleSearchGoogle = (term: string) => {
    const query = `explain ${term} in system design`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  const copyPrompt = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`explain ${term} in system design`);
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.simpleMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.technicalMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10 pb-24">
      {/* Title Header */}
      <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 lg:p-10 shadow-lg space-y-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
            <HelpCircle className="h-4 w-4" />
            Architectural Lexicon &amp; Explainer System
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#ffffff]">
            System Design Glossary &amp; Mental Models
          </h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-[#94a3b8] font-normal leading-relaxed">
            Precise definitions, theoretical theorems, and production implementations for high-stakes technical discussions.
          </p>
        </div>

        {/* Double Tap Explainer Feature Notice */}
        <div className="rounded-sm border border-[#d4af37]/30 bg-[#161824] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#ffffff] flex items-center gap-2">
                <span>Double-Tap Explainer System Active</span>
                <span className="rounded-full bg-[#22c55e] h-2 w-2 animate-pulse"></span>
              </div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Double-tap or double-click <strong>ANY</strong> term across this lexicon or anywhere in chapters to automatically trigger:
                <br className="hidden sm:inline" />
                <code className="text-[#d4af37] font-mono text-[11px] bg-[#0b0c10] px-1.5 py-0.5 rounded-xs mt-1 inline-block">
                  explain &#123;term&#125; in system design
                </code>
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search terms, theorems, data structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-sm border border-[#272a38] bg-[#161824] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#ffffff] placeholder:text-[#64748b] focus:border-[#d4af37] focus:outline-none min-h-[44px]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-sm border border-[#272a38] bg-[#161824] px-4 py-2.5 text-xs text-[#cbd5e1] focus:border-[#d4af37] focus:outline-none cursor-pointer min-h-[44px]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-[#12141c] text-[#ffffff]">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] font-semibold">
          <span>Showing {filteredTerms.length} Architectural Terms</span>
          <span className="text-[#64748b] hidden sm:inline">Tip: 2x Tap Card or Title</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredTerms.map(term => {
            const colors = getCategoryColor(term.category);
            return (
              <div 
                key={term.term} 
                data-term={term.term}
                onDoubleClick={() => handleSearchGoogle(term.term)}
                className={`rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-6 space-y-4 transition-all ${colors.cardHover} group cursor-default`}
              >
                {/* Term Header */}
                <div className="flex items-center justify-between gap-2 border-b border-[#1f2230] pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${colors.dot} shrink-0`}></span>
                    <h2 
                      className="text-lg sm:text-xl font-serif font-medium text-[#ffffff] group-hover:text-[#d4af37] transition-colors cursor-pointer"
                      onClick={() => handleSearchGoogle(term.term)}
                      title={`Click or double-tap to explain "${term.term}" in system design`}
                    >
                      {term.term}
                    </h2>
                  </div>
                  <span className={`rounded-xs border px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] font-semibold ${colors.badge}`}>
                    {term.category}
                  </span>
                </div>

                {/* Simple Definition */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[#d4af37]">
                    <Lightbulb className="h-3 w-3" />
                    Intuitive Mental Model
                  </div>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                    {term.simpleMeaning}
                  </p>
                </div>

                {/* Technical Definition */}
                <div className="space-y-1 border-t border-[#1f2230] pt-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[#94a3b8]">
                    <ShieldCheck className="h-3 w-3 text-[#d4af37]" />
                    Formal Engineering Definition
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    {term.technicalMeaning}
                  </p>
                </div>

                {/* Real World Example */}
                <div className="rounded-xs bg-[#161824] p-3 text-xs text-[#cbd5e1] border border-[#232634]">
                  <span className="text-[#d4af37] font-semibold mr-1">Production Example:</span>
                  <span>{term.example}</span>
                </div>

                {/* Google Search Direct Action Bar */}
                <div className="pt-2 border-t border-[#1a1c27] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSearchGoogle(term.term)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#ffffff] transition-colors font-mono cursor-pointer"
                    title={`Explain ${term.term} in system design on Google`}
                  >
                    <Search className="h-3 w-3" />
                    <span>Search Google &rarr;</span>
                  </button>

                  <button
                    onClick={(e) => copyPrompt(term.term, e)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-[#ffffff] transition-colors cursor-pointer"
                    title="Copy search prompt"
                  >
                    {copiedTerm === term.term ? (
                      <>
                        <Check className="h-3 w-3 text-[#22c55e]" />
                        <span className="text-[#22c55e]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
