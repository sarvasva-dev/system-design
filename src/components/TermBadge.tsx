import React from 'react';

interface TermBadgeProps {
  term: string;
  category?: 'core' | 'network' | 'consensus' | 'sla' | 'antipattern' | 'security' | 'storage';
  className?: string;
  onClick?: () => void;
}

export const TermBadge: React.FC<TermBadgeProps> = ({
  term,
  category = 'core',
  className = '',
  onClick
}) => {
  const categoryStyles = {
    core: 'border-[#d4af37]/40 bg-[#1e1c14] text-[#d4af37] hover:border-[#d4af37]',
    network: 'border-[#38bdf8]/40 bg-[#0e1d2c] text-[#38bdf8] hover:border-[#38bdf8]',
    consensus: 'border-[#c084fc]/40 bg-[#1c1229] text-[#c084fc] hover:border-[#c084fc]',
    sla: 'border-[#22c55e]/40 bg-[#0e2114] text-[#4ade80] hover:border-[#22c55e]',
    antipattern: 'border-[#ef4444]/40 bg-[#241113] text-[#f87171] hover:border-[#ef4444]',
    security: 'border-[#a78bfa]/40 bg-[#1b1429] text-[#a78bfa] hover:border-[#a78bfa]',
    storage: 'border-[#eab308]/40 bg-[#1f1a10] text-[#facc15] hover:border-[#eab308]'
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = `explain ${term} in system design`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <span
      data-term={term}
      onDoubleClick={handleDoubleClick}
      onClick={onClick}
      title={`Double-tap or double-click to explain "${term}" in system design`}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border text-[11px] font-mono tracking-tight cursor-pointer transition-all select-none hover:shadow-xs active:scale-98 ${categoryStyles[category]} ${className}`}
    >
      <span className="opacity-60 text-[9px]">&#123;</span>
      <span>{term}</span>
      <span className="opacity-60 text-[9px]">&#125;</span>
    </span>
  );
};
