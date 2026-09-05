import React, { useState } from 'react';
import { Chapter } from '../types';
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
  ChevronUp
} from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onSelectNextChapter?: () => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  isCompleted,
  onToggleComplete,
  onSelectNextChapter
}) => {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [copiedDiagram, setCopiedDiagram] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

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

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Chapter Title & Header */}
      <section className="rounded-sm border border-[#222] bg-[#111] p-8 sm:p-10 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-xs bg-[#181818] border border-[#2a2a2a] px-3.5 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
            {chapter.partTitle}
          </div>
          <button
            id="btn-mark-chapter-complete"
            onClick={onToggleComplete}
            className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all cursor-pointer ${
              isCompleted
                ? 'bg-[#1a2e1e] text-[#4ade80] border border-[#2e5936]'
                : 'border border-[#333] text-[#aaa] hover:border-[#c5a059] hover:text-[#fff]'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />
                Completed Module
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 text-[#666]" />
                Mark as Completed
              </>
            )}
          </button>
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-serif text-[#fff] tracking-tight">
          {chapter.title}
        </h1>
        <p className="mt-2 text-base sm:text-lg text-[#888] font-light leading-relaxed">
          {chapter.subtitle}
        </p>

        {/* Executive summary block */}
        <div className="mt-6 relative border-l-2 border-[#c5a059] bg-[#0c0c0c] p-5 pl-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-semibold mb-1">
            Executive Architecture Brief
          </div>
          <p className="text-sm text-[#ccc] leading-relaxed">
            {chapter.summary}
          </p>
        </div>
      </section>

      {/* ASCII Architectural Blueprint */}
      {chapter.diagramAscii && (
        <section className="rounded-sm border border-[#222] bg-[#050505] p-6 sm:p-8 text-[#e5e5e5]">
          <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-4">
            <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              <Terminal className="h-4 w-4 text-[#c5a059]" />
              <span>System Architectural Blueprint</span>
            </div>
            <button
              onClick={copyDiagramToClipboard}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#333] bg-[#111] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#aaa] hover:border-[#c5a059] hover:text-[#fff] transition-colors cursor-pointer"
            >
              {copiedDiagram ? <Check className="h-3.5 w-3.5 text-[#c5a059]" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedDiagram ? 'Copied' : 'Copy Blueprint'}
            </button>
          </div>
          <div className="overflow-x-auto p-2">
            <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-[#c5a059]/90 whitespace-pre">
              {chapter.diagramAscii.trim()}
            </pre>
          </div>
        </section>
      )}

      {/* Core Architectural Concepts */}
      <section className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-10 space-y-8">
        <div className="flex items-center justify-between border-b border-[#222] pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[#c5a059]" />
            <div>
              <h2 className="text-2xl font-serif text-[#fff]">
                Core Architectural Concepts
              </h2>
              <p className="text-xs text-[#777] uppercase tracking-[0.15em] mt-0.5">
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
              className={`shrink-0 rounded-sm px-4 py-2.5 text-xs tracking-wide transition-all cursor-pointer ${
                idx === activeConceptIndex
                  ? 'bg-[#1c1c1c] text-[#fff] border-b-2 border-[#c5a059] font-medium'
                  : 'bg-[#0c0c0c] text-[#777] hover:bg-[#161616] hover:text-[#bbb] border border-[#1e1e1e]'
              }`}
            >
              <span className="font-mono text-[10px] text-[#c5a059] mr-1.5">{idx + 1}.</span>
              {concept.title}
            </button>
          ))}
        </div>

        {/* Current Concept Details */}
        {currentConcept && (
          <div className="space-y-6 pt-2">
            {/* Concept Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e1e1e] pb-3">
              <h3 className="text-xl sm:text-2xl font-serif text-[#fff]">
                {currentConcept.title}
              </h3>
              <span className={`rounded-xs px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] font-semibold border ${
                currentConcept.confidence === 'stable'
                  ? 'bg-[#101811] text-[#4ade80] border-[#1d331f]'
                  : 'bg-[#1c160c] text-[#c5a059] border-[#382b14]'
              }`}>
                {currentConcept.confidence} standard
              </span>
            </div>

            {/* Simple Definition & Why it Exists */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
                  <Lightbulb className="h-3.5 w-3.5 text-[#c5a059]" />
                  Core Definition
                </div>
                <p className="mt-3 text-sm text-[#ddd] leading-relaxed">
                  {currentConcept.simpleDefinition}
                </p>
              </div>

              <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#c5a059]" />
                  Why It Exists in Architecture
                </div>
                <p className="mt-3 text-sm text-[#ddd] leading-relaxed">
                  {currentConcept.whyItExists}
                </p>
              </div>
            </div>

            {/* Real World Analogy / Quote */}
            <div className="relative rounded-sm border-l-2 border-[#c5a059] bg-[#0d0d0d] p-6 pl-8">
              <div className="text-[36px] font-serif text-[#c5a059] opacity-25 absolute top-1 left-2">“</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-semibold mb-2">
                Physical World Analogy
              </div>
              <p className="text-sm sm:text-base font-serif italic text-[#ccc] leading-relaxed">
                "{currentConcept.analogy}"
              </p>
            </div>

            {/* Deep Technical Explanation */}
            <div className="rounded-sm border border-[#222] bg-[#0e0e0e] p-6">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] mb-3">
                Mechanistic Explanation &amp; Technical Execution
              </h4>
              <p className="text-sm text-[#ccc] leading-relaxed whitespace-pre-line">
                {currentConcept.technicalExplanation}
              </p>
            </div>

            {/* Production Example */}
            <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-5 text-sm text-[#ccc]">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] mr-2 block sm:inline mb-1 sm:mb-0">
                Production Case:
              </span>
              <span>{currentConcept.example}</span>
            </div>

            {/* When to Use vs When Not to Use */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-sm border border-[#1d331f] bg-[#0a110b] p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#4ade80]">
                  <Check className="h-3.5 w-3.5 text-[#4ade80]" />
                  Architectural Fit (When To Use)
                </div>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#bbb]">
                  {currentConcept.whenToUse.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#4ade80] font-bold">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-sm border border-[#3b1c1c] bg-[#140b0b] p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#f87171]">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#f87171]" />
                  Anti-Patterns (When NOT To Use)
                </div>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#bbb]">
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
              <div className="rounded-sm border border-[#332514] bg-[#120e08] p-5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#c5a059]" />
                  Common Traps &amp; Production Antipatterns
                </div>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#ccc]">
                  {currentConcept.commonMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#c5a059] font-bold">&bull;</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Senior Interview Question & Model Answer */}
            {currentConcept.interviewQuestion && (
              <div className="rounded-sm border border-[#2a2215] bg-[#0e0b07] p-6">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] mb-3">
                  <HelpCircle className="h-4 w-4" />
                  Staff-Level Interview Question
                </div>
                <div className="text-base font-serif text-[#fff]">
                  {currentConcept.interviewQuestion.question}
                </div>
                <div className="mt-4 text-sm text-[#bbb] bg-[#070707] p-5 rounded-sm border border-[#222] leading-relaxed">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] block mb-2">
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
        <section className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#222] pb-4">
            <Scale className="h-5 w-5 text-[#c5a059]" />
            <div>
              <h2 className="text-2xl font-serif text-[#fff]">
                Trade-Off Evaluation: {chapter.tradeOffAnalysis.technologyA} vs. {chapter.tradeOffAnalysis.technologyB}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#666] mt-0.5">
                Every architectural choice represents an intentional compromise
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-[#222] bg-[#0c0c0c] text-[#888]">
                <tr>
                  <th className="p-4 text-[10px] uppercase tracking-[0.15em] font-semibold">Evaluation Dimension</th>
                  <th className="p-4 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#c5a059]">{chapter.tradeOffAnalysis.technologyA}</th>
                  <th className="p-4 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#888]">{chapter.tradeOffAnalysis.technologyB}</th>
                  <th className="p-4 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#c5a059]">Architect Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {chapter.tradeOffAnalysis.comparisonDimensions.map((dim, i) => (
                  <tr key={i} className="hover:bg-[#141414] transition-colors">
                    <td className="p-4 font-medium text-[#fff]">{dim.dimension}</td>
                    <td className="p-4 text-[#bbb]">{dim.optionA}</td>
                    <td className="p-4 text-[#bbb]">{dim.optionB}</td>
                    <td className="p-4 font-serif italic text-[#c5a059] bg-[#0a0a0a]">{dim.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Practical Exercises & Interview Rubric */}
      <section className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-10 space-y-8">
        <div className="flex items-center gap-3 border-b border-[#222] pb-4">
          <Code className="h-5 w-5 text-[#c5a059]" />
          <div>
            <h2 className="text-2xl font-serif text-[#fff]">
              Exercises &amp; Interview Evaluation
            </h2>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#666] mt-0.5">
              Rigorous problem-solving scenarios for senior design rounds
            </p>
          </div>
        </div>

        {/* Quick Revision Takeaways */}
        {chapter.exercises.quickRevision && chapter.exercises.quickRevision.length > 0 && (
          <div className="rounded-sm border border-[#222] bg-[#0c0c0c] p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] mb-3">
              Core Principles Checklist
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#ccc]">
              {chapter.exercises.quickRevision.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#c5a059] font-bold">&bull;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conceptual Questions with Toggle Reveal */}
        {chapter.exercises.conceptualQuestions && chapter.exercises.conceptualQuestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888]">
              Conceptual Drill ({chapter.exercises.conceptualQuestions.length} Prompts)
            </h3>
            <div className="space-y-3">
              {chapter.exercises.conceptualQuestions.map(q => {
                const isRevealed = revealedAnswers[q.id];
                return (
                  <div key={q.id} className="rounded-sm border border-[#222] p-5 bg-[#0e0e0e]">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm sm:text-base font-serif text-[#fff]">
                        {q.question}
                      </p>
                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className="shrink-0 inline-flex items-center gap-1 rounded-sm border border-[#333] bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[#aaa] hover:border-[#c5a059] hover:text-[#fff] cursor-pointer transition-colors"
                      >
                        {isRevealed ? (
                          <>Hide <ChevronUp className="h-3 w-3" /></>
                        ) : (
                          <>Reveal <ChevronDown className="h-3 w-3" /></>
                        )}
                      </button>
                    </div>
                    {isRevealed && (
                      <div className="mt-4 border-t border-[#222] pt-4 text-xs sm:text-sm text-[#bbb] leading-relaxed bg-[#080808] p-4 rounded-sm">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-semibold block mb-1">
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

        {/* Design Exercises */}
        {chapter.exercises.designExercises && chapter.exercises.designExercises.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888]">
              Architectural Design Scenarios
            </h3>
            <div className="space-y-4">
              {chapter.exercises.designExercises.map(de => (
                <div key={de.id} className="rounded-sm border border-[#222] p-6 bg-[#0c0c0c]">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
                    Scenario Description
                  </div>
                  <div className="text-base sm:text-lg font-serif text-[#fff] mt-1.5">
                    {de.scenario}
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-[#aaa]">
                    <span className="text-[#fff] font-medium">Deliverable Task: </span>
                    {de.task}
                  </div>
                  <div className="mt-4 rounded-sm bg-[#080808] p-5 text-xs sm:text-sm text-[#bbb] border border-[#222]">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] block mb-2">
                      Staff Architect Blueprint Solution:
                    </span>
                    {de.solutionGuide}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Interview Questions */}
        {chapter.exercises.interviewQuestions && chapter.exercises.interviewQuestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888]">
              Senior / Staff Interview Questions
            </h3>
            <div className="space-y-4">
              {chapter.exercises.interviewQuestions.map(iq => (
                <div key={iq.id} className="rounded-sm border border-[#222] bg-[#0c0c0c] p-6">
                  <div className="text-base sm:text-lg font-serif text-[#fff]">
                    Q: {iq.question}
                  </div>
                  <div className="mt-4 text-xs sm:text-sm text-[#bbb] bg-[#080808] p-5 rounded-sm border border-[#222] leading-relaxed">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059] block mb-2">
                      Exemplary Answer:
                    </span>
                    {iq.idealAnswer || iq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practical Task */}
        {chapter.exercises.practicalTask && (
          <div className="rounded-sm border border-[#2a2215] bg-[#0e0b07] p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
              Hands-On Verification: {chapter.exercises.practicalTask.title}
            </div>
            <div className="mt-2 text-sm text-[#ddd]">
              {chapter.exercises.practicalTask.instructions}
            </div>
            <div className="mt-3 text-xs text-[#c5a059] font-mono">
              Verification Criterion: {chapter.exercises.practicalTask.verification}
            </div>
          </div>
        )}
      </section>

      {/* Verified Sources & Conference Videos */}
      <section className="rounded-sm border border-[#222] bg-[#111] p-6 sm:p-10 space-y-6">
        <div className="border-b border-[#222] pb-4">
          <h2 className="text-2xl font-serif text-[#fff]">
            Primary Standards, Papers &amp; Lectures
          </h2>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#666] mt-0.5">
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
              className="flex flex-col justify-between rounded-sm border border-[#222] bg-[#0c0c0c] p-5 transition-all hover:border-[#c5a059] group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-xs bg-[#181818] px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-semibold text-[#c5a059] border border-[#2a2a2a]">
                    {src.type}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#555] group-hover:text-[#c5a059] transition-colors" />
                </div>
                <div className="mt-3 text-sm font-medium text-[#fff]">
                  {src.title}
                </div>
                <p className="mt-1.5 text-xs text-[#777] leading-relaxed">
                  {src.whatItSupports}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Videos */}
        {chapter.videos && chapter.videos.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#1e1e1e]">
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888]">
              Authoritative Video Lectures
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {chapter.videos.map((vid, i) => (
                <a
                  key={i}
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 rounded-sm border border-[#222] bg-[#0c0c0c] p-4 transition-all hover:border-[#c5a059] group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#181818] border border-[#222] text-[#c5a059] group-hover:border-[#c5a059] transition-colors">
                    <Play className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#fff] truncate">
                      {vid.title}
                    </div>
                    <div className="text-[10px] text-[#666] uppercase tracking-wider mt-0.5">
                      {vid.creator} &bull; {vid.duration} &bull; <span className="text-[#c5a059]">{vid.difficulty}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-[#888] line-clamp-2">
                      {vid.whatYouWillLearn}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Next Chapter Navigation Button */}
      {onSelectNextChapter && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onSelectNextChapter}
            className="inline-flex items-center gap-2.5 rounded-sm bg-[#c5a059] px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] font-bold text-[#080808] hover:bg-[#d6b57a] transition-colors cursor-pointer shadow-md"
          >
            Advance to Next Chapter
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
