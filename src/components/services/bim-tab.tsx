'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BIMFeature } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { BIMDialog } from '@/components/bim-dialog';
import { SingletonContentForm } from '@/components/singleton-content-form';
import { toast } from 'sonner';

export function BIMTab() {
  const [selectedFeature, setSelectedFeature] = useState<BIMFeature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: features, isLoading } = useQuery<BIMFeature[]>({
    queryKey: ['bim-features'],
    queryFn: async () => {
      const { data } = await axios.get('/api/bim-features');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => axios.delete(`/api/bim-features/${id}`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bim-features'] });
        toast.success('Diferencial excluído!');
    },
  });

  return (
    <div className="space-y-8">
      <SingletonContentForm 
        sectionKey="bim_intro" 
        title="Introdução BIM" 
        description="Texto introdutório da seção 'Diferencial Técnico'."
        fields={[
            { name: 'section_label', label: 'Etiqueta da Seção', placeholder: 'Diferencial Técnico', type: 'text' },
            { name: 'title', label: 'Título Principal', placeholder: 'Tecnologia BIM', type: 'text' },
            { name: 'description', label: 'Descrição', placeholder: 'Texto explicativo...', type: 'textarea' }
        ]}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-xl font-medium">BIM Features</h2>
            <p className="text-sm text-muted-foreground">Lista de diferenciais técnicos.</p>
            </div>
            <Button onClick={() => { setSelectedFeature(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Diferencial
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
                <div>Carregando...</div>
            ) : (
                features?.map((feature) => (
                    <div key={feature.id} className="border p-6 rounded-lg bg-card group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedFeature(feature); setIsDialogOpen(true); }}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if(confirm('Excluir?')) deleteMutation.mutate(feature.id); }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <h3 className="font-bold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                ))
            )}
        </div>
      </div>

      <BIMDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} feature={selectedFeature} />
    </div>
  );
}
