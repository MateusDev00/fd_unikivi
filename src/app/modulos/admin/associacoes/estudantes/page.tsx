'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, UserCheck, Users, BookOpen, Layers, Trash2 } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [turmas, setTurmas] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [estudantesDisponiveis, setEstudantesDisponiveis] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingEstudantes, setLoadingEstudantes] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AssociacaoEstudante>(formInicial);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const fetchBase = async () => {
    if (!token) return;
    try {
      const [resAss, resDis, resTur] = await Promise.all([
        fetch('/api/associacoes/estudantes', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/disciplinas?page=1&limit=100', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/turmas', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [dataAss, dataDis, dataTur] = await Promise.all([
        resAss.json(), resDis.json(), resTur.json(),
      ]);
      setAssociacoes(dataAss.data || []);
      setDisciplinas(dataDis.data || []);
      setTurmas(dataTur.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBase();
  }, [token]);

  useEffect(() => {
    setForm(prev => ({ ...prev, id_estudante: 0 }));

    if (form.id_turma && form.id_disciplina && token) {
      const fetchDisponiveis = async () => {
        setLoadingEstudantes(true);
        try {
          const res = await fetch(
            `/api/associacoes/estudantes/disponiveis?turma=${form.id_turma}&disciplina=${form.id_disciplina}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          setEstudantesDisponiveis(data.data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingEstudantes(false);
        }
      };
      fetchDisponiveis();
    } else {
      setEstudantesDisponiveis([]);
    }
  }, [form.id_turma, form.id_disciplina, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.id_turma || !form.id_disciplina || !form.id_estudante) return;

    try {
      const res = await fetch('/api/associacoes/estudantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Estudante associado com sucesso.' });
        setForm(prev => ({ ...prev, id_estudante: 0 })); 
        fetchBase();
      } else {
        const erro = await res.json();
        setMensagem({ tipo: 'erro', texto: erro.message || 'Erro ao criar associação.' });
      }
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Erro de rede.' });
    }
    setTimeout(() => setMensagem(null), 4000);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Tem a certeza que deseja desassociar este estudante desta turma e disciplina?')) return;

    try {
      const res = await fetch(`/api/associacoes/estudantes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Associação removida com sucesso.' });
        fetchBase();
      } else {
        const erro = await res.json();
        setMensagem({ tipo: 'erro', texto: erro.message || 'Erro ao remover associação.' });
      }
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Erro de rede.' });
    }
    setTimeout(() => setMensagem(null), 4000);
  };

  if (loading) return <LawLoader />;

  const columns = [
    { key: 'estudante', label: 'Estudante', render: (item: any) => item.nome_estudante },
    { key: 'disciplina', label: 'Disciplina', render: (item: any) => item.nome_disciplina },
    { key: 'turma', label: 'Turma', render: (item: any) => item.nome_turma },
    { key: 'ano', label: 'Ano', render: (item: any) => item.ano_frequencia },
    { key: 'semestre', label: 'Semestre', render: (item: any) => `${item.semestre}º` },
    { 
      key: 'estado', 
      label: 'Estado', 
      render: (item: any) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {item.estado || 'inscrito'}
        </span>
      )
    },
    {
      key: 'acoes',
      label: '',
      render: (item: any) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item.id)}
            className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
          >
            <Trash2 className="h-4 w-4" /> Desassociar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-heading">Associações Estudante</h1>
          <p className="text-body mt-1">{associacoes.length} registos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" /> {showForm ? 'Fechar Formulário' : 'Nova Associação'}
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary/10">
              <h3 className="font-serif text-xl text-heading mb-2">Nova Associação</h3>
              
              {mensagem && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  mensagem.tipo === 'sucesso' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {mensagem.texto}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-heading mb-2">
                    <Layers className="h-4 w-4 text-primary" /> 1. Turma
                  </label>
                  <select
                    value={form.id_turma}
                    onChange={(e) => setForm({ ...form, id_turma: Number(e.target.value) })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value={0}>Selecione a Turma</option>
                    {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-heading mb-2">
                    <BookOpen className="h-4 w-4 text-primary" /> 2. Disciplina
                  </label>
                  <select
                    value={form.id_disciplina}
                    onChange={(e) => setForm({ ...form, id_disciplina: Number(e.target.value) })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                    required
                    disabled={!form.id_turma}
                  >
                    <option value={0}>Selecione a Disciplina</option>
                    {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-heading mb-2">
                    <Users className="h-4 w-4 text-primary" /> 3. Estudante Disponível
                  </label>
                  
                  {loadingEstudantes ? (
                    <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
                  ) : (
                    <select
                      value={form.id_estudante}
                      onChange={(e) => setForm({ ...form, id_estudante: Number(e.target.value) })}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                      required
                      disabled={!form.id_turma || !form.id_disciplina || estudantesDisponiveis.length === 0}
                    >
                      <option value={0}>
                        {estudantesDisponiveis.length === 0 && form.id_turma && form.id_disciplina
                          ? 'Nenhum estudante disponível para esta combinação'
                          : 'Selecione o Estudante'}
                      </option>
                      {estudantesDisponiveis.map(est => (
                        <option key={est.id} value={est.id}>{est.nome} ({est.bilhete})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Ano de Frequência</label>
                  <input
                    type="number"
                    value={form.ano_frequencia}
                    onChange={(e) => setForm({ ...form, ano_frequencia: Number(e.target.value) })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Semestre</label>
                  <select
                    value={form.semestre}
                    onChange={(e) => setForm({ ...form, semestre: Number(e.target.value) })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                  >
                    <option value={1}>1º Semestre</option>
                    <option value={2}>2º Semestre</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!form.id_estudante}>
                    Associar Estudante
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DataTable columns={columns} data={associacoes} loading={loading} />
    </div>
  );
}