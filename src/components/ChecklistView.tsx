import React, { useState } from 'react';
import { ARCHITECTURE_CHECKLIST } from '../data/checklist';
import { CheckSquare, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export const ChecklistView: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Header */}
      <div className="rounded-sm border border-[#222] bg-[#111] p-8 sm:p-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
          <CheckSquare className="h-4 w-4" />
          Senior Interview Rubric
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-serif text-[#fff]">
          5-Step System Design Framework
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#888] font-light leading-relaxed">
          The standardized structural playbook evaluated by Principal and Staff engineering hiring panels at top tier tech organizations.
        </p>
      </div>

      {/* 5 Steps */}
      <div className="space-y-6">
        {ARCHITECTURE_CHECKLIST.map(step => (
          <div key={step.step} className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#c5a059]/40 bg-[#141414] font-mono text-xs font-bold text-[#c5a059]">
                  0{step.step}
                </span>
                <h2 className="text-xl font-serif text-[#fff]">
                  {step.category}
                </h2>
              </div>
            </div>

            <p className="text-sm text-[#ccc] leading-relaxed">
              {step.description}
            </p>

            {/* Key Questions */}
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
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
                      className={`flex items-start gap-3 rounded-sm p-3 border transition-colors cursor-pointer ${
                        isChecked
                          ? 'border-[#1d331f] bg-[#0a110b] text-[#ddd]'
                          : 'border-[#1e1e1e] bg-[#0c0c0c] text-[#aaa] hover:border-[#333]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked || false}
                        onChange={() => {}}
                        className="mt-1 h-3.5 w-3.5 accent-[#c5a059] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm">{q}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red Flags */}
            <div className="rounded-sm border border-[#3b1c1c] bg-[#140b0b] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#f87171]">
                <AlertTriangle className="h-3.5 w-3.5" />
                Disqualifying Anti-Patterns (Red Flags)
              </div>
              <ul className="space-y-1 text-xs text-[#bbb]">
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
