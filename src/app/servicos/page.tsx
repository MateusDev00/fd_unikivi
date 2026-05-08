// src/app/servicos/page.tsx
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { motion } from 'framer-motion';
import {
  Scale,
  Gavel,
  BookOpen,
  FileText,
  Users,
  Calendar,
  Landmark,
  Globe,
  Briefcase,
  Award,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const servicos = [
  {
    icon: Scale,
    titulo: 'Licenciatura em Direito',
    descricao:
      'Formação completa nas especializações Jurídico‑Civil, Jurídico‑Política e Jurídico‑Económica. O plano curricular aprovado oferece uma base sólida para a advocacia, magistratura e outras carreiras jurídicas.',
    cor: 'bg-blue-50 text-blue-700',
  },
  
  {
    icon: BookOpen,
    titulo: 'Investigação Jurídica',
    descricao:
      'Produção e divulgação de artigos, teses e revistas científicas. Os nossos investigadores participam em conferências nacionais e internacionais.',
    cor: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Gavel,
    titulo: 'Tribunal Simulado',
    descricao:
      'Simulações realistas de julgamentos para desenvolver competências práticas. Uma experiência imersiva que prepara os estudantes para a realidade forense.',
    cor: 'bg-red-50 text-red-700',
  },
  {
    icon: Users,
    titulo: 'Clínica Jurídica',
    descricao:
      'Apoio jurídico gratuito à comunidade, prestado por estudantes finalistas sob supervisão de docentes. Um serviço que une aprendizado e responsabilidade social.',
    cor: 'bg-green-50 text-green-700',
  },
  {
    icon: Calendar,
    titulo: 'Eventos e Seminários',
    descricao:
      'Organização de conferências, workshops e debates com especialistas de renome. Mantemos a comunidade académica actualizada sobre as tendências jurídicas.',
    cor: 'bg-teal-50 text-teal-700',
  },
  {
    icon: FileText,
    titulo: 'Consultoria Legislativa',
    descricao:
      'Assessoria na elaboração de diplomas legais, pareceres e análises de impacto normativo. Colaboramos com entidades públicas e privadas.',
    cor: 'bg-indigo-50 text-indigo-700',
  },
  {
    icon: Briefcase,
    titulo: 'Formação Contínua',
    descricao:
      'Cursos de curta duração para profissionais do Direito que desejam actualizar conhecimentos. Direitos Humanos, Resolução de Conflitos, Direito Digital, entre outros.',
    cor: 'bg-orange-50 text-orange-700',
  },
  {
    icon: Landmark,
    titulo: 'Observatório Legislativo',
    descricao:
      'Análise das reformas legislativas em Angola. Publicamos relatórios e promovemos o debate sobre as transformações do sistema jurídico.',
    cor: 'bg-gray-100 text-gray-700',
  },
  {
    icon: Globe,
    titulo: 'Parcerias Internacionais',
    descricao:
      'Acordos de cooperação com faculdades de Direito estrangeiras. Mobilidade de estudantes e docentes, e projectos de investigação conjuntos.',
    cor: 'bg-cyan-50 text-cyan-700',
  },
];

export default function ServicosPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero da página */}
        <section className="relative bg-dark py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.p
              className="text-primary uppercase tracking-[0.25em] text-sm mb-4  text-primary-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              O que oferecemos
            </motion.p>
            <motion.h1
              className="font-serif text-4xl md:text-6xl text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Serviços da <span className="text-primary">FD‑UNIKIVI</span>
            </motion.h1>
            <motion.p
              className="text-lg text-white/70 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Formação, investigação e extensão ao serviço da comunidade jurídica e da sociedade.
            </motion.p>
          </div>
        </section>

        {/* Grelha de serviços */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionTitle
              subtitle="Catálogo completo"
              title="Todos os nossos serviços"
              description="Conheça em detalhe cada um dos serviços que a Faculdade de Direito disponibiliza."
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicos.map((servico, idx) => (
                <motion.div
                  key={servico.titulo}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${servico.cor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <servico.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif text-xl text-heading mb-3">{servico.titulo}</h3>
                  <p className="text-body text-sm leading-relaxed">{servico.descricao}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-white text-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl text-heading mb-4">Interessado nos nossos serviços?</h2>
              <p className="text-body mb-8 max-w-xl mx-auto">
                Entre em contacto connosco para mais informações sobre qualquer um dos serviços.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  href="/contactos"
                  className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  Contactar <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sobre"
                  className="border border-primary text-primary px-8 py-3 rounded-xl font-medium hover:bg-primary-light transition-colors"
                >
                  Sobre a FD‑UNIKIVI
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}