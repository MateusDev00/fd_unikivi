'use client';

import { useEffect, useState } from 'react';

function Particula({ x, y, tamanho, duracao, delay, cor }: { x: number; y: number; tamanho: number; duracao: number; delay: number; cor: string }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: tamanho, height: tamanho, left: `${x}%`, top: `${y}%`,
        backgroundColor: cor,
        animation: `flutuar ${duracao}s ${delay}s ease-in-out infinite`,
        opacity: 0,
      }}
    />
  );
}

function SimboloJuridico() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-primary/20" style={{ animation: 'orbita 3s linear infinite', width: 100, height: 100, left: -50, top: -50, transformOrigin: 'center center' }} />
      <div className="absolute inset-0 rounded-full border border-primary/10" style={{ animation: 'orbita 4s linear infinite reverse', width: 140, height: 140, left: -70, top: -70 }} />
      <div className="absolute h-3 w-3 rounded-full bg-primary/60" style={{ animation: 'orbita-particula-1 4s linear infinite', left: -70, top: -70 }} />
      <div className="absolute h-2 w-2 rounded-full bg-dark-light/80" style={{ animation: 'orbita-particula-2 3s linear infinite', left: -50, top: -50 }} />
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="8" x2="6" y2="8" />
          <line x1="6" y1="8" x2="6" y2="4" />
          <polyline points="8,4 6,4 4,4" />
          <line x1="18" y1="8" x2="18" y2="4" />
          <polyline points="16,4 18,4 20,4" />
          <line x1="12" y1="10" x2="12" y2="12" />
        </svg>
      </div>
    </div>
  );
}

function BarraProgresso() {
  return (
    <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-200">
      <div className="h-full rounded-full bg-primary" style={{ animation: 'barra-progresso 1.8s ease-in-out infinite', width: '40%' }} />
    </div>
  );
}

function CodigoJuridico() {
  const linhas = [
    'import { Justica } from "@unikivi/fd";',
    'const sentenca = await analisar(processo);',
    'if (culpa) condenar(proporcionalidade);',
    'return new Direito("Angola");',
  ];
  const [linhaAtiva, setLinhaAtiva] = useState(0);
  useEffect(() => {
    const intervalo = setInterval(() => setLinhaAtiva((prev) => (prev + 1) % linhas.length), 1200);
    return () => clearInterval(intervalo);
  }, []);
  return (
    <div className="font-mono text-xs leading-relaxed">
      {linhas.map((linha, i) => (
        <div key={i} className={`transition-all duration-500 ${i === linhaAtiva ? 'text-primary translate-x-1' : 'text-gray-400'}`}>
          <span className="text-gray-300 mr-2">{String(i + 1).padStart(2, '0')}</span>
          {linha}
          {i === linhaAtiva && <span className="animate-pulse ml-1">▊</span>}
        </div>
      ))}
    </div>
  );
}

export function LawLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Particula x={15} y={25} tamanho={4} duracao={6} delay={0} cor="#4da748" />
        <Particula x={85} y={35} tamanho={3} duracao={7} delay={1} cor="#4da748" />
        <Particula x={20} y={70} tamanho={5} duracao={8} delay={2} cor="#e6f4e7" />
        <Particula x={75} y={65} tamanho={3} duracao={5} delay={0.5} cor="#e6f4e7" />
        <Particula x={50} y={15} tamanho={4} duracao={9} delay={3} cor="#183f2e" />
        <Particula x={10} y={80} tamanho={2} duracao={6} delay={1.5} cor="#4da748" />
        <Particula x={90} y={80} tamanho={3} duracao={7} delay={2.5} cor="#183f2e" />
      </div>
      <div className="flex flex-col items-center gap-10 z-10">
        <SimboloJuridico />
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-heading tracking-wide">FD<span className="text-primary">UNIKIVI</span></h2>
          <p className="mt-1 text-sm text-body">Preparando o Direito</p>
        </div>
        <BarraProgresso />
        <CodigoJuridico />
      </div>
    </div>
  );
}