'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Event } from '@/types';
import { DataTable } from '../components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Plus, Calendar, AlertCircle, Search } from 'lucide-react';
import { EventForm } from '../forms/EventForm';
import { LawLoader } from '@/components/ui/LawLoader';
import { FilterChips } from '@/components/ui/FilterChips';
import { motion, AnimatePresence } from 'framer-motion';

const estadoOptions = [
  { label: 'Todos', value: '' },
  { label: 'Futuro', value: 'futuro' },
  { label: 'Realizado', value: 'realizado' },
  { label: 'Cancelado', value: 'cancelado' },
];

export default function EventosPage() {
  const { token } = useAuth();
  const [eventos, setEventos] = useState<Event[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtros
  const [selectedEstado, setSelectedEstado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const fetchData = useCallback(async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.getEventos(page, 10, token, {
        estado: selectedEstado || '',
        search: searchTerm || '',
        dataInicio: dataInicio || '',
        dataFim: dataFim || '',
      });
      setEventos(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Erro ao carregar eventos.' });
    } finally {
      setLoading(false);
    }
  }, [token, selectedEstado, searchTerm, dataInicio, dataFim]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (formData: FormData) => {
    if (!token) { setFeedback({ type: 'error', message: 'Sessão expirada.' }); return; }
    try {
      if (editing) {
        await api.updateEvento(editing.id, formData, token);
        setFeedback({ type: 'success', message: 'Evento atualizado.' });
      } else {
        await api.createEvento(formData, token);
        setFeedback({ type: 'success', message: 'Evento criado.' });
      }
      setShowForm(false); setEditing(null); fetchData(meta.page);
    } catch (err: any) { setFeedback({ type: 'error', message: err.message }); }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (confirm('Eliminar este evento?')) {
      try {
        await api.deleteEvento(id, token);
        setFeedback({ type: 'success', message: 'Evento eliminado.' });
        fetchData(meta.page);
      } catch (err: any) { setFeedback({ type: 'error', message: err.message }); }
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-AO', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const columns = [
    { key: 'titulo', label: 'Título', render: (item: Event) => item.titulo },
    {
      key: 'data', label: 'Data',
      render: (item: Event) => <span className="text-sm whitespace-nowrap">{formatDate(item.data_evento)}</span>,
    },
    {
      key: 'estado', label: 'Estado',
      render: (item: Event) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${
            item.estado === 'futuro' ? 'bg-blue-100 text-blue-800'
            : item.estado === 'realizado' ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
          }`}
        >
          {item.estado}
        </span>
      ),
    },
    {
      key: 'acoes', label: '',
      render: (item: Event) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => { setEditing(item); setShowForm(true); }}>Editar</Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="text-red-600 border-red-200 hover:bg-red-50">Eliminar</Button>
        </div>
      ),
    },
  ];

  if (!token) return <LawLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="font-serif text-3xl text-heading">Eventos</h1><p className="text-body mt-1">{meta.total} registos</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Evento</Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterChips options={estadoOptions} selected={selectedEstado} onSelect={setSelectedEstado} />
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full sm:w-64"
              />
            </div>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            />
            <span className="text-body">até</span>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <AlertCircle className="h-5 w-5" />{feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl shadow animate-pulse" />
          ))}
        </div>
      ) : eventos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-primary/40 mb-4" />
          <p className="text-heading font-serif text-xl">Nenhum evento</p>
          <p className="text-body">Crie o primeiro evento.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={eventos} loading={loading} />
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

      {showForm && (
        <EventForm
          initialData={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}