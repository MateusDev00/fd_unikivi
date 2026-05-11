import Link from 'next/link';
import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Sobre a FD-UNIKIVI</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A Faculdade de Direito da Universidade Kimpa Vita é uma instituição de excelência
              na formação jurídica em Angola, comprometida com a produção de conhecimento
              e a promoção da justiça social.
            </p>
          </div>

          {/* Coluna 2 - Links */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Links Úteis</h3>
            <ul className="space-y-2">
              {['Sobre Nós', 'Cursos', 'Corpo Docente', 'Investigação', 'Biblioteca'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-300 hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 - Horários */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Horário de Funcionamento</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Segunda - Sexta: 08h00 - 15h00</li>        
            </ul>
          </div>

          {/* Coluna 4 - Contactos */}
          <div>
            <h3 className="font-serif text-xl mb-4 text-primary">Contactos</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Bairro Popular, Uíge, Angola
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:direito.unikivi@gmail.ao" className="text-gray-300 hover:text-primary text-sm">
                  direito.unikivi@gmail.ao
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+244926135112" className="text-gray-300 hover:text-primary text-sm">
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
                  className="bg-dark-light p-2 rounded-full text-white hover:bg-primary transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-dark-light">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Faculdade de Direito - Universidade Kimpa Vita.
          Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}