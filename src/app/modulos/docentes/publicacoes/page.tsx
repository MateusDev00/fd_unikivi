'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Publication } from '@/types';
import { motion } from 'framer-motion';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { LawLoader } from '@/components/ui/LawLoader';
import { Modal } from '@/components/ui/Modal';

export default function DocentePublicacoes() {
  const [publicacoes, setPublicacoes] = useState<Publication[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Publication | null>(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.getPublicacoes(page, 9);
      setPublicacoes(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = searchTerm
    ? publicacoes.filter(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    : publicacoes;

  if (loading) return <LawLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-heading">Publicações</h1>
        <p className="text-body mt-1">{meta.total} artigos e notícias</p>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-body" />
        <input
          type="text" placeholder="Pesquisar publicações..." value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="mx-auto h-12 w-12 text-primary/30" />
          <p className="text-body mt-4">Nenhuma publicação encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(pub => (
            <motion.div
              key={pub.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group"
              onClick={() => setSelected(pub)}
            >
              {pub.imagem_capa && (
                <div className="h-40 w-full relative overflow-hidden">
                  <img src={pub.imagem_capa} alt={pub.titulo} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-serif text-lg text-heading line-clamp-2">{pub.titulo}</h3>
                <p className="text-sm text-body mt-2 line-clamp-3">
                  {pub.conteudo?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${pub.estado === 'publicado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                    {pub.estado}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={page => fetchData(page)} />
        </div>
      )}

      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.titulo}>
          {selected.imagem_capa && <img src={selected.imagem_capa} alt={selected.titulo} className="w-full rounded-lg mb-4" />}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selected.conteudo }} />
        </Modal>
      )}
    </div>
  );
}