'use client';

import React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';

export function HeroParallax({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 200, damping: 25, bounce: 80 };

  // Movimentos horizontais
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1200]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1200]),
    springConfig
  );

  // Rotação oblíqua inicial → endireita ao rolar
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [18, 0]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [12, 0]),
    springConfig
  );

  // Opacidade inicial mais baixa → aumenta ao rolar
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.35, 1]),
    springConfig
  );

  // Translação vertical
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.3], [-400, 200]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[350vh] relative overflow-hidden antialiased bg-gradient-to-b from-white via-[#fdf7f9] to-white"
    >
      {/* Header sticky com glassmorphism */}
      <div className="sticky top-0 z-20 pt-24 pb-6 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl bg-black/50 rounded-3xl p-8 md:p-12 backdrop-blur-lg border border-white/10 shadow-glass">
          <Header />
        </div>
      </div>

      {/* Conteúdo em parallax com inclinação */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className="absolute inset-x-0 top-0 z-10 flex flex-col gap-10 py-16"
      >
        {/* Linha 1 – direita */}
        <motion.div style={{ x: translateX }} className="flex gap-6">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>

        {/* Linha 2 – esquerda */}
        <motion.div style={{ x: translateXReverse }} className="flex gap-6">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>

        {/* Linha 3 – direita */}
        <motion.div style={{ x: translateX }} className="flex gap-6">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>

        {/* Linhas extras para preencher a altura */}
        <motion.div style={{ x: translateXReverse }} className="flex gap-6">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={`dup-${product.title}`} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Header() {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
      >
        Faculdade de Direito <br />
        <span className="text-white/90">Universidade Kimpa Vita</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="max-w-2xl mt-6 text-sm md:text-xl text-white/70"
      >
        Excelência na formação jurídica, investigação científica e extensão à comunidade.
      </motion.p>
    </div>
  );
}

export function ProductCard({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product h-64 w-80 md:h-80 md:w-96 relative shrink-0 rounded-xl overflow-hidden shadow-card border border-primary/20"
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="object-cover object-center absolute inset-0 h-full w-full"
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-50 bg-primary/40 transition-opacity pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-serif text-xl transition-opacity drop-shadow-lg">
        {product.title}
      </h2>
    </motion.div>
  );
}