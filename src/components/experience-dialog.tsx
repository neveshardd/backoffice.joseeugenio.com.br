import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ExperienceItem } from '@/types';
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

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ExperienceItem | null;
}

interface ExperienceFormData {
  period: string;
  title: string;
  company: string;
  description: string;
  displayOrder: number;
}

export function ExperienceDialog({ open, onOpenChange, item }: ExperienceDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ExperienceFormData>();

  useEffect(() => {
    if (item) {
      reset({
        period: item.period,
        title: item.title,
        company: item.company,
        description: item.description,
        displayOrder: item.displayOrder,
      });
    } else {
      reset({
        period: '',
        title: '',
        company: '',
        description: '',
        displayOrder: 0,
      });
    }
  }, [item, reset, open]);

  const mutation = useMutation({
    mutationFn: async (data: ExperienceFormData) => {
      if (item) return axios.put(`/api/experience/${item.id}`, data);
      return axios.post('/api/experience', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('Experiência salva!');
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao salvar experiência.'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar Experiência' : 'Nova Experiência'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="period">Período</Label>
            <Input id="period" {...register('period', { required: true })} placeholder="2024 — Presente" />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">Cargo/Título</Label>
            <Input id="title" {...register('title', { required: true })} placeholder="Estagiário de Projetos" />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" {...register('company', { required: true })} placeholder="Silva & Associados" />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('description')}
              placeholder="Desenvolvimento de projetos executivos..."
            />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="displayOrder">Ordem de Exibição</Label>
            <Input id="displayOrder" type="number" {...register('displayOrder', { valueAsNumber: true })} placeholder="0" />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
