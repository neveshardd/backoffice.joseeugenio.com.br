'use client';

import { useState } from 'react';
import { HeroTab } from '@/components/about/hero-tab';
import { ManifestoTab } from '@/components/about/manifesto-tab';
import { TechStackTab } from '@/components/about/techstack-tab';
import { ExperienceTab } from '@/components/about/experience-tab';
import { EducationTab } from '@/components/about/education-tab';
import { cn } from '@/lib/utils';

type Tab = 'hero' | 'manifesto' | 'techstack' | 'experience' | 'education';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hero');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hero', label: 'Hero / Topo' },
    { id: 'manifesto', label: 'Manifesto' },
    { id: 'techstack', label: 'Tech Stack' },
    { id: 'experience', label: 'Experiência' },
    { id: 'education', label: 'Formação' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight mb-2">Página Sobre / Perfil</h1>
        <p className="text-muted-foreground">Gerencie todo o conteúdo da página sobre.</p>
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
        {activeTab === 'manifesto' && <ManifestoTab />}
        {activeTab === 'techstack' && <TechStackTab />}
        {activeTab === 'experience' && <ExperienceTab />}
        {activeTab === 'education' && <EducationTab />}
      </div>
    </div>
  );
}
