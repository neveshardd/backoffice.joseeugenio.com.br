'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ServiceDialog } from '@/components/service-dialog';
import { toast } from 'sonner';

export function CatalogTab() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await axios.get('/api/services');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`/api/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Serviço excluído com sucesso');
    },
  });

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-medium">Catálogo de Serviços</h2>
           <p className="text-sm text-muted-foreground">Estes são os cards principais da página de serviços.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Carregando serviços...
          </div>
        ) : services?.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado.</p>
            <Button variant="outline" onClick={handleCreate}>Criar Primeiro Serviço</Button>
          </div>
        ) : (
          services?.map((service) => (
            <div key={service.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(service)}>
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-4">
                  {/* Simplification: Just showing first char of Icon name or S */}
                  {service.icon ? service.icon.substring(0,2) : 'S'}
                </div>
                <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {service.description}
                </p>
              </div>
              
              <div className="pt-4 border-t text-xs text-muted-foreground">
                {service.tags}
              </div>
            </div>
          ))
        )}
      </div>

      <ServiceDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        service={selectedService} 
      />
    </div>
  );
}
