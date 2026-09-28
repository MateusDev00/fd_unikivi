// src/components/sections/PublicationsSection.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { PublicationCard } from '@/components/home/PublicationCard';

export default function PublicationsSection() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPublicacoes(1, 10, undefined, { estado: 'publicado' })
      .then((res) => setPublications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const destaque = publications.length > 0 ? publications[0] : null;
  const outras = publications.length > 1 ? publications.slice(1, 10) : [];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle subtitle="Fique por dentro" title="Últimas Notícias" />
          <div className="mt-12 space-y-8">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Fique por dentro"
          title="Últimas Notícias"
          description="Acompanhe os acontecimentos e comunicados oficiais da Faculdade de Direito."
        />

        {publications.length === 0 ? (
          <p className="text-center text-body mt-8">Nenhuma notícia publicada.</p>
        ) : (
          <div className="mt-12 space-y-12">
            {/* Destaque 3D */}
            {destaque && (
              <CardContainer className="w-full py-0">
                <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] border-black/[0.1] w-full h-auto rounded-2xl p-0 border shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {destaque.imagem_capa && (
                      <CardItem translateZ="60" className="lg:w-1/2 w-full cursor-pointer">
                        <div className="relative h-56 lg:h-full">
                          <Image
                            src={destaque.imagem_capa}
                            alt={destaque.titulo}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                        </div>
                      </CardItem>
                    )}
                    <div className={`p-6 lg:p-8 flex flex-col justify-center ${destaque.imagem_capa ? 'lg:w-1/2' : 'w-full'}`}>
                      <CardItem translateZ="30" className="flex items-center gap-4 text-xs text-body mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {formatDate(destaque.criado_em)}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">
                          MAIS RECENTE
                        </span>
                      </CardItem>
                      <CardItem translateZ="50" className="font-serif text-xl md:text-2xl text-heading mb-3 group-hover/card:text-primary transition-colors line-clamp-3">
                        {destaque.titulo}
                      </CardItem>
                      <CardItem translateZ="20" className="text-body text-sm leading-relaxed line-clamp-3">
                        {destaque.conteudo?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </CardItem>
                      <CardItem translateZ="40">
                        <Link
                          href={`/noticias/${destaque.id}`}
                          className="mt-4 inline-flex items-center text-primary font-medium text-sm hover:underline"
                        >
                          Ler mais <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardItem>
                    </div>
                  </div>
                </CardBody>
              </CardContainer>
            )}

            {/* Grelha de notícias secundárias com efeito 3D */}
            {outras.length > 0 && (
              <div>
                <h3 className="font-serif text-xl text-heading mb-6 flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                  Mais notícias
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {outras.map((pub) => (
                    <PublicationCard key={pub.id} publication={pub} />
                  ))}
                </div>
              </div>
            )}

            {/* Botão "Ver Mais" */}
            <div className="flex justify-center mt-8">
              <Link href="/noticias">
                <Button variant="outline" size="lg" className="gap-2 group">
                  Ver Todas as Notícias
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}