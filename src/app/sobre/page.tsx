// src/app/sobre/page.tsx
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { motion } from 'framer-motion';
import {
  Scale,
  GraduationCap,
  BookOpen,
  Globe,
  Users,
  Award,
  MapPin,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const valores = [
  { icon: Scale, titulo: 'Justiça', desc: 'Promovemos a equidade e o Estado de Direito como alicerces da sociedade.' },
  { icon: BookOpen, titulo: 'Conhecimento', desc: 'Produzimos e difundimos saber jurídico de excelência.' },
  { icon: Users, titulo: 'Comunidade', desc: 'Servimos a comunidade com responsabilidade social.' },
];

const numeros = [
  { valor: '200+', rotulo: 'Estudantes formados' },
  { valor: '18', rotulo: 'Docentes e investigadores' },
  { valor: '3', rotulo: 'Especializações' },
  { valor: '4', rotulo: 'Acordos internacionais' },
];

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero da página Sobre */}
        <section className="relative bg-dark py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.p
              className="text-primary uppercase tracking-[0.25em] text-sm mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Faculdade de Direito
            </motion.p>
            <motion.h1
              className="font-serif text-4xl md:text-6xl text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Universidade <span className="text-primary">Kimpa Vita</span>
            </motion.h1>
            <motion.p
              className="text-lg text-white/70 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Formamos juristas com rigor científico, consciência ética e compromisso social.
            </motion.p>
          </div>
        </section>

        {/* Introdução */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl text-heading mb-6">Uma instituição de referência</h2>
              <p className="text-body leading-relaxed text-lg mb-4">
                A Faculdade de Direito da Universidade Kimpa Vita (FD‑UNIKIVI) é uma unidade orgânica dedicada ao ensino, investigação e extensão no domínio das ciências jurídicas. Instalada na província do Uíge, a nossa faculdade assume‑se como um polo de desenvolvimento do pensamento jurídico angolano, aliando a tradição académica à inovação pedagógica.
              </p>
              <p className="text-body leading-relaxed text-lg mb-4">
                Desde a sua criação, a FD‑UNIKIVI tem formado licenciados em Direito com uma sólida preparação teórica e prática, aptos a intervir nos mais diversos domínios da vida jurídica – da advocacia à magistratura, da administração pública à consultoria internacional. O nosso plano curricular, aprovado pelo Decreto Executivo n.º 396/17 de 28 de agosto, contempla três áreas de especialização: Jurídico‑Civil, Jurídico‑Política e Jurídico‑Económica.
              </p>
              <p className="text-body leading-relaxed text-lg">
                A abertura de novos cursos de mestrado e a intensificação da investigação científica são a prova do nosso compromisso com a excelência. Acreditamos que o Direito é um instrumento de transformação social, e preparamos os nossos estudantes para serem agentes dessa mudança.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Missão, Visão, Valores */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: GraduationCap, titulo: 'Missão', texto: 'Formar profissionais do Direito altamente qualificados, promovendo a investigação científica e a extensão universitária ao serviço da comunidade.' },
                { icon: Award, titulo: 'Visão', texto: 'Ser uma faculdade de referência nacional e internacional na formação jurídica, reconhecida pela qualidade do seu ensino e pelo impacto da sua investigação.' },
                { icon: Globe, titulo: 'Valores', texto: 'Rigor, ética, inovação, responsabilidade social e respeito pelos direitos humanos.' },
              ].map((item, i) => (
                <motion.div
                  key={item.titulo}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl text-heading mb-3">{item.titulo}</h3>
                  <p className="text-body">{item.texto}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Números */}
        <section className="py-16 bg-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {numeros.map((num, i) => (
                <motion.div
                  key={num.rotulo}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary">{num.valor}</p>
                  <p className="text-white/60 mt-2">{num.rotulo}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Corpo Docente e Parcerias */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-2xl text-heading mb-4">Corpo Docente</h3>
                <p className="text-body mb-4">
                  O nosso corpo docente é composto por 18 professores e 6 investigadores, muitos dos quais com doutoramento obtido em universidades de prestígio. A experiência acumulada assegura um ensino de qualidade e uma investigação relevante para os desafios jurídicos contemporâneos.
                </p>
                <Link
                  href="/docentes"
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  Conheça os nossos docentes <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-heading mb-4">Parcerias Internacionais</h3>
                <p className="text-body mb-4">
                  A FD‑UNIKIVI mantém acordos de cooperação com a Faculdade de Direito da Universidade do Porto (Portugal) e outras instituições de ensino superior, promovendo intercâmbio de docentes e estudantes, e a realização de projectos de investigação conjuntos.
                </p>
                <Link
                  href="/parcerias"
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-50 text-center">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl text-heading mb-4">Pronto para fazer parte?</h2>
            <p className="text-body mb-8 max-w-xl mx-auto">
              Candidate‑se a uma das nossas licenciaturas ou inscreva‑se nos cursos de curta duração.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/cadastro" className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Criar conta
              </Link>
              <Link href="/contactos" className="border border-primary text-primary px-8 py-3 rounded-xl font-medium hover:bg-primary-light transition-colors">
                Contactar
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}