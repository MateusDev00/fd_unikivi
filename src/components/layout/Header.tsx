'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Menu, X, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/projetos', label: 'Projetos' },
    { href: '/noticias', label: 'Notícias' },
    { href: '/docentes', label: 'Docentes' },
    { href: '/contactos', label: 'Contactos' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b border-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-primary/60 hover:border-primary transition-colors">
              <Image
                src="/images/logo.png"
                alt="Logo FD-UNIKIVI"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-serif text-xl md:text-2xl text-primary font-bold">
              FD<span className="text-dark">UNIKIVI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-dark hover:text-primary font-sans text-sm font-medium uppercase tracking-wider transition-colors py-1 no-underline
                           after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:-translate-x-1/2
                           hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
          
            <Link href="/login" className="no-underline">
              <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors gap-1.5">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
           
          </div>

          {/* Hamburger button (mobile) */}
          <button
            className="lg:hidden p-2 text-dark hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-16 md:top-20 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-primary/10 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ visibility: isMenuOpen ? 'visible' : 'hidden' }}
      >
        <div className="px-6 py-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-dark hover:text-primary py-2 font-sans text-sm font-medium uppercase tracking-wider transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-primary/10 space-y-3">
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block no-underline">
              <Button variant="outline" size="sm" className="w-full justify-center text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </Link>
            
          </div>
        </div>
      </div>
    </header>
  );
}