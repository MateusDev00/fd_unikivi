import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Calendar, Clock, ArrowLeft, Share2, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Função para buscar a publicação pelo ID
async function getPublicacao(id: string) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const res = await fetch(`${apiBase}/publicacoes/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar publicação:', error);
    return null;
  }
}

// Função para buscar notícias recentes (para a barra lateral)
async function getNoticiasRecentes() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const res = await fetch(`${apiBase}/publicacoes?page=1&limit=5&estado=publicado`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar notícias recentes:', error);
    return [];
  }
}

export default async function DetalheNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const publicacao = await getPublicacao(id);
  const recentes = await getNoticiasRecentes();

  if (!publicacao) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const temImagem = publicacao.imagem_capa && publicacao.imagem_capa.trim().length > 0;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Breadcrumb e navegação */}
        <div className="container mx-auto px-4 mb-8">
          <Link
            href="/noticias"
            className="inline-flex items-center text-body hover:text-heading transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para notícias
          </Link>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Conteúdo principal */}
            <article className="lg:w-3/4">
              {/* Hero da notícia */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                {temImagem && (
                  <div className="relative h-[400px] w-full">
                    <Image
                      src={publicacao.imagem_capa}
                      alt={publicacao.titulo}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                  </div>
                )}
                <div className={`p-8 ${!temImagem ? 'pt-12' : ''}`}>
                  <div className="flex items-center gap-4 text-sm text-body mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(publicacao.criado_em)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      {new Date(publicacao.criado_em).toLocaleTimeString('pt-AO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {publicacao.estado === 'publicado' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Publicado
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-heading mb-6 leading-tight">
                    {publicacao.titulo}
                  </h1>
                  <div className="flex items-center gap-3 mb-8">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                      className="flex items-center gap-1 text-body hover:text-primary text-sm"
                    >
                      <Share2 className="h-4 w-4" />
                      Partilhar
                    </button>
                    {publicacao.categoria && (
                      <span className="flex items-center gap-1 text-body text-sm">
                        <Tag className="h-4 w-4" />
                        {publicacao.categoria}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-heading prose-p:text-body prose-a:text-primary">
                    <div dangerouslySetInnerHTML={{ __html: publicacao.conteudo }} />
                  </div>
                </div>
              </div>
            </article>

            {/* Barra lateral – outras notícias */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h3 className="font-serif text-lg text-heading mb-4">Notícias Recentes</h3>
                {recentes.length === 0 ? (
                  <p className="text-sm text-body">Nenhuma notícia disponível.</p>
                ) : (
                  <ul className="space-y-4">
                    {recentes
                      .filter((item: any) => item.id !== publicacao.id)
                      .slice(0, 5)
                      .map((item: any) => (
                        <li key={item.id} className="border-b border-gray-100 pb-3 last:border-0">
                          <Link
                            href={`/noticias/${item.id}`}
                            className="group block"
                          >
                            <h4 className="text-sm font-medium text-heading group-hover:text-primary transition-colors line-clamp-2">
                              {item.titulo}
                            </h4>
                            <p className="text-xs text-body mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.criado_em).toLocaleDateString('pt-AO')}
                            </p>
                          </Link>
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