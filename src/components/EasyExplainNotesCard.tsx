import React, { useState } from 'react';
import { EasyExplainGuide } from '../data/easy_explain_guides';
import { 
  Lightbulb, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface EasyExplainNotesCardProps {
  guide: EasyExplainGuide;
  onOpenJargonBuster: (term?: string) => void;
  defaultExpanded?: boolean;
}

export const EasyExplainNotesCard: React.FC<EasyExplainNotesCardProps> = ({
  guide,
  onOpenJargonBuster,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-md border border-[#d4af37]/40 bg-gradient-to-b from-[#141622] via-[#0f111a] to-[#0a0b10] p-4 sm:p-6 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232738] pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-sm bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37]">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 rounded-full bg-[#d4af37] text-[#0b0c10]">
                Plain English Notes
              </span>
              <span className="text-xs text-[#94a3b8]">Quick Comprehension &amp; Mental Models</span>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#ffffff] mt-0.5">
              {guide.simpleTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenJargonBuster()}
            className="inline-flex items-center gap-1.5 rounded-sm border border-[#38bdf8]/40 bg-[#0e1d2c] px-3 py-1.5 text-xs font-medium text-[#38bdf8] hover:bg-[#162b3d] hover:text-white transition-colors cursor-pointer"
            title="Open Architecture Jargon Buster"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Jargon Buster</span>
            <span className="sm:hidden">Jargon</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs text-[#94a3b8] hover:text-white px-2.5 py-1.5 rounded-sm border border-[#232738] bg-[#12141e] transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand Notes'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* One-Liner Takeaway */}
      <div className="rounded-sm bg-[#181b28] border-l-3 border-[#d4af37] p-3.5 text-sm text-[#f1f5f9] leading-relaxed">
        <strong className="text-[#d4af37] font-semibold mr-1.5 uppercase text-xs tracking-wider">The Core Concept:</strong>
        {guide.oneLiner}
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Why It Matters */}
          <div className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            <span className="font-semibold text-white">Why Engineers Care: </span>
            {guide.whyItMatters}
          </div>

          {/* Real-World Everyday Analogy */}
          {guide.realWorldAnalogy && (
            <div className="rounded-sm border border-[#282d40] bg-[#121420] p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38bdf8] mb-1.5">
                <Lightbulb className="h-4 w-4 text-[#38bdf8]" />
                Everyday Real-World Analogy: {guide.realWorldAnalogy.scenario}
              </div>
              <p className="text-xs sm:text-sm text-[#e2e8f0] leading-relaxed italic">
                "{guide.realWorldAnalogy.explanation}"
              </p>
            </div>
          )}

          {/* Three Golden Rules to Remember */}
          {guide.threeGoldenRules && guide.threeGoldenRules.length > 0 && (
            <div className="rounded-sm border border-[#232738] bg-[#12141f] p-4">
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-[#d4af37] mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e]" />
                3 Golden Rules for System Design Interviews
              </h4>
              <ul className="space-y-2">
                {guide.threeGoldenRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                    <span className="font-mono font-bold text-[#d4af37] shrink-0">{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Simplified Vocabulary Cards */}
          {guide.keyTermsSimplified && guide.keyTermsSimplified.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#94a3b8] flex items-center justify-between">
                <span>Key Terms Simplified:</span>
                <span className="text-[10px] text-[#64748b]">Plain English Translations</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {guide.keyTermsSimplified.map((item, idx) => (
                  <div key={idx} className="rounded-sm border border-[#202332] bg-[#10121b] p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{item.term}</span>
                      <button
                        onClick={() => onOpenJargonBuster(item.term)}
                        className="text-[10px] text-[#38bdf8] hover:underline"
                      >
                        Deep dive &rarr;
                      </button>
                    </div>
                    <div className="text-xs text-[#a5f3fc]">
                      <span className="font-medium text-[#38bdf8]">Plain English: </span>
                      {item.plainEnglish}
                    </div>
                    <div className="text-[11px] text-[#94a3b8] italic">
                      <span className="not-italic text-[#64748b]">Example: </span>
                      {item.realWorldExample}
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
