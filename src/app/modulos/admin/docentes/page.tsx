'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, Link2 } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';

type AssociacaoDocente = {
  id_docente: number;
  id_disciplina: number;
  id_turma: number;
  cargo: string;
  nivel_academico: string;
};

const formInicial: AssociacaoDocente = {
  id_docente: 0,
  id_disciplina: 0,
  id_turma: 0,
  cargo: '',
  nivel_academico: '',
};

export default function AssociacaoDocentePage() {
  const { token } = useAuth();
  const [associacoes, setAssociacoes] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AssociacaoDocente>(formInicial);

  const fetchBase = async () => {
    if (!token) return;
    try {
      const [resAss, resDoc, resDis, resTur] = await Promise.all([
        fetch('/api/associacoes/docente', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/usuarios?tipo=docente&limit=100', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/disciplinas?page=1&limit=100', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/turmas', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [dataAss, dataDoc, dataDis, dataTur] = await Promise.all([
        resAss.json(), resDoc.json(), resDis.json(), resTur.json(),
      ]);
      setAssociacoes(dataAss.data || []);
      setDocentes(dataDoc.data || []);
      setDisciplinas(dataDis.data || []);
      setTurmas(dataTur.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBase(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await fetch('/api/associacoes/docente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id_docente: Number(form.id_docente),
          id_disciplina: Number(form.id_disciplina),
          id_turma: Number(form.id_turma),
          cargo: form.cargo,
          nivel_academico: form.nivel_academico,
        }),
      });
      setShowForm(false);
      setForm(formInicial);
      fetchBase();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LawLoader />;

  const columns = [
    { key: 'docente', label: 'Docente', render: (item: any) => item.nome_docente },
    { key: 'disciplina', label: 'Disciplina', render: (item: any) => item.nome_disciplina },
    { key: 'turma', label: 'Turma', render: (item: any) => item.nome_turma },
    { key: 'cargo', label: 'Cargo', render: (item: any) => item.cargo || '—' },
    { key: 'nivel', label: 'Nível Académico', render: (item: any) => item.nivel_academico || '—' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-heading">Associação Docente-Turma-Disciplina</h1>
          <p className="text-body mt-1">{associacoes.length} associações</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Associação
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-serif text-xl text-heading mb-4">Nova Associação</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.id_docente}
              onChange={(e) => setForm({ ...form, id_docente: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            >
              <option value={0}>Selecione o Docente</option>
              {docentes.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
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
            <select
              value={form.id_turma}
              onChange={(e) => setForm({ ...form, id_turma: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            >
              <option value={0}>Selecione a Turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            <input
              type="text"
              placeholder="Cargo (ex: Professor Titular)"
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Nível Académico (ex: Doutor)"
              value={form.nivel_academico}
              onChange={(e) => setForm({ ...form, nivel_academico: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={associacoes} loading={loading} />
    </div>
  );
}