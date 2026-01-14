import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { EducationItem } from '@/types';
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

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EducationItem | null;
}

interface EducationFormData {
  period: string;
  title: string;
  institution: string;
  description: string;
  displayOrder: number;
}

export function EducationDialog({ open, onOpenChange, item }: EducationDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<EducationFormData>();

  useEffect(() => {
    if (item) {
      reset({
        period: item.period,
        title: item.title,
        institution: item.institution,
        description: item.description || '',
        displayOrder: item.displayOrder,
      });
    } else {
      reset({
        period: '',
        title: '',
        institution: '',
        description: '',
        displayOrder: 0,
      });
    }
  }, [item, reset, open]);

  const mutation = useMutation({
    mutationFn: async (data: EducationFormData) => {
      if (item) return axios.put(`/api/education/${item.id}`, data);
      return axios.post('/api/education', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Formação salva!');
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao salvar formação.'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar Formação' : 'Nova Formação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="period">Período</Label>
            <Input id="period" {...register('period', { required: true })} placeholder="2023 — Presente" />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">Título/Curso</Label>
            <Input id="title" {...register('title', { required: true })} placeholder="Arquitetura e Urbanismo" />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="institution">Instituição</Label>
            <Input id="institution" {...register('institution', { required: true })} placeholder="Universidade Federal" />
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('description')}
              placeholder="Foco em Tecnologia da Construção..."
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
