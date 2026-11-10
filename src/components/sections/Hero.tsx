'use client';

import { HeroCarousel } from '@/components/ui/hero-carousel';

const slides = [
  {
    imagem: '/images/hero/hero-3.jpg', // Podes trocar para a foto institucional principal
    titulo: 'Formando Excelência em Direito',
    subtitulo: 'A Faculdade de Direito da Universidade Kimpa Vita alia o rigor académico à prática jurídica, preparando juristas éticos e comprometidos com a justiça e o desenvolvimento de Angola.',
    link: '/sobre',
    botao: 'Conhecer a Faculdade',
  },
];

export function Hero() {
  return <HeroCarousel slides={slides} />;
}