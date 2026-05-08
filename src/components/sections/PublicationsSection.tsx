'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PublicationCard } from '@/components/home/PublicationCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function PublicationsSection() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublicacoes(1, 12)
      .then(res => setPublications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Fique por dentro"
          title="Últimas Publicações"
          description="Artigos, notícias e comunicados oficiais da Faculdade de Direito."
        />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : publications.length === 0 ? (
          <p className="text-center text-body mt-8">Nenhuma publicação recente.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {publications.map(pub => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}