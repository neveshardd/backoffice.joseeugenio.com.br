'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FAQItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { FAQDialog } from '@/components/faq-dialog';
import { toast } from 'sonner';

export function FAQTab() {
  const [selectedItem, setSelectedItem] = useState<FAQItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery<FAQItem[]>({
    queryKey: ['faq'],
    queryFn: async () => {
      const { data } = await axios.get('/api/faq');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => axios.delete(`/api/faq/${id}`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['faq'] });
        toast.success('Pergunta excluída!');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-medium">Perguntas Frequentes</h2>
           <p className="text-sm text-muted-foreground">Gerencie as perguntas da seção FAQ.</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pergunta
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
             <div>Carregando...</div>
        ) : (
            items?.map((item) => (
                <div key={item.id} className="border p-6 rounded-lg bg-card flex justify-between items-start gap-4 group">
                    <div className="flex-1">
                        <h3 className="font-bold mb-2">{item.question}</h3>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
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

      <FAQDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} item={selectedItem} />
    </div>
  );
}
