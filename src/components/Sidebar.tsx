import React, { useState } from 'react';
import { Chapter } from '../types';
import { CheckCircle2, Circle, ChevronRight, X, Search, BookOpen } from 'lucide-react';

interface SidebarProps {
  chapters: Chapter[];
  selectedChapterId: string;
  onSelectChapter: (id: string) => void;
  completedChapterIds: Set<string>;
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chapters,
  selectedChapterId,
  onSelectChapter,
  completedChapterIds,
  onToggleComplete,
  isOpen,
  onClose
}) => {
  const [sidebarFilter, setSidebarFilter] = useState('');

  const chapterGroups = [
    {
      title: 'I. Foundations & Mindset',
      parts: [0, 1]
    },
    {
      title: 'II. Backend, Databases & Messaging',
      parts: [2, 3, 4, 5, 6]
    },
    {
      title: 'III. Storage, Microservices & Cloud',
      parts: [7, 8, 9, 10, 11, 12]
    },
    {
      title: 'IV. SaaS Multitenancy, Billing & Auth',
      parts: [13, 14, 15, 16]
    },
    {
      title: 'V. Security, Reliability & Math',
      parts: [17, 18, 19]
    }
  ];

  const displayedChapters = chapters.filter(c => {
    if (!sidebarFilter.trim()) return true;
    const q = sidebarFilter.toLowerCase();
    return c.title.toLowerCase().includes(q) || 
           c.subtitle.toLowerCase().includes(q) || 
           `part ${c.part}`.includes(q);
  });

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 sm:w-88 transform border-r border-[#232634] bg-[#10121a] transition-transform duration-200 ease-in-out lg:static lg:w-80 xl:w-88 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Mobile close bar */}
        <div className="flex h-16 items-center justify-between border-b border-[#232634] px-5 lg:hidden bg-[#141620]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#d4af37]" />
            <span className="font-serif italic text-[#d4af37] text-base font-semibold">Curriculum Syllabus</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#272a38] text-[#94a3b8] hover:bg-[#1c1f2b] hover:text-white transition-colors"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Header & Search */}
        <div className="border-b border-[#232634] p-4 bg-[#12141c] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#94a3b8]">
              20 Course Modules
            </span>
            <span className="text-[11px] font-mono text-[#d4af37] font-semibold bg-[#181a24] border border-[#2d3142] px-2 py-0.5 rounded-xs">
              {completedChapterIds.size} / 20 Done
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Filter chapters..."
              value={sidebarFilter}
              onChange={(e) => setSidebarFilter(e.target.value)}
              className="w-full rounded-sm border border-[#272a38] bg-[#0c0d12] py-1.5 pl-8 pr-3 text-xs text-[#e2e8f0] placeholder:text-[#64748b] focus:border-[#d4af37] focus:outline-none"
            />
            {sidebarFilter && (
              <button
                onClick={() => setSidebarFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#94a3b8]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scrollable navigation tree */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-5 scrollbar-thin">
          {chapterGroups.map((group, groupIdx) => {
            const groupChapters = displayedChapters.filter(c => group.parts.includes(c.part));
            if (groupChapters.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1.5">
                <div className="px-2 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#64748b]">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {groupChapters.map(chapter => {
                    const isSelected = chapter.id === selectedChapterId;
                    const isCompleted = completedChapterIds.has(chapter.id);

                    return (
                      <div
                        key={chapter.id}
                        id={`sidebar-item-${chapter.id}`}
                        onClick={() => {
                          onSelectChapter(chapter.id);
                          onClose();
                        }}
                        className={`group flex items-center justify-between rounded-sm px-3 py-2.5 text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1a1d28] text-[#ffffff] border-l-2 border-[#d4af37] shadow-xs'
                            : 'text-[#cbd5e1] hover:bg-[#151722] hover:text-[#ffffff]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <button
                            onClick={(e) => onToggleComplete(chapter.id, e)}
                            className="mt-0.5 shrink-0 text-[#64748b] hover:text-[#d4af37] transition-colors p-0.5"
                            title={isCompleted ? 'Mark unread' : 'Mark completed'}
                            aria-label={isCompleted ? 'Mark unread' : 'Mark completed'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                            ) : (
                              <Circle className="h-4 w-4 text-[#475569] hover:text-[#d4af37]" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <div className={`truncate font-medium leading-snug ${isSelected ? 'text-[#ffffff] font-semibold' : 'text-[#e2e8f0]'}`}>
                              Part {chapter.part}: {chapter.title}
                            </div>
                            <div className="text-[10px] text-[#818cf8]/80 truncate font-mono mt-0.5">
                              {chapter.concepts.length} concepts &bull; {chapter.exercises.interviewQuestions?.length || 3} interview Qs
                            </div>
                          </div>
                        </div>

                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#d4af37] translate-x-0.5' : 'text-[#475569] group-hover:text-[#94a3b8]'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-[#232634] p-3 bg-[#0d0e14] text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748b]">
            Distributed Systems &bull; High Reliability
          </p>
        </div>
      </aside>
    </>
  );
};
