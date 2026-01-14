'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ExperienceItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ExperienceDialog } from '@/components/experience-dialog';
import { toast } from 'sonner';

export function ExperienceTab() {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery<ExperienceItem[]>({
    queryKey: ['experience'],
    queryFn: async () => {
      const { data } = await axios.get('/api/experience');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => axios.delete(`/api/experience/${id}`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['experience'] });
        toast.success('Experiência excluída!');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-medium">Experiência Profissional</h2>
           <p className="text-sm text-muted-foreground">Gerencie seu histórico profissional.</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Experiência
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
             <div>Carregando...</div>
        ) : (
            items?.map((item) => (
                <div key={item.id} className="border p-6 rounded-lg bg-card flex justify-between items-start gap-4 group hover:border-foreground/50 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-muted-foreground">{item.displayOrder}</span>
                            <span className="text-xs text-muted-foreground">{item.period}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground mb-2">{item.company}</p>
                        {item.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsDialogOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if(confirm('Excluir?')) deleteMutation.mutate(item.id); }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))
        )}
      </div>

      <ExperienceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} item={selectedItem} />
    </div>
  );
}
