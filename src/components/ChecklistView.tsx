import React, { useState } from 'react';
import { ARCHITECTURE_CHECKLIST } from '../data/checklist';
import { CheckSquare, AlertTriangle } from 'lucide-react';

export const ChecklistView: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10 pb-24">
      {/* Header */}
      <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 lg:p-10 shadow-lg">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
          <CheckSquare className="h-4 w-4" />
          Senior Interview Rubric
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#ffffff]">
          5-Step System Design Framework
        </h1>
        <p className="mt-2 text-xs sm:text-sm lg:text-base text-[#94a3b8] font-normal leading-relaxed">
          The standardized structural playbook evaluated by Principal and Staff engineering hiring panels.
        </p>
      </div>

      {/* 5 Steps */}
      <div className="space-y-6">
        {ARCHITECTURE_CHECKLIST.map(step => (
          <div key={step.step} className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#232634] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#d4af37]/40 bg-[#181a26] font-mono text-xs font-bold text-[#d4af37]">
                  0{step.step}
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-medium text-[#ffffff]">
                  {step.category}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              {step.description}
            </p>

            {/* Key Questions */}
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                Mandatory Clarifying Inquiries
              </div>
              <div className="space-y-2">
                {step.keyQuestionsToAsk.map((q, idx) => {
                  const key = `step-${step.step}-q-${idx}`;
                  const isChecked = checkedItems[key];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(key)}
                      className={`flex items-start gap-3 rounded-sm p-3.5 border transition-colors cursor-pointer min-h-[44px] ${
                        isChecked
                          ? 'border-[#22c55e]/40 bg-[#0e1c12] text-[#e2e8f0]'
                          : 'border-[#232634] bg-[#161824] text-[#cbd5e1] hover:border-[#2d3142]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked || false}
                        onChange={() => {}}
                        className="mt-0.5 h-4 w-4 accent-[#d4af37] cursor-pointer shrink-0"
                      />
                      <span className="text-xs sm:text-sm leading-relaxed">{q}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red Flags */}
            <div className="rounded-sm border border-[#3f1d22] bg-[#1f0e11] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-[#f87171]">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Disqualifying Anti-Patterns (Red Flags)
              </div>
              <ul className="space-y-1 text-xs text-[#cbd5e1]">
                {step.commonRedFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#f87171] font-bold">&bull;</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
