'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Scale, Landmark, BookOpen, Globe, Users, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';

const projetos = [
  {
    icon: Scale,
    titulo: 'Tribunal Simulado',
    descricao: 'Simulações de julgamentos para desenvolver competências práticas dos estudantes.',
    cor: 'bg-blue-50 text-blue-700',
  },
  {
    icon: Landmark,
    titulo: 'Clínica Jurídica',
    descricao: 'Apoio jurídico gratuito prestado por estudantes finalistas à comunidade local.',
    cor: 'bg-green-50 text-green-700',
  },
  {
    icon: BookOpen,
    titulo: 'Revista Científica FD-UNIKIVI',
    descricao: 'Publicação periódica de artigos e pareceres nas diversas áreas do Direito.',
    cor: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Globe,
    titulo: 'Parcerias Internacionais',
    descricao: 'Acordos de cooperação com faculdades de Direito de Portugal, Brasil e Moçambique.',
    cor: 'bg-purple-50 text-purple-700',
  },
  {
    icon: Users,
    titulo: 'Formação Contínua',
    descricao: 'Cursos de curta duração para profissionais do Direito.',
    cor: 'bg-red-50 text-red-700',
  },
  {
    icon: Gavel,
    titulo: 'Observatório Legislativo',
    descricao: 'Análise e acompanhamento das reformas legislativas em Angola.',
    cor: 'bg-teal-50 text-teal-700',
  },
];

export default function ProjetosPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Iniciativas"
            title="Projetos"
            description="Conheça os projetos e iniciativas que desenvolvemos para a comunidade académica e a sociedade."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((proj, idx) => (
              <motion.div
                key={proj.titulo}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <div className={`w-12 h-12 rounded-xl ${proj.cor} flex items-center justify-center mb-4`}>
                  <proj.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl text-heading mb-2">{proj.titulo}</h3>
                <p className="text-body text-sm leading-relaxed">{proj.descricao}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}