'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GalleryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Upload,  Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (urls: string[]) => void;
  multiSelect?: boolean;
  existingUrls?: string[];
}

export function MediaLibrary({ open, onOpenChange, onSelect, multiSelect = false, existingUrls = [] }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const queryClient = useQueryClient();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Biblioteca de Mídia</DialogTitle>
        </DialogHeader>
        
        <div className="flex border-b px-6">
          <button
            onClick={() => setActiveTab('library')}
            className={`mr-4 pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'library' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Biblioteca
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'upload' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Upload
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-6 bg-muted/10">
          {activeTab === 'library' ? (
            <MediaGrid 
                onSelect={(urls) => { onSelect(urls); if (!multiSelect) onOpenChange(false); }} 
                multiSelect={multiSelect}
                existingUrls={existingUrls}
            />
          ) : (
            <UploadView onSuccess={() => setActiveTab('library')} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MediaGrid({ onSelect, multiSelect, existingUrls = [] }: { onSelect: (urls: string[]) => void, multiSelect: boolean, existingUrls?: string[] }) {
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['media'],
    queryFn: async () => {
      const { data } = await axios.get('/api/media');
      return data;
    },
  });

  const handleImageClick = (url: string) => {
    if (existingUrls.includes(url)) return; // Prevent selecting already added images

    if (multiSelect) {
        setSelectedUrls(prev => 
            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
        );
    } else {
        onSelect([url]);
    }
  };

  const handleConfirmSelection = () => {
      onSelect(selectedUrls);
      setSelectedUrls([]);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
        <p>Nenhuma imagem encontrada</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
        {multiSelect && (
            <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                    {selectedUrls.length} selecionada(s)
                </span>
                <Button 
                    size="sm" 
                    disabled={selectedUrls.length === 0}
                    onClick={handleConfirmSelection}
                >
                    Adicionar Selecionadas
                </Button>
            </div>
        )}
        <div className="flex-1 overflow-y-auto pb-4 pr-2">
            <div className="columns-2 md:columns-4 lg:columns-5 gap-4 space-y-4">
            {images.map((image) => {
                const isSelected = selectedUrls.includes(image.url);
                const isAlreadyInProject = existingUrls.includes(image.url);
                
                return (
                    <div 
                        key={image.id} 
                        className={`group relative break-inside-avoid bg-background border rounded-md overflow-hidden transition-all ${
                            isAlreadyInProject 
                            ? 'opacity-60 cursor-not-allowed border-muted-foreground/30' 
                            : isSelected 
                                ? 'ring-4 ring-primary border-transparent cursor-pointer' 
                                : 'hover:ring-2 hover:ring-primary/50 hover:border-transparent cursor-pointer'
                        }`}
                        onClick={() => handleImageClick(image.url)}
                    >
                        <div className="relative w-full">
                            <Image 
                                src={image.url} 
                                alt={image.caption || 'Media'}
                                width={500}
                                height={500}
                                className={`w-full h-auto object-contain ${isAlreadyInProject ? 'grayscale' : ''}`}
                                sizes="(max-width: 768px) 50vw, 20vw"
                                unoptimized
                            />
                        </div>
                        
                        {(isSelected || (!multiSelect && !isAlreadyInProject)) && (
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                                <Check className="text-white h-8 w-8 drop-shadow-md" />
                            </div>
                        )}

                        {isAlreadyInProject && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <span className="bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm backdrop-blur-sm">
                                    Adicionado
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
            </div>
        </div>
    </div>
  );
}

function UploadView({ onSuccess }: { onSuccess: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      await Promise.all(
        files.map(file => {
          const formData = new FormData();
          formData.append('file', file);
          return mutation.mutateAsync(formData);
        })
      );
      
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success(`${files.length} imagem(ns) enviada(s) com sucesso!`);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto space-y-6">
      <div 
        className="w-full aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {files.length > 0 ? (
          <div className="text-center p-6 bg-muted/20 w-full h-full flex flex-col items-center justify-center">
             <ImageIcon className="h-10 w-10 mx-auto mb-2 text-primary" />
             <p className="font-medium text-lg">{files.length} Arquivo(s) Selecionado(s)</p>
             <p className="text-xs text-muted-foreground mt-1">Clique para alterar a seleção</p>
          </div>
        ) : (
          <div className="text-center p-6">
            <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WEBP</p>
          </div>
        )}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
          multiple 
        />
      </div>

      <div className="w-full text-center text-sm text-muted-foreground">
         {files.length > 0 && (
            <p>Pronto para enviar {files.length} imagens.</p>
         )}
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={files.length === 0 || uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando {files.length} imagens...
          </>
        ) : (
          'Fazer Upload'
        )}
      </Button>
    </div>
  );
}
