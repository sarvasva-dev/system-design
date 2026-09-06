import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Lightbulb, 
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { GlossaryTerm } from '../types';

interface DoubleTapExplainerProps {
  externalSearchTerm?: string | null;
  onClearExternalTerm?: () => void;
  onOpenColorModal: () => void;
  colorAwarenessMode: boolean;
}

export const DoubleTapExplainer: React.FC<DoubleTapExplainerProps> = ({
  externalSearchTerm,
  onClearExternalTerm,
  onOpenColorModal,
  colorAwarenessMode
}) => {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [matchedGlossary, setMatchedGlossary] = useState<GlossaryTerm | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHelperToast, setShowHelperToast] = useState(true);

  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });

  // Find glossary match for term
  const findGlossaryMatch = (term: string): GlossaryTerm | null => {
    const clean = term.toLowerCase().trim();
    if (!clean) return null;

    // Exact match
    const exact = GLOSSARY_TERMS.find(g => g.term.toLowerCase() === clean);
    if (exact) return exact;

    // Partial match
    const partial = GLOSSARY_TERMS.find(g => 
      g.term.toLowerCase().includes(clean) || clean.includes(g.term.toLowerCase())
    );
    return partial || null;
  };

  const triggerGoogleSearch = useCallback((rawTerm: string, openWindow = true) => {
    // Clean term
    let term = rawTerm
      .replace(/^[^a-zA-Z0-9#+]+|[^a-zA-Z0-9#+]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!term || term.length < 2) return;

    // Cap excessive selection to 60 characters
    if (term.length > 60) {
      term = term.substring(0, 60).trim();
    }

    const searchQuery = `explain ${term} in system design`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    setActiveTerm(term);
    setCustomInput(term);
    setMatchedGlossary(findGlossaryMatch(term));
    setIsMinimized(false);
    setShowHelperToast(false);

    if (openWindow) {
      try {
        const win = window.open(googleUrl, '_blank', 'noopener,noreferrer');
        // If popup was blocked or returned null, the user will still have the prominent button in HUD
        if (!win) {
          console.log('Popup blocked or handled in iframe; HUD link is active.');
        }
      } catch (err) {
        console.warn('Unable to window.open directly in iframe:', err);
      }
    }
  }, []);

  // Listen to external term searches (e.g. from ColorAwarenessModal test chips)
  useEffect(() => {
    if (externalSearchTerm) {
      triggerGoogleSearch(externalSearchTerm, true);
      if (onClearExternalTerm) onClearExternalTerm();
    }
  }, [externalSearchTerm, onClearExternalTerm, triggerGoogleSearch]);

  // Clean and extract word under cursor or selection
  const extractTermFromEvent = (e: MouseEvent | TouchEvent, targetEl: HTMLElement | null): string => {
    // 1. First priority: highlighted selection
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length >= 2 && selection.length <= 80) {
      return selection;
    }

    // 2. Element with data-term attribute
    if (targetEl) {
      const explicitTerm = targetEl.getAttribute('data-term') || 
                           targetEl.closest('[data-term]')?.getAttribute('data-term');
      if (explicitTerm) return explicitTerm;
    }

    // 3. Extract word at click point
    if (e instanceof MouseEvent && (document as any).caretRangeFromPoint) {
      const range = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
      if (range && range.startContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
        const text = range.startContainer.textContent || '';
        const offset = range.startOffset;
        
        // Find word boundary before and after offset
        const left = text.slice(0, offset).search(/[a-zA-Z0-9_\-#+]+$/);
        const rightMatch = text.slice(offset).match(/^[a-zA-Z0-9_\-#+]+/);
        
        if (left !== -1 && rightMatch) {
          const word = text.slice(left, offset + rightMatch[0].length);
          if (word && word.length >= 2) return word;
        }
      }
    }

    // 4. Fallback to target element text content if short
    if (targetEl) {
      const text = targetEl.textContent?.trim() || '';
      if (text.length >= 2 && text.length <= 40) {
        return text;
      }
    }

    return '';
  };

  useEffect(() => {
    // Desktop Double Click Handler
    const handleDoubleClick = (e: MouseEvent) => {
      // Avoid triggering when double clicking input fields or interactive buttons
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.closest('#double-tap-explainer-hud')) {
        return;
      }

      const term = extractTermFromEvent(e, target);
      if (term) {
        triggerGoogleSearch(term, true);
      }
    };

    // Mobile Double Tap Handler
    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.closest('#double-tap-explainer-hud')) {
        return;
      }

      const now = Date.now();
      const touch = e.changedTouches[0];
      if (!touch) return;

      const timeDelta = now - lastTapRef.current.time;
      const dist = Math.hypot(
        touch.clientX - lastTapRef.current.x,
        touch.clientY - lastTapRef.current.y
      );

      // Double tap threshold: within 350ms and within 30px
      if (timeDelta > 50 && timeDelta < 350 && dist < 30) {
        const term = extractTermFromEvent(e, target);
        if (term) {
          triggerGoogleSearch(term, true);
        }
        lastTapRef.current = { time: 0, x: 0, y: 0 };
      } else {
        lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };
      }
    };

    window.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [triggerGoogleSearch]);

  const copyPromptToClipboard = () => {
    if (activeTerm) {
      navigator.clipboard.writeText(`explain ${activeTerm} in system design`);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      triggerGoogleSearch(customInput.trim(), true);
    }
  };

  const googleSearchUrl = activeTerm 
    ? `https://www.google.com/search?q=${encodeURIComponent(`explain ${activeTerm} in system design`)}`
    : '';

  // If no term is active, do not render any permanent obstructing floating badge
  if (!activeTerm) {
    return null;
  }

  return (
    <div id="double-tap-explainer-hud" className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-50 max-w-md w-[calc(100vw-1.5rem)] sm:w-96 pointer-events-auto">
      {/* 1. Explainer HUD Card when a term is active */}
      {!isMinimized ? (
        <div className="rounded-md border border-[#d4af37]/60 bg-[#0e1017] p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-3 text-[#e2e8f0] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-[#232634] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-[#d4af37]/15 text-[#d4af37]">
                <Search className="h-3.5 w-3.5" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
                Double-Tap Term Explainer
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-[#94a3b8] hover:text-[#fff] p-1 text-xs"
                title="Minimize HUD"
              >
                &minus;
              </button>
              <button
                onClick={() => setActiveTerm(null)}
                className="text-[#94a3b8] hover:text-[#fff] p-1"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Prompt Preview */}
          <div className="rounded-xs bg-[#161824] p-3 border border-[#232634] space-y-1.5">
            <div className="text-[9px] uppercase tracking-[0.16em] text-[#94a3b8] font-semibold flex items-center justify-between">
              <span>Google Search Prompt:</span>
              <span className="text-[#22c55e] font-mono text-[9px]">● Triggered</span>
            </div>
            <div className="font-mono text-xs sm:text-sm text-[#ffffff] font-medium break-words">
              explain <span className="text-[#d4af37] underline underline-offset-2">{activeTerm}</span> in system design
            </div>
          </div>

          {/* Matched in-app architecture glossary note (if available) */}
          {matchedGlossary && (
            <div className="rounded-xs border border-[#1e2335] bg-[#121420] p-2.5 space-y-1">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-[#d4af37] font-semibold">
                <Lightbulb className="h-3 w-3" />
                <span>Instant Architecture Definition:</span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed line-clamp-2">
                {matchedGlossary.simpleMeaning}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm bg-[#d4af37] px-3.5 py-2 text-xs font-semibold text-[#000000] hover:bg-[#e6c148] transition-all min-h-[38px] shadow-sm cursor-pointer"
            >
              <span>Search on Google</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={copyPromptToClipboard}
              className="inline-flex items-center justify-center gap-1 rounded-sm border border-[#2d3142] bg-[#1a1d2b] px-3 py-2 text-xs text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#ffffff] transition-colors min-h-[38px] cursor-pointer"
            >
              {copiedPrompt ? <Check className="h-3.5 w-3.5 text-[#22c55e]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Quick manual query editor */}
          <form onSubmit={handleCustomSubmit} className="relative pt-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Search another term..."
              className="w-full rounded-xs border border-[#272a38] bg-[#12141c] py-1.5 pl-2.5 pr-8 text-[11px] text-[#ffffff] placeholder:text-[#64748b] focus:border-[#d4af37] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-2.5 text-[#94a3b8] hover:text-[#d4af37] p-1"
            >
              <ArrowRight className="h-3 w-3" />
            </button>
          </form>
        </div>
      ) : (
        /* 2. Minimized Pill when term is active but user clicked minus */
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 rounded-full border border-[#d4af37] bg-[#12141c] px-3.5 py-2 shadow-xl hover:bg-[#1a1d2b] transition-all cursor-pointer text-xs"
        >
          <Search className="h-3.5 w-3.5 text-[#d4af37]" />
          <span className="text-[#ffffff] font-medium truncate max-w-[180px]">"{activeTerm}"</span>
          <ExternalLink className="h-3 w-3 text-[#94a3b8]" />
        </button>
      )}
    </div>
  );
};
