import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { WorkProcessStep } from '@/types';
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

interface WorkProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: WorkProcessStep | null;
}

interface StepFormData {
  num: string;
  title: string;
  description: string;
}

export function WorkProcessDialog({ open, onOpenChange, step }: WorkProcessDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<StepFormData>();

  useEffect(() => {
    if (step) {
      reset({
        num: step.num,
        title: step.title,
        description: step.description,
      });
    } else {
      reset({
        num: '',
        title: '',
        description: '',
      });
    }
  }, [step, reset, open]);

  const mutation = useMutation({
    mutationFn: async (data: StepFormData) => {
      if (step) {
        return axios.put(`/api/work-process/${step.id}`, data);
      } else {
        return axios.post('/api/work-process', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-process'] });
      toast.success(step ? 'Etapa atualizada!' : 'Etapa criada!');
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao salvar etapa.'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{step ? 'Editar Etapa' : 'Nova Etapa'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="num">Número (Ex: 01)</Label>
            <Input id="num" {...register('num', { required: true })} placeholder="01" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register('title', { required: true })} placeholder="Briefing & Diagnóstico" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('description', { required: true })}
              placeholder="Descrição da etapa..."
            />
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
