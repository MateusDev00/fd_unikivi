'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Event } from '@/types';
import { motion } from 'framer-motion';
import { Search, CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { LawLoader } from '@/components/ui/LawLoader';
import { Modal } from '@/components/ui/Modal';

export default function DocenteEventos() {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Event | null>(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.getEventos(page, 9);
      setEventos(res.data);
      setMeta(res.meta);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = searchTerm
    ? eventos.filter(e => e.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    : eventos;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-AO', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  if (loading) return <LawLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-heading">Eventos</h1>
        <p className="text-body mt-1">{meta.total} eventos programados</p>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-body" />
        <input
          type="text" placeholder="Pesquisar eventos..." value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border rounded-xl focus:ring-2 focus:ring-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays className="mx-auto h-12 w-12 text-primary/30" />
          <p className="text-body mt-4">Nenhum evento encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => (
            <motion.div
              key={event.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group"
              onClick={() => setSelected(event)}
            >
              {event.imagem_capa && (
                <div className="h-36 w-full relative overflow-hidden">
                  <img src={event.imagem_capa} alt={event.titulo} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.estado === 'futuro' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                      {event.estado === 'futuro' ? 'Brevemente' : event.estado}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-5">
                <h3 className="font-serif text-lg text-heading line-clamp-2">{event.titulo}</h3>
                <div className="flex items-center gap-4 mt-3 text-sm text-body">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{formatDate(event.data_evento)}</span>
                  {event.local && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.local}</span>}
                </div>
                <div className="flex justify-end mt-3">
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-body"><CalendarDays className="h-4 w-4" />{formatDate(selected.data_evento)}</div>
            {selected.local && <div className="flex items-center gap-2 text-body"><MapPin className="h-4 w-4" />{selected.local}</div>}
            {selected.descricao && <p className="text-body">{selected.descricao}</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}