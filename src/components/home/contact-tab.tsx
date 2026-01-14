'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function ContactTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="home_contact" 
        title="Home Contact" 
        description="Seção de contato/call to action na home."
        fields={[
            { name: 'label', label: 'Rótulo (Tag)', placeholder: 'Disponibilidade', type: 'text' },
            { name: 'title', label: 'Título Grande', placeholder: 'Vamos criar algo único?', type: 'textarea' },
            { name: 'description', label: 'Descrição', placeholder: 'Estou disponível para...', type: 'textarea' },
            { name: 'primaryCtaText', label: 'Texto Botão Principal', placeholder: 'Iniciar Conversa', type: 'text' },
            { name: 'primaryCtaLink', label: 'Link Botão Principal', placeholder: '/contato', type: 'text' },
            { name: 'secondaryCtaText', label: 'Texto Botão Secundário', placeholder: 'Enviar E-mail', type: 'text' },
            { name: 'secondaryCtaLink', label: 'Link Botão Secundário', placeholder: 'mailto:contact@joseeugenio.com.br', type: 'text' }
        ]}
      />
    </div>
  );
}
