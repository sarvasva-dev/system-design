import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'T', description: 'Toggle Theme (Dark Obsidian ⇄ Editorial Light ⇄ Blueprint)' },
    { key: 'S', description: 'Open SEO Website Preview & Social Cards' },
    { key: 'C', description: 'Open Color Awareness Guide & Legend' },
    { key: 'Q', description: 'Take 5-Minute Staff Engineering Quiz' },
    { key: 'E', description: 'Export Study Plan, Notes & Certificate' },
    { key: '/', description: 'Focus Quick Architectural Search bar' },
    { key: 'Esc', description: 'Close any active overlay modal' },
    { key: 'Double Tap', description: 'Explain ANY term on Google: "explain {term} in system design"' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg rounded-lg border border-[#272a38] bg-[#12141c] text-[#cbd5e1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#232634] px-5 py-4 bg-[#141622]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-[#ffffff]">Keyboard Navigation &amp; Hotkeys</h2>
              <p className="text-xs text-[#94a3b8]">Power-user shortcuts for rapid architectural study</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-[#94a3b8] hover:text-[#ffffff] hover:bg-[#1f2230] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {shortcuts.map((item) => (
            <div 
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-sm bg-[#161824] border border-[#232634] text-xs"
            >
              <span className="text-[#e2e8f0]">{item.description}</span>
              <kbd className="px-2.5 py-1 rounded-xs bg-[#0b0c10] border border-[#2d3142] text-[#d4af37] font-mono text-xs font-semibold shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="border-t border-[#232634] px-5 py-3 bg-[#141622] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm border border-[#272a38] text-xs text-[#cbd5e1] hover:text-[#ffffff] cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
