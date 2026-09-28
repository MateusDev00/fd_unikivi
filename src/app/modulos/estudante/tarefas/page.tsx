'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ClipboardList, Calendar } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TarefasEstudantePage() {
  const { token } = useAuth();
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchTarefas = async () => {
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
    fetchTarefas();
  }, [token]);

  if (loading) return <LawLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-heading">Minhas Tarefas</h1>
        <p className="text-body mt-1">{tarefas.length} tarefas disponíveis</p>
      </motion.div>

      {tarefas.length === 0 ? (
        <p className="text-center text-body">Nenhuma tarefa no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tarefas.map((tarefa) => (
            <motion.div
              key={tarefa.uuid}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-primary-light rounded-lg">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-heading">{tarefa.titulo}</h3>
                  <p className="text-xs text-body">
                    {tarefa.nome_disciplina} · {tarefa.nome_turma}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-body">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Abertura: {new Date(tarefa.data_abertura).toLocaleString('pt-AO')}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Fechamento: {new Date(tarefa.data_fechamento).toLocaleString('pt-AO')}
                </p>
              </div>
              {tarefa.instrucoes && (
                <p className="mt-3 text-xs text-body">{tarefa.instrucoes}</p>
              )}
              <Link
                href={`/modulos/estudante/tarefas/${tarefa.uuid}`}
                className="mt-4 inline-flex items-center text-primary font-medium text-sm hover:underline"
              >
                Abrir tarefa
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}