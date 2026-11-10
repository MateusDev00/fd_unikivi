'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroParallax({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 150, damping: 30 };

  // Movimento horizontal suave (sem rotação, sem 3D)
  const translateXLeft = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -400]),
    springConfig
  );
  const translateXRight = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 400]),
    springConfig
  );

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  return (
    <section
      ref={ref}
      className="relative bg-white overflow-hidden min-h-[90vh] flex flex-col"
    >
      {/* ============ TEXTO (parte superior) ============ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 lg:pt-40">
        <div className="max-w-3xl">
          {/* Etiqueta superior */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider"
          >
            Bem‑vindo à FD‑UNIKIVI
          </motion.span>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tight"
          >
            Faculdade de Direito
            <br />
            <span className="text-dark/90">Universidade Kimpa Vita</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-base md:text-lg text-dark/70 max-w-2xl leading-relaxed"
          >
            Excelência na formação jurídica, investigação científica e extensão à
            comunidade. Formamos juristas com rigor, ética e compromisso social.
          </motion.p>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Conhecer a Faculdade
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/servicos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 text-primary font-medium hover:bg-primary/5 transition-colors"
            >
              Nossos Serviços
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ============ IMAGENS (faixa inferior) ============ */}
      <div className="relative mt-auto pb-12 overflow-hidden">
        {/* Gradientes laterais para suavizar a entrada/saída das imagens */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Linha 1 – move para a esquerda */}
        <motion.div
          style={{ x: translateXLeft }}
          className="flex gap-5 mb-5"
        >
          {[...firstRow, ...firstRow].map((product, index) => (
            <ImageTile key={`row1-${index}`} product={product} />
          ))}
        </motion.div>

        {/* Linha 2 – move para a direita */}
        <motion.div
          style={{ x: translateXRight }}
          className="flex gap-5 mb-5"
        >
          {[...secondRow, ...secondRow].map((product, index) => (
            <ImageTile key={`row2-${index}`} product={product} />
          ))}
        </motion.div>

        {/* Linha 3 – move para a esquerda */}
        <motion.div
          style={{ x: translateXLeft }}
          className="flex gap-5"
        >
          {[...thirdRow, ...thirdRow].map((product, index) => (
            <ImageTile key={`row3-${index}`} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ImageTile({
  product,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
}) {
  return (
    <Link
      href={product.link}
      className="group relative shrink-0 w-64 h-40 md:w-72 md:h-44 rounded-2xl overflow-hidden shadow-md border border-primary/10 hover:shadow-xl transition-all duration-300"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Overlay suave no hover com o título */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white text-sm font-medium line-clamp-2 drop-shadow">
          {product.title}
        </p>
      </div>
    </Link>
  );
}