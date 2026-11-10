'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, UserCheck, Briefcase, BookOpen, Layers, Trash2 } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';
import { motion, AnimatePresence } from 'framer-motion';

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
  cargo: 'Professor Auxiliar',
  nivel_academico: 'Licenciado',
};

export default function AssociacaoDocentePage() {
  const { token } = useAuth();
  const [associacoes, setAssociacoes] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [docentesDisponiveis, setDocentesDisponiveis] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AssociacaoDocente>(formInicial);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const fetchBase = async () => {
    if (!token) return;
    try {
      const [resAss, resDis, resTur] = await Promise.all([
        fetch('/api/associacoes/docentes', { headers: { Authorization: `Bearer ${token}` } }),
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
    setForm(prev => ({ ...prev, id_docente: 0 }));

    if (form.id_turma && form.id_disciplina && token) {
      const fetchDisponiveis = async () => {
        setLoadingDocentes(true);
        try {
          const res = await fetch(
            `/api/associacoes/docentes/disponiveis?turma=${form.id_turma}&disciplina=${form.id_disciplina}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          setDocentesDisponiveis(data.data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingDocentes(false);
        }
      };
      fetchDisponiveis();
    } else {
      setDocentesDisponiveis([]);
    }
  }, [form.id_turma, form.id_disciplina, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.id_turma || !form.id_disciplina || !form.id_docente) return;

    try {
      const res = await fetch('/api/associacoes/docentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Docente associado com sucesso.' });
        setForm(prev => ({ ...prev, id_docente: 0 })); 
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
    if (!confirm('Tem a certeza que deseja desassociar este docente desta turma e disciplina?')) return;

    try {
      const res = await fetch(`/api/associacoes/docentes/${id}`, {
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
    { key: 'docente', label: 'Docente', render: (item: any) => item.nome_docente },
    { key: 'disciplina', label: 'Disciplina', render: (item: any) => item.nome_disciplina },
    { key: 'turma', label: 'Turma', render: (item: any) => item.nome_turma },
    { key: 'cargo', label: 'Cargo', render: (item: any) => item.cargo || '—' },
    { key: 'nivel', label: 'Nível Académico', render: (item: any) => item.nivel_academico || '—' },
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
          <h1 className="font-serif text-3xl text-heading">Associações Docente</h1>
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
              <h3 className="font-serif text-xl text-heading mb-2">Nova Associação de Docente</h3>
              
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
                    <Briefcase className="h-4 w-4 text-primary" /> 3. Docente Disponível
                  </label>
                  
                  {loadingDocentes ? (
                    <div className="h-12 bg-gray-100 animate-pulse rounded-xl" />
                  ) : (
                    <select
                      value={form.id_docente}
                      onChange={(e) => setForm({ ...form, id_docente: Number(e.target.value) })}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                      required
                      disabled={!form.id_turma || !form.id_disciplina || docentesDisponiveis.length === 0}
                    >
                      <option value={0}>
                        {docentesDisponiveis.length === 0 && form.id_turma && form.id_disciplina
                          ? 'Nenhum docente disponível'
                          : 'Selecione o Docente'}
                      </option>
                      {docentesDisponiveis.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.nome} ({doc.titulacao})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Cargo</label>
                  <select
                    value={form.cargo}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="Professor Titular">Professor Titular</option>
                    <option value="Professor Auxiliar">Professor Auxiliar</option>
                    <option value="Professor Convidado">Professor Convidado</option>
                    <option value="Coordenador">Coordenador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Nível Académico</label>
                  <select
                    value={form.nivel_academico}
                    onChange={(e) => setForm({ ...form, nivel_academico: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="Licenciado">Licenciado</option>
                    <option value="Pós-Graduado">Pós-Graduado</option>
                    <option value="Mestre">Mestre</option>
                    <option value="Doutor">Doutor</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!form.id_docente}>
                    Associar Docente
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