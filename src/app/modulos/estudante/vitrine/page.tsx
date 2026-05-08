'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Publication, Event, Document } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CalendarDays, FolderOpen } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';
import { Modal } from '@/components/ui/Modal';

type Tab = 'publicacoes' | 'eventos' | 'documentos';

export default function VitrineEstudante() {
  const [tab, setTab] = useState<Tab>('publicacoes');
  const [publicacoes, setPublicacoes] = useState<Publication[]>([]);
  const [eventos, setEventos] = useState<Event[]>([]);
  const [documentos, setDocumentos] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Publication | Event | Document | null>(null);

  useEffect(() => {
    Promise.all([
      api.getPublicacoes(1, 20),
      api.getEventos(1, 20),
      api.getDocumentos(1, 20),
    ])
      .then(([p, e, d]) => {
        setPublicacoes(p.data);
        setEventos(e.data);
        setDocumentos(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: 'publicacoes', label: 'Publicações', icon: FileText, count: publicacoes.length },
    { key: 'eventos', label: 'Eventos', icon: CalendarDays, count: eventos.length },
    { key: 'documentos', label: 'Documentos', icon: FolderOpen, count: documentos.length },
  ];

  if (loading) return <LawLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-heading">Vitrine</h1>
        <p className="text-body mt-1">Todo o conteúdo institucional num só lugar.</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? 'bg-primary text-white shadow-md' : 'text-body hover:bg-gray-50'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            <span className="ml-1 opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {tab === 'publicacoes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicacoes.map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => setSelected(pub)}
                  className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow group"
                >
                  <h3 className="font-serif text-lg text-heading line-clamp-2">{pub.titulo}</h3>
                  <p className="text-sm text-body mt-2 line-clamp-3">
                    {pub.conteudo?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          )}
          {tab === 'eventos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-serif text-lg text-heading">{e.titulo}</h3>
                  <p className="text-sm text-body mt-2">
                    {new Date(e.data_evento).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              ))}
            </div>
          )}
          {tab === 'documentos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentos.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium text-heading line-clamp-1">{d.titulo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {selected && (
        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title={'titulo' in selected ? selected.titulo : ''}
        >
          {'conteudo' in selected && (
            <div dangerouslySetInnerHTML={{ __html: selected.conteudo! }} />
          )}
          {'descricao' in selected && <p className="text-body">{selected.descricao}</p>}
          {'data_evento' in selected && (
            <p className="text-body">
              {new Date(selected.data_evento).toLocaleDateString('pt-AO')}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}