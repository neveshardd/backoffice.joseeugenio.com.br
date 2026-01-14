'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Home, Briefcase, User, Database, LogOut } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      toast.success('Logout realizado');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao sair');
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-8 flex items-center gap-3 transition-opacity hover:opacity-80">
          <Image src="/logo.png" alt="José Eugênio" width={100} height={40} className="h-10 w-auto object-contain" />
        </Link>
        <div className="flex flex-1 space-x-6 text-sm font-medium">
          
          <Link
            href="/home"
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              pathname === "/home" ? "text-foreground" : "text-foreground/60"
            )}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link
            href="/"
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            )}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Projetos
          </Link>
          <Link
            href="/services"
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              pathname === "/services" ? "text-foreground" : "text-foreground/60"
            )}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Serviços
          </Link>
          <Link
            href="/about"
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              pathname === "/about" ? "text-foreground" : "text-foreground/60"
            )}
          >
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
          <Link
            href="/database"
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              pathname === "/database" ? "text-foreground" : "text-foreground/60"
            )}
          >
            <Database className="mr-2 h-4 w-4" />
            Banco de Dados
          </Link>
        </div>
        <div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );
}
