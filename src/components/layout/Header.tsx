'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Search, Menu, X, LogIn, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/projetos', label: 'Projetos' },
    { href: '/contactos', label: 'Contactos' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-dark/90 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo circular + Nome */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/50 hover:border-primary transition-colors">
              <Image
                src="/images/logo.png"
                alt="Logo FD-UNIKIVI"
                width={48}
                height={48}
                className="object-cover"
                priority
              />
            </div>
            <span className="font-serif text-2xl text-white font-bold">
              FD<span className="text-primary">UNIKIVI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-white/90 hover:text-white font-sans text-sm uppercase tracking-wider transition-colors !no-underline py-1
                           after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:-translate-x-1/2
                           hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center text-white">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm">+244 972 178 294</span>
            </div>
         
            <Link href="/login" className="!no-underline">
              <Button variant="ghost" size="sm" className="text-white hover:text-primary border border-white/20 hover:border-primary transition-colors gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
            <Button size="sm" className="whitespace-nowrap">
              Solicitar Contacto
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu com transição slide-down */}
      <div
        className={`lg:hidden bg-dark border-t border-dark-light overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? 'max-h-[500px] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-white/90 hover:text-white py-2 font-sans text-sm uppercase tracking-wider !no-underline transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-dark-light flex flex-col space-y-3">
            <div className="flex items-center text-white">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              <span>+244 972 178 294</span>
            </div>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="!no-underline">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:text-primary border border-white/20">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </Link>
            <Button size="sm" className="w-full">
              Solicitar Contacto
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}