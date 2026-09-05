import React from 'react';
import { Chapter } from '../types';
import { CheckCircle2, Circle, ChevronRight, X } from 'lucide-react';

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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 transform border-r border-[#222] bg-[#0c0c0c] transition-transform duration-200 ease-in-out lg:static lg:w-80 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Mobile close bar */}
        <div className="flex h-16 items-center justify-between border-b border-[#222] px-6 lg:hidden">
          <span className="font-serif italic text-[#c5a059] text-base">Curriculum Index</span>
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 text-[#888] hover:bg-[#161616] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Header summary */}
        <div className="border-b border-[#222] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#888]">
              Textbook Modules
            </span>
            <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">
              20 Parts
            </span>
          </div>
        </div>

        {/* Scrollable navigation tree */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {chapterGroups.map((group, groupIdx) => {
            const groupChapters = chapters.filter(c => group.parts.includes(c.part));
            if (groupChapters.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-2">
                <div className="px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#555]">
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
                            ? 'bg-[#141414] text-[#fff] border-l-2 border-[#c5a059]'
                            : 'text-[#aaa] hover:bg-[#111] hover:text-[#fff]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <button
                            onClick={(e) => onToggleComplete(chapter.id, e)}
                            className="mt-0.5 shrink-0 text-[#444] hover:text-[#c5a059] transition-colors"
                            title={isCompleted ? 'Mark unread' : 'Mark completed'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#c5a059]" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <div className={`truncate font-medium ${isSelected ? 'text-[#fff]' : ''}`}>
                              Part {chapter.part}: {chapter.title}
                            </div>
                            <div className="text-[10px] text-[#555] truncate font-mono mt-0.5">
                              {chapter.concepts.length} concepts • {chapter.exercises.quickRevision.length} key points
                            </div>
                          </div>
                        </div>

                        <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-[#555] transition-transform ${
                          isSelected ? 'text-[#c5a059] translate-x-0.5' : 'opacity-0 group-hover:opacity-100'
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
        <div className="border-t border-[#222] p-4 text-center bg-[#080808]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#555]">
            Secure Architectural Blueprint &bull; Staff Level
          </p>
        </div>
      </aside>
    </>
  );
};
