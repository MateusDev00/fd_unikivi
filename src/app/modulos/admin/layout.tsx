import { RoleRoute } from '@/components/auth/RoleRoute';
import { Sidebar } from './components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex bg-gray-50 overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-4 sm:p-6 lg:pl-72 transition-all duration-300">
          <div className="max-w-full overflow-x-auto">{children}</div>
        </main>
      </div>
    </RoleRoute>
  );
}