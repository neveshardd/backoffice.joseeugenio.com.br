import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BIMFeature } from '@/types';
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

interface BIMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: BIMFeature | null;
}

interface BIMFormData {
  title: string;
  description: string;
}

export function BIMDialog({ open, onOpenChange, feature }: BIMDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<BIMFormData>();

  useEffect(() => {
    if (feature) {
      reset({ title: feature.title, description: feature.description });
    } else {
      reset({ title: '', description: '' });
    }
  }, [feature, reset, open]);

  const mutation = useMutation({
    mutationFn: async (data: BIMFormData) => {
      if (feature) return axios.put(`/api/bim-features/${feature.id}`, data);
      return axios.post('/api/bim-features', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bim-features'] });
      toast.success('Diferencial atualizado!');
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao salvar diferencial.'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{feature ? 'Editar Diferencial' : 'Novo Diferencial'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register('title', { required: true })} placeholder="Ex: Quantitativos Precisos" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('description', { required: true })}
              placeholder="Descrição do diferencial..."
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
