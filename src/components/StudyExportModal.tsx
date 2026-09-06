import React, { useState } from 'react';
import { X, Download, FileText, Check, Copy, Printer, Award, BookOpen } from 'lucide-react';
import { ALL_CHAPTERS } from '../data/chapters';

interface StudyExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedChapterIds: Set<string>;
}

export const StudyExportModal: React.FC<StudyExportModalProps> = ({
  isOpen,
  onClose,
  completedChapterIds
}) => {
  const [copied, setCopied] = useState(false);
  const [userNotes, setUserNotes] = useState(
    'Key takeaway: Always verify Little\'s Law for thread dimensioning and PACELC for cross-region latency trade-offs.'
  );

  if (!isOpen) return null;

  const total = ALL_CHAPTERS.length;
  const completed = completedChapterIds.size;
  const percent = Math.round((completed / total) * 100);

  const completedList = ALL_CHAPTERS.filter(c => completedChapterIds.has(c.id));

  const generateMarkdownReport = () => {
    return `# System Design for SaaS & IaaS — Study Progress Report
**Generated on:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
**Overall Curriculum Completion:** ${percent}% (${completed}/${total} Chapters Verified)

---

## 📚 Study Status Summary
- **Verified Core Chapters:** ${completed} / ${total}
- **Mastery Score:** ${percent}% Complete
- **Standards:** RFC 9110, CAP, PACELC, Raft Consensus, Write-Ahead Logging

## ✍️ Personal Engineering Notes & Takeaways
> ${userNotes}

---

## 🏆 Completed Chapters
${completedList.length > 0 
  ? completedList.map(c => `- [x] **Part ${c.part}: ${c.title}** — ${c.subtitle}`).join('\n') 
  : '- _No chapters completed yet._ Click "Mark Read" on chapters as you study!'}

---
*Reference Curriculum: System Design for SaaS & IaaS Architecture Reference Guide (Made by [sarthakml.in](https://sarthakml.in))*
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([generateMarkdownReport()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-design-study-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg border border-[#272a38] bg-[#12141c] text-[#cbd5e1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232634] px-5 py-4 bg-[#141622]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-[#ffffff]">Study Progress &amp; Syllabus Export</h2>
              <p className="text-xs text-[#94a3b8]">Export your personal syllabus progress, notes, and study log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-[#ffffff] hover:bg-[#1f2230] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Progress Card */}
          <div className="rounded-md border border-[#232634] bg-[#161824] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider text-[#94a3b8] font-semibold">Your Study Track</div>
              <div className="text-xl sm:text-2xl font-serif font-semibold text-[#ffffff]">
                {completed} of {total} Chapters Completed
              </div>
              <p className="text-xs text-[#cbd5e1]">
                {percent >= 80 ? '🔥 Staff Readiness Achieved!' : 'Keep progressing through distributed systems and cloud patterns.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 rounded-full border-4 border-[#232634] flex items-center justify-center font-serif text-lg font-bold text-[#d4af37]">
                {percent}%
              </div>
            </div>
          </div>

          {/* Personal Notes Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#ffffff] flex items-center justify-between">
              <span>Personal Study Notes &amp; Action Items</span>
              <span className="text-[11px] text-[#94a3b8] font-normal">Included in export report</span>
            </label>
            <textarea
              rows={3}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Add key insights, questions for mock interviewers, or architecture topics to review..."
              className="w-full rounded-sm border border-[#272a38] bg-[#0b0c10] p-3 text-xs text-[#ffffff] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          {/* Preview Markdown Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#94a3b8]">
              <span>Markdown Syllabus Preview</span>
              <span className="text-[11px] font-mono">Format: GitHub-flavored Markdown</span>
            </div>
            <pre className="rounded-md border border-[#232634] bg-[#0b0c10] p-4 text-[11px] font-mono text-[#cbd5e1] overflow-x-auto max-h-48 leading-relaxed">
              <code>{generateMarkdownReport()}</code>
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#232634] px-5 py-3.5 bg-[#141622] text-xs">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-sm border border-[#2d3142] bg-[#161824] px-3 py-1.5 text-xs text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-[#38bdf8]" />
            Print / Save to PDF
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#2d3142] bg-[#161824] px-3 py-1.5 text-xs text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#22c55e]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#d4af37] bg-[#1c1910] px-3 py-1.5 text-xs font-medium text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b0c10] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
