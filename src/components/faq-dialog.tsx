import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FAQItem } from '@/types';
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

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FAQItem | null;
}

interface FAQFormData {
  question: string;
  answer: string;
}

export function FAQDialog({ open, onOpenChange, item }: FAQDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FAQFormData>();

  useEffect(() => {
    if (item) {
      reset({ question: item.question, answer: item.answer });
    } else {
      reset({ question: '', answer: '' });
    }
  }, [item, reset, open]);

  const mutation = useMutation({
    mutationFn: async (data: FAQFormData) => {
      if (item) return axios.put(`/api/faq/${item.id}`, data);
      return axios.post('/api/faq', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast.success(item ? 'FAQ atualizado!' : 'FAQ criado!');
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao salvar FAQ.'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar Pergunta' : 'Nova Pergunta'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="question">Pergunta</Label>
            <Input id="question" {...register('question', { required: true })} placeholder="Ex: Como funciona?" />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="answer">Resposta</Label>
            <textarea
              id="answer"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('answer', { required: true })}
              placeholder="Resposta detalhada..."
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
