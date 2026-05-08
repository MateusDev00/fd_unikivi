'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Clock } from 'lucide-react';

export default function DocenteOrientacoes() {
  return (
    <div className="space-y-8 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-heading">Orientações</h1>
        <p className="text-body mt-1">Teses, dissertações e projetos orientados</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-10 text-center"
      >
        <div className="mx-auto w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h2 className="font-serif text-2xl text-heading mb-3">Em breve</h2>
        <p className="text-body max-w-md mx-auto">
          O módulo de orientações está a ser preparado. Aqui poderá consultar e gerir os seus orientandos,
          teses em andamento e trabalhos concluídos.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-body/60">
          <Clock className="h-4 w-4" />
          <span>Disponível na próxima atualização</span>
        </div>
      </motion.div>
    </div>
  );
}