// Server Component – dados via API
import { api } from '@/lib/api';
import { PublicationCard } from '@/components/home/PublicationCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export async function PublicationsSection() {
  let publications: any[] = [];
  let total = 0;
  try {
    const res = await api.getPublicacoes(1, 12);
    publications = res.data;
    total = res.meta.total;
  } catch (error) {
    console.error('Erro ao carregar publicações:', error);
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Fique por dentro"
          title="Últimas Publicações"
          description="Artigos, notícias e comunicados oficiais da Faculdade de Direito."
        />

        {publications.length === 0 ? (
          <p className="text-center text-body mt-8">
            Nenhuma publicação recente.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}