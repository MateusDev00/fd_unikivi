'use client';

import { HeroParallax } from '@/components/ui/hero-parallax';

// Dados das imagens e links (substitua pelos links internos desejados)
const products = [
  {
    title: 'Excelência na Formação Jurídica',
    link: '/sobre',
    thumbnail: '/images/hero/hero-1.png',
  },
  {
    title: 'Tribunal Simulado',
    link: '/noticias',
    thumbnail: '/images/hero/hero-2.png',
  },
  {
    title: 'Investigação Científica',
    link: '/servicos',
    thumbnail: '/images/hero/hero-3.jpg',
  },
  {
    title: 'Clínica Jurídica',
    link: '/projetos',
    thumbnail: '/images/hero/hero-4.png',
  },
  {
    title: 'Parcerias Internacionais',
    link: '/sobre',
    thumbnail: '/images/hero/hero-5.png',
  },
  // Repetir as imagens para preencher as três linhas (15 itens)
  {
    title: 'Formação Contínua',
    link: '/servicos',
    thumbnail: '/images/hero/hero-1.png',
  },
  {
    title: 'Eventos Académicos',
    link: '/noticias',
    thumbnail: '/images/hero/hero-2.png',
  },
  {
    title: 'Publicações',
    link: '/noticias',
    thumbnail: '/images/hero/hero-3.jpg',
  },
  {
    title: 'Responsabilidade Social',
    link: '/sobre',
    thumbnail: '/images/hero/hero-4.png',
  },
  {
    title: 'Cooperação Internacional',
    link: '/sobre',
    thumbnail: '/images/hero/hero-5.png',
  },
  // Terceira linha (podem repetir mais uma vez)
  {
    title: 'Formação de Excelência',
    link: '/sobre',
    thumbnail: '/images/hero/hero-1.png',
  },
  {
    title: 'Prática Jurídica',
    link: '/noticias',
    thumbnail: '/images/hero/hero-2.png',
  },
  {
    title: 'Investigação',
    link: '/servicos',
    thumbnail: '/images/hero/hero-3.jpg',
  },
  {
    title: 'Serviço à Comunidade',
    link: '/projetos',
    thumbnail: '/images/hero/hero-4.png',
  },
  {
    title: 'Parcerias',
    link: '/sobre',
    thumbnail: '/images/hero/hero-5.png',
  },
];

export function Hero() {
  return <HeroParallax products={products} />;
}