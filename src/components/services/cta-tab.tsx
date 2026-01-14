'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function CTATab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="services_cta" 
        title="Call to Action (Rodapé)" 
        description="Seção de chamada para ação no final da página."
        fields={[
            { name: 'title', label: 'Título', placeholder: 'Pronto para iniciar seu projeto?', type: 'text' },
            { name: 'description', label: 'Descrição', placeholder: 'Entre em contato...', type: 'textarea' },
            { name: 'buttonText', label: 'Texto do Botão', placeholder: 'Solicitar Orçamento', type: 'text' },
            { name: 'buttonLink', label: 'Link do Botão', placeholder: '/contato', type: 'text' }
        ]}
      />
    </div>
  );
}
