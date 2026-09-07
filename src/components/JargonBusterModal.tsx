import React, { useState } from 'react';
import { PLAIN_ENGLISH_JARGON_BUSTER } from '../data/easy_explain_guides';
import { X, Search, BookOpen, Sparkles, HelpCircle, Check, Tag } from 'lucide-react';

interface JargonBusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}

export const JargonBusterModal: React.FC<JargonBusterModalProps> = ({
  isOpen,
  onClose,
  initialTerm = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(PLAIN_ENGLISH_JARGON_BUSTER.map(i => i.category)))];

  const entries = PLAIN_ENGLISH_JARGON_BUSTER.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      item.term.toLowerCase().includes(query) ||
      item.plainDefinition.toLowerCase().includes(query) ||
      item.professionalContext.toLowerCase().includes(query) ||
      item.everydayAnalogy.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-md border border-[#d4af37]/40 bg-[#0f1118] text-[#f1f5f9] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#232634] bg-[#141724] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-sm bg-[#1e2235] border border-[#d4af37]/30 text-[#d4af37]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-medium text-white flex items-center gap-2">
                <span>System Architecture Jargon Buster</span>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 uppercase font-bold tracking-wider">
                  Plain English
                </span>
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Intimidating technical concepts translated into clear, professional, plain English
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-white hover:bg-[#232634] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-[#1f2230] bg-[#0c0e14] space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search terms (e.g. Throughput, Cache, WAL, CAP, PACELC, Sharding)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-sm border border-[#2d3142] bg-[#161926] text-white placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] uppercase text-[#64748b] font-semibold shrink-0">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-xs text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-[#0b0c10] font-bold'
                    : 'bg-[#161824] text-[#94a3b8] hover:text-white border border-[#232738]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Word Cards List */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-4 divide-y divide-[#1e2232]/60">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-[#94a3b8]">
              <HelpCircle className="h-8 w-8 mx-auto text-[#64748b] mb-2" />
              <p className="text-sm">No definition found for "{searchTerm}".</p>
              <p className="text-xs text-[#64748b] mt-1">Try searching: Latency, Cache, Sharding, Consistent Hashing, CAP</p>
            </div>
          ) : (
            entries.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-semibold text-[#fde047] font-mono">
                    {item.term}
                  </h4>
                  <span className="text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-2 py-0.5 rounded-xs font-mono">
                    {item.category}
                  </span>
                </div>
                
                {/* Plain English Definition */}
                <p className="text-xs sm:text-sm text-[#f1f5f9] leading-relaxed">
                  <strong className="text-[#4ade80] font-semibold">Plain English: </strong>
                  {item.plainDefinition}
                </p>

                {/* Professional Context */}
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  <strong className="text-[#cbd5e1] font-medium">Professional Architecture Context: </strong>
                  {item.professionalContext}
                </p>

                {/* Everyday Analogy */}
                <div className="rounded-xs border-l-2 border-[#d4af37] bg-[#141622] px-3 py-2 text-xs text-[#cbd5e1]">
                  <span className="font-semibold text-[#d4af37] mr-1">Everyday Real-World Analogy:</span>
                  <span className="italic text-[#e2e8f0]">"{item.everydayAnalogy}"</span>
                </div>

                {/* Interview Tip */}
                <div className="text-[11px] text-[#38bdf8] bg-[#0c1824] border border-[#1e3a5f] p-2 rounded-xs">
                  <span className="font-bold text-[#38bdf8] mr-1">🎯 Interview Pro-Tip:</span>
                  <span>{item.howToExplainInInterview}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#232634] bg-[#12141f] px-5 py-3 text-xs text-[#94a3b8]">
          <span>Use Plain English notes to master mental models before the interview deep-dive.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-[#d4af37] text-[#0b0c10] font-semibold hover:brightness-110 transition-all text-xs cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
