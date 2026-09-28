'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, Users } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';

type AssociacaoEstudante = {
  id_estudante: number;
  id_disciplina: number;
  id_turma: number;
  ano_frequencia: number;
  semestre: number;
};

const formInicial: AssociacaoEstudante = {
  id_estudante: 0,
  id_disciplina: 0,
  id_turma: 0,
  ano_frequencia: new Date().getFullYear(),
  semestre: 1,
};

export default function AssociacaoEstudantePage() {
  const { token } = useAuth();
  const [associacoes, setAssociacoes] = useState<any[]>([]);
  const [estudantes, setEstudantes] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AssociacaoEstudante>(formInicial);

  const fetchBase = async () => {
    if (!token) return;
    try {
      const [resAss, resEst, resDis, resTur] = await Promise.all([
        fetch('/api/associacoes/estudante', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/usuarios?tipo=estudante&limit=100', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/disciplinas?page=1&limit=100', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/turmas', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [dataAss, dataEst, dataDis, dataTur] = await Promise.all([
        resAss.json(), resEst.json(), resDis.json(), resTur.json(),
      ]);
      setAssociacoes(dataAss.data || []);
      setEstudantes(dataEst.data || []);
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
      await fetch('/api/associacoes/estudante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id_estudante: Number(form.id_estudante),
          id_disciplina: Number(form.id_disciplina),
          id_turma: Number(form.id_turma),
          ano_frequencia: Number(form.ano_frequencia),
          semestre: Number(form.semestre),
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
    { key: 'estudante', label: 'Estudante', render: (item: any) => item.nome_estudante },
    { key: 'disciplina', label: 'Disciplina', render: (item: any) => item.nome_disciplina },
    { key: 'turma', label: 'Turma', render: (item: any) => item.nome_turma },
    { key: 'ano', label: 'Ano', render: (item: any) => item.ano_frequencia },
    { key: 'semestre', label: 'Semestre', render: (item: any) => item.semestre },
    { key: 'estado', label: 'Estado', render: (item: any) => item.estado || 'inscrito' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-heading">Associação Estudante-Turma-Disciplina</h1>
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
              value={form.id_estudante}
              onChange={(e) => setForm({ ...form, id_estudante: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            >
              <option value={0}>Selecione o Estudante</option>
              {estudantes.map(est => <option key={est.id} value={est.id}>{est.nome}</option>)}
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
              type="number"
              placeholder="Ano de Frequência"
              value={form.ano_frequencia}
              onChange={(e) => setForm({ ...form, ano_frequencia: Number(e.target.value) })}
              className="border p-2 rounded"
              required
            />
            <select
              value={form.semestre}
              onChange={(e) => setForm({ ...form, semestre: Number(e.target.value) })}
              className="border p-2 rounded"
            >
              <option value={1}>1º Semestre</option>
              <option value={2}>2º Semestre</option>
            </select>
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