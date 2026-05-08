'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, Briefcase } from 'lucide-react';

export default function DocenteDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-serif text-4xl text-heading">
          Olá, <span className="text-primary">{user?.nome?.split(' ')[0]}</span>
        </h1>
        <p className="text-body text-lg mt-1">Área do Docente</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Turmas', value: '3', icon: Users, color: 'bg-indigo-100 text-indigo-700' },
          { label: 'Publicações', value: '8', icon: FileText, color: 'bg-green-100 text-green-700' },
          { label: 'Orientações', value: '4', icon: Briefcase, color: 'bg-amber-100 text-amber-700' },
        ].map((card, idx) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.color} bg-opacity-20`}><card.icon className="h-8 w-8" /></div>
              <div>
                <p className="text-sm font-medium text-body uppercase">{card.label}</p>
                <p className="text-3xl font-bold text-heading">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="font-serif text-xl text-heading mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Resumo da Atividade Docente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b py-2"><span className="text-body">Departamento:</span><span className="font-medium text-heading">Direito Privado</span></div>
          <div className="flex justify-between border-b py-2"><span className="text-body">Titulação:</span><span className="font-medium text-heading">Doutor</span></div>
          <div className="flex justify-between border-b py-2"><span className="text-body">Área de Especialização:</span><span className="font-medium text-heading">Direito Civil</span></div>
        </div>
      </div>
    </div>
  );
}