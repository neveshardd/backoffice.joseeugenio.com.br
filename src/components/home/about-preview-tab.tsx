'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function AboutPreviewTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="home_about_preview" 
        title="Home About Preview" 
        description="Seção de resumo do perfil na home."
        fields={[
            { name: 'label', label: 'Rótulo (Tag)', placeholder: 'O Perfil', type: 'text' },
            { name: 'heading', label: 'Título Grande', placeholder: 'Atemporalidade é minha busca...', type: 'textarea' },
            { name: 'paragraph1', label: 'Parágrafo 1', placeholder: 'Acredito que...', type: 'textarea' },
            { name: 'paragraph2', label: 'Parágrafo 2', placeholder: 'Como estudante...', type: 'textarea' },
            { name: 'ctaText', label: 'Texto do Botão', placeholder: 'Conheça Minha Trajetória', type: 'text' },
            { name: 'ctaLink', label: 'Link do Botão', placeholder: '/sobre', type: 'text' }
        ]}
      />
    </div>
  );
}
