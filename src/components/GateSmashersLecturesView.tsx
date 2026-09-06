import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle, 
  Circle, 
  Search, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Layers, 
  Youtube,
  Tv,
  CheckCircle2,
  Filter,
  ArrowRight,
  Share2
} from 'lucide-react';
import { GATE_SMASHERS_LECTURES, GATE_SMASHERS_PLAYLIST_URL, GATE_SMASHERS_PLAYLIST_ID } from '../data/gate_smashers_videos';
import { GateSmashersLecture } from '../types';

interface GateSmashersLecturesViewProps {
  onSelectChapter?: (chapterId: string) => void;
}

export const GateSmashersLecturesView: React.FC<GateSmashersLecturesViewProps> = ({ onSelectChapter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [watchedLectures, setWatchedLectures] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gate_smashers_watched_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeEmbed, setActiveEmbed] = useState<GateSmashersLecture | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('gate_smashers_watched_v1', JSON.stringify(watchedLectures));
    } catch {
      // ignore
    }
  }, [watchedLectures]);

  const toggleWatched = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchedLectures(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const categories = [
    'All',
    'Foundations & Mindset',
    'Load Balancing & Networking',
    'Caching & Performance',
    'Databases & Sharding',
    'Scaling & Architecture',
    'APIs & Microservices',
    'Security & Auth',
    'Real-World Systems',
    'Design Principles'
  ];

  const filteredLectures = GATE_SMASHERS_LECTURES.filter(lec => {
    const matchesCategory = selectedCategory === 'All' || lec.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      lec.title.toLowerCase().includes(q) ||
      lec.summary.toLowerCase().includes(q) ||
      lec.category.toLowerCase().includes(q) ||
      lec.keyTakeaways.some(t => t.toLowerCase().includes(q)) ||
      lec.lectureNumber.toString() === q;
    return matchesCategory && matchesSearch;
  });

  const percentComplete = Math.round((watchedLectures.length / GATE_SMASHERS_LECTURES.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative rounded-md border border-[#232634] bg-[#12141c] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 font-mono text-[11px] font-semibold">
                <Youtube className="h-3.5 w-3.5 fill-current" />
                Gate Smashers Series
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1c1910] border border-[#d4af37]/30 text-[#d4af37] font-mono text-[11px]">
                <Sparkles className="h-3 w-3" />
                Varun Sir
              </span>
              <span className="text-[11px] text-[#94a3b8]">2.83M+ Subscribers &bull; 33 Full Lectures</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#ffffff] tracking-tight">
              Gate Smashers System Design Series
            </h1>
            
            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              Complete lecture-by-lecture syllabus companion for Varun Sir’s legendary YouTube course. 
              Review the architectural notes, key takeaways, and jump directly to corresponding written curriculum chapters.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href={GATE_SMASHERS_PLAYLIST_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors shadow-sm"
              >
                <Youtube className="h-4 w-4" />
                Open Full Playlist on YouTube
                <ExternalLink className="h-3 w-3 opacity-80" />
              </a>

              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Gate Smashers System Design Series',
                      url: window.location.href
                    }).catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[#272a38] bg-[#161824] hover:bg-[#1f2230] text-xs text-[#cbd5e1] hover:text-[#ffffff] transition-colors"
              >
                <Share2 className="h-3.5 w-3.5 text-[#94a3b8]" />
                Share Track
              </button>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="rounded-md border border-[#232634] bg-[#161823] p-5 md:w-80 shrink-0 space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#ffffff] uppercase tracking-wider text-[11px]">Curriculum Progress</span>
              <span className="font-mono font-bold text-[#d4af37]">{watchedLectures.length} / {GATE_SMASHERS_LECTURES.length}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#0b0c10] overflow-hidden border border-[#232634]">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${percentComplete}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
              <span>{percentComplete}% Completed</span>
              {percentComplete === 100 ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Certified
                </span>
              ) : (
                <span>{GATE_SMASHERS_LECTURES.length - watchedLectures.length} remaining</span>
              )}
            </div>

            <p className="text-[10px] text-[#94a3b8] italic border-t border-[#232634] pt-2">
              Mark lectures as watched to track your placement preparation across all 33 modules.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Player Modal if active */}
      {activeEmbed && (
        <div className="rounded-md border border-[#d4af37]/40 bg-[#12141c] p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#232634] pb-3">
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4 text-[#d4af37]" />
              <h3 className="text-sm font-medium text-[#ffffff]">
                Viewing: {activeEmbed.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={activeEmbed.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                Watch on YouTube <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={() => setActiveEmbed(null)}
                className="text-xs text-[#94a3b8] hover:text-[#ffffff] px-2 py-1 rounded-xs bg-[#161824] border border-[#232634]"
              >
                Close Player
              </button>
            </div>
          </div>

          <div className="aspect-video w-full rounded-sm overflow-hidden bg-black border border-[#232634]">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/videoseries?list=${GATE_SMASHERS_PLAYLIST_ID}&index=${activeEmbed.lectureNumber}`}
              title={activeEmbed.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Search & Category Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search lectures (e.g. Load Balancer, IRCTC, CAP, Sharding)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-sm border border-[#272a38] bg-[#141620] text-xs text-[#ffffff] placeholder-[#94a3b8] focus:border-[#d4af37] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#94a3b8] hover:text-[#ffffff]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
            <Filter className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>Showing <strong className="text-[#ffffff]">{filteredLectures.length}</strong> of {GATE_SMASHERS_LECTURES.length} lectures</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' 
              ? GATE_SMASHERS_LECTURES.length 
              : GATE_SMASHERS_LECTURES.filter(x => x.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1c1910] text-[#d4af37] border border-[#d4af37]/60 shadow-xs'
                    : 'bg-[#141620] text-[#94a3b8] border border-[#232634] hover:text-[#ffffff] hover:border-[#2d3142]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono px-1 rounded-full ${isSelected ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-[#1f2230] text-[#64748b]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lectures Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredLectures.map((lec) => {
          const isWatched = watchedLectures.includes(lec.id);
          return (
            <div
              key={lec.id}
              className={`rounded-md border transition-all duration-150 p-5 space-y-4 flex flex-col justify-between ${
                isWatched 
                  ? 'border-emerald-500/30 bg-[#0e1511]/40' 
                  : 'border-[#232634] bg-[#12141c] hover:border-[#2d3142]'
              }`}
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold uppercase tracking-wider bg-[#1c1910] text-[#d4af37] border border-[#d4af37]/30">
                      Lec {lec.lectureNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#94a3b8]">
                      <Clock className="h-3 w-3" />
                      {lec.duration}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#161824] border border-[#232634] text-[#94a3b8]">
                      {lec.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleWatched(lec.id, e)}
                    title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
                    className="p-1 rounded-sm text-[#94a3b8] hover:text-[#ffffff] transition-colors cursor-pointer"
                  >
                    {isWatched ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="h-4 w-4 text-[#64748b] hover:text-[#94a3b8]" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-medium text-[#ffffff] leading-snug">
                  {lec.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {lec.summary}
                </p>

                {/* Key Takeaways */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]">
                    Key Takeaways:
                  </div>
                  <ul className="space-y-1">
                    {lec.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-[#cbd5e1] leading-relaxed">
                        <span className="text-[#d4af37] text-[10px] mt-0.5">&bull;</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-[#232634] pt-3 flex flex-wrap items-center justify-between gap-2 mt-4">
                {/* Associated Syllabus Chapter Link */}
                {onSelectChapter ? (
                  <button
                    onClick={() => onSelectChapter(lec.associatedChapterId)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#e5c158] font-medium transition-colors cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Study Notes: {lec.associatedChapterTitle.split(':')[0]}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8]">
                    <Layers className="h-3.5 w-3.5 text-[#d4af37]" />
                    <span>{lec.associatedChapterTitle}</span>
                  </span>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEmbed(lec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border border-[#272a38] bg-[#161824] hover:bg-[#1f2230] text-xs text-[#cbd5e1] hover:text-[#ffffff] transition-colors cursor-pointer"
                  >
                    <Play className="h-3 w-3 text-[#d4af37] fill-[#d4af37]" />
                    Play in App
                  </button>

                  <a
                    href={lec.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-red-600/90 hover:bg-red-600 text-white text-xs font-medium transition-colors"
                  >
                    <Youtube className="h-3.5 w-3.5" />
                    YouTube
                    <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
