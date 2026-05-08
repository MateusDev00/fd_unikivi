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
    if (!loading && !token) {
      router.push('/login');
    } else if (!loading && user && !allowedRoles.includes(user.tipo)) {
      const tipo = user.tipo;
      if (tipo === 'admin') router.push('/modulos/admin');
      else if (tipo === 'docente') router.push('/modulos/docentes');
      else if (tipo === 'estudante') router.push('/modulos/estudante');
    }
  }, [loading, token, user, allowedRoles, router]);

  if (loading || !user) return <LawLoader />;
  if (!allowedRoles.includes(user.tipo)) return null; // será redirecionado

  return <>{children}</>;
}