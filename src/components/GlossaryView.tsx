import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { HelpCircle, Search, BookOpen, Lightbulb, ShieldCheck } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Distributed Systems', 'Databases', 'Messaging', 'SaaS Architecture', 'IaaS & Cloud', 'Security', 'Performance Engineering', 'Observability', 'Reliability'];

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.simpleMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.technicalMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Title Header */}
      <div className="rounded-sm border border-[#222] bg-[#111] p-8 sm:p-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
          <HelpCircle className="h-4 w-4" />
          Architectural Lexicon
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-serif text-[#fff]">
          System Design Glossary &amp; Mental Models
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#888] font-light leading-relaxed">
          Precise definitions, theoretical theorems, and production implementations for high-stakes technical discussions.
        </p>

        {/* Search & Category Filter */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search terms, theorems, data structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-sm border border-[#222] bg-[#0c0c0c] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#fff] placeholder:text-[#555] focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-sm border border-[#222] bg-[#0c0c0c] px-4 py-2.5 text-xs text-[#ccc] focus:border-[#c5a059] focus:outline-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div className="space-y-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-semibold">
          Showing {filteredTerms.length} Architectural Terms
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredTerms.map(term => (
            <div key={term.term} className="rounded-sm border border-[#222] bg-[#111] p-6 space-y-4 hover:border-[#333] transition-colors">
              <div className="flex items-center justify-between gap-2 border-b border-[#1e1e1e] pb-3">
                <h2 className="text-xl font-serif text-[#fff]">
                  {term.term}
                </h2>
                <span className="rounded-xs bg-[#181818] border border-[#2a2a2a] px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-semibold text-[#c5a059]">
                  {term.category}
                </span>
              </div>

              {/* Simple Definition */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#c5a059]">
                  <Lightbulb className="h-3 w-3" />
                  Intuitive Mental Model
                </div>
                <p className="text-xs sm:text-sm text-[#ccc] leading-relaxed">
                  {term.simpleMeaning}
                </p>
              </div>

              {/* Technical Definition */}
              <div className="space-y-1 border-t border-[#1a1a1a] pt-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold text-[#888]">
                  <ShieldCheck className="h-3 w-3 text-[#c5a059]" />
                  Formal Engineering Definition
                </div>
                <p className="text-xs text-[#aaa] leading-relaxed">
                  {term.technicalMeaning}
                </p>
              </div>

              {/* Real World Example */}
              <div className="rounded-xs bg-[#0a0a0a] p-3 text-xs text-[#888] border border-[#1e1e1e]">
                <span className="text-[#c5a059] font-medium mr-1">Production Example:</span>
                <span>{term.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
