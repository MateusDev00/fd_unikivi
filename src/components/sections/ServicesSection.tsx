'use client';

import { Scale, Gavel, BookOpen, FileText, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { motion } from 'framer-motion';

const services = [
  { icon: Scale, title: 'Direito Civil', description: 'Especialização em contratos, família e sucessões.' },
  { icon: Gavel, title: 'Direito Penal', description: 'Formação em criminologia e processo penal.' },
  { icon: BookOpen, title: 'Investigação Jurídica', description: 'Produção científica e publicações académicas.' },
  { icon: FileText, title: 'Consultoria Legislativa', description: 'Apoio na elaboração de diplomas legais.' },
  { icon: Users, title: 'Clínica Jurídica', description: 'Atendimento gratuito à comunidade.' },
  { icon: Calendar, title: 'Eventos e Seminários', description: 'Debates e conferências com especialistas.' },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="O que oferecemos"
          title="Uma ampla gama de serviços institucionais"
          description="A Faculdade de Direito da UNIKIVI disponibiliza recursos e expertise para estudantes, profissionais e comunidade."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group mt-6 mb-6" 
              >
                {/* 🟢 CAMADA DE TRÁS (Cinza mais escuro) */}
                <div className="absolute -inset-y-4 inset-x-4 bg-gray-200/70 rounded-xl border border-gray-200 transition-all duration-300 group-hover:-inset-y-5 group-hover:bg-gray-200" />
                
                {/* 🟢 CAMADA DO MEIO (Cinza mais claro) */}
                <div className="absolute -inset-y-2 inset-x-2 bg-gray-100 rounded-xl border border-gray-100 transition-all duration-300 group-hover:-inset-y-3 group-hover:bg-gray-100" />

                {/* 🟢 CARD PRINCIPAL (Frente Branca) */}
                <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md p-8 border border-gray-100 z-10 h-full flex flex-col transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <h3 className="font-serif text-xl text-heading mb-3">{service.title}</h3>
                  <p className="text-body mb-6 flex-grow">{service.description}</p>
                  
                  <Link href="#" className="inline-flex items-center text-primary font-medium hover:underline mt-auto">
                    Saiba mais 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}