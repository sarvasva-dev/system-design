import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/case_studies';
import { CASE_STUDY_IMAGES } from '../data/chapter_images';
import { 
  Layers, 
  Terminal, 
  ShieldAlert, 
  CheckCircle, 
  AlertOctagon, 
  MessageSquare,
  Copy,
  Check,
  MoveHorizontal,
  Sparkles
} from 'lucide-react';

interface CaseStudyViewProps {
  onOpenResearch?: (topic: string) => void;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({ onOpenResearch }) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  const cs = CASE_STUDIES[selectedCaseIndex] || CASE_STUDIES[0];

  const copyBlueprint = () => {
    navigator.clipboard.writeText(cs.highLevelArchitectureAscii);
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10 pb-24">
      {/* Header */}
      <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 lg:p-10 shadow-lg">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
          <Layers className="h-4 w-4" />
          Production Case Study Blueprint
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#ffffff]">
          End-to-End System Architectures
        </h1>
        <p className="mt-2 text-xs sm:text-sm lg:text-base text-[#94a3b8] font-normal leading-relaxed">
          Production-grade architectural blueprints for hyperscale SaaS and IaaS cloud systems.
        </p>

        {/* Case Selector Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CASE_STUDIES.map((study, idx) => (
            <button
              key={study.id}
              onClick={() => setSelectedCaseIndex(idx)}
              className={`shrink-0 rounded-sm px-3.5 py-2.5 text-xs tracking-wide transition-all cursor-pointer min-h-[44px] ${
                idx === selectedCaseIndex
                  ? 'bg-[#1e2230] text-[#ffffff] border-b-2 border-[#d4af37] font-semibold shadow-xs'
                  : 'bg-[#161824] text-[#94a3b8] hover:bg-[#1c1f2d] hover:text-[#ffffff] border border-[#232634]'
              }`}
            >
              <span className="font-mono text-[11px] text-[#d4af37] mr-1.5 font-bold">#{study.number}</span>
              {study.title}
            </button>
          ))}
        </div>
      </div>

      {/* Case Thematic Banner */}
      {(() => {
        const csVisual = CASE_STUDY_IMAGES[cs.id] || {
          bannerUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          logoUrl: '',
          topologySummary: 'High-availability multi-region cloud topology with active-active service mesh and distributed persistence.'
        };
        return (
          <div className="relative rounded-md border border-[#232634] overflow-hidden group shadow-lg">
            <div className="relative h-40 sm:h-52 md:h-60 w-full overflow-hidden bg-[#0a0b0f]">
              <img
                src={csVisual.bannerUrl}
                alt={cs.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f16] via-[#0e0f16]/60 to-transparent" />
              <div className="absolute top-3 left-4 z-10">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37] bg-[#0b0c10]/85 backdrop-blur-md px-2.5 py-1 rounded-xs border border-[#2d3142]">
                  Case #{cs.number} &bull; Architectural Blueprint
                </span>
              </div>
              <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-[#e2e8f0] font-sans max-w-2xl drop-shadow-md">
                    <span className="font-semibold text-[#d4af37]">Production Topology: </span>
                    {csVisual.topologySummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Case Details */}
      <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
              System Design Specification #{cs.number}
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-serif font-medium text-[#ffffff]">
              {cs.title}
            </h2>
          </div>
          {onOpenResearch && (
            <button
              id="btn-casestudy-research"
              onClick={() => onOpenResearch(`${cs.title}: high-scale production architecture, failure modes, and recent engineering updates`)}
              className="inline-flex items-center gap-1.5 self-start rounded-sm border border-[#2d3142] bg-[#171a25] px-3.5 py-2 text-xs uppercase tracking-[0.12em] font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer"
              title="Search real-time Google Search data & engineering post-mortems for this system"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Grounded Web Research</span>
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-[#cbd5e1] leading-relaxed">
          {cs.problem}
        </p>

        {/* Requirements */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-[#232634] bg-[#161824] p-4 sm:p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-3">
              Functional Requirements
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#cbd5e1]">
              {cs.requirements.functional.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-sm border border-[#232634] bg-[#161824] p-4 sm:p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#94a3b8] mb-3">
              Non-Functional SLA Targets
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#cbd5e1]">
              {cs.requirements.nonFunctional.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-[#818cf8] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scale Assumptions & Math */}
        <div className="rounded-sm border border-[#232634] bg-[#141620] p-4 sm:p-6 space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
            Scale Footprint &amp; Assumptions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-sm border border-[#232634] bg-[#181a26] p-3 sm:p-4">
              <div className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-semibold">Active Workspaces</div>
              <div className="mt-1 font-serif text-base sm:text-lg text-[#ffffff] font-semibold">{cs.scaleAssumptions.dauMau}</div>
            </div>
            <div className="rounded-sm border border-[#232634] bg-[#181a26] p-3 sm:p-4">
              <div className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-semibold">Throughput (RPS)</div>
              <div className="mt-1 font-serif text-base sm:text-lg text-[#d4af37] font-semibold">{cs.scaleAssumptions.peakRps}</div>
            </div>
            <div className="rounded-sm border border-[#232634] bg-[#181a26] p-3 sm:p-4">
              <div className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-semibold">Storage Volume</div>
              <div className="mt-1 font-serif text-base sm:text-lg text-[#ffffff] font-semibold">{cs.scaleAssumptions.storage}</div>
            </div>
            <div className="rounded-sm border border-[#232634] bg-[#181a26] p-3 sm:p-4">
              <div className="text-[9px] uppercase tracking-wider text-[#94a3b8] font-semibold">Read / Write Ratio</div>
              <div className="mt-1 font-serif text-base sm:text-lg text-[#d4af37] font-semibold">{cs.scaleAssumptions.readWriteRatio}</div>
            </div>
          </div>

          <div className="rounded-sm bg-[#0a0b0f] p-4 border border-[#1e202c]">
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] font-semibold mb-2">
              Derivation Calculations:
            </div>
            <ul className="space-y-1 text-xs text-[#cbd5e1] font-mono">
              {cs.scaleAssumptions.calculationsStepByStep.map((step, i) => (
                <li key={i}>&bull; {step}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ASCII Architecture Blueprint */}
        <div className="rounded-sm border border-[#232634] bg-[#090a0f] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2230] pb-3 mb-4 gap-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
              <Terminal className="h-4 w-4 text-[#d4af37]" />
              <span>Complete System Blueprint</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-[#64748b] sm:hidden">
                <MoveHorizontal className="h-3 w-3" /> Scroll
              </span>
              <button
                onClick={copyBlueprint}
                className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-[#2d3142] bg-[#141620] px-3 py-1.5 text-xs uppercase tracking-[0.14em] font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fff] transition-colors cursor-pointer min-h-[36px]"
              >
                {copiedBlueprint ? <Check className="h-3.5 w-3.5 text-[#22c55e]" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedBlueprint ? 'Copied' : 'Copy Blueprint'}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto p-2 bg-[#050608] rounded-sm border border-[#1a1c27]">
            <pre className="font-mono text-[11px] sm:text-xs leading-relaxed text-[#d4af37] whitespace-pre min-w-[520px]">
              {cs.highLevelArchitectureAscii.trim()}
            </pre>
          </div>
        </div>

        {/* Core Components Table */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
            Subsystem Roles &amp; Scaling Vectors
          </h3>
          <div className="overflow-x-auto rounded-sm border border-[#232634]">
            <table className="w-full text-left text-xs sm:text-sm min-w-[560px]">
              <thead className="border-b border-[#232634] bg-[#151722] text-[#94a3b8]">
                <tr>
                  <th className="p-3 sm:p-4 text-[10px] uppercase tracking-[0.14em] font-semibold text-[#d4af37]">Subsystem</th>
                  <th className="p-3 sm:p-4 text-[10px] uppercase tracking-[0.14em] font-semibold">Operational Role</th>
                  <th className="p-3 sm:p-4 text-[10px] uppercase tracking-[0.14em] font-semibold text-[#94a3b8]">Scaling Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2230]">
                {cs.components.map((c, i) => (
                  <tr key={i} className="hover:bg-[#181a26] transition-colors">
                    <td className="p-3 sm:p-4 font-semibold text-[#ffffff]">{c.name}</td>
                    <td className="p-3 sm:p-4 text-[#cbd5e1]">{c.role}</td>
                    <td className="p-3 sm:p-4 text-[#d4af37] font-mono text-xs">{c.scalingStrategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Lifecycle Trace */}
        <div className="rounded-sm border border-[#232634] bg-[#161824] p-4 sm:p-6 space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
            End-to-End Request Lifecycle Trace
          </h3>
          <ol className="space-y-2 text-xs sm:text-sm text-[#cbd5e1]">
            {cs.requestLifecycle.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-mono text-[#d4af37] font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Failure Scenarios & Mitigations */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#f87171]">
            Failure Modes &amp; Resilience Mitigations
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {cs.failureScenarios.map((fs, i) => (
              <div key={i} className="rounded-sm border border-[#3f1d22] bg-[#1f0e11] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f87171]">
                  <AlertOctagon className="h-4 w-4 shrink-0" />
                  <span>Failure: {fs.failure}</span>
                </div>
                <p className="text-xs text-[#cbd5e1]">
                  <span className="text-[#94a3b8]">Impact: </span>{fs.impact}
                </p>
                <div className="rounded-xs bg-[#100709] p-3 text-xs text-[#e2e8f0] border border-[#2d1418] mt-2">
                  <span className="text-[#4ade80] font-semibold">Mitigation: </span>
                  {fs.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Discussion Points */}
        <div className="rounded-sm border border-[#332a18] bg-[#16130b] p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
            <MessageSquare className="h-4 w-4" />
            Senior Architectural Defense &bull; Interview Talking Points
          </div>
          <div className="space-y-3">
            {cs.interviewDiscussion.map((disc, i) => (
              <div key={i} className="rounded-sm bg-[#0d0b06] p-4 border border-[#2d2414]">
                <div className="text-xs sm:text-sm font-serif font-medium text-[#ffffff]">
                  Q: {disc.question}
                </div>
                <ul className="mt-2.5 space-y-1 text-xs text-[#cbd5e1]">
                  {disc.keyTalkingPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#d4af37] font-bold">&bull;</span>
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
