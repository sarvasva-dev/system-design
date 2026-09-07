import React, { useState } from 'react';
import { HinglishChapterGuide } from '../data/hinglish_guides';
import { 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface HinglishChapterCardProps {
  guide: HinglishChapterGuide;
  onOpenJargonBuster: (initialTerm?: string) => void;
  isHinglishDefault?: boolean;
}

export const HinglishChapterCard: React.FC<HinglishChapterCardProps> = ({
  guide,
  onOpenJargonBuster,
  isHinglishDefault = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="rounded-md border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#191610] via-[#12141c] to-[#0d0f15] p-5 sm:p-7 shadow-xl space-y-5">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/30 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-sm bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37]">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 rounded-full bg-[#d4af37] text-[#0b0c10]">
                Aasan Bhasha Mein
              </span>
              <span className="text-xs text-[#94a3b8] font-sans">Bhai Style / ELI5 Quick Guide</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#ffffff] mt-1">
              {guide.desiTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenJargonBuster()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#38bdf8]/50 bg-[#0e1d2c] text-[#38bdf8] hover:bg-[#152a40] text-xs font-medium transition-all"
            title="Dictionary of complex technical words in plain Hindi/Hinglish"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Jargon Buster (कठिन शब्द)</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-[#2d3142] bg-[#161824] text-[#cbd5e1] hover:text-white text-xs font-medium transition-all"
          >
            <span>{isExpanded ? 'Chhota Karo' : 'Poora Padho'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 1-Line Punchline */}
      <div className="rounded-sm border-l-4 border-[#d4af37] bg-[#1a1711] p-4 text-sm sm:text-base font-medium text-[#fde047] leading-relaxed">
        <span className="text-[#d4af37] font-bold mr-1.5">🚀 1-Line Mein Saara Khel:</span>
        "{guide.oneLiner}"
      </div>

      {isExpanded && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Why Needed & Real-Life Desi Story in 2 columns */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Why Needed */}
            <div className="rounded-sm border border-[#272a3a] bg-[#141622] p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                <Flame className="h-4 w-4 text-[#fb923c]" />
                Iski Zaroorat Hi Kyun Padi?
              </div>
              <p className="mt-2.5 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                {guide.whyNeeded}
              </p>
            </div>

            {/* Real Life Analogy */}
            <div className="rounded-sm border border-[#d4af37]/30 bg-[#171510] p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                <Lightbulb className="h-4 w-4 text-[#d4af37]" />
                Desi Example: {guide.realLifeAnalogy.scenario}
              </div>
              <p className="mt-2.5 text-xs sm:text-sm text-[#f1f5f9] leading-relaxed italic">
                "{guide.realLifeAnalogy.explanation}"
              </p>
            </div>
          </div>

          {/* 3 Golden Rules: Sirf 3 Baatein Yaad Rakho */}
          <div className="rounded-sm border border-[#232634] bg-[#11131c] p-4 sm:p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#4ade80] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />
              Sirf 3 Baatein Yaad Rakho (Exam &amp; Interview Tips):
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {guide.threeGoldenRules.map((rule, idx) => (
                <div key={idx} className="rounded-xs border border-[#1e2230] bg-[#161824] p-3 text-xs text-[#cbd5e1] leading-relaxed flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded-xs bg-[#d4af37]/20 text-[#d4af37] font-mono text-[10px] font-bold mb-1.5">
                      Niyam #{idx + 1}
                    </span>
                    <p>{rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Terms Quick Cards (if any in guide) */}
          {guide.keyTermsHinglish && guide.keyTermsHinglish.length > 0 && (
            <div className="rounded-sm border border-[#1f2232] bg-[#0c0e14] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-2.5">
                💡 Is Chapter Ke Important Shabd (Quick Dictionary):
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {guide.keyTermsHinglish.map((term, tIdx) => (
                  <div key={tIdx} className="rounded-xs border border-[#232738] bg-[#141622] p-2.5 text-xs">
                    <div className="font-semibold text-[#38bdf8] font-mono text-xs">
                      {term.term}
                    </div>
                    <div className="text-[11px] text-[#cbd5e1] mt-1">
                      {term.aasanBhasha}
                    </div>
                    <div className="text-[10px] text-[#d4af37] mt-1.5 italic border-t border-[#1e2230] pt-1">
                      Ex: {term.desiExample}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
