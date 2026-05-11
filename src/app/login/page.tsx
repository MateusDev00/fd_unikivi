'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogIn, AlertCircle, Lock, ArrowLeft, CreditCard, Scale } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [bilhete, setBilhete] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(bilhete, senha);
      router.push('/splash');
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Painel Esquerdo — Mural Institucional */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-dark overflow-hidden">
        {/* Imagem de fundo com opacidade aumentada para visibilidade */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-60" />
        {/* Overlay gradiente reduzido para não esconder a imagem */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark/40 to-dark/30 backdrop-blur-[0.5px]" />
        {/* Padrão pontilhado decorativo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full text-white">
          {/* Cabeçalho com logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Scale className="h-6 w-6 text-primary-light" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-primary-light">
              FD  <span className="text-primary-light">UNIKIVI</span>
            </span>
          </Link>

          {/* Conteúdo central */}
          <div className="mt-auto mb-auto">
            <motion.h2
              className="font-serif text-4xl xl:text-5xl leading-tight mb-6 text-primary-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Portal da<br />
              <span className="text-primary-light">Faculdade de Direito</span>
            </motion.h2>
            <motion.p
              className="text-white/80 text-lg max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Aceda ao painel administrativo para gerir publicações, eventos
              e documentos oficiais da instituição.
            </motion.p>
            <motion.div
              className="mt-8 flex gap-4 text-sm text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> Ambiente seguro
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> Acesso por bilhete
              </span>
            </motion.div>
          </div>

          {/* Rodapé */}
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Universidade Kimpa Vita — Faculdade de Direito
          </p>
        </div>
      </div>

      {/* Painel Direito — Formulário */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Link para voltar */}
          <Link
            href="/"
            className="inline-flex items-center text-body hover:text-heading mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Voltar ao site</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light mb-4">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-serif text-3xl text-heading">Iniciar Sessão</h2>
              <p className="text-body mt-2">Utilize o seu nº de bilhete e palavra‑passe.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label
                  htmlFor="bilhete"
                  className="block text-sm font-medium text-heading mb-1"
                >
                  Nº do Bilhete
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-body" />
                  <input
                    id="bilhete"
                    type="text"
                    value={bilhete}
                    onChange={(e) => setBilhete(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    placeholder="Ex: 000123456LA"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="block text-sm font-medium text-heading mb-1"
                >
                  Palavra‑passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-body" />
                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Autenticando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

          
          </div>
        </motion.div>
      </div>
    </div>
  );
}