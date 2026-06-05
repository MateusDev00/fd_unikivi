'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Publication } from '@/types';
import { api } from '@/lib/api';
import { FilterChips } from '@/components/ui/FilterChips';
import { PublicationCard } from '@/components/home/PublicationCard';
import { Calendar, ArrowRight, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const estadoOptions = [
  { label: 'Todas', value: '' },
  { label: 'Publicado', value: 'publicado' },
];

export default function NoticiasPage() {
  const [publicacoes, setPublicacoes] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState('publicado');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPublicacoes(1, 50, undefined, {
        estado: selectedEstado || undefined,
        search: searchTerm || undefined,
      });
      setPublicacoes(res.data);
    } catch (err: any) {
      console.error('Erro ao carregar notícias:', err);
      setError('Não foi possível carregar as notícias. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [selectedEstado, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const principal = publicacoes.length > 0 ? publicacoes[0] : null;
  const outras = publicacoes.length > 1 ? publicacoes.slice(1) : [];

  if (error) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl text-heading mb-4">Notícias</h1>
            <p className="text-body mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="text-primary hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero da página de notícias – destaque para a mais recente */}
        <section className="relative bg-dark py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 relative z-10">
            {principal ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-white max-w-4xl mx-auto"
              >
                <p className="text-primary uppercase tracking-[0.25em] text-sm mb-4">
                  Destaque
                </p>
                <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                  {principal.titulo}
                </h1>
                <p className="text-white/70 text-lg mb-6">
                  {principal.conteudo?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(principal.criado_em).toLocaleDateString('pt-AO', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <Link
                    href={`/noticias/${principal.id}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Ler mais <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-white">
                <h1 className="font-serif text-3xl md:text-5xl">Notícias</h1>
                <p className="mt-4 text-white/60">Nenhuma notícia publicada.</p>
              </div>
            )}
          </div>
        </section>

        {/* Corpo da página: barra lateral + grelha */}
        <div className="container mx-auto px-4 mt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Conteúdo principal – grelha de publicações */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-serif text-2xl text-heading">Últimas Notícias</h2>
                  <p className="text-body text-sm">{publicacoes.length} artigos encontrados</p>
                </div>
                <div className="flex items-center gap-3">
                  <FilterChips
                    options={estadoOptions}
                    selected={selectedEstado}
                    onSelect={setSelectedEstado}
                  />
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body" />
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary w-48"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : outras.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {outras.map((pub) => (
                    <PublicationCard key={pub.id} publication={pub} />
                  ))}
                </div>
              ) : (
                <p className="text-body">Nenhuma notícia adicional.</p>
              )}
            </div>

            {/* Barra lateral – últimas notícias */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h3 className="font-serif text-lg text-heading mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Últimas Notícias
                </h3>
                {publicacoes.length === 0 ? (
                  <p className="text-sm text-body">Nenhuma notícia.</p>
                ) : (
                  <ul className="space-y-3">
                    {publicacoes.slice(0, 8).map((pub) => (
                      <li key={pub.id} className="border-b border-gray-100 pb-2 last:border-0">
                        <Link
                          href={`/noticias/${pub.id}`}
                          className="text-sm font-medium text-heading hover:text-primary transition-colors line-clamp-2"
                        >
                          {pub.titulo}
                        </Link>
                        <p className="text-xs text-body mt-1">
                          {new Date(pub.criado_em).toLocaleDateString('pt-AO')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}