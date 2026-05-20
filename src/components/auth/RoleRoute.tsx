'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LawLoader } from '@/components/ui/LawLoader';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verifica a cada 2 segundos se o token ainda é válido
    const interval = setInterval(() => {
      const savedToken = localStorage.getItem('authToken');
      if (!savedToken) {
        router.push('/login');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    } else if (!loading && user && !allowedRoles.includes(user.tipo)) {
      const tipo = user.tipo;
      if (tipo === 'admin') router.push('/modulos/admin');
      else if (tipo === 'docente') router.push('/modulos/docentes');
      else if (tipo === 'estudante') router.push('/modulos/estudante');
    }
  }, [loading, token, user, allowedRoles, router]);

  // Evento para detetar quando a página é restaurada do cache (botão voltar)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // A página foi carregada do cache do navegador (bfcache)
        const savedToken = localStorage.getItem('authToken');
        if (!savedToken) {
          router.push('/login');
        }
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [router]);

  if (loading || !user) return <LawLoader />;
  if (!allowedRoles.includes(user.tipo)) return null;

  return <>{children}</>;
}