import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TechStackItem } from '@/types';
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
import { Image as ImageIcon, Upload } from 'lucide-react';
import { MediaLibrary } from './media-library';

interface TechStackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TechStackItem | null;
}

interface TechStackFormData {
  category: string;
  categoryNumber: string;
  categoryTitle: string;
  categoryQuote: string;
  toolName: string;
  toolIcon: string;
  toolDescription: string;
  displayOrder: number;
}

export function TechStackDialog({ open, onOpenChange, item }: TechStackDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm<TechStackFormData>();
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const selectedIcon = watch('toolIcon');

  useEffect(() => {
    if (item) {
      reset({
        category: item.category,
        categoryNumber: item.categoryNumber,
        categoryTitle: item.categoryTitle,
        categoryQuote: item.categoryQuote,
        toolName: item.toolName,
        toolIcon: item.toolIcon,
        toolDescription: item.toolDescription,
        displayOrder: item.displayOrder,
      });
    } else {
      reset({
        category: '',
        categoryNumber: '',
        categoryTitle: '',
        categoryQuote: '',
        toolName: '',
        toolIcon: '',
        toolDescription: '',
        displayOrder: 0,
      });
    }
  }, [item, reset, open]);

  const mutation = useMutation({
    mutationFn: async (data: TechStackFormData) => {
      if (item) return axios.put(`/api/tech-stack/${item.id}`, data);
      return axios.post('/api/tech-stack', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tech-stack'] });
      toast.success('Ferramenta salva!');
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao salvar ferramenta.'),
  });

  const handleMediaSelect = (urls: string[]) => {
      if (urls.length > 0) {
          setValue('toolIcon', urls[0]);
      }
      setIsMediaLibraryOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{item ? 'Editar Ferramenta' : 'Nova Ferramenta'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="category">Categoria (bim/render/post)</Label>
                <Input id="category" {...register('category', { required: true })} placeholder="bim" />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="categoryNumber">Número da Categoria</Label>
                <Input id="categoryNumber" {...register('categoryNumber', { required: true })} placeholder="01" />
              </div>
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="categoryTitle">Título da Categoria (Suporta HTML)</Label>
              <Input id="categoryTitle" {...register('categoryTitle', { required: true })} placeholder="BIM &<br/>Modelagem" />
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="categoryQuote">Citação da Categoria</Label>
              <textarea
                id="categoryQuote"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('categoryQuote')}
                placeholder="O BIM é o alicerce digital..."
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Informações da Ferramenta</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="toolName">Nome da Ferramenta</Label>
                        <Input id="toolName" {...register('toolName', { required: true })} placeholder="Revit" />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="toolDescription">Descrição da Ferramenta</Label>
                        <Input id="toolDescription" {...register('toolDescription', { required: true })} placeholder="Coordenação Técnica" />
                    </div>
                </div>

                <div className="grid w-full gap-4">
                    <Label>Logo da Ferramenta</Label>
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square w-32 relative border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {selectedIcon ? (
                                <img 
                                    src={selectedIcon.startsWith('/') ? `${process.env.NEXT_PUBLIC_BACKOFFICE_URL || 'http://localhost:4000'}${selectedIcon}` : selectedIcon} 
                                    alt="Preview" 
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <ImageIcon className="h-10 w-10 text-muted-foreground opacity-20" />
                            )}
                        </div>
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="w-32"
                            onClick={() => setIsMediaLibraryOpen(true)}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {selectedIcon ? 'Alterar' : 'Upload'}
                        </Button>
                        <input type="hidden" {...register('toolIcon', { required: true })} />
                    </div>
                </div>
              </div>
              
              <div className="grid w-full gap-1.5 mt-4">
                <Label htmlFor="displayOrder">Ordem de Exibição</Label>
                <Input id="displayOrder" type="number" {...register('displayOrder', { valueAsNumber: true })} placeholder="0" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <MediaLibrary 
        open={isMediaLibraryOpen} 
        onOpenChange={setIsMediaLibraryOpen} 
        onSelect={handleMediaSelect}
      />
    </>
  );
}
