'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText, CalendarDays, FolderOpen, GraduationCap, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { LawLoader } from '@/components/ui/LawLoader';

export default function EstudanteDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ publicacoes: 0, eventos: 0, documentos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.getPublicacoes(1, 1),
      api.getEventos(1, 1),
      api.getDocumentos(1, 1),
    ])
      .then(([p, e, d]) => {
        setStats({ publicacoes: p.meta.total, eventos: e.meta.total, documentos: d.meta.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LawLoader />;

  const menuCards = [
    { label: 'Publicações', description: 'Artigos e notícias da faculdade', icon: FileText, href: '/modulos/estudante/publicacoes', stat: stats.publicacoes, color: 'bg-blue-50 text-blue-700' },
    { label: 'Eventos', description: 'Seminários, conferências e workshops', icon: CalendarDays, href: '/modulos/estudante/eventos', stat: stats.eventos, color: 'bg-green-50 text-green-700' },
    { label: 'Documentos', description: 'Legislação, teses e pareceres', icon: FolderOpen, href: '/modulos/estudante/documentos', stat: stats.documentos, color: 'bg-amber-50 text-amber-700' },
    { label: 'Vitrine', description: 'Todo o conteúdo num só lugar', icon: LayoutDashboard, href: '/modulos/estudante/vitrine', stat: null, color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-serif text-4xl text-heading">
          Olá, <span className="text-primary">{user?.nome?.split(' ')[0]}</span>
        </h1>
        <p className="text-body text-lg mt-1">Área do Estudante</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuCards.map((card, idx) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}>
            <Link href={card.href} className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg text-heading">{card.label}</h3>
              <p className="text-sm text-body mt-1">{card.description}</p>
              {card.stat !== null && (
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-heading">{card.stat}</span>
                  <span className="text-xs text-body">disponíveis</span>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Resumo Académico
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between border-b py-2"><span className="text-body">Nº de Estudante:</span><span className="font-medium text-heading">2024001DIR</span></div>
          <div className="flex justify-between border-b py-2"><span className="text-body">Curso:</span><span className="font-medium text-heading">Licenciatura em Direito</span></div>
          <div className="flex justify-between border-b py-2"><span className="text-body">Ano de Ingresso:</span><span className="font-medium text-heading">2024</span></div>
        </div>
      </div>
    </div>
  );
}