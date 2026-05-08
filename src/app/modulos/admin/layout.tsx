import { RoleRoute } from '@/components/auth/RoleRoute';
import { Sidebar } from './components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 lg:pl-72">{children}</main>
      </div>
    </RoleRoute>
  );
}