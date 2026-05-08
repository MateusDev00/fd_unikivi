import { Scale, Gavel, BookOpen, FileText, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';

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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="font-serif text-xl text-heading mb-3">{service.title}</h3>
                <p className="text-body mb-6">{service.description}</p>
                <Link href="#" className="inline-flex items-center text-primary font-medium hover:underline">
                  Saiba mais
                  <span className="ml-2">→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}