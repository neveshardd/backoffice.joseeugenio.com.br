'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function HeroTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="services_hero" 
        title="Services Hero" 
        description="Título e descrição para o topo da página de serviços."
        fields={[
            { name: 'title', label: 'Título (Suporta HTML)', placeholder: 'Soluções em<br/>Arquitetura Digital', type: 'text' },
            { name: 'description', label: 'Descrição', placeholder: 'Trabalho na intersecção...', type: 'textarea' },
            { name: 'buttonText', label: 'Texto do Botão', placeholder: 'Solicitar Proposta', type: 'text' },
            { name: 'buttonLink', label: 'Link do Botão', placeholder: '/contato', type: 'text' }
        ]}
      />
    </div>
  );
}
