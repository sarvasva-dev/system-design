import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, HelpCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  law: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'According to the PACELC theorem, what trade-off must a distributed system make when there is NO network partition?',
    options: [
      'Availability vs Partition Tolerance',
      'Latency vs Consistency',
      'Throughput vs Durability',
      'Strong Consistency vs Eventual Consistency'
    ],
    correctIndex: 1,
    explanation: 'PACELC states: if Partition (P), trade Availability (A) vs Consistency (C); Else (E), trade Latency (L) vs Consistency (C).',
    law: 'PACELC Theorem (Daniel Abadi, 2012)'
  },
  {
    question: 'Why does Raft require a strict majority quorum (e.g. 3 of 5 nodes) to commit an entry?',
    options: [
      'To prevent network packet loss over WAN links',
      'To ensure at least one node in any new quorum has the committed entry (Pigeonhole principle), preventing split-brain',
      'To balance disk write IOPS evenly across storage heads',
      'To satisfy ACID serialization in transactional databases'
    ],
    correctIndex: 1,
    explanation: 'Any two quorums of size ⌊N/2⌋ + 1 must overlap by at least one node, guaranteeing that a newly elected leader will see every previously committed log entry.',
    law: 'Raft Consensus Protocol (Ongaro & Ousterhout)'
  },
  {
    question: 'Under Little’s Law (L = λ × W), if an API receives 2,000 req/sec and average latency is 50ms (0.05s), how many concurrent requests are in flight?',
    options: [
      '40 concurrent requests',
      '100 concurrent requests',
      '500 concurrent requests',
      '10,000 concurrent requests'
    ],
    correctIndex: 1,
    explanation: 'L = λ × W = 2,000 req/sec × 0.05 sec = 100 concurrent in-flight requests. This determines your thread pool / socket queue dimensioning.',
    law: "Little's Law (Operations Research, 1961)"
  },
  {
    question: 'What is the primary benefit of Write-Ahead Logging (WAL) in database engines like PostgreSQL or SQLite?',
    options: [
      'It compresses SQL statements to save NVMe SSD wear',
      'It ensures durability by appending mutations sequentially to disk before flushing randomized B-Tree pages into memory',
      'It allows clients to bypass authentication checks during peak traffic',
      'It converts synchronous TCP writes into asynchronous UDP packets'
    ],
    correctIndex: 1,
    explanation: 'Sequential disk append is orders of magnitude faster than random B-Tree page writes. In a crash, the WAL allows exact state reconstruction without dirty page corruption.',
    law: 'ARIES Recovery Algorithm / Write-Ahead Logging'
  },
  {
    question: 'In multi-tenant SaaS architecture, what is the best defense against the "Noisy Neighbor" problem where Tenant A starves Tenant B of capacity?',
    options: [
      'Disable SSL/TLS during traffic spikes',
      'Per-tenant token bucket rate limiters, segregated queue pools, and database connection quotas',
      'Increase the client browser timeout to 120 seconds',
      'Store all tenants in a single unindexed JSON blob'
    ],
    correctIndex: 1,
    explanation: 'Segregating queues and enforcing per-tenant token-bucket rate limits prevents a rogue or bursty tenant from exhausting cluster thread pools and DB connections.',
    law: 'SaaS Multi-Tenancy Isolation Pattern'
  }
];

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl rounded-lg border border-[#272a38] bg-[#12141c] text-[#cbd5e1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232634] px-5 py-4 bg-[#141622]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-[#ffffff]">Staff Architectural Quiz</h2>
              <p className="text-xs text-[#94a3b8]">5-Question Rapid Knowledge Check</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-[#ffffff] hover:bg-[#1f2230] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quiz Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {!quizFinished ? (
            <>
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-[#94a3b8] border-b border-[#1f2230] pb-2">
                <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                <span className="font-mono text-[#d4af37]">Score: {score}/{QUIZ_QUESTIONS.length}</span>
              </div>

              {/* Law Tag */}
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[#d4af37] font-mono">
                {currentQ.law}
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-medium text-[#ffffff] leading-relaxed">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => {
                  let btnStyle = 'border-[#272a38] bg-[#161824] text-[#cbd5e1] hover:border-[#d4af37]';
                  if (selectedAnswer === i && !isAnswerSubmitted) {
                    btnStyle = 'border-[#d4af37] bg-[#1c1910] text-[#ffffff] ring-1 ring-[#d4af37]';
                  } else if (isAnswerSubmitted) {
                    if (i === currentQ.correctIndex) {
                      btnStyle = 'border-[#22c55e] bg-[#0e2114] text-[#4ade80] font-semibold';
                    } else if (selectedAnswer === i) {
                      btnStyle = 'border-[#ef4444] bg-[#241113] text-[#f87171]';
                    } else {
                      btnStyle = 'border-[#1f2230] bg-[#141620] text-[#64748b] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3 rounded-sm border text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-mono text-xs opacity-70 shrink-0 mt-0.5">[{String.fromCharCode(65 + i)}]</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card upon submit */}
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-sm border text-xs space-y-1 ${
                  selectedAnswer === currentQ.correctIndex 
                    ? 'border-[#22c55e]/40 bg-[#0e2114] text-[#cbd5e1]'
                    : 'border-[#ef4444]/40 bg-[#241113] text-[#cbd5e1]'
                }`}>
                  <div className="font-semibold flex items-center gap-1.5">
                    {selectedAnswer === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                        <span className="text-[#4ade80]">Correct Answer!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-[#ef4444]" />
                        <span className="text-[#f87171]">Incorrect</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed text-[#cbd5e1] mt-1">{currentQ.explanation}</p>
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#ffffff]">Quiz Completed!</h3>
              <p className="text-sm text-[#94a3b8]">
                You scored <strong className="text-[#d4af37] text-lg">{score}</strong> out of {QUIZ_QUESTIONS.length}
              </p>
              <div className="p-4 rounded-sm bg-[#161824] border border-[#272a38] text-xs text-[#cbd5e1] max-w-sm mx-auto">
                {score === 5 && '🌟 Outstanding! Ready for Staff/Principal System Design rounds.'}
                {score >= 3 && score < 5 && '👍 Strong fundamentals! Review PACELC and Little’s Law to lock down edge cases.'}
                {score < 3 && '📚 Good effort! We recommend reviewing Part 1 and Part 2 core theorems.'}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-[#232634] px-5 py-3.5 bg-[#141622] text-xs">
          {!quizFinished ? (
            <>
              <button
                onClick={onClose}
                className="text-[#94a3b8] hover:text-[#ffffff] cursor-pointer"
              >
                Exit Quiz
              </button>
              <div>
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={selectedAnswer === null}
                    className="px-4 py-1.5 rounded-sm bg-[#d4af37] text-[#0b0c10] font-semibold hover:bg-[#e6c24d] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-[#d4af37] text-[#0b0c10] font-semibold hover:bg-[#e6c24d] cursor-pointer"
                  >
                    <span>{currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#272a38] text-xs text-[#cbd5e1] hover:border-[#d4af37] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-sm bg-[#d4af37] text-[#0b0c10] font-semibold hover:bg-[#e6c24d] cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
