import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react';

// Lista de parceiros – inicialmente o logo repetido 5 vezes.
const parceiros = [
  { id: 1, nome: 'Parceiro 1', logo: '/images/logo.png' },
  { id: 2, nome: 'Parceiro 2', logo: '/images/logo.png' },
  { id: 3, nome: 'Parceiro 3', logo: '/images/logo.png' },
  { id: 4, nome: 'Parceiro 4', logo: '/images/logo.png' },
  { id: 5, nome: 'Parceiro 5', logo: '/images/logo.png' },
];

export function Footer() {
  return (
    <footer className="bg-white text-dark border-t border-primary/10">
      {/* Cabeçalho do footer com logo */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 border-b border-primary/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary/60">
              <Image
                src="/images/logo.png"
                alt="Logo FD-UNIKIVI"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-xl md:text-2xl text-primary">
                Faculdade de Direito
              </h2>
              <p className="text-dark/70 text-sm font-medium">
                Universidade Kimpa Vita
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Colunas principais */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Sobre a FD-UNIKIVI</h3>
            <p className="text-body/80 text-sm leading-relaxed text-justify">
              A Faculdade de Direito da Universidade Kimpa Vita é uma instituição de excelência
              na formação jurídica em Angola, comprometida com a produção de conhecimento
              e a promoção da justiça social.
            </p>
          </div>

          {/* Coluna 2 - Links Úteis */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Links Úteis</h3>
            <ul className="space-y-2">
              {['Sobre Nós', 'Cursos', 'Corpo Docente', 'Investigação', 'Biblioteca'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-dark/70 hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 - Horários */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Horário de Funcionamento</h3>
            <ul className="space-y-2 text-dark/70 text-sm">
              <li>Segunda - Sexta: 08h00 - 15h00</li>
              <li>Sábado: 08h00 - 12h00</li>
              <li>Domingo: Fechado</li>
            </ul>
          </div>

          {/* Coluna 4 - Contactos */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Contactos</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-dark/70 text-sm">Bairro Cassexe, Uíge, Angola</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:direito.unikivi@gmail.ao" className="text-dark/70 hover:text-primary text-sm">
                  direito.unikivi@gmail.ao
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+244926135112" className="text-dark/70 hover:text-primary text-sm">
                  +244 926 135 112 / 921 094 757
                </a>
              </li>
            </ul>
            {/* Redes Sociais */}
            <div className="flex space-x-3 mt-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zona de Parceiros – marquee dinâmico */}
      <div className="border-t border-primary/10 bg-gray-50 py-8">
        <h3 className="text-center font-serif text-lg text-primary mb-6 uppercase tracking-wider">
          Nossos Parceiros
        </h3>
        <div className="relative overflow-hidden">
          {/* Gradientes laterais para suavizar */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />

          {/* Conteúdo em marquee */}
          <div className="flex animate-marquee whitespace-nowrap">
            {[...parceiros, ...parceiros].map((parceiro, index) => (
              <div
                key={`${parceiro.id}-${index}`}
                className="flex-shrink-0 w-24 h-24 mx-6 relative bg-white rounded-full overflow-hidden shadow-sm border border-primary/10"
              >
                <Image
                  src={parceiro.logo}
                  alt={parceiro.nome}
                  fill
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary/10">
        <div className="container mx-auto px-4 py-6 text-center text-dark/60 text-sm">
          &copy; {new Date().getFullYear()} Faculdade de Direito - Universidade Kimpa Vita.
          Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}