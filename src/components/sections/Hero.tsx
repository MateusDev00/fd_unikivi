'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Slide {
  imagem: string;      // caminho a partir de /public
  titulo: string;
  subtitulo?: string;
  breadcrumb?: string;
}

const SLIDES: Slide[] = [
  {
    imagem: '/images/hero/hero-1.png',
    titulo: 'Excelência na Formação Jurídica em Angola',
    subtitulo: 'Formando juristas desde a tradição até à inovação.',
    breadcrumb: 'Home > Faculdade',
  },
  {
    imagem: '/images/hero/hero-2.png',
    titulo: 'Tribunal Simulado - Aprender na Prática',
    subtitulo: 'Simulações reais para uma advocacia de excelência.',
    breadcrumb: 'Home > Eventos > Tribunal Simulado',
  },
  {
    imagem: '/images/hero/hero-3.png',
    titulo: 'Investigação Científica e Publicações',
    subtitulo: 'Artigos, teses e revistas indexadas.',
    breadcrumb: 'Home > Investigação',
  },
  {
    imagem: '/images/hero/hero-4.png',
    titulo: 'Clínica Jurídica - Serviço à Comunidade',
    subtitulo: 'Apoio jurídico gratuito prestado pelos nossos estudantes.',
    breadcrumb: 'Home > Clínica Jurídica',
  },
  {
    imagem: '/images/hero/hero-5.jpg',
    titulo: 'Parcerias Internacionais',
    subtitulo: 'Cooperação com faculdades de Direito de prestígio mundial.',
    breadcrumb: 'Home > Parcerias',
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 segundos

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay (pausa quando o rato está sobre o hero)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const goTo = (index: number) => setCurrent(index);

  return (
    <section
      className="relative h-[80vh] min-h-[650px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides com AnimatePresence para transição suave */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <Image
            src={SLIDES[current].imagem}
            alt={SLIDES[current].titulo}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay escuro institucional */}
          <div className="absolute inset-0 bg-dark/50 backdrop-blur-[0.5px]" />
          {/* Pontilhado decorativo */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
        </motion.div>
      </AnimatePresence>

      {/* Conteúdo central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl"
          >
            {SLIDES[current].subtitulo && (
              <p className="font-sans text-sm md:text-base uppercase tracking-[0.25em] text-white/90 mb-4">
                {SLIDES[current].subtitulo}
              </p>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-white drop-shadow-lg">
              {SLIDES[current].titulo}
            </h1>
            {SLIDES[current].breadcrumb && (
              <div className="mt-6 flex items-center justify-center gap-2 text-white/80 text-sm">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span>{SLIDES[current].breadcrumb.replace('Home > ', '')}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Setas de navegação */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-primary/70 transition-colors"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-primary/70 transition-colors"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores (bolinhas) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current
                ? 'bg-primary scale-125 shadow-[0_0_10px_rgba(77,167,72,0.7)]'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Seta para baixo (scroll) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-5 w-5 text-white/60" />
      </div>
    </section>
  );
}