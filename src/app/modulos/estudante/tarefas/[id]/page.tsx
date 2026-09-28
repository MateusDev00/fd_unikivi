'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LawLoader } from '@/components/ui/LawLoader';
import { Upload, Send, FileText, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetalheTarefaEstudante() {
  const { id } = useParams<{ id: string }>(); // UUID da tarefa
  const { token, user } = useAuth();
  const [tarefa, setTarefa] = useState<any>(null);
  const [submissao, setSubmissao] = useState<any>(null);
  const [interacoes, setInteracoes] = useState<any[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buscar dados da tarefa, submissão e interações
  useEffect(() => {
    if (!token || !id) return;
    const fetchData = async () => {
      setLoading(true);
      setErro(null);
      try {
        const [resTarefa, resSub, resInter] = await Promise.all([
          fetch(`/api/tarefas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/submissoes?tarefa=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/tarefas/${id}/interacoes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!resTarefa.ok) {
          const err = await resTarefa.json();
          throw new Error(err.message || 'Tarefa não encontrada');
        }
        const dataTarefa = await resTarefa.json();
        setTarefa(dataTarefa.data);

        const dataSub = await resSub.json();
        // Filtrar a submissão do próprio estudante
        const minhaSubmissao = dataSub.data?.find((s: any) => s.id_estudante === user?.id);
        setSubmissao(minhaSubmissao || null);

        const dataInter = await resInter.json();
        setInteracoes(dataInter.data || []);
      } catch (err: any) {
        setErro(err.message || 'Erro ao carregar tarefa');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, id, user?.id]);

  // Submeter PDF
  const handleSubmissao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !arquivo) return;
    setEnviando(true);
    setErro(null);
    setSucesso(null);
    const formData = new FormData();
    formData.append('tarefa_uuid', id);
    formData.append('arquivo', arquivo);
    try {
      const res = await fetch('/api/submissoes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSubmissao(data.data);
        setArquivo(null);
        setSucesso('Submissão enviada com sucesso!');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setErro(data.message || 'Erro ao submeter');
      }
    } catch (err) {
      setErro('Erro de rede');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  // Enviar mensagem de interação
  const handleInteracao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !mensagem.trim()) return;
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch(`/api/tarefas/${id}/interacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mensagem }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensagem('');
        // Recarregar interações
        const resInter = await fetch(`/api/tarefas/${id}/interacoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataInter = await resInter.json();
        setInteracoes(dataInter.data || []);
      } else {
        setErro(data.message || 'Erro ao enviar mensagem');
      }
    } catch (err) {
      setErro('Erro de rede');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <LawLoader />;

  if (erro || !tarefa) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="font-serif text-2xl text-heading">{erro || 'Tarefa não encontrada'}</h1>
        <Link href="/modulos/estudante/tarefas" className="text-primary hover:underline mt-4 inline-block">
          ← Voltar para tarefas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pt-24 pb-16 px-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/modulos/estudante/tarefas" className="inline-flex items-center text-primary text-sm hover:underline mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para tarefas
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl text-heading">{tarefa.titulo}</h1>
        <p className="text-body">
          {tarefa.nome_disciplina} · {tarefa.nome_turma}
        </p>
      </motion.div>

      {/* Detalhes da tarefa */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="font-serif text-xl text-heading">Detalhes</h2>
        <p className="text-body">{tarefa.descricao}</p>
        {tarefa.instrucoes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-heading mb-1">Instruções</h3>
            <p className="text-sm text-body">{tarefa.instrucoes}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-body">
          <span>Abertura: {new Date(tarefa.data_abertura).toLocaleString('pt-AO')}</span>
          <span>Fechamento: {new Date(tarefa.data_fechamento).toLocaleString('pt-AO')}</span>
        </div>
      </div>

      {/* Submissão */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-serif text-xl text-heading mb-4">Submeter Resposta (PDF)</h2>
        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-3">
            {sucesso}
          </div>
        )}
        {submissao ? (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <FileText className="h-4 w-4" />
            Submetido em {new Date(submissao.data_submissao).toLocaleString('pt-AO')}
          </div>
        ) : (
          <form onSubmit={handleSubmissao} className="space-y-3">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              className="block w-full text-sm text-body"
              required
            />
            <Button type="submit" disabled={!arquivo || enviando}>
              <Upload className="h-4 w-4 mr-2" />
              {enviando ? 'Enviando...' : 'Submeter PDF'}
            </Button>
          </form>
        )}
      </div>

      {/* Interação */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" /> Interação
        </h2>
        <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
          {interacoes.length === 0 ? (
            <p className="text-sm text-body">Nenhuma mensagem.</p>
          ) : (
            interacoes.map((inter) => (
              <div
                key={inter.id}
                className={`p-3 rounded-lg ${
                  inter.enviado_por === 'estudante'
                    ? 'bg-primary/5 ml-auto max-w-[80%]'
                    : 'bg-gray-50 max-w-[80%]'
                }`}
              >
                <p className="text-xs font-medium text-heading">{inter.nome_remetente}</p>
                <p className="text-sm text-body">{inter.mensagem}</p>
                <p className="text-[10px] text-body/60">
                  {new Date(inter.data_envio).toLocaleString('pt-AO')}
                </p>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleInteracao} className="flex gap-2">
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Escreva a sua dúvida..."
            className="flex-1 px-4 py-2 border rounded-xl focus:ring-primary"
            disabled={enviando}
          />
          <Button type="submit" disabled={!mensagem.trim() || enviando}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}