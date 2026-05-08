// frontend/src/components/sections/client/PublicationsClient.tsx
'use client';

import { useState } from 'react';
import { PublicationCard } from '@/components/home/PublicationCard';
import { Pagination } from '@/components/ui/Pagination';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Publication, PaginatedResponse } from '@/types';
import { api } from '@/lib/api';

interface PublicationsClientProps {
  initialData: PaginatedResponse<Publication>;
}

export function PaginatedPublications({ initialData }: PublicationsClientProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const newData = await api.getPublicacoes(page, 3);
      setData(newData);
    } catch (err) {
      setError('Erro ao carregar publicações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Fique por dentro"
          title="Últimas Publicações"
          description="Artigos, notícias e comunicados da Faculdade de Direito."
        />

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 h-64 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))
          ) : (
            data.data.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))
          )}
        </div>

        {data.meta.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}