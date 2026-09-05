import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Layers, 
  CheckSquare, 
  HelpCircle, 
  FileText, 
  Menu, 
  Search,
  BookmarkCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'chapters' | 'casestudies' | 'calculator' | 'glossary' | 'checklist' | 'sources';
  setActiveTab: (tab: 'chapters' | 'casestudies' | 'calculator' | 'glossary' | 'checklist' | 'sources') => void;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  completedCount: number;
  totalChapters: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  completedCount,
  totalChapters
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#222] bg-[#080808]/95 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          id="mobile-sidebar-toggle"
          onClick={toggleSidebar}
          className="rounded-sm p-2 text-[#888] hover:bg-[#161616] hover:text-[#fff] lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#c5a059]/40 bg-[#111] text-[#c5a059] shadow-xs">
            <span className="font-serif italic font-bold text-base">SD</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl tracking-tight text-[#fff]">
                System Design <span className="italic text-[#c5a059]">SaaS & IaaS</span>
              </span>
              <span className="hidden sm:inline-block rounded-xs bg-[#141414] border border-[#2a2a2a] px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium text-[#c5a059]">
                Staff Edition
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="hidden lg:flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-medium text-[#888]">
        <button
          id="nav-tab-chapters"
          onClick={() => setActiveTab('chapters')}
          className={`flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'chapters'
              ? 'text-[#fff] border-b-2 border-[#c5a059] pb-1'
              : 'hover:text-[#fff]'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Chapters
        </button>

        <button
          id="nav-tab-casestudies"
          onClick={() => setActiveTab('casestudies')}
          className={`flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'casestudies'
              ? 'text-[#fff] border-b-2 border-[#c5a059] pb-1'
              : 'hover:text-[#fff]'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Case Studies
        </button>

        <button
          id="nav-tab-calculator"
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'text-[#fff] border-b-2 border-[#c5a059] pb-1'
              : 'hover:text-[#fff]'
          }`}
        >
          <Calculator className="h-3.5 w-3.5" />
          Capacity Math
        </button>

        <button
          id="nav-tab-glossary"
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'glossary'
              ? 'text-[#fff] border-b-2 border-[#c5a059] pb-1'
              : 'hover:text-[#fff]'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Glossary
        </button>

        <button
          id="nav-tab-checklist"
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'checklist'
              ? 'text-[#fff] border-b-2 border-[#c5a059] pb-1'
              : 'hover:text-[#fff]'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          Rubric
        </button>

        <button
          id="nav-tab-sources"
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-1.5 px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'sources'
              ? 'text-[#fff] border-b-2 border-[#c5a059] pb-1'
              : 'hover:text-[#fff]'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Primary RFCs
        </button>
      </nav>

      {/* Right utilities: Search & Progress indicator */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-48 xl:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666]" />
          <input
            id="global-header-search"
            type="text"
            placeholder="Search architecture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-sm border border-[#222] bg-[#111] py-1.5 pl-8 pr-3 text-xs text-[#e5e5e5] placeholder:text-[#555] focus:border-[#c5a059] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] tracking-wide text-[#aaa] bg-[#111] border border-[#222] px-3 py-1.5 rounded-sm">
          <BookmarkCheck className="h-3.5 w-3.5 text-[#c5a059]" />
          <span className="font-mono text-[#c5a059] font-medium">{completedCount}/{totalChapters}</span>
          <span className="hidden sm:inline uppercase text-[10px] tracking-widest text-[#666]">Read</span>
        </div>
      </div>
    </header>
  );
};
