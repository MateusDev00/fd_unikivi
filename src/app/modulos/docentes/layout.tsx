import type { Metadata } from 'next';
import { RoleRoute } from '@/components/auth/RoleRoute';
import { SidebarDocente } from '@/components/docente/SidebarDocente';

export const metadata: Metadata = {
  title: 'Área do Docente – FD-UNIKIVI',
  description: 'Painel do docente da Faculdade de Direito',
};

export default function DocenteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleRoute allowedRoles={['docente']}>
      <div className="min-h-screen flex bg-gray-50">
        <SidebarDocente />
        <main className="flex-1 p-6 lg:pl-72">{children}</main>
      </div>
    </RoleRoute>
  );
}