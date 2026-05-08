'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { UtilizadorCompleto } from '@/types';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Plus, Users, AlertCircle, Search } from 'lucide-react';
import UsuarioForm from '@/components/admin/forms/UsuarioForm';
import { LawLoader } from '@/components/ui/LawLoader';
import { FilterChips } from '@/components/ui/FilterChips';
import { motion, AnimatePresence } from 'framer-motion';

const tipoOptions = [
  { label: 'Todos', value: '' },
  { label: 'Administradores', value: 'admin' },
  { label: 'Estudantes', value: 'estudante' },
  { label: 'Docentes', value: 'docente' },
];

export default function UsuariosPage() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<UtilizadorCompleto[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [selectedTipo, setSelectedTipo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Método para chamar a API de usuários (vamos adicionar no api.ts)
  const fetchData = useCallback(async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      // Chamada customizada pois o método não existe no api.ts ainda
      const res = await fetch(`/api/usuarios?page=${page}&limit=10&tipo=${selectedTipo}&search=${encodeURIComponent(searchTerm)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsuarios(data.data);
        setMeta(data.meta);
      } else {
        setFeedback({ type: 'error', message: data.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Erro ao carregar usuários.' });
    } finally {
      setLoading(false);
    }
  }, [token, selectedTipo, searchTerm]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: any) => {
    if (!token) return;
    try {
      if (editing) {
        await fetch(`/api/usuarios/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        setFeedback({ type: 'success', message: 'Utilizador atualizado.' });
      } else {
        await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        setFeedback({ type: 'success', message: 'Utilizador criado.' });
      }
      setShowForm(false);
      setEditing(null);
      fetchData(meta.page);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (confirm('Remover este utilizador?')) {
      await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback({ type: 'success', message: 'Utilizador removido.' });
      fetchData(meta.page);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome', render: (item: any) => item.nome },
    { key: 'bilhete', label: 'Bilhete', render: (item: any) => item.bilhete },
    { key: 'email', label: 'Email', render: (item: any) => item.email || '—' },
    { key: 'tipo', label: 'Tipo', render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.tipo === 'admin' ? 'bg-purple-100 text-purple-800' :
          item.tipo === 'docente' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>{item.tipo}</span>
    )},
    { key: 'acoes', label: '', render: (item: any) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => { setEditing(item); setShowForm(true); }}>Editar</Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="text-red-600 border-red-200 hover:bg-red-50">Remover</Button>
        </div>
    )},
  ];

  if (!token) return <LawLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-heading">Utilizadores</h1>
          <p className="text-body mt-1">{meta.total} registos</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} className="gap-2"><Plus className="h-4 w-4" /> Novo Utilizador</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <FilterChips options={tipoOptions} selected={selectedTipo} onSelect={setSelectedTipo} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body" />
            <input
              type="text"
              placeholder="Pesquisar por nome, bilhete ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-80 focus:ring-primary focus:border-primary"
            />
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

      {loading ? <div className="grid grid-cols-1 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl shadow animate-pulse" />)}</div> :
        usuarios.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center"><Users className="mx-auto h-12 w-12 text-primary/40 mb-4" /><p className="text-heading font-serif text-xl">Nenhum utilizador</p><p className="text-body">Cadastre o primeiro utilizador.</p></div>
        ) : (
          <DataTable columns={columns} data={usuarios} loading={loading} />
      )}

      {meta.totalPages > 1 && <div className="flex justify-center"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(page) => fetchData(page)} /></div>}
      {showForm && <UsuarioForm initialData={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}