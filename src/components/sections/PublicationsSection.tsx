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

export default function PublicationsSection() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar as 10 publicações mais recentes com estado "publicado"
    api
      .getPublicacoes(1, 10, undefined, { estado: 'publicado' })
      .then((res) => setPublications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // A primeira publicação é a mais recente
  const destaque = publications.length > 0 ? publications[0] : null;
  const outras = publications.length > 1 ? publications.slice(1, 10) : [];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Fique por dentro"
          title="Últimas Notícias"
          description="Acompanhe os acontecimentos e comunicados oficiais da Faculdade de Direito."
        />

        {loading ? (
          <div className="mt-12 space-y-8">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : publications.length === 0 ? (
          <p className="text-center text-body mt-8">Nenhuma notícia publicada.</p>
        ) : (
          <div className="mt-12 space-y-12">
            {/* Destaque – notícia mais recente */}
            {destaque && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href={`/noticias/${destaque.id}`}
                  className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Imagem de capa */}
                    {destaque.imagem_capa && (
                      <div className="lg:w-1/2 relative h-56 lg:h-auto">
                        <Image
                          src={destaque.imagem_capa}
                          alt={destaque.titulo}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                      </div>
                    )}

                    {/* Conteúdo textual */}
                    <div className={`p-6 lg:p-8 flex flex-col justify-center ${destaque.imagem_capa ? 'lg:w-1/2' : 'w-full'}`}>
                      <div className="flex items-center gap-4 text-xs text-body mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {formatDate(destaque.criado_em)}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">
                          MAIS RECENTE
                        </span>
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-heading mb-3 group-hover:text-primary transition-colors line-clamp-3">
                        {destaque.titulo}
                      </h3>
                      <p className="text-body text-sm leading-relaxed line-clamp-3">
                        {destaque.conteudo?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </p>
                      <div className="mt-4 inline-flex items-center text-primary font-medium text-sm group-hover:underline">
                        Ler mais <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grelha de notícias secundárias */}
            {outras.length > 0 && (
              <div>
                <h3 className="font-serif text-xl text-heading mb-6 flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                  Mais notícias
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {outras.map((pub, idx) => (
                    <motion.div
                      key={pub.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={`/noticias/${pub.id}`}
                        className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full"
                      >
                        {pub.imagem_capa && (
                          <div className="relative h-40 w-full">
                            <Image
                              src={pub.imagem_capa}
                              alt={pub.titulo}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center text-xs text-body mb-2">
                            <Calendar className="h-3 w-3 mr-1 text-primary" />
                            {formatDate(pub.criado_em)}
                          </div>
                          <h4 className="font-serif text-base text-heading mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {pub.titulo}
                          </h4>
                          <p className="text-xs text-body line-clamp-2">
                            {pub.conteudo?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </p>
                        </div>
                      </Link>
                    </motion.div>
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