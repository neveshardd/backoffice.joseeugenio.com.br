'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Table as TableIcon, 
  Database as DatabaseIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  Filter,
  RefreshCcw,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnMetadata {
  name: string;
  type: string;
  pk: number;
}

interface TableSchema {
  name: string;
  columns: ColumnMetadata[];
}

export default function DatabasePage() {
  const queryClient = useQueryClient();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all tables
  const { data: schemas, isLoading: isLoadingSchemas } = useQuery<TableSchema[]>({
    queryKey: ['db-schemas'],
    queryFn: async () => {
      const { data } = await axios.get('/api/db/tables');
      if (data.length > 0 && !selectedTable) setSelectedTable(data[0].name);
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache schema for 5 minutes
  });

  // Fetch data for selected table
  const { data: tableData, isLoading: isLoadingData, isFetching: isFetchingData, refetch } = useQuery({
    queryKey: ['db-data', selectedTable],
    queryFn: async () => {
      if (!selectedTable) return [];
      const { data } = await axios.get(`/api/db/data/${selectedTable}`);
      return data;
    },
    enabled: !!selectedTable,
    staleTime: 1000 * 10, // Data is fresh for 10 seconds
  });

  const activeSchema = schemas?.find(s => s.name === selectedTable);

  const deleteMutation = useMutation({
    mutationFn: async (id: any) => axios.delete(`/api/db/data/${selectedTable}?id=${id}`),
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['db-data', selectedTable] });
      const previousData = queryClient.getQueryData(['db-data', selectedTable]);
      queryClient.setQueryData(['db-data', selectedTable], (old: any) => 
        old?.filter((item: any) => item.id !== id)
      );
      return { previousData };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['db-data', selectedTable], context?.previousData);
      toast.error('Erro ao remover registro');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['db-data', selectedTable] });
    },
    onSuccess: () => {
      toast.success('Registro removido');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (editingRow) {
        return axios.put(`/api/db/data/${selectedTable}?id=${editingRow.id}`, formData);
      }
      return axios.post(`/api/db/data/${selectedTable}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['db-data', selectedTable] });
      toast.success('Salvo com sucesso');
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Erro ao salvar'),
  });

  const deferredSearch = useDeferredValue(searchTerm);

  const filteredData = useMemo(() => {
    if (!tableData) return [];
    if (!deferredSearch) return tableData;
    const lowerSearch = deferredSearch.toLowerCase();
    return tableData.filter((row: any) => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [tableData, deferredSearch]);

  const handleOpenEdit = (row: any) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingRow(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex h-full overflow-hidden">
        {/* Sidebar - Table List */}
        <div className="w-64 shrink-0 border-r bg-muted/20 flex flex-col">
          <div className="p-4 border-b bg-muted/30">
            <h2 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <DatabaseIcon className="w-3 h-3" />
              Tabelas
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoadingSchemas ? (
               <div className="p-4 text-sm text-muted-foreground">Carregando...</div>
            ) : (
              schemas?.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedTable(s.name)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    selectedTable === s.name 
                      ? "bg-foreground text-background font-medium" 
                      : "hover:bg-muted"
                  )}
                >
                  <TableIcon className="w-4 h-4 opacity-50 shrink-0" />
                  <span className="truncate">{s.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Toolbar */}
          <div className="p-4 border-b flex items-center justify-between bg-card">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar registros..." 
                  className="pl-9 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => refetch()}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-4">
                {filteredData.length} registros
              </span>
              <Button size="sm" onClick={handleOpenAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Registro
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-auto relative">
            {/* Background loading indicator */}
            {isFetchingData && !isLoadingData && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-foreground/20 overflow-hidden z-20">
                <div className="h-full bg-foreground animate-progress origin-left"></div>
              </div>
            )}

            {isLoadingData ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCcw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : selectedTable ? (
               <Table>
                 <TableHeader className="sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
                   <TableRow>
                     {activeSchema?.columns.map(col => (
                       <TableHead key={col.name} className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">
                         <div className="flex flex-col">
                           <span>{col.name}</span>
                           <span className="text-[10px] opacity-40 uppercase font-mono">{col.type}</span>
                         </div>
                       </TableHead>
                     ))}
                     <TableHead className="w-[50px] sticky right-0 bg-secondary/80"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={activeSchema?.columns.length || 1} className="h-32 text-center text-muted-foreground italic">
                          Nenhum registro encontrado nesta tabela.
                        </TableCell>
                      </TableRow>
                   ) : (
                     filteredData.map((row: any, i: number) => (
                       <TableRow key={i} className="hover:bg-muted/50 border-b text-sm">
                         {activeSchema?.columns.map(col => (
                           <TableCell key={col.name} className="px-4 py-3 max-w-[300px] truncate group border-r border-border/10">
                              {renderCell(row[col.name])}
                           </TableCell>
                         ))}
                         <TableCell className="sticky right-0 bg-background/80 backdrop-blur-sm shadow-l border-l group-hover:bg-muted">
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8">
                                 <MoreVertical className="w-4 h-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={() => handleOpenEdit(row)}>
                                 <Edit className="w-4 h-4 mr-2" /> Editar
                               </DropdownMenuItem>
                               <DropdownMenuItem 
                                 className="text-destructive font-medium"
                                 onClick={() => { if(confirm('Remover permanentemente?')) deleteMutation.mutate(row.id); }}
                               >
                                 <Trash2 className="w-4 h-4 mr-2" /> Excluir
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <DatabaseIcon className="w-12 h-12 mb-4 opacity-10" />
                <p>Selecione uma tabela para explorar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generic Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRow ? `Editar em ${selectedTable}` : `Novo em ${selectedTable}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data: any = {};
            activeSchema?.columns.forEach(col => {
              if (col.name === 'id' && !editingRow) return;
              data[col.name] = formData.get(col.name);
            });
            saveMutation.mutate(data);
          }} className="space-y-4 py-4">
            {activeSchema?.columns.map(col => {
              // Hide ID on new entry if auto-inc, or disable it on edit
              const isID = col.name === 'id';
              if (isID && !editingRow) return null;

              return (
                <div key={col.name} className="grid w-full gap-2">
                  <Label htmlFor={col.name} className="flex items-center gap-2">
                    {col.name}
                    <span className="text-[10px] text-muted-foreground uppercase">{col.type}</span>
                    {isID && <span className="text-[10px] bg-muted px-1 rounded">PK</span>}
                  </Label>
                  {col.type?.toLowerCase().includes('text') || col.name.toLowerCase().includes('description') || col.name.toLowerCase().includes('content') ? (
                    <textarea
                      id={col.name}
                      name={col.name}
                      defaultValue={editingRow?.[col.name] || ''}
                      readOnly={isID}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  ) : (
                    <Input
                      id={col.name}
                      name={col.name}
                      type={col.type?.toLowerCase().includes('int') ? 'number' : 'text'}
                      defaultValue={editingRow?.[col.name] || ''}
                      readOnly={isID}
                      className={isID ? "bg-muted" : ""}
                    />
                  )}
                </div>
              );
            })}
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Salvando...' : 'Salvar Registro'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function renderCell(value: any) {
  if (value === null || value === undefined) return <span className="text-muted-foreground/30 italic">NULL</span>;
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
    try {
      return <span className="text-[10px] font-mono opacity-60">JSON Object</span>;
    } catch { return value; }
  }
  return String(value);
}
