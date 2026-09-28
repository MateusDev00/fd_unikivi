'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, Users } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';

type TurmaForm = {
  nome: string;
  descricao: string;
};

const formInicial: TurmaForm = {
  nome: '',
  descricao: '',
};

export default function TurmasPage() {
  const { token } = useAuth();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TurmaForm>(formInicial);

  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/turmas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTurmas(data.data || []);
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
    try {
      await fetch('/api/turmas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm(formInicial);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LawLoader />;

  const columns = [
    { key: 'nome', label: 'Nome', render: (item: any) => item.nome },
    { key: 'descricao', label: 'Descrição', render: (item: any) => item.descricao || '—' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-heading">Turmas</h1>
          <p className="text-body mt-1">{turmas.length} registos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Turma
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-serif text-xl text-heading mb-4">Nova Turma</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome da Turma"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <textarea
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="border p-2 rounded w-full"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={turmas} loading={loading} />
    </div>
  );
}