'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SplashPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const timer = setTimeout(() => {
      const tipo = user.tipo;
      let destino = '/modulos/estudante';
      if (tipo === 'admin') destino = '/modulos/admin';
      else if (tipo === 'docente') destino = '/modulos/docentes';
      router.push(destino);
    }, 3500);
    return () => clearTimeout(timer);
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white">
      {/* Efeito de papel a comprimir */}
      <motion.div
        className="absolute inset-0 bg-white shadow-2xl origin-top"
        initial={{ scaleY: 1, opacity: 1 }}
        animate={{ scaleY: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 2.2, ease: [0.6, 0.01, -0.05, 0.9] }}
        style={{
          backgroundImage: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,_#4da748_1px,_transparent_1px)] bg-[size:20px_20px]" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Scale className="h-20 w-20 text-primary" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-4xl md:text-5xl text-heading mb-2"
        >
          Bem‑vindo, <span className="text-primary">{user?.nome?.split(' ')[0]}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-body text-lg mb-10"
        >
          Faculdade de Direito · UNIKIVI
        </motion.p>

        <motion.div
          className="w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-xs mt-4"
        >
          A preparar o seu ambiente…
        </motion.p>
      </div>
    </div>
  );
}