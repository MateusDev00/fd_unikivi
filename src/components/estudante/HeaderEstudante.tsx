'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, CalendarDays, FolderOpen, LayoutDashboard, Menu, X, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/modulos/estudante', label: 'Painel', icon: Home },
  { href: '/modulos/estudante/publicacoes', label: 'Publicações', icon: BookOpen },
  { href: '/modulos/estudante/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/modulos/estudante/documentos', label: 'Documentos', icon: FolderOpen },
  { href: '/modulos/estudante/vitrine', label: 'Vitrine', icon: LayoutDashboard },
];

export function HeaderEstudante() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-dark/90 backdrop-blur-md shadow-lg h-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-dark-light flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <span className="font-serif text-2xl text-white font-bold">FD<span className="text-primary">UNIKIVI</span></span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors py-1 relative ${isActive(link.href) ? 'text-primary' : 'text-white/80 hover:text-white'}`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-white text-sm font-medium">{user?.nome}</p>
            <p className="text-primary text-xs uppercase">Estudante</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:text-primary border border-white/20">
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>

        <button className="lg:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-dark border-t border-dark-light">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive(link.href) ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light hover:text-white'}`}>
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-dark-light flex justify-between items-center">
              <div>
                <p className="text-white text-sm">{user?.nome}</p>
                <p className="text-primary text-xs">Estudante</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:text-primary">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}