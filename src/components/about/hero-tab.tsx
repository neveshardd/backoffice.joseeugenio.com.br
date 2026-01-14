'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function HeroTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="about_hero" 
        title="Hero / Cabeçalho" 
        description="Informações principais do perfil."
        fields={[
            { name: 'name', label: 'Nome', placeholder: 'José Eugênio', type: 'text' },
            { name: 'subtitle', label: 'Subtítulo', placeholder: 'Estudante de Arquitetura & BIM Specialist', type: 'text' },
            { name: 'quote', label: 'Citação', placeholder: '"A arquitetura não é sobre..."', type: 'textarea' },
            { name: 'imageUrl', label: 'URL da Imagem (Retrato)', placeholder: '/images/portrait.jpg', type: 'text' }
        ]}
      />
    </div>
  );
}
