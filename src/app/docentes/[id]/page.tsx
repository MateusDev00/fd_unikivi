'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { LawLoader } from '@/components/ui/LawLoader';
import { GraduationCap, BookOpen, MapPin, Mail, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DocentePerfil {
  id: number;
  nome: string;
  email: string | null;
  departamento: string;
  titulacao: string;
  area_especializacao: string | null;
  biografia: string | null;
  foto: string | null;
  website: string | null;
  redes_sociais: Record<string, string> | null;
}

export default function PerfilDocentePage() {
  const { id } = useParams<{ id: string }>();
  const [docente, setDocente] = useState<DocentePerfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPerfil = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${apiBase}/docentes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDocente(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [id]);

  if (loading) return <LawLoader />;

  if (!docente) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 text-center">
          <h1 className="font-serif text-2xl text-heading">Docente não encontrado</h1>
          <Link href="/docentes" className="text-primary hover:underline">
            Voltar para docentes
          </Link>
        </main>
        <Footer />
        <ScrollToTop />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/docentes" className="inline-flex items-center text-body hover:text-heading mb-8 text-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para docentes
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              {docente.foto ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image src={docente.foto} alt={docente.nome} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
              )}
              <div>
                <h1 className="font-serif text-3xl text-heading">{docente.nome}</h1>
                <p className="text-primary font-medium">{docente.titulacao}</p>
                <p className="text-body">{docente.area_especializacao || docente.departamento}</p>
              </div>
            </div>

            <div className="space-y-4 text-body">
              {docente.departamento && (
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{docente.departamento}</p>
              )}
              {docente.email && (
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{docente.email}</p>
              )}
              {docente.website && (
                <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />{docente.website}</p>
              )}
              {docente.biografia && (
                <div>
                  <h2 className="font-serif text-xl text-heading mb-2">Biografia</h2>
                  <p className="whitespace-pre-wrap leading-relaxed">{docente.biografia}</p>
                </div>
              )}
              {docente.redes_sociais && Object.keys(docente.redes_sociais).length > 0 && (
                <div>
                  <h3 className="font-serif text-lg text-heading mb-2">Redes Sociais</h3>
                  <ul>
                    {Object.entries(docente.redes_sociais).map(([rede, url]) => (
                      <li key={rede} className="mb-1">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline capitalize">
                          {rede}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}