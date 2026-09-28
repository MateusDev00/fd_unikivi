'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, BookOpen } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';

type DisciplinaForm = {
  nome: string;
  codigo: string;
  descricao: string;
  carga_horaria: number | null;
  ano_lectivo: number;
};

const formInicial: DisciplinaForm = {
  nome: '',
  codigo: '',
  descricao: '',
  carga_horaria: null,
  ano_lectivo: new Date().getFullYear(),
};

export default function DisciplinasPage() {
  const { token } = useAuth();
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DisciplinaForm>(formInicial);

  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/disciplinas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDisciplinas(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      nome: form.nome,
      codigo: form.codigo,
      descricao: form.descricao || null,
      carga_horaria: form.carga_horaria ? Number(form.carga_horaria) : null,
      ano_lectivo: Number(form.ano_lectivo),
    };

    try {
      await fetch('/api/disciplinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      setShowForm(false);
      setForm(formInicial);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof DisciplinaForm
  ) => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      [field]: field === 'carga_horaria' || field === 'ano_lectivo'
        ? value === '' ? null : Number(value)
        : value,
    }));
  };

  if (loading) return <LawLoader />;

  const columns = [
    { key: 'nome', label: 'Nome', render: (item: any) => item.nome },
    { key: 'codigo', label: 'Código', render: (item: any) => item.codigo },
    { key: 'ano', label: 'Ano Lectivo', render: (item: any) => item.ano_lectivo },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-heading">Disciplinas</h1>
          <p className="text-body mt-1">{disciplinas.length} registos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Disciplina
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-serif text-xl text-heading mb-4">Nova Disciplina</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => handleChange(e, 'nome')}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Código"
              value={form.codigo}
              onChange={(e) => handleChange(e, 'codigo')}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => handleChange(e, 'descricao')}
              className="border p-2 rounded col-span-1 md:col-span-2"
              rows={3}
            />
            <input
              type="number"
              placeholder="Carga Horária"
              value={form.carga_horaria ?? ''}
              onChange={(e) => handleChange(e, 'carga_horaria')}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Ano Lectivo"
              value={form.ano_lectivo}
              onChange={(e) => handleChange(e, 'ano_lectivo')}
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

      <DataTable columns={columns} data={disciplinas} loading={loading} />
    </div>
  );
}