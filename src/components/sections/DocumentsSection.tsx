// Server Component – dados via API
import { api } from '@/lib/api';
import { DocumentCard } from '@/components/home/DocumentCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export async function DocumentsSection() {
  let documents: any[] = [];
  let total = 0;
  try {
    const res = await api.getDocumentos(1, 12);
    documents = res.data;
    total = res.meta.total;
  } catch (error) {
    console.error('Erro ao carregar documentos:', error);
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Vitrine de Conhecimento"
          title="Documentos e Legislação"
          description="Aceda a artigos científicos, pareceres jurídicos e diplomas legais."
        />

        {documents.length === 0 ? (
          <p className="text-center text-body mt-8">
            Nenhum documento disponível.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}