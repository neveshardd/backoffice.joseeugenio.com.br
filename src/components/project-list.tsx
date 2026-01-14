'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { ProjectDialog } from '@/components/project-dialog';
import { Trash2, Pencil, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProjectList() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await axios.get('/api/projects');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto deletado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar projeto.');
    },
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Projetos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu portfólio.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <div key={project.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow relative group">
            <div className="relative aspect-video bg-muted border-b">
                {project.imageSrc ? (
                    <img 
                        src={project.imageSrc} 
                        alt={project.imageAlt || project.title} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Sem imagem
                    </div>
                )}
                
                <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(project)}>
                                <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="p-6">
               <h3 className="text-xl font-medium mb-1 truncate" title={project.title}>{project.title}</h3>
               <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">{project.meta}</p>
               
               {project.description && (
                   <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
               )}
            </div>
          </div>
        ))}
        {projects?.length === 0 && (
            <div className="col-span-full text-center py-20 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Nenhum projeto encontrado.</p>
                <Button variant="outline" onClick={handleCreate}>Criar Primeiro Projeto</Button>
            </div>
        )}
      </div>

      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        project={selectedProject}
      />
    </div>
  );
}
