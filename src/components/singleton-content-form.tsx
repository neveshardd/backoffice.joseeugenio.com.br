'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea';
  placeholder?: string;
}

interface SingletonContentFormProps {
  sectionKey: string;
  title: string;
  description: string;
  fields: FieldConfig[];
}

export function SingletonContentForm({ sectionKey, title, description, fields }: SingletonContentFormProps) {
  const { register, handleSubmit, reset, setValue } = useForm();
  
  const { data, isLoading } = useQuery({
    queryKey: ['page-content', sectionKey],
    queryFn: async () => {
      const { data } = await axios.get(`/api/page-content?key=${sectionKey}`);
      return data.content || {}; // Return empty obj if no content
    },
  });

  useEffect(() => {
    if (data) {
      fields.forEach(field => {
        setValue(field.name, data[field.name] || '');
      });
    }
  }, [data, fields, setValue]);

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      return axios.post('/api/page-content', { key: sectionKey, content: formData });
    },
    onSuccess: () => {
      toast.success('Conteúdo salvo com sucesso!');
    },
    onError: () => toast.error('Erro ao salvar conteúdo.'),
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6 mb-8">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 max-w-2xl">
        {fields.map((field) => (
          <div key={field.name} className="grid w-full gap-1.5">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === 'textarea' ? (
                <textarea
                    id={field.name}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...register(field.name)}
                    placeholder={field.placeholder}
                />
            ) : (
                <Input id={field.name} {...register(field.name)} placeholder={field.placeholder} />
            )}
          </div>
        ))}
        <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : 'Salvar Conteúdo'}
            </Button>
        </div>
      </form>
    </div>
  );
}
