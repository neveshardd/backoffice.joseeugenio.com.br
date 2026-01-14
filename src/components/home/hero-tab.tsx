'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function HeroTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="home_hero" 
        title="Home Hero" 
        description="Título e subtítulo principal da página inicial."
        fields={[
            { name: 'title', label: 'Título', placeholder: 'Arquitetura do Silêncio', type: 'text' },
            { name: 'subtitle', label: 'Subtítulo', placeholder: 'Moldando o vazio. Esculpindo a luz.', type: 'textarea' },
            { name: 'ctaText', label: 'Texto do Botão', placeholder: 'Ver Portfólio', type: 'text' },
            { name: 'ctaLink', label: 'Link do Botão', placeholder: '/projetos', type: 'text' },
            { name: 'imageSrc', label: 'URL da Imagem de Fundo', placeholder: '/hero.jpg', type: 'text' }
        ]}
      />
    </div>
  );
}
