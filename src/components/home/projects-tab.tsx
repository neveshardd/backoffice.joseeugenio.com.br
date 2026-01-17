'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function ProjectsTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="home_projects" 
        title="Home Projects" 
        description="Textos e configurações da seção de projetos na página inicial."
        fields={[
            { name: 'label', label: 'Rótulo da Seção', placeholder: 'Destaques', type: 'text' },
            { name: 'placeholderTitle', label: 'Título do Card "Ver Mais"', placeholder: 'Explorar Acervo', type: 'text' },
            { name: 'placeholderSubtitle', label: 'Subtítulo do Card "Ver Mais"', placeholder: 'Ver todos os projetos', type: 'text' },
            { name: 'ctaTitle', label: 'Tiítulo Interno (Fundo) do Card', placeholder: 'Portfólio Completo', type: 'text' },
            { name: 'ctaMeta', label: 'Metadados do Card', placeholder: '2023 — 2026', type: 'text' },
            { name: 'ctaLink', label: 'Link do Card', placeholder: '/projetos', type: 'text' },
            { name: 'ctaAlt', label: 'Alt da Imagem do Card', placeholder: 'Ver todos os projetos', type: 'text' }
        ]}
      />
    </div>
  );
}
