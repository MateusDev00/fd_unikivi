'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Document } from '@/types';
import { DataTable } from '../components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Plus, FileText, Download, AlertCircle, Search } from 'lucide-react';
import { DocumentForm } from '../forms/DocumentForm';
import { LawLoader } from '@/components/ui/LawLoader';
import { FilterChips } from '@/components/ui/FilterChips';
import { motion, AnimatePresence } from 'framer-motion';

const categoriaOptions = [
  { label: 'Todas', value: '' },
  { label: 'Legislação', value: 'legislacao' },
  { label: 'Artigos', value: 'artigo' },
  { label: 'Pareceres', value: 'parecer' },
  { label: 'Teses', value: 'tese' },
];

export default function DocumentosPage() {
  const { token } = useAuth();
  const [documentos, setDocumentos] = useState<Document[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Document | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const fetchData = useCallback(async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.getDocumentos(page, 10, token, {
        categoria: selectedCategoria,
        search: searchTerm,
        dataInicio: dataInicio,
        dataFim: dataFim,
      });
      setDocumentos(res.data);
      setMeta(res.meta);
    } catch (err: any) { setFeedback({ type: 'error', message: 'Erro ao carregar documentos.' }); }
    finally { setLoading(false); }
  }, [token, selectedCategoria, searchTerm, dataInicio, dataFim]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (formData: FormData) => {
    if (!token) { setFeedback({ type: 'error', message: 'Sessão expirada.' }); return; }
    try {
      if (editing) {
        await api.updateDocumento(editing.id, formData, token);
        setFeedback({ type: 'success', message: 'Metadados atualizados.' });
      } else {
        await api.createDocumento(formData, token);
        setFeedback({ type: 'success', message: 'Documento inserido.' });
      }
      setShowForm(false); setEditing(null); fetchData(meta.page);
    } catch (err: any) { setFeedback({ type: 'error', message: err.message }); }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (confirm('Arquivar este documento?')) {
      try {
        await api.deleteDocumento(id, token);
        setFeedback({ type: 'success', message: 'Documento arquivado.' });
        fetchData(meta.page);
      } catch (err: any) { setFeedback({ type: 'error', message: err.message }); }
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDownload = (doc: Document) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    window.open(`${baseUrl}/documentos/${doc.id}/download`, '_blank');
  };

  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : (bytes / 1024).toFixed(1) + ' KB';

  const columns = [
    { key: 'titulo', label: 'Título', render: (item: Document) => (
        <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{item.titulo}</div>
    )},
    { key: 'tamanho', label: 'Tamanho', render: (item: Document) => formatSize(item.tamanho_bytes) },
    { key: 'tipo', label: 'Tipo', render: (item: Document) => item.tipo_mime?.split('/')[1]?.toUpperCase() },
    { key: 'acoes', label: '', render: (item: Document) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => handleDownload(item)} className="gap-1"><Download className="h-4 w-4" /> Download</Button>
          <Button variant="outline" size="sm" onClick={() => { setEditing(item); setShowForm(true); }}>Editar</Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="text-red-600 border-red-200 hover:bg-red-50">Arquivar</Button>
        </div>
    )},
  ];

  if (!token) return <LawLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="font-serif text-3xl text-heading">Documentos</h1><p className="text-body mt-1">{meta.total} registos</p></div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Documento</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterChips options={categoriaOptions} selected={selectedCategoria} onSelect={setSelectedCategoria} />
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body" />
              <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full sm:w-64" />
            </div>
            <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
            <span className="text-body">até</span>
            <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-4 rounded-lg flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <AlertCircle className="h-5 w-5" />{feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? <div className="grid grid-cols-1 gap-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl shadow animate-pulse" />)}</div> :
        documentos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center"><FileText className="mx-auto h-12 w-12 text-primary/40 mb-4" /><p className="text-heading font-serif text-xl">Nenhum documento</p><p className="text-body">Adicione o primeiro documento.</p></div>
        ) : (
          <DataTable columns={columns} data={documentos} loading={loading} />
      )}
      {meta.totalPages > 1 && <div className="flex justify-center"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(page) => fetchData(page)} /></div>}
      {showForm && <DocumentForm initialData={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}