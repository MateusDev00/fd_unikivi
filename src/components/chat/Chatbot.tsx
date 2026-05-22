'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL || 'https://fd-agente.onrender.com';

function gerarSessionId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('fd_unikivi_session');
  if (!id) {
    id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('fd_unikivi_session', id);
  }
  return id;
}

interface Message {
  id: string;
  tipo: 'user' | 'assistant' | 'error';
  texto: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sessionId = useRef(gerarSessionId());

  // Mensagem inicial de boas‑vindas
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          tipo: 'assistant',
          texto: 'Olá! Sou o assistente virtual da Faculdade de Direito da UNIKIVI. Como posso ajudar?',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const enviar = async () => {
    const pergunta = input.trim();
    if (!pergunta || loading) return;
    setInput('');

    const userMsg: Message = {
      id: crypto.randomUUID(),
      tipo: 'user',
      texto: pergunta,
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${AGENT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta, session_id: sessionId.current }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Erro ${response.status}`);
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          tipo: 'assistant',
          texto: data.resposta || 'O agente não retornou uma resposta.',
        },
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          tipo: 'error',
          texto:
            err.name === 'AbortError'
              ? 'O assistente demorou muito a responder. Tente novamente.'
              : `Erro: ${err.message}. Verifique se o assistente está online.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 ${
          isOpen
            ? 'bg-gray-200 text-dark rotate-90'
            : 'bg-primary text-white hover:bg-primary/90 hover:scale-110'
        }`}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Janela de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-[380px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Cabeçalho */}
            <div className="bg-dark text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold">
                  FD<span className="text-primary">UNIKIVI</span> Assistente
                </h3>
                <p className="text-xs text-white/70 mt-0.5">Faculdade de Direito · Universidade Kimpa Vita</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.tipo === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.tipo === 'user'
                        ? 'bg-primary text-white'
                        : msg.tipo === 'assistant'
                        ? 'bg-dark text-white'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {msg.tipo === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : msg.tipo === 'assistant' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.tipo === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : msg.tipo === 'assistant'
                        ? 'bg-white border border-gray-200 text-heading rounded-bl-md shadow-sm'
                        : 'bg-red-50 border border-red-200 text-red-800 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.texto}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreva a sua pergunta..."
                  className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={enviar}
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}