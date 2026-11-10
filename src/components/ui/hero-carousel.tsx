'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Scale } from 'lucide-react'; // ArrowRight removido

interface Slide {
  imagem: string;
  titulo: string;
  subtitulo: string;
  link: string;
  botao: string;
}

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay só faz sentido se houver mais de 1 slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-[#0a2b1d] flex overflow-hidden">
      
      {/* ================= COLUNA ESQUERDA: TEXTO (50%) ================= */}
      <div className="w-full lg:w-1/2 relative z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 bg-[#0a2b1d] text-white overflow-hidden">
        
        {/* PADRÃO DE FUNDO FORMAL (Linhas e Balança da Justiça em Branco) */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:40px_40px]" />
          <Scale className="absolute -bottom-10 -left-10 w-[400px] h-[400px] text-white transform -rotate-12 opacity-30" />
        </div>

        {/* CONTEÚDO DE TEXTO */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-xl relative z-10"
          >
            

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-6">
              {slides[current].titulo}
            </h1>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              {slides[current].subtitulo}
            </p>

            <div className="flex flex-wrap gap-4">
              {/* BOTÃO RETANGULAR E SEM SETA */}
              <Link
                href={slides[current].link}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-none bg-primary text-white font-medium hover:bg-white hover:text-[#0a2b1d] transition-all shadow-lg shadow-primary/20 hover:scale-105 transform duration-300"
              >
                {slides[current].botao}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= COLUNA DIREITA: IMAGEM EM MEIA LUA (50%) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a2b1d] items-center justify-end">
        <div className="relative w-[95%] h-[90%] rounded-l-[8rem] overflow-hidden shadow-2xl border-l border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={slides[current].imagem}
                alt={slides[current].titulo}
                fill
                className="object-cover"
                priority
              />
              
              <div className="absolute inset-0 bg-[#0a2b1d]/30 mix-blend-multiply z-10" />
              
              <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0a2b1d] via-[#0a2b1d]/70 to-transparent z-20" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ================= CONTROLES DE NAVEGAÇÃO (Apenas se houver + de 1 slide) ================= */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-8 lg:right-16 z-30 flex items-center gap-4">
          <div className="flex gap-2 mr-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-10 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-primary transition-all shadow-sm"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="p-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-primary transition-all shadow-sm"
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
}