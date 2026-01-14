'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function ManifestoTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="about_manifesto" 
        title="Manifesto / Abordagem" 
        description="Texto sobre a abordagem e filosofia."
        fields={[
            { name: 'sectionLabel', label: 'Etiqueta da Seção', placeholder: 'Abordagem', type: 'text' },
            { name: 'title', label: 'Título (Suporta HTML <br/>)', placeholder: 'Minimalismo com<br/>Propósito Humano.', type: 'text' },
            { name: 'paragraph1', label: 'Parágrafo 1', placeholder: 'Atualmente cursando...', type: 'textarea' },
            { name: 'paragraph2', label: 'Parágrafo 2', placeholder: 'Acredito que ferramentas...', type: 'textarea' }
        ]}
      />
    </div>
  );
}
