import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Service } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

interface ServiceFormData {
  title: string;
  description: string;
  tags: string;
  icon: string;
}

export function ServiceDialog({ open, onOpenChange, service }: ServiceDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ServiceFormData>();

  useEffect(() => {
    if (service) {
      reset({
        title: service.title,
        description: service.description,
        tags: service.tags,
        icon: service.icon,
      });
    } else {
      reset({
        title: '',
        description: '',
        tags: '',
        icon: '',
      });
    }
  }, [service, reset, open]);

  const saveServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      if (service) {
        return axios.put(`/api/services/${service.id}`, data);
      } else {
        return axios.post('/api/services', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(service ? 'Serviço atualizado!' : 'Serviço criado!');
      onOpenChange(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao salvar serviço.');
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    saveServiceMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{service ? `Editar: ${service.title}` : 'Novo Serviço'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register('title', { required: true })} placeholder="Ex: Projeto Arquitetônico" />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('description', { required: true })}
              placeholder="Descrição do serviço..."
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="tags">Tags (separadas por •)</Label>
            <Input id="tags" {...register('tags')} placeholder="Residencial • Comercial" />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="icon">Ícone (Nome da React Icon - Fa..)</Label>
            <Input id="icon" {...register('icon')} placeholder="Ex: FaDraftingCompass" />
            <p className="text-xs text-muted-foreground">
              Use nomes de ícones da biblioteca FontAwesome (Fa...)
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saveServiceMutation.isPending}>
              {saveServiceMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
