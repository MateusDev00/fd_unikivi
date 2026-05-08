'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactosPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    // Simulação de envio – substituir por chamada à API de contacto quando existir
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Fale connosco"
            title="Contactos"
            description="Estamos à sua disposição para qualquer esclarecimento."
          />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações de contacto */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-serif text-xl text-heading mb-4">Informações</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-heading">Morada</p>
                      <p className="text-sm text-body">Bairro Popular, Uíge, Angola</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-heading">Telefone</p>
                      <p className="text-sm text-body">+244 222 000 000</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-heading">Email</p>
                      <p className="text-sm text-body">fd@unikivi.ao</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-heading">Horário</p>
                      <p className="text-sm text-body">Seg‑Sex: 08h00 – 17h00</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Mapa placeholder */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-serif text-xl text-heading mb-4">Localização</h3>
                <div className="h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-body/40" />
                  <span className="ml-2 text-body/60 text-sm">Mapa em breve</span>
                </div>
              </div>
            </motion.div>

            {/* Formulário de contacto */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="font-serif text-2xl text-heading mb-2">Envie‑nos uma mensagem</h3>
                <p className="text-body mb-6">Responderemos assim que possível.</p>

                {status === 'success' && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Mensagem enviada com sucesso! Entraremos em contacto.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">Erro ao enviar. Tente novamente mais tarde.</span>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-heading mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Assunto</label>
                    <input
                      type="text"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1">Mensagem</label>
                    <textarea
                      rows={5}
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        A enviar...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Enviar Mensagem
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}