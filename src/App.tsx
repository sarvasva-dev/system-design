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
import { ColorAwarenessModal } from './components/ColorAwarenessModal';
import { DoubleTapExplainer } from './components/DoubleTapExplainer';
import { SeoWebsitePreviewModal } from './components/SeoWebsitePreviewModal';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { StudyExportModal } from './components/StudyExportModal';
import { GateSmashersLecturesView } from './components/GateSmashersLecturesView';
import { LiveResearchView } from './components/LiveResearchView';
import { LiveResearchModal } from './components/LiveResearchModal';
import { AppTheme } from './components/ThemeToggle';
import { 
  BookOpen, 
  Layers, 
  Calculator, 
  HelpCircle, 
  CheckSquare,
  Youtube,
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chapters' | 'lectures' | 'casestudies' | 'calculator' | 'glossary' | 'checklist' | 'sources' | 'research'>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(ALL_CHAPTERS[0]?.id || 'part0-mindset');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false);
  const [seoModalOpen, setSeoModalOpen] = useState<boolean>(false);
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [researchModalOpen, setResearchModalOpen] = useState<boolean>(false);
  const [researchTopic, setResearchTopic] = useState<string>('');

  // Theme state: dark | light | blueprint
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('system_design_theme') as AppTheme;
      if (saved === 'light' || saved === 'blueprint' || saved === 'dark') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'dark';
  });

  const [colorAwarenessMode, setColorAwarenessMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('system_design_color_awareness') !== 'false';
    } catch {
      return true;
    }
  });
  const [externalSearchTerm, setExternalSearchTerm] = useState<string | null>(null);

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

  // Apply and persist theme
  useEffect(() => {
    try {
      localStorage.setItem('system_design_theme', theme);
    } catch {
      // ignore
    }

    // Apply class to body
    document.body.classList.remove('theme-light', 'theme-blueprint');
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else if (theme === 'blueprint') {
      document.body.classList.add('theme-blueprint');
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (theme === 'light') {
        metaThemeColor.setAttribute('content', '#f8fafc');
      } else if (theme === 'blueprint') {
        metaThemeColor.setAttribute('content', '#080d1a');
      } else {
        metaThemeColor.setAttribute('content', '#0b0c10');
      }
    }
  }, [theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        setColorModalOpen(false);
        setSeoModalOpen(false);
        setQuizModalOpen(false);
        setShortcutsModalOpen(false);
        setExportModalOpen(false);
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsModalOpen(prev => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setTheme(prev => {
          if (prev === 'dark') return 'light';
          if (prev === 'light') return 'blueprint';
          return 'dark';
        });
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSeoModalOpen(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setColorModalOpen(prev => !prev);
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setQuizModalOpen(prev => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setExportModalOpen(prev => !prev);
      } else if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Persist color awareness preference
  useEffect(() => {
    try {
      localStorage.setItem('system_design_color_awareness', String(colorAwarenessMode));
    } catch {
      // ignore
    }
  }, [colorAwarenessMode]);

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
    <div className={`min-h-screen bg-[#0b0c10] text-[#e2e8f0] flex flex-col font-sans selection:bg-[#d4af37]/25 selection:text-[#ffffff] ${
      theme === 'light' ? 'theme-light' : theme === 'blueprint' ? 'theme-blueprint' : ''
    }`}>
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
        currentTheme={theme}
        setTheme={setTheme}
        onOpenColorModal={() => setColorModalOpen(true)}
        colorAwarenessMode={colorAwarenessMode}
        onOpenSeoModal={() => setSeoModalOpen(true)}
        onOpenQuizModal={() => setQuizModalOpen(true)}
        onOpenShortcutsModal={() => setShortcutsModalOpen(true)}
        onOpenExportModal={() => setExportModalOpen(true)}
        onOpenResearchModal={() => {
          setResearchTopic('');
          setResearchModalOpen(true);
        }}
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
        <main className="flex-1 overflow-y-auto px-3 pt-4 pb-20 sm:py-6 sm:px-6 md:px-8 lg:px-12 bg-[#0b0c10]">
          {activeTab === 'chapters' && currentChapter && (
            <ChapterView
              chapter={currentChapter}
              isCompleted={completedChapterIds.has(currentChapter.id)}
              onToggleComplete={() => toggleChapterComplete(currentChapter.id)}
              onSelectNextChapter={handleSelectNextChapter}
              onOpenLecturesTab={() => setActiveTab('lectures')}
              completedChapterIds={completedChapterIds}
              onSelectChapter={(id) => {
                setSelectedChapterId(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenResearch={(topic) => {
                setResearchTopic(topic);
                setResearchModalOpen(true);
              }}
            />
          )}

          {activeTab === 'lectures' && (
            <GateSmashersLecturesView
              onSelectChapter={(chapterId) => {
                const targetChapter = ALL_CHAPTERS.find(c => c.id === chapterId);
                if (targetChapter) {
                  setSelectedChapterId(targetChapter.id);
                }
                setActiveTab('chapters');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'casestudies' && (
            <CaseStudyView 
              onOpenResearch={(topic) => {
                setResearchTopic(topic);
                setResearchModalOpen(true);
              }} 
            />
          )}

          {activeTab === 'calculator' && <CapacityCalculator />}

          {activeTab === 'research' && (
            <LiveResearchView 
              initialTopic={researchTopic} 
            />
          )}

          {activeTab === 'glossary' && <GlossaryView />}

          {activeTab === 'checklist' && <ChecklistView />}

          {activeTab === 'sources' && <SourcesView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav id="mobile-bottom-nav" className="sticky bottom-0 z-30 flex h-14 sm:h-15 items-center justify-around border-t border-[#232634] bg-[#0e0f14]/95 px-2 backdrop-blur-md lg:hidden">
        <button
          onClick={() => {
            setActiveTab('chapters');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'chapters' ? 'text-[#d4af37]' : 'text-[#94a3b8] hover:text-[#ffffff]'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Chapters</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('lectures');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'lectures' ? 'text-red-400 font-semibold' : 'text-[#94a3b8] hover:text-[#ffffff]'
          }`}
        >
          <Youtube className="h-4 w-4" />
          <span>Videos</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('casestudies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'casestudies' ? 'text-[#d4af37]' : 'text-[#94a3b8] hover:text-[#ffffff]'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Cases</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('calculator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'calculator' ? 'text-[#d4af37]' : 'text-[#94a3b8] hover:text-[#ffffff]'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>Math</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('glossary');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
            activeTab === 'glossary' ? 'text-[#d4af37]' : 'text-[#94a3b8] hover:text-[#ffffff]'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Glossary</span>
        </button>
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden sm:flex h-14 border-t border-[#232634] bg-[#0e0f14] items-center justify-between px-6 sm:px-12 text-[10px] uppercase tracking-[0.2em] text-[#64748b]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]"></span>
          <span className="text-[#94a3b8]">System Blueprint: 0x-Staff-Arch</span>
          <span className="text-[#475569]">&bull; Theme: {theme}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://sarthakml.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#161824] border border-[#2d3142] hover:border-[#d4af37] text-xs normal-case font-mono text-[#cbd5e1] hover:text-[#ffffff] transition-colors group cursor-pointer"
          >
            <span className="text-[#94a3b8] group-hover:text-[#d4af37] transition-colors">Made by</span>
            <strong className="text-[#d4af37] font-semibold">sarthakml.in</strong>
            <ExternalLink className="h-3 w-3 text-[#d4af37] opacity-80 group-hover:opacity-100" />
          </a>
          <span className="text-[#475569]">&bull;</span>
          <button 
            onClick={() => setShortcutsModalOpen(true)}
            className="text-[#94a3b8] hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            Hotkeys (?)
          </button>
        </div>
        <div>Verified Standards &bull; RFC 9110 / CAP / Raft</div>
      </footer>

      {/* Color Awareness & Architectural Legend Modal */}
      <ColorAwarenessModal
        isOpen={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        colorAwarenessMode={colorAwarenessMode}
        setColorAwarenessMode={setColorAwarenessMode}
        onSearchTerm={(term) => {
          setExternalSearchTerm(term);
          setColorModalOpen(false);
        }}
      />

      {/* Global Double-Tap Term Explainer HUD */}
      <DoubleTapExplainer
        externalSearchTerm={externalSearchTerm}
        onClearExternalTerm={() => setExternalSearchTerm(null)}
        onOpenColorModal={() => setColorModalOpen(true)}
        colorAwarenessMode={colorAwarenessMode}
      />

      {/* SEO & Website Social Preview Modal */}
      <SeoWebsitePreviewModal
        isOpen={seoModalOpen}
        onClose={() => setSeoModalOpen(false)}
      />

      {/* Interactive Staff Engineering Quiz Modal */}
      <InteractiveQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
      />

      {/* Keyboard Shortcuts Reference Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Live AI Search Grounding Modal */}
      <LiveResearchModal
        isOpen={researchModalOpen}
        onClose={() => setResearchModalOpen(false)}
        initialTopic={researchTopic}
      />

      {/* Study Plan & Syllabus Export Modal */}
      <StudyExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        completedChapterIds={completedChapterIds}
      />
    </div>
  );
}
