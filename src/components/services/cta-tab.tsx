'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function CTATab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="services_cta" 
        title="Services Call to Action" 
        description="Seção de encerramento da página de serviços."
        fields={[
            { name: 'title', label: 'Título Grande', placeholder: 'Pronto para materializar sua ideia?', type: 'text' },
            { name: 'description', label: 'Descrição', placeholder: 'Seja para um projeto completo...', type: 'textarea' },
            { name: 'buttonText', label: 'Texto do Botão', placeholder: 'Solicitar Orçamento', type: 'text' },
            { name: 'buttonLink', label: 'Link do Botão', placeholder: '/contato', type: 'text' }
        ]}
      />
    </div>
  );
}
