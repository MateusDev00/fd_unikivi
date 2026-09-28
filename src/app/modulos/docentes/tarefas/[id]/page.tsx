'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LawLoader } from '@/components/ui/LawLoader';
import { Download, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DetalheTarefaDocente() {
  const { id } = useParams<{ id: string }>(); // id é a UUID da tarefa
  const { token } = useAuth();
  const [tarefa, setTarefa] = useState<any>(null);
  const [submissoes, setSubmissoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    const fetchData = async () => {
      try {
        const resTarefa = await fetch(`/api/tarefas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTarefa((await resTarefa.json()).data);

        const resSub = await fetch(`/api/submissoes?tarefa=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissoes((await resSub.json()).data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, id]);

  if (loading) return <LawLoader />;
  if (!tarefa) return <p className="text-center mt-20">Tarefa não encontrada</p>;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/modulos/docentes/tarefas" className="text-primary text-sm hover:underline">
          ← Voltar para tarefas
        </Link>
        <h1 className="font-serif text-3xl text-heading mt-2">{tarefa.titulo}</h1>
        <p className="text-body">{tarefa.nome_disciplina} · {tarefa.nome_turma}</p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Submissões ({submissoes.length})
        </h2>
        {submissoes.length === 0 ? (
          <p className="text-sm text-body">Nenhuma submissão ainda.</p>
        ) : (
          <div className="space-y-3">
            {submissoes.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-heading">{sub.nome_estudante}</p>
                  <p className="text-xs text-body">
                    Submetido em {new Date(sub.data_submissao).toLocaleString('pt-AO')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(sub.arquivo_pdf, '_blank')}
                >
                  <Download className="h-4 w-4 mr-1" /> Baixar PDF
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}