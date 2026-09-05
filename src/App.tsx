import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS } from './data/chapters';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { CaseStudyView } from './components/CaseStudyView';
import { CapacityCalculator } from './components/CapacityCalculator';
import { GlossaryView } from './components/GlossaryView';
import { ChecklistView } from './components/ChecklistView';
import { SourcesView } from './components/SourcesView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chapters' | 'casestudies' | 'calculator' | 'glossary' | 'checklist' | 'sources'>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(ALL_CHAPTERS[0]?.id || 'part0-mindset');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedChapterIds, setCompletedChapterIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('system_design_completed_chapters');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  // Persist completed chapters
  useEffect(() => {
    try {
      localStorage.setItem(
        'system_design_completed_chapters',
        JSON.stringify(Array.from(completedChapterIds))
      );
    } catch {
      // ignore
    }
  }, [completedChapterIds]);

  const toggleChapterComplete = (chapterId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedChapterIds(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Find currently active chapter
  const currentChapter = ALL_CHAPTERS.find(c => c.id === selectedChapterId) || ALL_CHAPTERS[0];

  // Navigate to next chapter
  const currentChapterIndex = ALL_CHAPTERS.findIndex(c => c.id === selectedChapterId);
  const handleSelectNextChapter = currentChapterIndex < ALL_CHAPTERS.length - 1 ? () => {
    const nextChapter = ALL_CHAPTERS[currentChapterIndex + 1];
    setSelectedChapterId(nextChapter.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } : undefined;

  // Filter chapters if searching from sidebar/header
  const filteredChapters = ALL_CHAPTERS.filter(ch => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ch.title.toLowerCase().includes(q) ||
      ch.subtitle.toLowerCase().includes(q) ||
      ch.summary.toLowerCase().includes(q) ||
      ch.concepts.some(c => c.title.toLowerCase().includes(q) || c.simpleDefinition.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#080808] text-[#e5e5e5] flex flex-col font-sans selection:bg-[#c5a059]/30 selection:text-[#fff]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        completedCount={completedChapterIds.size}
        totalChapters={ALL_CHAPTERS.length}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (visible only in Chapters tab) */}
        {activeTab === 'chapters' && (
          <Sidebar
            chapters={filteredChapters}
            selectedChapterId={selectedChapterId}
            onSelectChapter={(id) => {
              setSelectedChapterId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            completedChapterIds={completedChapterIds}
            onToggleComplete={toggleChapterComplete}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 bg-[#080808]">
          {activeTab === 'chapters' && currentChapter && (
            <ChapterView
              chapter={currentChapter}
              isCompleted={completedChapterIds.has(currentChapter.id)}
              onToggleComplete={() => toggleChapterComplete(currentChapter.id)}
              onSelectNextChapter={handleSelectNextChapter}
            />
          )}

          {activeTab === 'casestudies' && <CaseStudyView />}

          {activeTab === 'calculator' && <CapacityCalculator />}

          {activeTab === 'glossary' && <GlossaryView />}

          {activeTab === 'checklist' && <ChecklistView />}

          {activeTab === 'sources' && <SourcesView />}
        </main>
      </div>

      {/* Sophisticated Dark Footer */}
      <footer className="h-14 border-t border-[#222] bg-[#0c0c0c] flex items-center justify-between px-6 sm:px-12 text-[10px] uppercase tracking-[0.2em] text-[#555]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059]"></span>
          <span>System Blueprint: 0x-Staff-Arch</span>
        </div>
        <div>&copy; 2026 System Design for SaaS &amp; IaaS Reference Guide</div>
        <div className="hidden sm:block">Verified Standards &bull; RFC 9110 / CAP / Raft</div>
      </footer>
    </div>
  );
}
