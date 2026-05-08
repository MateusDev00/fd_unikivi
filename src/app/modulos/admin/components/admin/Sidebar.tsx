'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Calendar, FolderOpen, ChevronLeft, Menu, LogOut, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

const menuItems = [
  { href: '/modulos/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/modulos/admin/publicacaoes', label: 'Publicações', icon: FileText },
  { href: '/modulos/admin/eventos', label: 'Eventos', icon: Calendar },
  { href: '/modulos/admin/documentos', label: 'Documentos', icon: FolderOpen },
  { href: '/modulos/admin/usuarios', label: 'Utilizadores', icon: Users }, // <-- NOVO
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-dark text-white z-50 transform transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-dark-light">
          <Link href="/" className="flex items-center space-x-2 overflow-hidden">
            <span className="font-serif text-xl font-bold whitespace-nowrap">
              {!collapsed ? (
                <>FD<span className="text-primary">UNIKIVI</span></>
              ) : (
                <span className="text-primary">FD</span>
              )}
            </span>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 text-gray-400 hover:text-white transition"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-gray-400"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-dark-light hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="border-t border-dark-light p-4">
          {!collapsed && user && (
            <div className="text-sm text-gray-300 mb-2 truncate">{user.nome}</div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && 'Sair'}
          </Button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-dark text-white rounded-lg shadow-lg"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}