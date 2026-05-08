'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { FileText, Calendar, FolderOpen, TrendingUp, ArrowUpRight } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#4da748', '#0a2b1d', '#e6f4e7', '#1f2937', '#6b7280', '#183f2e'];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    const step = Math.ceil(value / 30);
    const interval = setInterval(() => {
      setDisplay(prev => {
        const next = prev + step;
        return next >= value ? value : next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{display}</span>;
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({ publicacoes: 0, eventos: 0, documentos: 0 });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [pubPorEstado, setPubPorEstado] = useState<any[]>([]);
  const [eventosPorLocal, setEventosPorLocal] = useState<any[]>([]);
  const [docCategorias, setDocCategorias] = useState<any[]>([]);

  // Filtro de período (afeta todos os dados)
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Função centralizada que carrega TUDO baseado no período
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    // Filtros que serão passados para as chamadas à API
    const filters: any = {};
    if (dataInicio) filters.dataInicio = dataInicio;
    if (dataFim) filters.dataFim = dataFim;

    try {
      // 1. Contagens totais (cartões)
      const [pubRes, evRes, docRes] = await Promise.all([
        api.getPublicacoes(1, 1, token, filters),
        api.getEventos(1, 1, token, filters),
        api.getDocumentos(1, 1, token, filters),
      ]);
      setStats({
        publicacoes: pubRes.meta.total,
        eventos: evRes.meta.total,
        documentos: docRes.meta.total,
      });

      // 2. Todos os registos do período (limitados a 1000 para gráficos)
      const [pubAll, evAll, docAll] = await Promise.all([
        api.getPublicacoes(1, 1000, token, filters),
        api.getEventos(1, 1000, token, filters),
        api.getDocumentos(1, 1000, token, filters),
      ]);

      // Publicações por estado
      const estadoCounts: Record<string, number> = {};
      pubAll.data.forEach((p: any) => {
        estadoCounts[p.estado] = (estadoCounts[p.estado] || 0) + 1;
      });
      setPubPorEstado(Object.entries(estadoCounts).map(([name, value]) => ({ name, value })));

      // Eventos por local
      const localCounts: Record<string, number> = {};
      evAll.data.forEach((e: any) => {
        const loc = e.local || 'Indefinido';
        localCounts[loc] = (localCounts[loc] || 0) + 1;
      });
      setEventosPorLocal(Object.entries(localCounts).map(([name, value]) => ({ name, value })));

      // Documentos por categoria
      const catCounts: Record<string, number> = {};
      docAll.data.forEach((d: any) => {
        const cat = d.categoria || 'Sem categoria';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
      setDocCategorias(Object.entries(catCounts).map(([name, value]) => ({ name, value })));

      // Atividades recentes (últimas 5 publicações + últimas 5 eventos)
      const [pubAct, evAct] = await Promise.all([
        api.getPublicacoes(1, 5, token, filters),
        api.getEventos(1, 5, token, filters),
      ]);
      setRecentActivities([
        ...pubAct.data.slice(0, 3).map((p: any) => ({ tipo: 'Publicação', titulo: p.titulo, data: p.criado_em })),
        ...evAct.data.slice(0, 2).map((e: any) => ({ tipo: 'Evento', titulo: e.titulo, data: e.criado_em })),
      ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [token, dataInicio, dataFim]);

  // Recarregar sempre que o token ou as datas mudarem
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <LawLoader />;

  // Dados estáticos para o gráfico de área (mensal)
  const areaData = [
    { name: 'Jan', publicações: 4, eventos: 2 },
    { name: 'Fev', publicações: 6, eventos: 3 },
    { name: 'Mar', publicações: 8, eventos: 5 },
    { name: 'Abr', publicações: 10, eventos: 6 },
    { name: 'Mai', publicações: 7, eventos: 4 },
    { name: 'Jun', publicações: 9, eventos: 7 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho com filtro de data */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-heading">
              Olá, <span className="text-primary">{user?.nome?.split(' ')[0]}</span>
            </h1>
            <p className="text-body text-lg mt-1">Bem‑vindo ao centro de gestão da faculdade.</p>
          </div>

          {/* Filtro de período */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <Calendar className="h-5 w-5 text-body" />
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
            />
            <span className="text-body text-sm">até</span>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
            />
            {(dataInicio || dataFim) && (
              <button
                onClick={() => { setDataInicio(''); setDataFim(''); }}
                className="text-xs text-red-500 hover:underline"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Cartões */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Publicações', value: stats.publicacoes, icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Eventos', value: stats.eventos, icon: Calendar, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Documentos', value: stats.documentos, icon: FolderOpen, color: 'bg-amber-50 text-amber-700 border-amber-200' },
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow"
            style={{ borderLeftColor: '#4da748' }}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${card.color} bg-opacity-20`}>
                <card.icon className="h-8 w-8" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-body/40" />
            </div>
            <p className="text-sm font-medium text-body mt-4 uppercase tracking-wider">{card.label}</p>
            <p className="text-4xl font-bold text-heading mt-1">
              <AnimatedNumber value={card.value} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Linha de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Área – evolução semestral */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Evolução Semestral
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorPub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4da748" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4da748" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0a2b1d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0a2b1d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="publicações" stroke="#4da748" fillOpacity={1} fill="url(#colorPub)" />
              <Area type="monotone" dataKey="eventos" stroke="#0a2b1d" fillOpacity={1} fill="url(#colorEv)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Barras – Publicações por estado */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Publicações por Estado
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pubPorEstado}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="value" name="Quantidade" fill="#4da748" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rosca – Eventos por local */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Eventos por Local
          </h3>
          {eventosPorLocal.length === 0 ? (
            <p className="text-body">Nenhum evento registado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={eventosPorLocal}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventosPorLocal.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pizza – Documentos por categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Documentos por Categoria
          </h3>
          {docCategorias.length === 0 ? (
            <p className="text-body">Nenhum documento categorizado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={docCategorias}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {docCategorias.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Atividades recentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Atividades Recentes
        </h3>
        {recentActivities.length === 0 ? (
          <p className="text-body">Nenhuma atividade recente.</p>
        ) : (
          <ul className="space-y-3">
            {recentActivities.map((act, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${act.tipo === 'Publicação' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {act.tipo === 'Publicação' ? <FileText className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-heading">{act.titulo}</p>
                  <p className="text-xs text-body">{new Date(act.data).toLocaleDateString('pt-AO')}</p>
                </div>
                <span className="text-xs text-body">{act.tipo}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}