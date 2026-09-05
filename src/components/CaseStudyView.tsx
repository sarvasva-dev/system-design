import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/case_studies';
import { 
  Layers, 
  Terminal, 
  ShieldAlert, 
  Server, 
  Activity, 
  CheckCircle, 
  AlertOctagon, 
  DollarSign, 
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';

export const CaseStudyView: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  const cs = CASE_STUDIES[selectedCaseIndex] || CASE_STUDIES[0];

  const copyBlueprint = () => {
    navigator.clipboard.writeText(cs.highLevelArchitectureAscii);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Header */}
      <div className="rounded-sm border border-[#222] bg-[#111] p-8 sm:p-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
          <Layers className="h-4 w-4" />
          Production Case Study Blueprint
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-serif text-[#fff]">
          End-to-End System Architectures
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#888] font-light leading-relaxed">
          Comprehensive, production-grade architectural blueprints for hyperscale SaaS and IaaS cloud systems.
        </p>

        {/* Case Selector Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CASE_STUDIES.map((study, idx) => (
            <button
              key={study.id}
              onClick={() => setSelectedCaseIndex(idx)}
              className={`shrink-0 rounded-sm px-4 py-3 text-xs tracking-wide transition-all cursor-pointer ${
                idx === selectedCaseIndex
                  ? 'bg-[#1c1c1c] text-[#fff] border-b-2 border-[#c5a059] font-medium'
                  : 'bg-[#0c0c0c] text-[#777] hover:bg-[#161616] hover:text-[#bbb] border border-[#1e1e1e]'
              }`}
            >
              <span className="font-mono text-[10px] text-[#c5a059] mr-1.5">#{study.number}</span>
              {study.title}
            </button>
          ))}
        </div>
      </div>

      {/* Case Details */}
      <div className="rounded-sm border border-[#222] bg-[#111] p-8 sm:p-10 space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
            System Design Specification #{cs.number}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-serif text-[#fff]">
            {cs.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#ccc] leading-relaxed">
            {cs.problem}
          </p>
        </div>

        {/* Requirements */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] mb-4">
              Functional Requirements
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#bbb]">
              {cs.requirements.functional.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888] mb-4">
              Non-Functional SLA Targets
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#bbb]">
              {cs.requirements.nonFunctional.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-[#888] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scale Assumptions & Math */}
        <div className="rounded-sm border border-[#222] bg-[#0a0a0a] p-6 space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
            Scale Calculations &amp; Capacity Footprint
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-sm border border-[#222] bg-[#111] p-4">
              <div className="text-[9px] uppercase tracking-widest text-[#666]">DAU / Workspaces</div>
              <div className="mt-1 font-serif text-lg text-[#fff]">{cs.scaleAssumptions.dauMau}</div>
            </div>
            <div className="rounded-sm border border-[#222] bg-[#111] p-4">
              <div className="text-[9px] uppercase tracking-widest text-[#666]">Throughput (RPS)</div>
              <div className="mt-1 font-serif text-lg text-[#c5a059]">{cs.scaleAssumptions.peakRps}</div>
            </div>
            <div className="rounded-sm border border-[#222] bg-[#111] p-4">
              <div className="text-[9px] uppercase tracking-widest text-[#666]">Storage Horizon</div>
              <div className="mt-1 font-serif text-lg text-[#fff]">{cs.scaleAssumptions.storage}</div>
            </div>
            <div className="rounded-sm border border-[#222] bg-[#111] p-4">
              <div className="text-[9px] uppercase tracking-widest text-[#666]">Read / Write Ratio</div>
              <div className="mt-1 font-serif text-lg text-[#c5a059]">{cs.scaleAssumptions.readWriteRatio}</div>
            </div>
          </div>

          <div className="mt-4 rounded-sm bg-[#050505] p-4 border border-[#1e1e1e]">
            <div className="text-[10px] uppercase tracking-[0.15em] text-[#888] font-semibold mb-2">
              Derivation Steps:
            </div>
            <ul className="space-y-1 text-xs text-[#aaa] font-mono">
              {cs.scaleAssumptions.calculationsStepByStep.map((step, i) => (
                <li key={i}>&bull; {step}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ASCII Architecture Blueprint */}
        <div className="rounded-sm border border-[#222] bg-[#050505] p-6 text-[#e5e5e5]">
          <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              <Terminal className="h-4 w-4 text-[#c5a059]" />
              <span>Complete System Blueprint</span>
            </div>
            <button
              onClick={copyBlueprint}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#333] bg-[#111] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[#aaa] hover:border-[#c5a059] hover:text-[#fff] transition-colors cursor-pointer"
            >
              {copiedBlueprint ? <Check className="h-3.5 w-3.5 text-[#c5a059]" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedBlueprint ? 'Copied' : 'Copy Blueprint'}
            </button>
          </div>
          <div className="overflow-x-auto p-2">
            <pre className="font-mono text-xs leading-relaxed text-[#c5a059]/90 whitespace-pre">
              {cs.highLevelArchitectureAscii.trim()}
            </pre>
          </div>
        </div>

        {/* Core Components Table */}
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
            Subsystem Roles &amp; Scaling Vectors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-[#222] bg-[#0c0c0c] text-[#888]">
                <tr>
                  <th className="p-3.5 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#c5a059]">Subsystem</th>
                  <th className="p-3.5 text-[10px] uppercase tracking-[0.15em] font-semibold">Operational Responsibility</th>
                  <th className="p-3.5 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#888]">Horizontal Scaling Technique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {cs.components.map((c, i) => (
                  <tr key={i} className="hover:bg-[#141414] transition-colors">
                    <td className="p-3.5 font-medium text-[#fff]">{c.name}</td>
                    <td className="p-3.5 text-[#bbb]">{c.role}</td>
                    <td className="p-3.5 text-[#aaa] font-mono text-xs">{c.scalingStrategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Lifecycle Trace */}
        <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-6 space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
            End-to-End Request Lifecycle Trace
          </h3>
          <ol className="space-y-2.5 text-xs sm:text-sm text-[#ccc]">
            {cs.requestLifecycle.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono text-[#c5a059] font-bold text-xs shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Failure Scenarios & Mitigations */}
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#f87171]">
            Failure Modes &amp; Resilience Mitigations
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {cs.failureScenarios.map((fs, i) => (
              <div key={i} className="rounded-sm border border-[#3b1c1c] bg-[#140b0b] p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f87171]">
                  <AlertOctagon className="h-4 w-4 shrink-0" />
                  <span>Failure: {fs.failure}</span>
                </div>
                <p className="text-xs text-[#bbb]">
                  <span className="text-[#888]">Impact: </span>{fs.impact}
                </p>
                <div className="rounded-xs bg-[#080808] p-3 text-xs text-[#ddd] border border-[#222] mt-2">
                  <span className="text-[#4ade80] font-semibold">Mitigation: </span>
                  {fs.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Discussion Points */}
        <div className="rounded-sm border border-[#2a2215] bg-[#0e0b07] p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
            <MessageSquare className="h-4 w-4" />
            Senior Architectural Defense &bull; Interview Talking Points
          </div>
          <div className="space-y-4">
            {cs.interviewDiscussion.map((disc, i) => (
              <div key={i} className="rounded-sm bg-[#070707] p-5 border border-[#222]">
                <div className="text-sm font-serif text-[#fff]">
                  Q: {disc.question}
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-[#bbb]">
                  {disc.keyTalkingPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#c5a059] font-bold">&bull;</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
