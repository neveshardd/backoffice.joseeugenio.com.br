'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TechStackItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { TechStackDialog } from '@/components/tech-stack-dialog';
import { toast } from 'sonner';

export function TechStackTab() {
  const [selectedItem, setSelectedItem] = useState<TechStackItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery<TechStackItem[]>({
    queryKey: ['tech-stack'],
    queryFn: async () => {
      const { data } = await axios.get('/api/tech-stack');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => axios.delete(`/api/tech-stack/${id}`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tech-stack'] });
        toast.success('Ferramenta excluída!');
    },
  });

  // Group by category
  const groupedItems = items?.reduce((acc: any, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-medium">Tech Stack / Ferramentas</h2>
           <p className="text-sm text-muted-foreground">Gerencie as ferramentas e tecnologias por categoria.</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ferramenta
        </Button>
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems || {}).map(([category, categoryItems]: [string, any]) => (
            <div key={category} className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-medium mb-4 capitalize">
                Categoria: {category}
                <span className="text-sm text-muted-foreground ml-2">
                  ({categoryItems[0]?.categoryTitle?.replace(/<br\/?>/g, ' ')})
                </span>
              </h3>
              
              <div className="space-y-3">
                {categoryItems.map((item: TechStackItem) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">{item.displayOrder}</span>
                        <div>
                          <h4 className="font-medium">{item.toolName}</h4>
                          <p className="text-sm text-muted-foreground">{item.toolDescription}</p>
                          <p className="text-xs text-muted-foreground mt-1">Ícone: {item.toolIcon}</p>
                        </div>
                      </div>
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
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TechStackDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} item={selectedItem} />
    </div>
  );
}
