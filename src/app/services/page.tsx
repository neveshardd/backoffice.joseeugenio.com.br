'use client';

import { useState } from 'react';
import { CatalogTab } from '@/components/services/catalog-tab';
import { WorkProcessTab } from '@/components/services/work-process-tab';
import { FAQTab } from '@/components/services/faq-tab';
import { BIMTab } from '@/components/services/bim-tab';
import { HeroTab } from '@/components/services/hero-tab';
import { CTATab } from '@/components/services/cta-tab';
import { cn } from '@/lib/utils';

type Tab = 'hero' | 'catalog' | 'process' | 'bim' | 'faq' | 'cta';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hero', label: 'Hero / Topo' },
    { id: 'catalog', label: 'Catálogo de Serviços' },
    { id: 'process', label: 'Processo' },
    { id: 'bim', label: 'BIM & Diferenciais' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'CTA / Rodapé' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight mb-2">Página de Serviços</h1>
        <p className="text-muted-foreground">Gerencie todo o conteúdo da página de serviços.</p>
      </div>

      <div className="flex border-b mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'hero' && <HeroTab />}
        {activeTab === 'catalog' && <CatalogTab />}
        {activeTab === 'process' && <WorkProcessTab />}
        {activeTab === 'bim' && <BIMTab />}
        {activeTab === 'faq' && <FAQTab />}
        {activeTab === 'cta' && <CTATab />}
      </div>
    </div>
  );
}
