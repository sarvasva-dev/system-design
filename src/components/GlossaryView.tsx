import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { 
  HelpCircle, 
  Search, 
  Lightbulb, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Briefcase, 
  Building2, 
  Target, 
  AlertTriangle, 
  Layers,
  Award,
  Filter
} from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  const categories = [
    'All', 
    'Distributed Systems', 
    'Databases', 
    'Messaging', 
    'SaaS Architecture', 
    'IaaS & Cloud', 
    'Security', 
    'Performance Engineering', 
    'Observability', 
    'Reliability'
  ];

  const targetCompanies = [
    'All',
    'Google',
    'Meta',
    'Amazon',
    'Netflix',
    'Uber',
    'Stripe',
    'Apple',
    'Microsoft'
  ];

  const toggleQuestion = (termName: string, qIndex: number) => {
    const key = `${termName}-${qIndex}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleExpandAll = () => {
    const nextState = !expandAll;
    setExpandAll(nextState);
    const newExpanded: Record<string, boolean> = {};
    GLOSSARY_TERMS.forEach(term => {
      if (term.interviewQuestions) {
        term.interviewQuestions.forEach((_, qIdx) => {
          newExpanded[`${term.term}-${qIdx}`] = nextState;
        });
      }
    });
    setExpandedQuestions(newExpanded);
  };

  const isQuestionExpanded = (termName: string, qIndex: number) => {
    if (expandAll) {
      return expandedQuestions[`${termName}-${qIndex}`] !== false;
    }
    return !!expandedQuestions[`${termName}-${qIndex}`];
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Distributed Systems':
        return {
          badge: 'bg-[#c084fc]/15 text-[#c084fc] border-[#c084fc]/40',
          dot: 'bg-[#c084fc]',
          cardHover: 'hover:border-[#c084fc]/50'
        };
      case 'Databases':
        return {
          badge: 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/40',
          dot: 'bg-[#d4af37]',
          cardHover: 'hover:border-[#d4af37]/50'
        };
      case 'Messaging':
      case 'IaaS & Cloud':
        return {
          badge: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40',
          dot: 'bg-[#38bdf8]',
          cardHover: 'hover:border-[#38bdf8]/50'
        };
      case 'SaaS Architecture':
      case 'Reliability':
        return {
          badge: 'bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/40',
          dot: 'bg-[#22c55e]',
          cardHover: 'hover:border-[#22c55e]/50'
        };
      case 'Security':
        return {
          badge: 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/40',
          dot: 'bg-[#a78bfa]',
          cardHover: 'hover:border-[#a78bfa]/50'
        };
      case 'Performance Engineering':
      case 'Observability':
        return {
          badge: 'bg-[#fb923c]/15 text-[#fb923c] border-[#fb923c]/40',
          dot: 'bg-[#fb923c]',
          cardHover: 'hover:border-[#fb923c]/50'
        };
      default:
        return {
          badge: 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/40',
          dot: 'bg-[#d4af37]',
          cardHover: 'hover:border-[#d4af37]/50'
        };
    }
  };

  const getCompanyBadgeColor = (company: string) => {
    switch (company) {
      case 'Google':
        return 'bg-[#4285f4]/15 text-[#93c5fd] border-[#4285f4]/40';
      case 'Meta':
        return 'bg-[#0081fb]/15 text-[#60a5fa] border-[#0081fb]/40';
      case 'Amazon':
      case 'AWS':
        return 'bg-[#ff9900]/15 text-[#fbbf24] border-[#ff9900]/40';
      case 'Netflix':
        return 'bg-[#e50914]/15 text-[#f87171] border-[#e50914]/40';
      case 'Stripe':
        return 'bg-[#635bff]/15 text-[#a5b4fc] border-[#635bff]/40';
      case 'Uber':
        return 'bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]/40';
      case 'Apple':
        return 'bg-[#94a3b8]/15 text-[#e2e8f0] border-[#94a3b8]/40';
      case 'Microsoft':
      case 'Microsoft Azure':
        return 'bg-[#00a4ef]/15 text-[#7dd3fc] border-[#00a4ef]/40';
      default:
        return 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/40';
    }
  };

  const handleSearchGoogle = (term: string) => {
    const query = `explain ${term} in system design`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  const copyFullInterviewAnswer = (key: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(key);
    setTimeout(() => setCopiedQuestionId(null), 2500);
  };

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const termMatchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.simpleMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.technicalMeaning.toLowerCase().includes(searchTerm.toLowerCase());

    const questionMatchesSearch = term.interviewQuestions?.some(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.detailedAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.companies.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesSearch = termMatchesSearch || !!questionMatchesSearch;
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    const matchesCompany = selectedCompany === 'All' || 
      term.interviewQuestions?.some(q => q.companies.includes(selectedCompany) || (selectedCompany === 'Amazon' && q.companies.includes('AWS')));

    return matchesSearch && matchesCategory && matchesCompany;
  });

  const totalInterviewQuestions = GLOSSARY_TERMS.reduce((acc, curr) => acc + (curr.interviewQuestions?.length || 0), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10 pb-24">
      {/* Title Header */}
      <div className="rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-8 lg:p-10 shadow-lg space-y-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#d4af37]">
            <HelpCircle className="h-4 w-4" />
            Architectural Lexicon &amp; Interview Question Bank
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#ffffff]">
            System Design Glossary &amp; Company Interview Q&amp;A
          </h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-[#94a3b8] font-normal leading-relaxed">
            Essential concepts, rigorous definitions, and real interview questions asked by top tech firms (Google, Meta, Amazon, Netflix, Stripe, Uber) with detailed model answers and staff-level follow-ups.
          </p>
        </div>

        {/* Company Interview Banner Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-sm border border-[#232634] bg-[#161824] p-3 text-center">
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#d4af37]">{GLOSSARY_TERMS.length}</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">Core Concepts</div>
          </div>
          <div className="rounded-sm border border-[#232634] bg-[#161824] p-3 text-center">
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#38bdf8]">{totalInterviewQuestions}</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">Company Q&amp;As</div>
          </div>
          <div className="rounded-sm border border-[#232634] bg-[#161824] p-3 text-center">
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#22c55e]">L5 / L6</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">Senior / Staff Bar</div>
          </div>
          <div className="rounded-sm border border-[#232634] bg-[#161824] p-3 text-center">
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#c084fc]">FAANG+</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#94a3b8] mt-0.5">Tier-1 Companies</div>
          </div>
        </div>

        {/* Double Tap Explainer Feature Notice */}
        <div className="rounded-sm border border-[#d4af37]/30 bg-[#161824] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#ffffff] flex items-center gap-2">
                <span>Double-Tap Explainer System Active</span>
                <span className="rounded-full bg-[#22c55e] h-2 w-2 animate-pulse"></span>
              </div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Double-tap or double-click <strong>ANY</strong> term title to instantly trigger:
                <code className="text-[#d4af37] font-mono text-[11px] bg-[#0b0c10] px-1.5 py-0.5 rounded-xs ml-1 inline-block">
                  explain &#123;term&#125; in system design
                </code>
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleExpandAll}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#d4af37]/40 bg-[#241f12] text-xs font-medium text-[#d4af37] hover:border-[#d4af37] hover:bg-[#2e2716] transition-all cursor-pointer min-h-[36px]"
          >
            {expandAll ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Collapse All Answers</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Expand All Interview Answers</span>
              </>
            )}
          </button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search terms, company names (Google, Stripe, Uber...), or interview question keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-sm border border-[#272a38] bg-[#161824] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#ffffff] placeholder:text-[#64748b] focus:border-[#d4af37] focus:outline-none min-h-[44px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Dropdown */}
            <div className="flex-1 flex items-center gap-2 rounded-sm border border-[#272a38] bg-[#161824] px-3 py-1.5">
              <Layers className="h-3.5 w-3.5 text-[#d4af37] shrink-0" />
              <div className="text-[11px] text-[#94a3b8] shrink-0">Category:</div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs text-[#ffffff] focus:outline-none cursor-pointer py-1"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#12141c] text-[#ffffff]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Company Dropdown */}
            <div className="flex-1 flex items-center gap-2 rounded-sm border border-[#272a38] bg-[#161824] px-3 py-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#38bdf8] shrink-0" />
              <div className="text-[11px] text-[#94a3b8] shrink-0">Company:</div>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full bg-transparent text-xs text-[#ffffff] focus:outline-none cursor-pointer py-1"
              >
                {targetCompanies.map(comp => (
                  <option key={comp} value={comp} className="bg-[#12141c] text-[#ffffff]">
                    {comp === 'All' ? 'All Companies' : `${comp} Interview Questions`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] font-semibold">
          <span>Showing {filteredTerms.length} Architectural Terms {selectedCompany !== 'All' ? `(Targeting ${selectedCompany})` : ''}</span>
          <span className="text-[#64748b] hidden sm:inline">Tip: Click "View Interview Q&amp;A" for Model Answers</span>
        </div>

        <div className="space-y-6">
          {filteredTerms.map(term => {
            const colors = getCategoryColor(term.category);
            return (
              <div 
                key={term.term} 
                data-term={term.term}
                className={`rounded-md border border-[#232634] bg-[#12141c] p-5 sm:p-7 space-y-5 transition-all ${colors.cardHover} group cursor-default shadow-md`}
              >
                {/* Term Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2230] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${colors.dot} shrink-0`}></span>
                    <h2 
                      className="text-xl sm:text-2xl font-serif font-medium text-[#ffffff] group-hover:text-[#d4af37] transition-colors cursor-pointer"
                      onClick={() => handleSearchGoogle(term.term)}
                      onDoubleClick={() => handleSearchGoogle(term.term)}
                      title={`Double-click to explain "${term.term}" in system design on Google`}
                    >
                      {term.term}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-xs border px-2.5 py-0.5 text-[9px] uppercase tracking-[0.16em] font-semibold ${colors.badge}`}>
                      {term.category}
                    </span>
                    {term.interviewQuestions && term.interviewQuestions.length > 0 && (
                      <span className="rounded-xs border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] font-semibold text-[#38bdf8] flex items-center gap-1">
                        <Briefcase className="h-2.5 w-2.5" />
                        {term.interviewQuestions.length} Interview Q&amp;A
                      </span>
                    )}
                  </div>
                </div>

                {/* Definitions Grid: Simple + Technical */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Simple Definition */}
                  <div className="rounded-sm bg-[#161824] p-4 border border-[#232634] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[#d4af37]">
                      <Lightbulb className="h-3 w-3" />
                      Intuitive Mental Model
                    </div>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                      {term.simpleMeaning}
                    </p>
                  </div>

                  {/* Technical Definition */}
                  <div className="rounded-sm bg-[#161824] p-4 border border-[#232634] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[#94a3b8]">
                      <ShieldCheck className="h-3 w-3 text-[#d4af37]" />
                      Formal Engineering Definition
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {term.technicalMeaning}
                    </p>
                  </div>
                </div>

                {/* Real World Example */}
                <div className="rounded-xs bg-[#171922] p-3 text-xs text-[#cbd5e1] border border-[#232634]">
                  <span className="text-[#d4af37] font-semibold mr-1.5">Production Architecture Example:</span>
                  <span>{term.example}</span>
                </div>

                {/* REAL COMPANY INTERVIEW QUESTIONS & MODEL ANSWERS ACCORDION */}
                {term.interviewQuestions && term.interviewQuestions.length > 0 && (
                  <div className="border-t border-[#1f2230] pt-4 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#ffffff] uppercase tracking-[0.14em]">
                      <Target className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span>Company Interview Questions &amp; Detailed Model Answers</span>
                    </div>

                    <div className="space-y-3">
                      {term.interviewQuestions.map((iq, qIdx) => {
                        const questionKey = `${term.term}-${qIdx}`;
                        const isExpanded = isQuestionExpanded(term.term, qIdx);

                        return (
                          <div 
                            key={qIdx}
                            className="rounded-sm border border-[#d4af37]/30 bg-[#161825] overflow-hidden transition-all"
                          >
                            {/* Question Header Bar (Clickable) */}
                            <div 
                              onClick={() => toggleQuestion(term.term, qIdx)}
                              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#1a1d2e] transition-colors"
                            >
                              <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {/* Company Badges */}
                                  {iq.companies.map(comp => (
                                    <span 
                                      key={comp}
                                      className={`rounded-xs border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] font-semibold ${getCompanyBadgeColor(comp)}`}
                                    >
                                      {comp}
                                    </span>
                                  ))}
                                  <span className="rounded-xs border border-[#22c55e]/40 bg-[#22c55e]/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] font-semibold text-[#4ade80] flex items-center gap-1">
                                    <Award className="h-2.5 w-2.5" />
                                    {iq.level}
                                  </span>
                                </div>
                                <h3 className="text-sm sm:text-base font-serif font-medium text-[#ffffff] leading-snug">
                                  "{iq.question}"
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                <span className="text-[11px] font-medium text-[#d4af37] hidden sm:inline">
                                  {isExpanded ? 'Hide Model Answer' : 'View Model Answer'}
                                </span>
                                <div className="p-1 rounded-xs bg-[#241f12] text-[#d4af37] border border-[#d4af37]/40">
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </div>
                              </div>
                            </div>

                            {/* Detailed Answer & Interviewer Follow-up (Collapsible) */}
                            {isExpanded && (
                              <div className="p-4 sm:p-5 border-t border-[#272a3b] bg-[#12141f] space-y-4">
                                {/* Step-by-Step Model Answer */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#38bdf8] flex items-center gap-1.5">
                                      <ShieldCheck className="h-3 w-3" />
                                      Detailed Technical Model Answer (45-Min System Design Bar)
                                    </span>
                                    <button
                                      onClick={(e) => copyFullInterviewAnswer(questionKey, `${iq.question}\n\nAnswer:\n${iq.detailedAnswer}`, e)}
                                      className="inline-flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-[#d4af37] transition-colors cursor-pointer"
                                      title="Copy full answer text"
                                    >
                                      {copiedQuestionId === questionKey ? (
                                        <>
                                          <Check className="h-3 w-3 text-[#22c55e]" />
                                          <span className="text-[#22c55e]">Answer Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="h-3 w-3" />
                                          <span>Copy Answer</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <div className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line font-sans bg-[#161824] p-3.5 rounded-sm border border-[#232634]">
                                    {iq.detailedAnswer}
                                  </div>
                                </div>

                                {/* Key Architectural Points / Grading Rubric */}
                                {iq.keyPoints && iq.keyPoints.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#d4af37] flex items-center gap-1">
                                      <Check className="h-3 w-3 text-[#22c55e]" />
                                      Key Architectural Trade-offs to State Aloud to Pass Senior/Staff Bar
                                    </div>
                                    <div className="grid gap-1.5 sm:grid-cols-2">
                                      {iq.keyPoints.map((point, pIdx) => (
                                        <div key={pIdx} className="flex items-start gap-2 text-xs text-[#94a3b8] bg-[#161824] p-2 rounded-xs border border-[#232634]">
                                          <span className="text-[#22c55e] font-bold text-xs mt-0.5">•</span>
                                          <span>{point}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Tricky Follow-up Question & Ideal Counter-Response */}
                                {iq.interviewerFollowUp && iq.followUpAnswer && (
                                  <div className="rounded-sm border border-[#f59e0b]/40 bg-[#1d180d] p-3.5 space-y-2">
                                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[#f59e0b]">
                                      <AlertTriangle className="h-3.5 w-3.5 text-[#f59e0b]" />
                                      Interviewer's Tricky Trap / Follow-up Question
                                    </div>
                                    <p className="text-xs font-serif font-medium text-[#ffffff]">
                                      {iq.interviewerFollowUp}
                                    </p>
                                    <div className="pt-2 border-t border-[#f59e0b]/20">
                                      <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[#d4af37] block mb-1">
                                        Ideal Counter-Answer:
                                      </span>
                                      <p className="text-xs text-[#cbd5e1] leading-relaxed">
                                        {iq.followUpAnswer}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Google Search Direct Action Bar */}
                <div className="pt-2 border-t border-[#1a1c27] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSearchGoogle(term.term)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#ffffff] transition-colors font-mono cursor-pointer"
                    title={`Explain ${term.term} in system design on Google`}
                  >
                    <Search className="h-3 w-3" />
                    <span>Search Google &rarr;</span>
                  </button>

                  <div className="text-[11px] text-[#64748b]">
                    Double-tap card to explain
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
