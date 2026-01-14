'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { WorkProcessStep } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { WorkProcessDialog } from '@/components/work-process-dialog';
import { toast } from 'sonner';

export function WorkProcessTab() {
  const [selectedStep, setSelectedStep] = useState<WorkProcessStep | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: steps, isLoading } = useQuery<WorkProcessStep[]>({
    queryKey: ['work-process'],
    queryFn: async () => {
      const { data } = await axios.get('/api/work-process');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => axios.delete(`/api/work-process/${id}`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['work-process'] });
        toast.success('Etapa excluída!');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-medium">Processo de Trabalho</h2>
           <p className="text-sm text-muted-foreground">Etapas exibidas na seção "Etapas do Processo".</p>
        </div>
        <Button onClick={() => { setSelectedStep(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Etapa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
             <div>Carregando...</div>
        ) : (
            steps?.map((step) => (
                <div key={step.id} className="border p-6 rounded-lg bg-card relative group hover:border-foreground/50 transition-colors">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedStep(step); setIsDialogOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if(confirm('Excluir?')) deleteMutation.mutate(step.id); }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <span className="text-4xl font-bold text-border block mb-4">{step.num}</span>
                    <h3 className="font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
            ))
        )}
      </div>

      <WorkProcessDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} step={selectedStep} />
    </div>
  );
}
