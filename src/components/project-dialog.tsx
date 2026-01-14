import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Project, GalleryImage } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming simple textarea for now
import { toast } from 'sonner';
import { MediaLibrary } from '@/components/media-library';
import { Image as ImageIcon, X, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

interface ProjectFormData {
  title: string;
  description: string;
  location: string;
  year: string;
  area: string;
  status: string;
  softwares: string;
  credits: string;
  href: string;
  meta: string;
  imageSrc: string;
  imageAlt: string;
  isPlaceholder: boolean;
  placeholderTitle: string;
  placeholderSubtitle: string;
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, setValue } = useForm<ProjectFormData>();
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaLibraryMode, setMediaLibraryMode] = useState<'cover' | 'gallery'>('cover');
  const [activeTab, setActiveTab] = useState<'info' | 'gallery'>('info');
  
  const isPlaceholder = watch('isPlaceholder');
  const imageSrc = watch('imageSrc');

  // Fetch gallery images if project exists
  const { data: galleryImages, isLoading: isLoadingGallery } = useQuery<GalleryImage[]>({
    queryKey: ['gallery', project?.id],
    queryFn: async () => {
      if (!project?.id) return [];
      const { data } = await axios.get(`/api/gallery?projectId=${project.id}`);
      return data;
    },
    enabled: !!project?.id && activeTab === 'gallery',
  });

  useEffect(() => {
    setActiveTab('info'); // Reset tab on open
    if (project) {
        reset({
            title: project.title,
            description: project.description || '',
            location: project.location || '',
            year: project.year || '',
            area: project.area || '',
            status: project.status || '',
            softwares: project.softwares || '',
            credits: project.credits || '',
            href: project.href,
            meta: project.meta,
            imageSrc: project.imageSrc || '',
            imageAlt: project.imageAlt || '',
        });
    } else {
        reset({
            title: '',
            description: '',
            location: '',
            year: '',
            area: '',
            status: '',
            softwares: '',
            credits: '',
            href: '',
            meta: '',
            imageSrc: '',
            imageAlt: '',
        });
    }
  }, [project, reset, open]); // Added open to dependency to ensure reset

  const saveProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      if (project && project.id) {
        return axios.put(`/api/projects/${project.id}`, data);
      } else {
        return axios.post('/api/projects', data);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(project ? 'Projeto atualizado!' : 'Projeto criado!');
      
      // If created new project, optionally we could switch to edit mode, 
      // but for now let's just close as per standard flow.
      // If user wants to add gallery, they reopen it. 
      // Or we can keep it open and set the project? That's complex.
      onOpenChange(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao salvar projeto.');
    },
  });

  const addToGalleryMutation = useMutation({
    mutationFn: async (url: string) => {
      if (!project?.id) return;
      return axios.post('/api/gallery', {
        url,
        caption: '', // Default empty caption
        projectId: project.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', project?.id] });
      toast.success('Imagem adicionada à galeria');
    }
  });

  const deleteFromGalleryMutation = useMutation({
    mutationFn: async (imageId: number) => {
      return axios.delete(`/api/gallery/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', project?.id] });
      toast.success('Imagem removida da galeria');
    }
  });

  const onSelectMedia = (urls: string[]) => {
    if (mediaLibraryMode === 'cover') {
        // For cover, we expect only one, but we handle array just in case taking the first
        if (urls.length > 0) setValue('imageSrc', urls[0]);
    } else {
        // For gallery, add all selected
        urls.forEach(url => addToGalleryMutation.mutate(url));
    }
  };

  const onSubmit = (data: ProjectFormData) => {
    saveProjectMutation.mutate(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{project ? `Editar: ${project.title}` : 'Novo Projeto'}</DialogTitle>
            <p className="text-sm text-muted-foreground hidden">
              Formulário para criar ou editar projetos.
            </p>
          </DialogHeader>

          <div className="flex border-b px-6">
            <button
                onClick={() => setActiveTab('info')}
                className={`mr-4 pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
                Informações Principais
            </button>
            <button
                onClick={() => setActiveTab('gallery')}
                disabled={!project}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'gallery'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                } ${!project ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Galeria do Projeto
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'info' ? (
                <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" {...register('title', { required: true })} placeholder="Ex: Casa Brutalista" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="meta">Meta / Categoria</Label>
                                    <Input id="meta" {...register('meta', { required: true })} placeholder="Ex: Residencial" />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="year">Ano</Label>
                                    <Input id="year" {...register('year')} placeholder="Ex: 2024" />
                                </div>
                            </div>

                            {/* HREF Field Removed as per user request */}

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="description">Descrição do Projeto</Label>
                                <textarea
                                  id="description"
                                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  {...register('description')}
                                  placeholder="Descrição detalhada do projeto..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="location">Localização</Label>
                                    <Input id="location" {...register('location')} placeholder="Ex: São Paulo, SP" />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="area">Área</Label>
                                    <Input id="area" {...register('area')} placeholder="Ex: 450m²" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="status">Status</Label>
                                    <Input id="status" {...register('status')} placeholder="Ex: Em Construção" />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="softwares">Softwares</Label>
                                    <Input id="softwares" {...register('softwares')} placeholder="Ex: Revit, V-Ray, Photoshop" />
                                </div>
                            </div>
                            
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="credits">Ficha Técnica / Créditos</Label>
                                <textarea
                                  id="credits"
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  {...register('credits')}
                                  placeholder="Arquitetos: Fulano, Beltrano..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label>Imagem de Capa (Principal)</Label>
                                <div className="flex flex-col gap-3">
                                    <input type="hidden" {...register('imageSrc')} />
                                    
                                    {imageSrc ? (
                                    <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-muted group">
                                        <Image 
                                        src={imageSrc} 
                                        alt="Capa" 
                                        fill 
                                        className="object-cover" 
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => { setMediaLibraryMode('cover'); setShowMediaLibrary(true); }}
                                            >
                                                Trocar
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => setValue('imageSrc', '')}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    ) : (
                                    <div 
                                        onClick={() => { setMediaLibraryMode('cover'); setShowMediaLibrary(true); }}
                                        className="aspect-video w-full rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                        <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Selecionar Capa</span>
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="imageAlt">Texto Alternativo (Alt)</Label>
                                <Input id="imageAlt" {...register('imageAlt')} placeholder="Descrição da imagem de capa" />
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium">Galeria de Imagens</h3>
                            <p className="text-sm text-muted-foreground">Adicone imagens extras para o modal deste projeto.</p>
                        </div>
                        <Button onClick={() => { setMediaLibraryMode('gallery'); setShowMediaLibrary(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Imagens
                        </Button>
                    </div>

                    {isLoadingGallery ? (
                        <div className="text-center py-12">Carregando galeria...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {galleryImages?.map((img) => (
                                <div key={img.id} className="group relative aspect-square bg-muted rounded-md overflow-hidden border">
                                    <Image 
                                        src={img.url} 
                                        alt={img.caption || 'Galeria'} 
                                        fill 
                                        className="object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button 
                                            variant="destructive" 
                                            size="icon"
                                            onClick={() => deleteFromGalleryMutation.mutate(img.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {galleryImages?.length === 0 && (
                                <div className="col-span-full border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                                    Nenhuma imagem na galeria deste projeto.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
          </div>

          {activeTab === 'info' && (
             <div className="p-6 border-t flex justify-end bg-muted/5">
                <Button type="submit" form="project-form" disabled={saveProjectMutation.isPending}>
                    {saveProjectMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
             </div>
          )}
        </DialogContent>
      </Dialog>
      
      <MediaLibrary 
        open={showMediaLibrary} 
        onOpenChange={setShowMediaLibrary} 
        onSelect={onSelectMedia} 
        multiSelect={mediaLibraryMode === 'gallery'}
        existingUrls={mediaLibraryMode === 'gallery' ? galleryImages?.map(i => i.url) : undefined}
      />
    </>
  );
}
