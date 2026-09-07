import React, { useState } from 'react';
import { DESI_JARGON_BUSTER } from '../data/hinglish_guides';
import { X, Search, BookOpen, Sparkles, HelpCircle, Check } from 'lucide-react';

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

  if (!isOpen) return null;

  const entries = Object.values(DESI_JARGON_BUSTER).filter(item => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      item.term.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query) ||
      item.desiAnalogy.toLowerCase().includes(query)
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
                <span>Jargon Buster</span>
                <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                  आसान भाषा में
                </span>
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Bhaari-bharkam technical words ka bilkul simple desi matlab
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-white hover:bg-[#232634] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Filter */}
        <div className="p-4 border-b border-[#1f2230] bg-[#0c0e14]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search term (e.g. Throughput, Cache, Sharding, ACID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-sm border border-[#2d3142] bg-[#161926] text-white placeholder-[#64748b] focus:border-[#d4af37] focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Word Cards List */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-3.5 divide-y divide-[#1e2232]/50">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-[#94a3b8]">
              <HelpCircle className="h-8 w-8 mx-auto text-[#64748b] mb-2" />
              <p className="text-sm">Koi term nahi mila "{searchTerm}" ke liye.</p>
              <p className="text-xs text-[#64748b] mt-1">Try searching: Throughput, Cache, Sharding, Latency, CAP</p>
            </div>
          ) : (
            entries.map((item, idx) => (
              <div key={idx} className="pt-3.5 first:pt-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-semibold text-[#d4af37] font-mono">
                    {item.term}
                  </h4>
                  <span className="text-[10px] text-[#64748b] font-mono uppercase">
                    System Design Concept
                  </span>
                </div>
                
                {/* Meaning */}
                <p className="mt-1.5 text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
                  <strong className="text-[#38bdf8] font-normal">Matlab: </strong>
                  {item.meaning}
                </p>

                {/* Desi Analogy */}
                <div className="mt-2 rounded-xs border-l-2 border-[#d4af37] bg-[#141622] px-3 py-2 text-xs text-[#cbd5e1]">
                  <span className="font-semibold text-[#d4af37] mr-1">Desi Example:</span>
                  <span className="italic">"{item.desiAnalogy}"</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#232634] bg-[#12141f] px-5 py-3 text-xs text-[#94a3b8]">
          <span>💡 Kisi bhi concept par "Aasan Bhasha" toggle se desi explanation dekhein.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-sm bg-[#d4af37] text-[#0b0c10] font-semibold hover:brightness-110 transition-all text-xs"
          >
            Samajh Gaya (Done)
          </button>
        </div>

      </div>
    </div>
  );
};
