import React, { useState, useEffect } from 'react';
import { Chapter } from '../../types';
import { LoadBalancerDiagram } from './LoadBalancerDiagram';
import { MicroservicesDiagram } from './MicroservicesDiagram';
import { CachingDiagram } from './CachingDiagram';
import { DatabaseDiagram } from './DatabaseDiagram';
import { MessagingDiagram } from './MessagingDiagram';
import { VisualArchitectureDiagram } from '../VisualArchitectureDiagram';
import { 
  Network, 
  Cpu, 
  Zap, 
  Database, 
  Activity, 
  Layers,
  ChevronDown
} from 'lucide-react';

interface ChapterDiagramDispatcherProps {
  chapter: Chapter;
}

type DiagramType = 'auto' | 'lb' | 'microservices' | 'caching' | 'database' | 'messaging' | 'system_topology';

export const ChapterDiagramDispatcher: React.FC<ChapterDiagramDispatcherProps> = ({ chapter }) => {
  // Determine default diagram based on chapter ID
  const getDefaultDiagramType = (id: string): DiagramType => {
    if (id.includes('networking') || id.includes('part1')) return 'lb';
    if (id.includes('containers') || id.includes('backend') || id.includes('part9') || id.includes('part2') || id.includes('part10')) return 'microservices';
    if (id.includes('caching') || id.includes('part5')) return 'caching';
    if (id.includes('databases') || id.includes('distributed') || id.includes('part3') || id.includes('part4') || id.includes('multitenant')) return 'database';
    if (id.includes('messaging') || id.includes('part6')) return 'messaging';
    return 'system_topology';
  };

  const defaultType = getDefaultDiagramType(chapter.id);
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>(defaultType);

  // Sync if chapter changes
  useEffect(() => {
    setSelectedDiagram(getDefaultDiagramType(chapter.id));
  }, [chapter.id]);

  const diagramOptions = [
    { id: 'lb', label: 'Load Balancer (L4/L7 Ingress)', icon: Network, highlight: chapter.id.includes('networking') },
    { id: 'microservices', label: 'Microservices & Service Mesh', icon: Cpu, highlight: chapter.id.includes('containers') || chapter.id.includes('backend') },
    { id: 'caching', label: 'Distributed Caching (Redis)', icon: Zap, highlight: chapter.id.includes('caching') },
    { id: 'database', label: 'Database WAL & Sharding Ring', icon: Database, highlight: chapter.id.includes('database') || chapter.id.includes('distributed') },
    { id: 'messaging', label: 'Kafka Event Streaming & Outbox', icon: Activity, highlight: chapter.id.includes('messaging') },
    { id: 'system_topology', label: 'Global End-to-End Topology', icon: Layers, highlight: selectedDiagram === 'system_topology' }
  ];

  return (
    <div className="space-y-3">
      {/* Blueprint Sub-navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#94a3b8]">
          <span className="text-[#d4af37] font-semibold">Active Blueprint Architecture:</span>
        </div>

        {/* Blueprint Selector Pill Group */}
        <div className="flex flex-wrap items-center gap-1.5">
          {diagramOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedDiagram === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedDiagram(opt.id as DiagramType)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#d4af37] text-[#0b0c10] font-semibold shadow-xs'
                    : 'bg-[#12141c] text-[#94a3b8] border border-[#232634] hover:text-[#ffffff] hover:border-[#38bdf8]/50'
                }`}
              >
                <Icon className={`h-3 w-3 ${isSelected ? 'text-[#0b0c10]' : 'text-[#d4af37]'}`} />
                <span>{opt.label}</span>
                {opt.highlight && !isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Diagram */}
      <div className="transition-all duration-300">
        {selectedDiagram === 'lb' && <LoadBalancerDiagram />}
        {selectedDiagram === 'microservices' && <MicroservicesDiagram />}
        {selectedDiagram === 'caching' && <CachingDiagram />}
        {selectedDiagram === 'database' && <DatabaseDiagram />}
        {selectedDiagram === 'messaging' && <MessagingDiagram />}
        {selectedDiagram === 'system_topology' && <VisualArchitectureDiagram />}
      </div>
    </div>
  );
};
