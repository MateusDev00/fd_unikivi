'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GraduationCap, BookOpen, MapPin, Mail, Search } from 'lucide-react';
import { LawLoader } from '@/components/ui/LawLoader';
import { motion } from 'framer-motion';

interface Docente {
  id: number;
  nome: string;
  bilhete: string;
  email: string | null;
  departamento: string;
  titulacao: string;
  area_especializacao: string | null;
  criado_em: string;
}

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDocentes = async () => {
      setLoading(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${apiBase}/docentes?page=1&limit=50`);
        if (res.ok) {
          const data = await res.json();
          setDocentes(data.data);
        }
      } catch (error) {
        console.error('Erro ao carregar docentes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocentes();
  }, []);

  const filtrados = searchTerm
    ? docentes.filter(d =>
        d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.departamento && d.departamento.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : docentes;

  if (loading) return <LawLoader />;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Corpo Docente"
            title="Os nossos docentes"
            description="Conheça os professores e investigadores da Faculdade de Direito."
          />

          {/* Pesquisa */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-body" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {filtrados.length === 0 ? (
            <p className="text-center text-body mt-12">Nenhum docente encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {filtrados.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-heading mb-0.5">{doc.nome}</h3>
                      {doc.titulacao && (
                        <p className="text-sm text-primary font-medium">{doc.titulacao}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-body">
                    {doc.departamento && (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        {doc.departamento}
                      </p>
                    )}
                    {doc.area_especializacao && (
                      <p className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                        {doc.area_especializacao}
                      </p>
                    )}
                    {doc.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        {doc.email}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}