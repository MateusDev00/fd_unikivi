import type { Metadata } from 'next';
import { RoleRoute } from '@/components/auth/RoleRoute';
import { HeaderEstudante } from '@/components/estudante/HeaderEstudante';

export const metadata: Metadata = {
  title: 'Área do Estudante – FD-UNIKIVI',
  description: 'Painel do estudante da Faculdade de Direito',
};

export default function EstudanteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleRoute allowedRoles={['estudante']}>
      <div className="min-h-screen bg-gray-50">
        <HeaderEstudante />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </RoleRoute>
  );
}