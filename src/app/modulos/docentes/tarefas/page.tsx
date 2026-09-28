'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, ClipboardList } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function TarefasDocentePage() {
  const { token } = useAuth();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data_abertura: '',
    data_fechamento: '',
    arquivos_apoio: [] as string[],
    instrucoes: '',
    id_turma: 0,
    id_disciplina: 0,
  });

  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/tarefas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTarefas(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssociacoes = async () => {
    if (!token) return;
    try {
      const [resTur, resDis] = await Promise.all([
        fetch('/api/turmas', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/disciplinas?page=1&limit=100', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [dataTur, dataDis] = await Promise.all([resTur.json(), resDis.json()]);
      setTurmas(dataTur.data || []);
      setDisciplinas(dataDis.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAssociacoes();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Converter datas para ISO com fuso
    const data_abertura_iso = new Date(form.data_abertura).toISOString();
    const data_fechamento_iso = new Date(form.data_fechamento).toISOString();

    try {
      const res = await fetch('/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          data_abertura: data_abertura_iso,
          data_fechamento: data_fechamento_iso,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setForm({
          titulo: '',
          descricao: '',
          data_abertura: '',
          data_fechamento: '',
          arquivos_apoio: [],
          instrucoes: '',
          id_turma: 0,
          id_disciplina: 0,
        });
        fetchData();
      } else {
        const error = await res.json();
        alert(error.message || 'Erro ao criar tarefa');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede');
    }
  };

  if (loading) return <LawLoader />;

  const columns = [
    { key: 'titulo', label: 'Título', render: (item: any) => item.titulo },
    { key: 'turma', label: 'Turma', render: (item: any) => item.nome_turma },
    { key: 'disciplina', label: 'Disciplina', render: (item: any) => item.nome_disciplina },
    { key: 'abertura', label: 'Abertura', render: (item: any) => new Date(item.data_abertura).toLocaleString('pt-AO') },
    { key: 'fechamento', label: 'Fechamento', render: (item: any) => new Date(item.data_fechamento).toLocaleString('pt-AO') },
    {
      key: 'acoes',
      label: '',
      render: (item: any) => (
        <Link
          href={`/modulos/docentes/tarefas/${item.uuid}`}
          className="text-primary hover:underline"
        >
          Ver detalhes
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-heading">Minhas Tarefas</h1>
          <p className="text-body mt-1">{tarefas.length} tarefas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h3 className="font-serif text-xl text-heading mb-4">Nova Tarefa</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <select
                  value={form.id_turma}
                  onChange={(e) => setForm({ ...form, id_turma: Number(e.target.value) })}
                  className="border p-2 rounded"
                  required
                >
                  <option value={0}>Selecione a Turma</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
                <select
                  value={form.id_disciplina}
                  onChange={(e) => setForm({ ...form, id_disciplina: Number(e.target.value) })}
                  className="border p-2 rounded"
                  required
                >
                  <option value={0}>Selecione a Disciplina</option>
                  {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
                <input
                  type="datetime-local"
                  placeholder="Abertura"
                  value={form.data_abertura}
                  onChange={(e) => setForm({ ...form, data_abertura: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="datetime-local"
                  placeholder="Fechamento"
                  value={form.data_fechamento}
                  onChange={(e) => setForm({ ...form, data_fechamento: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  placeholder="Descrição"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="border p-2 rounded col-span-1 md:col-span-2"
                  rows={3}
                />
                <textarea
                  placeholder="Instruções para submissão"
                  value={form.instrucoes}
                  onChange={(e) => setForm({ ...form, instrucoes: e.target.value })}
                  className="border p-2 rounded col-span-1 md:col-span-2"
                  rows={3}
                />
                <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DataTable columns={columns} data={tarefas} loading={loading} />
    </div>
  );
}