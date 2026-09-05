import React, { useState } from 'react';
import { GLOBAL_VERIFIED_SOURCES } from '../data/verified_sources';
import { FileText, ExternalLink, Search, Filter } from 'lucide-react';

export const SourcesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  const types = ['All', 'RFC / Standard', 'Research Paper', 'Official Documentation', 'Engineering Blog'];

  const filteredSources = GLOBAL_VERIFIED_SOURCES.filter(src => {
    const matchesSearch = src.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      src.whatItSupports.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || src.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Header */}
      <div className="rounded-sm border border-[#222] bg-[#111] p-8 sm:p-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c5a059]">
          <FileText className="h-4 w-4" />
          Authoritative Primary Sources
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-serif text-[#fff]">
          RFC Standards, Research Papers &amp; Specifications
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#888] font-light leading-relaxed">
          The foundational documents underpinning modern distributed systems, protocols, database internals, and internet infrastructure.
        </p>

        {/* Filter controls */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search RFCs, papers, or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-sm border border-[#222] bg-[#0c0c0c] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#fff] placeholder:text-[#555] focus:border-[#c5a059] focus:outline-none"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-sm border border-[#222] bg-[#0c0c0c] px-4 py-2.5 text-xs text-[#ccc] focus:border-[#c5a059] focus:outline-none cursor-pointer"
          >
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="space-y-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-semibold">
          Showing {filteredSources.length} Primary Documents
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredSources.map((src, idx) => (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-[#222] bg-[#111] p-6 space-y-3 transition-all hover:border-[#c5a059] group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-xs bg-[#181818] border border-[#2a2a2a] px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-semibold text-[#c5a059]">
                    {src.type}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#555] group-hover:text-[#c5a059] transition-colors" />
                </div>
                <h2 className="mt-3 text-base sm:text-lg font-serif text-[#fff] group-hover:text-[#c5a059] transition-colors">
                  {src.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#aaa] leading-relaxed">
                  {src.whatItSupports}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] text-[#555] font-mono">
                <span className="truncate max-w-[240px]">{src.url}</span>
                <span className="text-[#c5a059] group-hover:underline">Open Spec &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
