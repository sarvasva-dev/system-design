import React, { useState } from 'react';
import { Chapter } from '../types';
import { ALL_CHAPTERS } from '../data/chapters';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Trophy, 
  Sparkles, 
  Compass, 
  Layers, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Milestone
} from 'lucide-react';

interface SyllabusRoadmapBarProps {
  currentChapter: Chapter;
  completedChapterIds: Set<string>;
  onToggleComplete: () => void;
  onSelectChapter?: (chapterId: string) => void;
  onSelectNextChapter?: () => void;
}

export const SyllabusRoadmapBar: React.FC<SyllabusRoadmapBarProps> = ({
  currentChapter,
  completedChapterIds,
  onToggleComplete,
  onSelectChapter,
  onSelectNextChapter
}) => {
  const [showMatrix, setShowMatrix] = useState(false);
  const [hoveredChapter, setHoveredChapter] = useState<Chapter | null>(null);

  const totalChapters = ALL_CHAPTERS.length;
  const completedCount = ALL_CHAPTERS.filter(c => completedChapterIds.has(c.id)).length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);
  const isCurrentCompleted = completedChapterIds.has(currentChapter.id);

  // Curriculum Phases Definition
  const phases = [
    {
      id: 'phase-1',
      name: 'Phase 1: Architecture Foundations',
      parts: [0, 1, 2],
      description: 'Engineering mindset, silicon limits, network protocols & backend APIs.'
    },
    {
      id: 'phase-2',
      name: 'Phase 2: Persistence & Distributed Core',
      parts: [3, 4, 5, 6, 7, 8],
      description: 'Databases, Raft consensus, Redis caching, Kafka streams & distributed storage.'
    },
    {
      id: 'phase-3',
      name: 'Phase 3: Scale, Compute & Infrastructure',
      parts: [9, 10, 11, 12, 13, 14],
      description: 'Kubernetes pods, site reliability, bare-metal IaaS & multi-tenant isolation.'
    },
    {
      id: 'phase-4',
      name: 'Phase 4: Security, Identity & Math',
      parts: [15, 16, 17, 18, 19],
      description: 'OAuth2/OIDC, cryptosystems, threat modeling & capacity Fermi estimation.'
    }
  ];

  // Derive current curriculum stage badge
  const getStageBadge = (pct: number) => {
    if (pct === 100) return { label: 'Principal Architect Mastery', color: 'text-[#22c55e] border-[#22c55e]/40 bg-[#22c55e]/10' };
    if (pct >= 75) return { label: 'Stage 4: Enterprise Identity & Security', color: 'text-[#c084fc] border-[#c084fc]/40 bg-[#c084fc]/10' };
    if (pct >= 50) return { label: 'Stage 3: Infrastructure & Scale', color: 'text-[#38bdf8] border-[#38bdf8]/40 bg-[#38bdf8]/10' };
    if (pct >= 25) return { label: 'Stage 2: Distributed Core & Caching', color: 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10' };
    return { label: 'Stage 1: Hardware & Network Foundations', color: 'text-[#d4af37] border-[#d4af37]/40 bg-[#d4af37]/10' };
  };

  const stage = getStageBadge(progressPercent);

  return (
    <div className="rounded-md border border-[#232634] bg-[#0c0e15] p-3 sm:p-5 shadow-lg space-y-3 font-sans relative">
      {/* Top Header: Progress Counter & Active Stage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b1e2a] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
            <Milestone className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#ffffff]">
                Syllabus Progress Tracker
              </span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border font-medium ${stage.color}`}>
                {stage.label}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#94a3b8] mt-0.5">
              <span className="text-[#d4af37] font-semibold">{completedCount}</span> of{' '}
              <span className="text-[#ffffff]">{totalChapters}</span> Chapters Completed ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* Quick Actions: Mark Current Chapter & Next Navigation */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onToggleComplete}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-medium transition-all cursor-pointer border ${
              isCurrentCompleted
                ? 'bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/50 hover:bg-[#22c55e]/25'
                : 'bg-[#141622] text-[#cbd5e1] border-[#2d3142] hover:border-[#d4af37] hover:text-[#ffffff]'
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${isCurrentCompleted ? 'text-[#22c55e]' : 'text-[#64748b]'}`} />
            <span>{isCurrentCompleted ? 'Part Completed' : 'Mark Part Complete'}</span>
          </button>

          {onSelectNextChapter && (
            <button
              onClick={onSelectNextChapter}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-[#141622] text-xs font-mono text-[#94a3b8] border border-[#2d3142] hover:text-[#d4af37] hover:border-[#d4af37]/60 transition-colors cursor-pointer"
              title="Next Chapter"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xs bg-[#141622] text-[11px] font-mono text-[#94a3b8] border border-[#2d3142] hover:text-[#ffffff] transition-colors cursor-pointer"
            title="Toggle Curriculum Matrix"
          >
            <span>Phases</span>
            {showMatrix ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Dynamic Smooth Progress Fill Bar */}
      <div className="space-y-1">
        <div className="relative h-2 w-full rounded-full bg-[#141622] overflow-hidden border border-[#1f2230]">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] via-[#22c55e] to-[#38bdf8] transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Segmented Milestone Roadmap Ribbon (All 20 Chapters) */}
      <div className="relative">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {ALL_CHAPTERS.map((ch) => {
            const isCompleted = completedChapterIds.has(ch.id);
            const isCurrent = ch.id === currentChapter.id;

            return (
              <button
                key={ch.id}
                onClick={() => onSelectChapter?.(ch.id)}
                onMouseEnter={() => setHoveredChapter(ch)}
                onMouseLeave={() => setHoveredChapter(null)}
                className={`group relative flex-1 min-w-[32px] sm:min-w-[42px] h-8 sm:h-9 rounded-xs border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#d4af37] bg-[#d4af37]/20 shadow-md ring-1 ring-[#d4af37]'
                    : isCompleted
                    ? 'border-[#22c55e]/50 bg-[#22c55e]/15 hover:border-[#22c55e]'
                    : 'border-[#232634] bg-[#10121a] hover:border-[#38bdf8]/60 hover:bg-[#141622]'
                }`}
              >
                {/* Node Status Dot / Icon */}
                <div className="flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#22c55e]" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#475569] group-hover:bg-[#94a3b8]" />
                  )}
                </div>

                {/* Node Label */}
                <span className={`text-[9px] sm:text-[10px] font-mono leading-none mt-0.5 ${
                  isCurrent
                    ? 'text-[#d4af37] font-bold'
                    : isCompleted
                    ? 'text-[#4ade80] font-medium'
                    : 'text-[#64748b] group-hover:text-[#cbd5e1]'
                }`}>
                  P{ch.part}
                </span>

                {/* Current Active Indicator Pill */}
                {isCurrent && (
                  <span className="absolute -top-1.5 px-1 py-0 rounded-xs bg-[#d4af37] text-[#0b0c10] text-[7px] font-mono font-black uppercase">
                    Now
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Hovered Chapter Tooltip Bar */}
        {hoveredChapter && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 p-2.5 rounded-sm bg-[#090a0f] border border-[#2d3142] shadow-xl text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-[#ffffff] font-semibold flex items-center gap-1.5">
                <span className="text-[#d4af37]">Part {hoveredChapter.part}:</span>
                <span>{hoveredChapter.title}</span>
              </div>
              <div className="text-[10px] text-[#94a3b8] truncate max-w-xl">
                {hoveredChapter.subtitle}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-xs font-medium ${
                completedChapterIds.has(hoveredChapter.id)
                  ? 'bg-[#22c55e]/20 text-[#22c55e]'
                  : hoveredChapter.id === currentChapter.id
                  ? 'bg-[#d4af37]/20 text-[#d4af37]'
                  : 'bg-[#1e2230] text-[#94a3b8]'
              }`}>
                {completedChapterIds.has(hoveredChapter.id) ? 'Completed ✅' : hoveredChapter.id === currentChapter.id ? 'Viewing Now ⚡' : 'Click to Study ↗'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Phase Matrix Breakdown */}
      {showMatrix && (
        <div className="pt-3 border-t border-[#1b1e2a] grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {phases.map((phase) => {
            const phaseChapters = ALL_CHAPTERS.filter(c => phase.parts.includes(c.part));
            const phaseDone = phaseChapters.filter(c => completedChapterIds.has(c.id)).length;
            const phasePct = Math.round((phaseDone / phaseChapters.length) * 100);

            return (
              <div
                key={phase.id}
                className="p-2.5 rounded-sm bg-[#10121a] border border-[#232634] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[#ffffff]">{phase.name}</span>
                  <span className={`text-[10px] font-bold ${phasePct === 100 ? 'text-[#22c55e]' : 'text-[#d4af37]'}`}>
                    {phaseDone}/{phaseChapters.length}
                  </span>
                </div>
                
                {/* Phase Mini Progress Bar */}
                <div className="h-1 w-full bg-[#1b1e2a] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      phasePct === 100 ? 'bg-[#22c55e]' : 'bg-[#d4af37]'
                    }`}
                    style={{ width: `${phasePct}%` }}
                  />
                </div>

                {/* Chapter Chips in this phase */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {phaseChapters.map(c => {
                    const isDone = completedChapterIds.has(c.id);
                    const isNow = c.id === currentChapter.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => onSelectChapter?.(c.id)}
                        className={`px-1.5 py-0.5 rounded-xs text-[9px] font-mono transition-colors cursor-pointer border ${
                          isNow
                            ? 'bg-[#d4af37] text-[#0b0c10] font-bold border-[#d4af37]'
                            : isDone
                            ? 'bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/40'
                            : 'bg-[#141622] text-[#94a3b8] border-[#232634] hover:text-[#ffffff]'
                        }`}
                        title={c.title}
                      >
                        P{c.part} {isDone ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
