import React, { useState } from 'react';
import { Chapter } from '../types';
import { GATE_SMASHERS_LECTURES, GATE_SMASHERS_PLAYLIST_URL } from '../data/gate_smashers_videos';
import { CHAPTER_IMAGES } from '../data/chapter_images';
import { ChapterDiagramDispatcher } from './diagrams/ChapterDiagramDispatcher';
import { ConceptArchitectureVisualizer } from './diagrams/ConceptArchitectureVisualizer';
import { SyllabusRoadmapBar } from './SyllabusRoadmapBar';
import { FlowAnimator } from './FlowAnimator';
import { EasyExplainNotesCard } from './EasyExplainNotesCard';
import { JargonBusterModal } from './JargonBusterModal';
import { getEasyExplainGuideForChapter } from '../data/easy_explain_guides';
import { 
  CheckCircle2, 
  Circle, 
  Code, 
  HelpCircle, 
  Lightbulb, 
  AlertTriangle, 
  Check, 
  Copy, 
  ExternalLink, 
  Play, 
  ShieldCheck, 
  Scale, 
  BookOpen, 
  Terminal,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MoveHorizontal,
  Search,
  Sparkles,
  Youtube,
  Clock,
  Layers
} from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onSelectNextChapter?: () => void;
  onOpenLecturesTab?: () => void;
  completedChapterIds?: Set<string> ;
  onSelectChapter?: (chapterId: string) => void;
  onOpenResearch?: (topic: string) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  isCompleted,
  onToggleComplete,
  onSelectNextChapter,
  onOpenLecturesTab,
  completedChapterIds = new Set<string>(),
  onSelectChapter,
  onOpenResearch
}) => {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [copiedDiagram, setCopiedDiagram] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [diagramMode, setDiagramMode] = useState<'visual' | 'animated' | 'ascii'>('visual');

  // Reading Comfort & Notes Style State
  const [notesStyle, setNotesStyle] = useState<'easy' | 'professional'>(() => {
    try {
      return (localStorage.getItem('sys_design_notes_style') as 'easy' | 'professional') || 'easy';
    } catch {
      return 'easy';
    }
  });
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      return (localStorage.getItem('sys_design_font') as 'normal' | 'large' | 'xlarge') || 'large';
    } catch {
      return 'large';
    }
  });
  const [jargonModalOpen, setJargonModalOpen] = useState(false);
  const [jargonSearchTerm, setJargonSearchTerm] = useState('');

  const easyGuide = getEasyExplainGuideForChapter(chapter);

  // Dynamic text size class for high readability
  const bodyTextClass = fontSize === 'xlarge'
    ? 'text-base sm:text-lg leading-loose text-[#f8fafc]'
    : fontSize === 'large'
      ? 'text-sm sm:text-base leading-relaxed text-[#f1f5f9]'
      : 'text-xs sm:text-sm leading-relaxed text-[#e2e8f0]';

  const visualAsset = CHAPTER_IMAGES[chapter.id];

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyDiagramToClipboard = () => {
    if (chapter.diagramAscii) {
      navigator.clipboard.writeText(chapter.diagramAscii);
      setCopiedDiagram(true);
      setTimeout(() => setCopiedDiagram(false), 2000);
    }
  };

  const currentConcept = chapter.concepts[activeConceptIndex] || chapter.concepts[0];

  const matchingLectures = GATE_SMASHERS_LECTURES.filter(
    lec => lec.associatedChapterId === chapter.id || 
           lec.associatedChapterTitle.toLowerCase().includes(`part ${chapter.part}:`) ||
           lec.associatedChapterTitle.toLowerCase().includes(`part ${chapter.part} `)
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10 pb-24">
      {/* Visual Syllabus Progress Tracker & Roadmap Bar */}
      <SyllabusRoadmapBar
        currentChapter={chapter}
        completedChapterIds={completedChapterIds}
        onToggleComplete={onToggleComplete}
        onSelectChapter={onSelectChapter}
        onSelectNextChapter={onSelectNextChapter}
      />

      {/* Reading & Comprehension Comfort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#d4af37]/40 bg-[#12141e] p-3 sm:p-4 shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
            Reading Depth:
          </span>
          <div className="flex rounded-sm bg-[#0a0b0f] p-0.5 border border-[#232738]">
            <button
              onClick={() => {
                setNotesStyle('easy');
                try { localStorage.setItem('sys_design_notes_style', 'easy'); } catch {}
              }}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                notesStyle === 'easy'
                  ? 'bg-[#d4af37] text-[#0b0c10] font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <span>💡 Easy Explain Notes (Plain English)</span>
            </button>
            <button
              onClick={() => {
                setNotesStyle('professional');
                try { localStorage.setItem('sys_design_notes_style', 'professional'); } catch {}
              }}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                notesStyle === 'professional'
                  ? 'bg-[#1e2235] text-white font-bold shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <span>🏛️ Professional Architecture Deep Dive</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Text Size Switcher */}
          <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Text Size:</span>
            <div className="flex rounded-sm bg-[#0a0b0f] p-0.5 border border-[#232738]">
              <button
                onClick={() => {
                  setFontSize('normal');
                  try { localStorage.setItem('sys_design_font', 'normal'); } catch {}
                }}
                className={`px-2.5 py-1 rounded-xs text-xs font-mono cursor-pointer transition-all ${
                  fontSize === 'normal' ? 'bg-[#d4af37] text-[#0b0c10] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Standard Text Size"
              >
                A-
              </button>
              <button
                onClick={() => {
                  setFontSize('large');
                  try { localStorage.setItem('sys_design_font', 'large'); } catch {}
                }}
                className={`px-2.5 py-1 rounded-xs text-xs font-mono cursor-pointer transition-all ${
                  fontSize === 'large' ? 'bg-[#d4af37] text-[#0b0c10] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Comfortable Reading Size"
              >
                A
              </button>
              <button
                onClick={() => {
                  setFontSize('xlarge');
                  try { localStorage.setItem('sys_design_font', 'xlarge'); } catch {}
                }}
                className={`px-2.5 py-1 rounded-xs text-xs font-mono font-bold cursor-pointer transition-all ${
                  fontSize === 'xlarge' ? 'bg-[#d4af37] text-[#0b0c10] font-bold' : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Extra Large Readable Size"
              >
                A+
              </button>
            </div>
          </div>

          {/* Jargon Buster Button */}
          <button
            onClick={() => {
              setJargonSearchTerm('');
              setJargonModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-sm border border-[#38bdf8]/40 bg-[#0e1d2c] px-3 py-1.5 text-xs font-medium text-[#38bdf8] hover:bg-[#152a40] hover:text-white transition-colors cursor-pointer"
            title="Open Architecture Jargon Buster"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Jargon Buster</span>
          </button>
        </div>
      </div>

      {/* Prominent Easy Explain Notes & Mental Models Card */}
      <EasyExplainNotesCard
        guide={easyGuide}
        onOpenJargonBuster={(term) => {
          setJargonSearchTerm(term || '');
          setJargonModalOpen(true);
        }}
        defaultExpanded={notesStyle === 'easy'}
      />

      {/* Chapter Thematic Architecture Photography & Hardware Context */}
      {visualAsset && (
        <div className="relative rounded-md border border-[#232634] bg-[#0e0f14] overflow-hidden shadow-xl group">
          <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden bg-[#07080c]">
            <img
              src={visualAsset.bannerUrl}
              alt={chapter.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/50 to-transparent" />
            
            {/* Top architectural component pills */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1.5 z-10">
              {visualAsset.architecturalElements.map((elem, idx) => (
                <span
                  key={idx}
                  className="rounded-xs bg-[#0b0c10]/85 backdrop-blur-md border border-[#2d3142] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono text-[#cbd5e1] shadow-xs"
                >
                  {elem}
                </span>
              ))}
            </div>

            {/* Bottom caption bar */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#e2e8f0] max-w-2xl font-sans drop-shadow-md">
                <span className="font-semibold text-[#d4af37]">Physical Domain Infrastructure: </span>
                {visualAsset.caption}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setDiagramMode('animated')}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono font-semibold text-[#38bdf8] bg-[#0b0c10]/90 hover:bg-[#161c2c] border border-[#38bdf8]/40 hover:border-[#38bdf8] px-2.5 py-1 rounded-xs transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="h-3 w-3 text-[#38bdf8]" />
                  <span>Simulate Flow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Title & Header */}
      <section className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 lg:p-10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-xs bg-[#191b26] border border-[#2d3142] px-3.5 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] w-fit">
            {chapter.partTitle}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onOpenResearch && (
              <button
                id="btn-chapter-live-research"
                onClick={() => onOpenResearch(`${chapter.title}: real-world architecture, benchmarks, and production trade-offs`)}
                className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-[#2d3142] bg-[#171a25] px-3.5 py-2 text-xs uppercase tracking-[0.12em] font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#d4af37] transition-all cursor-pointer min-h-[44px]"
                title="Search real-time Google Search data, benchmarks & incidents for this chapter"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>Live Web Benchmarks</span>
              </button>
            )}
            <button
              id="btn-mark-chapter-complete"
              onClick={onToggleComplete}
              className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-xs uppercase tracking-[0.14em] font-semibold transition-all cursor-pointer min-h-[44px] ${
                isCompleted
                  ? 'bg-[#152e1d] text-[#4ade80] border border-[#22c55e]/40 shadow-xs'
                  : 'border border-[#2d3142] bg-[#171a25] text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff]'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />
                  Completed Module
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 text-[#94a3b8]" />
                  Mark as Completed
                </>
              )}
            </button>
          </div>
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-medium text-[#ffffff] tracking-tight leading-tight">
          {chapter.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base lg:text-lg text-[#94a3b8] font-normal leading-relaxed">
          {chapter.subtitle}
        </p>

        {/* Executive summary brief */}
        <div className="mt-6 relative border-l-2 border-[#d4af37] bg-[#171a26] p-4 sm:p-6 rounded-r-sm">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-1.5">
            Executive Architecture Brief
          </div>
          <p className="text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
            {chapter.summary}
          </p>
        </div>

        {/* Color Awareness & Double-Tap Explainer System Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 rounded-sm border border-[#232634] bg-[#141620] px-3.5 py-2.5 text-[11px] text-[#94a3b8]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#d4af37] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              Color Awareness:
            </span>
            <span className="flex items-center gap-1.5 text-[#e2e8f0]">
              <span className="h-2 w-2 rounded-full bg-[#d4af37]"></span> Core Laws
            </span>
            <span className="flex items-center gap-1.5 text-[#4ade80]">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]"></span> SLA Guarantees
            </span>
            <span className="flex items-center gap-1.5 text-[#f87171]">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]"></span> Anti-Patterns
            </span>
            <span className="flex items-center gap-1.5 text-[#38bdf8]">
              <span className="h-2 w-2 rounded-full bg-[#38bdf8]"></span> Network / Edge
            </span>
            <span className="flex items-center gap-1.5 text-[#c084fc]">
              <span className="h-2 w-2 rounded-full bg-[#c084fc]"></span> Consensus
            </span>
          </div>
          <div className="text-[10px] text-[#cbd5e1] font-mono bg-[#0b0c10] px-2 py-1 rounded-xs border border-[#1f2230]">
            💡 Double-tap any term to search Google
          </div>
        </div>
      </section>

      {/* System Architecture Topology: Visual Interactive Map & ASCII Blueprint */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#d4af37]" />
              Topology Architecture View:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-sm bg-[#12141c] border border-[#232634]">
              <button
                onClick={() => setDiagramMode('visual')}
                className={`px-3 py-1 rounded-xs text-xs font-medium transition-all cursor-pointer ${
                  diagramMode === 'visual'
                    ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#ffffff]'
                }`}
              >
                Interactive Topology Map
              </button>
              <button
                onClick={() => setDiagramMode('animated')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xs text-xs font-medium transition-all cursor-pointer ${
                  diagramMode === 'animated'
                    ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#ffffff]'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-ping" />
                <span>Live Flow Simulator</span>
              </button>
              <button
                onClick={() => setDiagramMode('ascii')}
                className={`px-3 py-1 rounded-xs text-xs font-medium transition-all cursor-pointer ${
                  diagramMode === 'ascii'
                    ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#ffffff]'
                }`}
              >
                ASCII Blueprint
              </button>
            </div>
          </div>
        </div>

        {diagramMode === 'visual' ? (
          <ChapterDiagramDispatcher chapter={chapter} />
        ) : diagramMode === 'animated' ? (
          <FlowAnimator
            chapterVisualUrl={visualAsset?.bannerUrl}
            chapterTitle={chapter.title}
          />
        ) : (
          chapter.diagramAscii && (
            <div className="rounded-md border border-[#232634] bg-[#090a0f] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2230] pb-4 mb-4 gap-3">
                <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                  <Terminal className="h-4 w-4 text-[#d4af37]" />
                  <span>System Architectural Blueprint (ASCII Specification)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#64748b] sm:hidden">
                    <MoveHorizontal className="h-3 w-3" /> Scrollable
                  </span>
                  <button
                    onClick={copyDiagramToClipboard}
                    className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-[#2d3142] bg-[#141620] px-3 py-2 text-xs uppercase tracking-[0.14em] font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fff] transition-colors cursor-pointer min-h-[38px]"
                  >
                    {copiedDiagram ? <Check className="h-3.5 w-3.5 text-[#22c55e]" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedDiagram ? 'Copied' : 'Copy Blueprint'}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto p-2 bg-[#050608] rounded-sm border border-[#1a1c27]">
                <pre className="font-mono text-[11px] sm:text-xs md:text-[13px] leading-relaxed text-[#d4af37] whitespace-pre min-w-[500px]">
                  {chapter.diagramAscii.trim()}
                </pre>
              </div>
            </div>
          )
        )}
      </section>

      {/* Core Architectural Concepts */}
      <section className="rounded-md border border-[#232634] bg-[#12141c] p-4 sm:p-8 lg:p-10 space-y-8">
        <div className="flex items-center justify-between border-b border-[#232634] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-[#191b26] border border-[#2d3142] text-[#d4af37]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#ffffff]">
                Core Architectural Concepts
              </h2>
              <p className="text-[11px] text-[#94a3b8] uppercase tracking-[0.14em] mt-0.5">
                Foundations &amp; Mechanistic Trade-Offs ({chapter.concepts.length} Modules)
              </p>
            </div>
          </div>
        </div>

        {/* Concept Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {chapter.concepts.map((concept, idx) => (
            <button
              key={idx}
              onClick={() => setActiveConceptIndex(idx)}
              className={`shrink-0 rounded-sm px-3.5 py-2.5 text-xs tracking-wide transition-all cursor-pointer min-h-[42px] ${
                idx === activeConceptIndex
                  ? 'bg-[#1e2230] text-[#ffffff] border-b-2 border-[#d4af37] font-semibold shadow-xs'
                  : 'bg-[#151722] text-[#94a3b8] hover:bg-[#1a1c28] hover:text-[#cbd5e1] border border-[#232634]'
              }`}
            >
              <span className="font-mono text-[11px] text-[#d4af37] mr-1.5 font-bold">{idx + 1}.</span>
              {concept.title}
            </button>
          ))}
        </div>

        {/* Current Concept Details */}
        {currentConcept && (
          <div className="space-y-6 pt-2" data-term={currentConcept.title}>
            {/* Concept Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2230] pb-3">
              <h3 className="text-lg sm:text-2xl font-serif font-medium text-[#ffffff]">
                {currentConcept.title}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const q = `explain ${currentConcept.title} in system design`;
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[#2d3142] bg-[#161824] px-2.5 py-1 text-[11px] font-medium text-[#d4af37] hover:border-[#d4af37] hover:text-[#fff] transition-colors cursor-pointer min-h-[32px]"
                  title={`Search Google: explain ${currentConcept.title} in system design`}
                >
                  <Search className="h-3 w-3" />
                  <span>Explain on Google ↗</span>
                </button>
                <span className={`rounded-xs px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold border ${
                  currentConcept.confidence === 'stable'
                    ? 'bg-[#122216] text-[#4ade80] border-[#22c55e]/30'
                    : 'bg-[#221c10] text-[#d4af37] border-[#d4af37]/30'
                }`}>
                  {currentConcept.confidence} standard
                </span>
              </div>
            </div>

            {/* Plain English Breakdown & Mental Model Card */}
            {(() => {
              const conceptNote = easyGuide.conceptNotes?.[currentConcept.title];
              return (
                <div className="rounded-md border border-[#d4af37]/50 bg-gradient-to-r from-[#161826] via-[#12141f] to-[#0c0e16] p-4 sm:p-6 shadow-lg space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#24293d] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 rounded-full bg-[#d4af37] text-[#0b0c10]">
                        Plain English Notes
                      </span>
                      <h4 className="text-sm sm:text-base font-semibold text-[#fde047]">
                        {conceptNote?.plainTitle || `${currentConcept.title} — Intuitive Mental Model`}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        const firstWord = currentConcept.title.split(' ')[0].replace(/[^a-zA-Z]/g, '');
                        setJargonSearchTerm(firstWord);
                        setJargonModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#38bdf8] hover:text-white bg-[#0e1d2c] border border-[#38bdf8]/40 px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
                      title="Look up term in Plain English Jargon Buster"
                    >
                      <HelpCircle className="h-3 w-3" />
                      <span>Jargon Buster ↗</span>
                    </button>
                  </div>

                  {/* Plain English Core Concept */}
                  <div>
                    <p className={bodyTextClass}>
                      <strong className="text-[#4ade80] font-semibold">In Plain English: </strong>
                      {conceptNote?.plainEnglishExplanation || currentConcept.simpleDefinition}
                    </p>
                  </div>

                  {/* Everyday Real-World Analogy */}
                  <div className="rounded-sm border-l-3 border-[#38bdf8] bg-[#0f1422] p-3.5 sm:p-4 text-[#f1f5f9]">
                    <div className="text-[10px] uppercase tracking-wider text-[#38bdf8] font-semibold mb-1 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-[#38bdf8]" />
                      Real-World Everyday Analogy:
                    </div>
                    <p className={`${bodyTextClass} italic`}>
                      "{conceptNote?.everydayAnalogy || currentConcept.analogy}"
                    </p>
                  </div>

                  {conceptNote?.interviewTakeaway && (
                    <div className="text-xs text-[#cbd5e1] flex items-start gap-2 bg-[#141724] border border-[#272c42] p-2.5 rounded-xs">
                      <span className="text-[#f59e0b] font-bold shrink-0">🎯 Interview Takeaway:</span>
                      <span>{conceptNote.interviewTakeaway}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Simple Definition & Why it Exists */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-[#232634] bg-[#161823] p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                  <Lightbulb className="h-3.5 w-3.5 text-[#d4af37]" />
                  Core Definition (English)
                </div>
                <p className={`mt-2.5 ${bodyTextClass}`}>
                  {currentConcept.simpleDefinition}
                </p>
              </div>

              <div className="rounded-sm border border-[#232634] bg-[#161823] p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#94a3b8]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#d4af37]" />
                  Why It Exists in Architecture
                </div>
                <p className={`mt-2.5 ${bodyTextClass}`}>
                  {currentConcept.whyItExists}
                </p>
              </div>
            </div>

            {/* Physical World Analogy / Quote */}
            <div className="relative rounded-sm border-l-2 border-[#d4af37] bg-[#171924] p-5 sm:p-6 pl-6 sm:pl-8">
              <div className="text-[32px] font-serif text-[#d4af37] opacity-30 absolute top-1 left-2">“</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-2">
                Physical World Analogy
              </div>
              <p className={`font-serif italic leading-relaxed ${bodyTextClass}`}>
                "{currentConcept.analogy}"
              </p>
            </div>

            {/* Programmatic Technical Architecture Diagram (SVG + CSS Grid) */}
            <ConceptArchitectureVisualizer
              title={currentConcept.title}
              technicalExplanation={currentConcept.technicalExplanation}
              simpleDefinition={currentConcept.simpleDefinition}
            />

            {/* Deep Technical Explanation */}
            <div className="rounded-sm border border-[#232634] bg-[#141620] p-5 sm:p-6">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-3">
                Mechanistic Explanation &amp; Technical Execution
              </h4>
              <p className={`${bodyTextClass} whitespace-pre-line`}>
                {currentConcept.technicalExplanation}
              </p>
            </div>

            {/* Production Example */}
            <div className="rounded-sm border border-[#232634] bg-[#161823] p-4 sm:p-5">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] mr-2 block sm:inline mb-1 sm:mb-0">
                Production Case:
              </span>
              <span className={bodyTextClass}>{currentConcept.example}</span>
            </div>

            {/* When to Use vs When Not to Use */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-[#1c3822] bg-[#0e1c12] p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#4ade80]">
                  <Check className="h-3.5 w-3.5 text-[#4ade80]" />
                  Architectural Fit (When To Use)
                </div>
                <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-[#cbd5e1]">
                  {currentConcept.whenToUse.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#4ade80] font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-sm border border-[#3f1d22] bg-[#1f0e11] p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#f87171]">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#f87171]" />
                  Anti-Patterns (When NOT To Use)
                </div>
                <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-[#cbd5e1]">
                  {currentConcept.whenNotToUse.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#f87171] font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Common Mistakes */}
            {currentConcept.commonMistakes && currentConcept.commonMistakes.length > 0 && (
              <div className="rounded-sm border border-[#3d2e18] bg-[#1a140a] p-4 sm:p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#d4af37]" />
                  Common Traps &amp; Production Antipatterns
                </div>
                <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-[#e2e8f0]">
                  {currentConcept.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#d4af37] font-bold">&bull;</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Senior Interview Question & Model Answer */}
            {currentConcept.interviewQuestion && (
              <div className="rounded-sm border border-[#332a18] bg-[#17130b] p-4 sm:p-6">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-2">
                  <HelpCircle className="h-4 w-4" />
                  Staff-Level Interview Question
                </div>
                <div className="text-sm sm:text-base font-serif text-[#ffffff]">
                  {currentConcept.interviewQuestion.question}
                </div>
                <div className="mt-3 text-xs sm:text-sm text-[#cbd5e1] bg-[#0c0a06] p-4 rounded-sm border border-[#2d2414] leading-relaxed">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] block mb-1.5">
                    Ideal Response:
                  </span>
                  {currentConcept.interviewQuestion.answer}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Trade-Off Analysis Matrix */}
      {chapter.tradeOffAnalysis && (
        <section className="rounded-md border border-[#232634] bg-[#12141c] p-4 sm:p-8 lg:p-10 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#232634] pb-4">
            <div className="p-2 rounded-sm bg-[#191b26] border border-[#2d3142] text-[#d4af37]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#ffffff]">
                Trade-Off Evaluation: {chapter.tradeOffAnalysis.technologyA} vs. {chapter.tradeOffAnalysis.technologyB}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">
                Every architectural choice represents an intentional compromise
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-sm border border-[#232634]">
            <table className="w-full text-left text-xs sm:text-sm min-w-[620px]">
              <thead className="border-b border-[#232634] bg-[#151722] text-[#94a3b8]">
                <tr>
                  <th className="p-3 sm:p-4 text-[10px] uppercase tracking-[0.14em] font-semibold">Dimension</th>
                  <th className="p-3 sm:p-4 text-[10px] uppercase tracking-[0.14em] font-semibold text-[#d4af37]">{chapter.tradeOffAnalysis.technologyA}</th>
                  <th className="p-3 sm:p-4 text-[10px] uppercase tracking-[0.14em] font-semibold text-[#cbd5e1]">{chapter.tradeOffAnalysis.technologyB}</th>
                  <th className="p-3 sm:p-4 text-[10px] uppercase tracking-[0.14em] font-semibold text-[#d4af37]">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2230]">
                {chapter.tradeOffAnalysis.comparisonDimensions.map((dim, i) => (
                  <tr key={i} className="hover:bg-[#181a26] transition-colors">
                    <td className="p-3 sm:p-4 font-medium text-[#ffffff]">{dim.dimension}</td>
                    <td className="p-3 sm:p-4 text-[#cbd5e1]">{dim.optionA}</td>
                    <td className="p-3 sm:p-4 text-[#cbd5e1]">{dim.optionB}</td>
                    <td className="p-3 sm:p-4 font-serif italic text-[#d4af37] bg-[#0e1017] font-medium">{dim.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Practical Exercises & Interview Rubric */}
      <section className="rounded-md border border-[#232634] bg-[#12141c] p-4 sm:p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3 border-b border-[#232634] pb-4">
          <div className="p-2 rounded-sm bg-[#191b26] border border-[#2d3142] text-[#d4af37]">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#ffffff]">
              Exercises &amp; Interview Evaluation
            </h2>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">
              Problem-solving scenarios for senior and staff design rounds
            </p>
          </div>
        </div>

        {/* Quick Revision Takeaways */}
        {chapter.exercises.quickRevision && chapter.exercises.quickRevision.length > 0 && (
          <div className="rounded-sm border border-[#232634] bg-[#161824] p-4 sm:p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-3">
              Core Principles Checklist
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#cbd5e1]">
              {chapter.exercises.quickRevision.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#d4af37] font-bold">&bull;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conceptual Questions with Toggle Reveal */}
        {chapter.exercises.conceptualQuestions && chapter.exercises.conceptualQuestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#94a3b8]">
              Conceptual Drill ({chapter.exercises.conceptualQuestions.length} Prompts)
            </h3>
            <div className="space-y-3">
              {chapter.exercises.conceptualQuestions.map(q => {
                const isRevealed = revealedAnswers[q.id];
                return (
                  <div key={q.id} className="rounded-sm border border-[#232634] p-4 sm:p-5 bg-[#151722]">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs sm:text-base font-serif text-[#ffffff]">
                        {q.question}
                      </p>
                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className="shrink-0 inline-flex items-center justify-center gap-1 rounded-sm border border-[#2d3142] bg-[#1a1d2a] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fff] cursor-pointer min-h-[36px] transition-colors"
                      >
                        {isRevealed ? (
                          <>Hide <ChevronUp className="h-3.5 w-3.5 text-[#d4af37]" /></>
                        ) : (
                          <>Reveal <ChevronDown className="h-3.5 w-3.5 text-[#d4af37]" /></>
                        )}
                      </button>
                    </div>
                    {isRevealed && (
                      <div className="mt-3 border-t border-[#232634] pt-3 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed bg-[#0d0f15] p-4 rounded-sm border border-[#1e212d]">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block mb-1">
                          Model Formulation:
                        </span>
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Staff Interview Questions */}
        {chapter.exercises.interviewQuestions && chapter.exercises.interviewQuestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#94a3b8]">
              Senior / Staff Interview Questions
            </h3>
            <div className="space-y-4">
              {chapter.exercises.interviewQuestions.map(iq => (
                <div key={iq.id} className="rounded-sm border border-[#232634] bg-[#151722] p-4 sm:p-6">
                  <div className="text-sm sm:text-lg font-serif text-[#ffffff] font-medium">
                    Q: {iq.question}
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-[#cbd5e1] bg-[#0d0f15] p-4 sm:p-5 rounded-sm border border-[#232634] leading-relaxed">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] block mb-1.5">
                      Exemplary Answer:
                    </span>
                    {iq.idealAnswer || iq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Gate Smashers Video Lecture Integration */}
      {matchingLectures.length > 0 && (
        <section className="rounded-md border border-red-500/30 bg-[#12141c] p-4 sm:p-8 lg:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232634] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-sm bg-red-950/50 border border-red-500/40 text-red-400">
                <Youtube className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#ffffff]">
                  Gate Smashers Video Lectures (Varun Sir)
                </h2>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">
                  {matchingLectures.length} Recommended Video Lesson{matchingLectures.length > 1 ? 's' : ''} for this Chapter
                </p>
              </div>
            </div>

            {onOpenLecturesTab && (
              <button
                onClick={onOpenLecturesTab}
                className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#ebd078] font-medium transition-colors cursor-pointer"
              >
                <span>View Full 33-Lecture Syllabus</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {matchingLectures.map((lec) => (
              <div 
                key={lec.id}
                className="flex flex-col justify-between rounded-sm border border-[#232634] bg-[#161824] p-4 sm:p-5 transition-all hover:border-[#d4af37]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-xs bg-[#1c1910] border border-[#d4af37]/40 px-2 py-0.5 text-[10px] font-mono font-bold text-[#d4af37]">
                        Lec {lec.lectureNumber}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#94a3b8]">
                        <Clock className="h-3 w-3" />
                        {lec.duration}
                      </span>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-[#1f2230] border border-[#2d3142] text-[#94a3b8]">
                      {lec.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-[#ffffff] leading-snug">
                    {lec.title}
                  </h3>

                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    {lec.summary}
                  </p>

                  <div className="space-y-1 pt-1 border-t border-[#232634]/60">
                    <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">Key Points:</div>
                    {lec.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                      <div key={idx} className="text-[11px] text-[#cbd5e1] flex items-start gap-1.5">
                        <span className="text-[#d4af37]">&bull;</span>
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-[#232634] flex items-center justify-between">
                  <a
                    href={lec.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-red-600/90 hover:bg-red-600 text-white text-xs font-medium transition-colors"
                  >
                    <Youtube className="h-3.5 w-3.5 fill-current" />
                    Watch on YouTube
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </a>

                  {onOpenLecturesTab && (
                    <button
                      onClick={onOpenLecturesTab}
                      className="text-xs text-[#94a3b8] hover:text-[#ffffff] cursor-pointer"
                    >
                      Browse All Videos &rarr;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified Sources & Conference Videos */}
      <section className="rounded-md border border-[#232634] bg-[#12141c] p-4 sm:p-8 lg:p-10 space-y-6">
        <div className="border-b border-[#232634] pb-4">
          <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#ffffff]">
            Primary Standards, Papers &amp; Lectures
          </h2>
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">
            Peer-reviewed research and authoritative specifications
          </p>
        </div>

        {/* Sources Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {chapter.sources.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-sm border border-[#232634] bg-[#161824] p-4 sm:p-5 transition-all hover:border-[#d4af37] group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-xs bg-[#1f2230] px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] font-semibold text-[#d4af37] border border-[#2d3142]">
                    {src.type}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#64748b] group-hover:text-[#d4af37] transition-colors" />
                </div>
                <div className="mt-3 text-sm font-medium text-[#ffffff] group-hover:text-[#d4af37] transition-colors">
                  {src.title}
                </div>
                <p className="mt-1.5 text-xs text-[#94a3b8] leading-relaxed">
                  {src.whatItSupports}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Next Chapter Navigation Button */}
      {onSelectNextChapter && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onSelectNextChapter}
            className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-[#d4af37] px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-bold text-[#0b0c10] hover:bg-[#ebd078] transition-colors cursor-pointer shadow-md min-h-[48px] w-full sm:w-auto"
          >
            Advance to Next Chapter
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Jargon Buster Plain Hindi Dictionary Modal */}
      <JargonBusterModal
        isOpen={jargonModalOpen}
        onClose={() => setJargonModalOpen(false)}
        initialTerm={jargonSearchTerm}
      />
    </div>
  );
};
