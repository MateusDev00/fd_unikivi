'use client';

import { useState } from 'react';
import { DocumentCard } from '@/components/home/DocumentCard';
import { Pagination } from '@/components/ui/Pagination';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Document, PaginatedResponse } from '@/types';
import { api } from '@/lib/api';

interface DocumentsClientProps {
  initialData: PaginatedResponse<Document>;
}

export function PaginatedDocuments({ initialData }: DocumentsClientProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    try {
      const newData = await api.getDocumentos(page, 6);
      setData(newData);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Vitrine de Conhecimento"
          title="Documentos e Legislação"
          description="Aceda a artigos científicos, pareceres jurídicos e diplomas legais."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 h-40 animate-pulse" />
            ))
          ) : data.data.length > 0 ? (
            data.data.map((doc) => <DocumentCard key={doc.id} document={doc} />)
          ) : (
            <p className="col-span-full text-center text-body">
              Nenhum documento disponível.
            </p>
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