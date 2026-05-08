'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DocumentCard } from '@/components/home/DocumentCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function DocumentsSection() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDocumentos(1, 12)
      .then(res => setDocuments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Vitrine de Conhecimento"
          title="Documentos e Legislação"
          description="Aceda a artigos científicos, pareceres jurídicos e diplomas legais."
        />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <p className="text-center text-body mt-8">Nenhum documento disponível.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {documents.map(doc => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}