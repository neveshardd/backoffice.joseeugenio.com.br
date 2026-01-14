'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function HeroTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="services_hero" 
        title="Hero / Cabeçalho" 
        description="Conteúdo principal do topo da página de serviços."
        fields={[
            { name: 'title', label: 'Título Principal (Suporta HTML <br/>)', placeholder: 'Excelência Técnica <br/> & Precisão BIM', type: 'text' },
            { name: 'description', label: 'Descrição', placeholder: 'Transformando necessidades...', type: 'textarea' },
            { name: 'buttonText', label: 'Texto do Botão', placeholder: 'Solicitar Proposta', type: 'text' },
            { name: 'buttonLink', label: 'Link do Botão', placeholder: '/contato', type: 'text' }
        ]}
      />
    </div>
  );
}
