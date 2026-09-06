import React from 'react';
import { Sun, Moon, Compass, Palette } from 'lucide-react';

export type AppTheme = 'dark' | 'light' | 'blueprint';

interface ThemeToggleProps {
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentTheme,
  setTheme,
  className = '',
  showLabels = false
}) => {
  const themes: { id: AppTheme; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'dark',
      label: 'Obsidian Dark',
      icon: <Moon className="h-3.5 w-3.5" />,
      color: '#d4af37'
    },
    {
      id: 'light',
      label: 'Editorial Light',
      icon: <Sun className="h-3.5 w-3.5" />,
      color: '#b45309'
    },
    {
      id: 'blueprint',
      label: 'Blueprint Navy',
      icon: <Compass className="h-3.5 w-3.5" />,
      color: '#38bdf8'
    }
  ];

  const cycleTheme = () => {
    if (currentTheme === 'dark') setTheme('light');
    else if (currentTheme === 'light') setTheme('blueprint');
    else setTheme('dark');
  };

  if (!showLabels) {
    const current = themes.find(t => t.id === currentTheme) || themes[0];
    return (
      <button
        onClick={cycleTheme}
        title={`Current Theme: ${current.label}. Click to switch theme (Dark / Light / Blueprint)`}
        className={`inline-flex items-center gap-1.5 rounded-sm border border-[#272a38] bg-[#14161f] px-2.5 py-1.5 text-xs font-medium text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] transition-all cursor-pointer min-h-[36px] ${className}`}
      >
        <span style={{ color: current.color }}>{current.icon}</span>
        <span className="hidden xl:inline text-[11px] font-sans">{current.label.split(' ')[0]}</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1 rounded-sm border border-[#272a38] bg-[#0b0c10] p-1 ${className}`}>
      {themes.map(t => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-1.5 rounded-xs px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-[#1c1910] text-[#d4af37] border border-[#d4af37]/50 shadow-xs'
                : 'text-[#94a3b8] hover:text-[#ffffff]'
            }`}
          >
            <span style={{ color: isActive ? '#d4af37' : 'inherit' }}>{t.icon}</span>
            <span className="text-[11px]">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
