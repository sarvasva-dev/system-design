import React, { useState } from 'react';
import { 
  BookOpen, 
  Calculator, 
  Layers, 
  CheckSquare, 
  HelpCircle, 
  FileText, 
  Menu, 
  X, 
  Search, 
  BookmarkCheck, 
  ChevronRight,
  Palette,
  Sparkles,
  Globe,
  Award,
  Keyboard,
  Download,
  Youtube
} from 'lucide-react';
import { ThemeToggle, AppTheme } from './ThemeToggle';

interface HeaderProps {
  activeTab: 'chapters' | 'lectures' | 'casestudies' | 'calculator' | 'glossary' | 'checklist' | 'sources';
  setActiveTab: (tab: 'chapters' | 'lectures' | 'casestudies' | 'calculator' | 'glossary' | 'checklist' | 'sources') => void;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  completedCount: number;
  totalChapters: number;
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  onOpenColorModal?: () => void;
  colorAwarenessMode?: boolean;
  onOpenSeoModal?: () => void;
  onOpenQuizModal?: () => void;
  onOpenShortcutsModal?: () => void;
  onOpenExportModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  completedCount,
  totalChapters,
  currentTheme,
  setTheme,
  onOpenColorModal,
  colorAwarenessMode,
  onOpenSeoModal,
  onOpenQuizModal,
  onOpenShortcutsModal,
  onOpenExportModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const navItems = [
    { id: 'chapters', label: 'Chapters', icon: BookOpen, desc: '20 Parts Curriculum' },
    { id: 'lectures', label: 'Gate Smashers', icon: Youtube, desc: '33 Video Lectures by Varun Sir' },
    { id: 'casestudies', label: 'Case Studies', icon: Layers, desc: 'Notion, AWS Nitro & Stripe' },
    { id: 'calculator', label: 'Capacity Math', icon: Calculator, desc: "Little's & Amdahl's Law" },
    { id: 'glossary', label: 'Glossary', icon: HelpCircle, desc: 'Core Mental Models' },
    { id: 'checklist', label: 'Rubric', icon: CheckSquare, desc: 'Staff 5-Step Playbook' },
    { id: 'sources', label: 'Primary RFCs', icon: FileText, desc: 'RFCs & Seminal Papers' },
  ] as const;

  const handleSelectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 sm:h-18 items-center justify-between border-b border-[#232634] bg-[#0e0f14]/95 px-4 sm:px-6 backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Chapter drawer toggle button (only shown when in chapters tab) */}
          {activeTab === 'chapters' && (
            <button
              id="mobile-sidebar-toggle"
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#272a38] bg-[#14161f] text-[#cbd5e1] hover:bg-[#1c1f2b] hover:text-[#fff] lg:hidden transition-colors"
              aria-label="Toggle curriculum navigation"
            >
              <Menu className="h-5 w-5 text-[#d4af37]" />
            </button>
          )}

          {/* App Branding */}
          <div 
            onClick={() => handleSelectTab('chapters')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          >
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-sm border border-[#d4af37]/40 bg-[#161722] text-[#d4af37] shadow-sm group-hover:border-[#d4af37] transition-all">
              <span className="font-serif italic font-bold text-sm sm:text-lg">SD</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg lg:text-xl font-medium tracking-tight text-[#ffffff] whitespace-nowrap truncate block max-w-[130px] xs:max-w-[200px] sm:max-w-none">
                  System Design <span className="italic text-[#d4af37] hidden xs:inline">SaaS &amp; IaaS</span>
                </span>
                <span className="hidden md:inline-block rounded-xs bg-[#191b26] border border-[#2d3142] px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] font-semibold text-[#d4af37]">
                  Staff Edition
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[11px] uppercase tracking-[0.14em] font-medium text-[#94a3b8]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#ffffff] bg-[#181a24] border-b-2 border-[#d4af37] font-semibold shadow-xs'
                    : 'hover:text-[#ffffff] hover:bg-[#14161f]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#d4af37]' : 'text-[#64748b]'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right utilities: Search, Progress, Mobile Menu toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Desktop Search */}
          <div className="relative hidden md:block w-44 xl:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748b]" />
            <input
              id="global-header-search"
              type="text"
              placeholder="Search architecture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-[#272a38] bg-[#14161f] py-1.5 pl-8 pr-3 text-xs text-[#e2e8f0] placeholder:text-[#64748b] focus:border-[#d4af37] focus:bg-[#181a24] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#94a3b8] hover:text-[#fff]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-sm border border-[#272a38] bg-[#14161f] text-[#94a3b8] hover:text-[#fff] md:hidden"
            aria-label="Toggle search input"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Progress Tracker Pill (desktop only to prevent mobile wrapping) */}
          <div 
            title={`${completedCount} of ${totalChapters} chapters completed`}
            className="hidden sm:flex items-center gap-2 text-xs tracking-wide text-[#cbd5e1] bg-[#14161f] border border-[#272a38] px-2.5 sm:px-3 py-1.5 rounded-sm"
          >
            <BookmarkCheck className="h-4 w-4 text-[#d4af37] shrink-0" />
            <span className="font-mono text-[#d4af37] font-semibold">{completedCount}/{totalChapters}</span>
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider text-[#64748b]">Read</span>
          </div>

          {/* Theme Selector Toggle */}
          <ThemeToggle
            currentTheme={currentTheme}
            setTheme={setTheme}
          />

          {/* SEO Social Preview Button */}
          {onOpenSeoModal && (
            <button
              id="btn-header-seo-preview"
              onClick={onOpenSeoModal}
              title="SEO & Social Card Preview (Google, Twitter/X, LinkedIn, Slack)"
              className="hidden md:inline-flex items-center gap-1.5 rounded-sm border border-[#272a38] bg-[#14161f] px-2.5 py-1.5 text-xs font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] transition-all cursor-pointer min-h-[36px]"
            >
              <Globe className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span className="hidden 2xl:inline">SEO Preview</span>
            </button>
          )}

          {/* Interactive Quiz Button */}
          {onOpenQuizModal && (
            <button
              id="btn-header-quiz"
              onClick={onOpenQuizModal}
              title="Take Staff Engineering Knowledge Quiz"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-sm border border-[#272a38] bg-[#14161f] px-2.5 py-1.5 text-xs font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] transition-all cursor-pointer min-h-[36px]"
            >
              <Award className="h-3.5 w-3.5 text-[#fb923c]" />
              <span className="hidden 2xl:inline">Quiz</span>
            </button>
          )}

          {/* Study Progress Export Button */}
          {onOpenExportModal && (
            <button
              id="btn-header-export"
              onClick={onOpenExportModal}
              title="Export Study Plan, Syllabus & Notes Report"
              className="hidden xl:inline-flex items-center gap-1.5 rounded-sm border border-[#272a38] bg-[#14161f] px-2.5 py-1.5 text-xs font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] transition-all cursor-pointer min-h-[36px]"
            >
              <Download className="h-3.5 w-3.5 text-[#22c55e]" />
              <span className="hidden 2xl:inline">Export</span>
            </button>
          )}

          {/* Color Awareness Button */}
          {onOpenColorModal && (
            <button
              id="btn-header-color-awareness"
              onClick={onOpenColorModal}
              title="Color Awareness & Architectural Legend"
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer min-h-[36px] ${
                colorAwarenessMode
                  ? 'border-[#d4af37] bg-[#1c1910] text-[#d4af37] shadow-xs'
                  : 'border-[#272a38] bg-[#14161f] text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff]'
              }`}
            >
              <Palette className="h-3.5 w-3.5 text-[#d4af37]" />
              <span className="hidden xl:inline">Color Guide</span>
            </button>
          )}

          {/* Keyboard Shortcuts Trigger Button */}
          {onOpenShortcutsModal && (
            <button
              id="btn-header-shortcuts"
              onClick={onOpenShortcutsModal}
              title="Keyboard Shortcuts (?)"
              className="hidden lg:inline-flex items-center justify-center h-9 w-9 rounded-sm border border-[#272a38] bg-[#14161f] text-[#94a3b8] hover:text-[#ffffff] hover:border-[#d4af37] transition-all cursor-pointer"
            >
              <Keyboard className="h-4 w-4" />
            </button>
          )}

          {/* Mobile Navigation Hub Button (3 lines / X) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#272a38] bg-[#14161f] text-[#cbd5e1] hover:text-[#fff] lg:hidden"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-[#d4af37]" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Search Bar Expandable Drawer */}
      {mobileSearchVisible && (
        <div className="border-b border-[#232634] bg-[#12141c] p-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search concepts, chapters, case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-[#2d3142] bg-[#181a24] py-2 pl-9 pr-8 text-xs text-[#e2e8f0] placeholder:text-[#64748b] focus:border-[#d4af37] focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8] hover:text-[#fff]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Modal Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-[#0b0c10]/98 backdrop-blur-lg lg:hidden p-4 overflow-y-auto">
          {/* Mobile Reading Progress Summary */}
          <div className="p-3.5 rounded-sm border border-[#232634] bg-[#14161f] flex items-center justify-between mb-4 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-sm border border-[#d4af37]/40 bg-[#1c1910] text-[#d4af37]">
                <BookmarkCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#ffffff]">Curriculum Progress</div>
                <div className="text-[11px] text-[#94a3b8]">{completedCount} of {totalChapters} chapters completed</div>
              </div>
            </div>
            <div className="font-mono text-sm text-[#d4af37] font-bold px-2.5 py-1 bg-[#181a24] border border-[#2d3142] rounded-xs">
              {Math.round((completedCount / totalChapters) * 100)}%
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37] mb-3 px-2">
            Navigation Sections
          </div>
          <div className="grid gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center justify-between p-3.5 rounded-sm border transition-all text-left ${
                    isActive
                      ? 'border-[#d4af37] bg-[#181a24] text-[#ffffff]'
                      : 'border-[#232634] bg-[#12141c] text-[#cbd5e1] hover:bg-[#181a24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-sm border ${
                      isActive ? 'border-[#d4af37]/50 bg-[#1e212f] text-[#d4af37]' : 'border-[#272a38] bg-[#14161f] text-[#94a3b8]'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-serif text-base font-medium">{item.label}</div>
                      <div className="text-[11px] text-[#94a3b8]">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${isActive ? 'text-[#d4af37]' : 'text-[#64748b]'}`} />
                </button>
              );
            })}

            {/* Mobile Color Awareness Option */}
            {onOpenColorModal && (
              <button
                onClick={() => {
                  onOpenColorModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-3.5 rounded-sm border border-[#2d3142] bg-[#151824] text-[#cbd5e1] hover:border-[#d4af37] text-left mt-1"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm border border-[#d4af37]/40 bg-[#1c1910] text-[#d4af37]">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-serif text-base font-medium text-[#ffffff]">Color Awareness Guide</div>
                    <div className="text-[11px] text-[#94a3b8]">Architectural color legend &amp; contrast scale</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#d4af37]" />
              </button>
            )}

            {/* Mobile SEO Website Preview Option */}
            {onOpenSeoModal && (
              <button
                onClick={() => {
                  onOpenSeoModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-3.5 rounded-sm border border-[#2d3142] bg-[#151824] text-[#cbd5e1] hover:border-[#38bdf8] text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm border border-[#38bdf8]/40 bg-[#0e1d2c] text-[#38bdf8]">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-serif text-base font-medium text-[#ffffff]">SEO Website Preview</div>
                    <div className="text-[11px] text-[#94a3b8]">Social cards, Google SERP &amp; OpenGraph</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#38bdf8]" />
              </button>
            )}

            {/* Mobile Quiz Option */}
            {onOpenQuizModal && (
              <button
                onClick={() => {
                  onOpenQuizModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-3.5 rounded-sm border border-[#2d3142] bg-[#151824] text-[#cbd5e1] hover:border-[#fb923c] text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm border border-[#fb923c]/40 bg-[#26150a] text-[#fb923c]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-serif text-base font-medium text-[#ffffff]">Staff Architectural Quiz</div>
                    <div className="text-[11px] text-[#94a3b8]">5-question knowledge assessment</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#fb923c]" />
              </button>
            )}

            {/* Mobile Study Progress Export Option */}
            {onOpenExportModal && (
              <button
                onClick={() => {
                  onOpenExportModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-3.5 rounded-sm border border-[#2d3142] bg-[#151824] text-[#cbd5e1] hover:border-[#22c55e] text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm border border-[#22c55e]/40 bg-[#0e2114] text-[#4ade80]">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-serif text-base font-medium text-[#ffffff]">Export Study Report</div>
                    <div className="text-[11px] text-[#94a3b8]">Download syllabus markdown &amp; progress</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#22c55e]" />
              </button>
            )}

            {/* Mobile Theme Selector Strip */}
            <div className="p-3.5 rounded-sm border border-[#232634] bg-[#0b0c10] space-y-2 mt-2">
              <div className="text-xs font-semibold text-[#cbd5e1] flex items-center justify-between">
                <span>Select Interface Theme</span>
                <span className="text-[10px] uppercase font-mono text-[#d4af37]">{currentTheme}</span>
              </div>
              <ThemeToggle
                currentTheme={currentTheme}
                setTheme={setTheme}
                showLabels={true}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#232634] px-2 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#64748b]">
              System Design &bull; Staff Engineer Reference
            </p>
          </div>
        </div>
      )}
    </>
  );
};
