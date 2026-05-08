'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Document } from '@/types';
import { motion } from 'framer-motion';
import { Search, FileText, Download, Eye } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { LawLoader } from '@/components/ui/LawLoader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function DocumentosEstudante() {
  const [documentos, setDocumentos] = useState<Document[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Document | null>(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.getDocumentos(page, 9);
      setDocumentos(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = searchTerm
    ? documentos.filter((d) => d.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    : documentos;

  const formatSize = (bytes: number) =>
    bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';

  if (loading) return <LawLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-heading">Documentos</h1>
        <p className="text-body mt-1">{meta.total} ficheiros disponíveis</p>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-body" />
        <input
          type="text"
          placeholder="Pesquisar documentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="mx-auto h-12 w-12 text-primary/30" />
          <p className="text-body mt-4">Nenhum documento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-light rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-heading line-clamp-2">{doc.titulo}</h3>
                    <p className="text-xs text-body mt-1">
                      {formatSize(doc.tamanho_bytes)} • {doc.tipo_mime?.split('/')[1]?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={() => setSelected(doc)}>
                  <Eye className="h-4 w-4 mr-1" /> Detalhes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_URL}/documentos/${doc.id}/download`,
                      '_blank'
                    )
                  }
                >
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(page) => fetchData(page)}
          />
        </div>
      )}

      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.titulo}>
          <div className="space-y-2 text-sm">
            <p><strong>Nome original:</strong> {selected.nome_original}</p>
            <p><strong>Tamanho:</strong> {formatSize(selected.tamanho_bytes)}</p>
            <p><strong>Tipo:</strong> {selected.tipo_mime}</p>
            {selected.descricao && <p><strong>Descrição:</strong> {selected.descricao}</p>}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_URL}/documentos/${selected.id}/download`,
                    '_blank'
                  )
                }
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}