'use client';

import { SingletonContentForm } from '@/components/singleton-content-form';

export function BIMIntroTab() {
  return (
    <div className="space-y-6">
      <SingletonContentForm 
        sectionKey="bim_intro" 
        title="BIM Methodology Intro" 
        description="Título e descrição da seção de metodologia BIM."
        fields={[
            { name: 'section_label', label: 'Rótulo da Seção', placeholder: 'Diferencial Técnico', type: 'text' },
            { name: 'title', label: 'Título da Seção', placeholder: 'A Metodologia BIM como Pilar', type: 'text' },
            { name: 'description', label: 'Descrição da Seção', placeholder: 'Minha abordagem não é apenas visual...', type: 'textarea' }
        ]}
      />
    </div>
  );
}
