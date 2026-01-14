'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Briefcase } from 'lucide-react';

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-8 font-bold text-xl">Backoffice</div>
        <div className="flex space-x-6 text-sm font-medium">
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
            <Briefcase className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </div>
      </div>
    </nav>
  );
}
