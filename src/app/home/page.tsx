'use client';

import { useState } from 'react';
import { HeroTab } from '@/components/home/hero-tab';
import { AboutPreviewTab } from '@/components/home/about-preview-tab';
import { ContactTab } from '@/components/home/contact-tab';
import { cn } from '@/lib/utils';

type Tab = 'hero' | 'about' | 'contact';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('hero');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hero', label: 'Hero / Banner' },
    { id: 'about', label: 'Chamada Sobre' },
    { id: 'contact', label: 'Chamada Contato' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight mb-2">Página Inicial</h1>
        <p className="text-muted-foreground">Gerencie o conteúdo modular da home.</p>
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
        {activeTab === 'about' && <AboutPreviewTab />}
        {activeTab === 'contact' && <ContactTab />}
      </div>
    </div>
  );
}
