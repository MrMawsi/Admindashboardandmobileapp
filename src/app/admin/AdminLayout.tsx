import React, { useEffect } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { cn } from '../components/ui/shared';
import { LayoutDashboard, Users, FileText, Settings, MessageSquare, Database, LogOut } from 'lucide-react';
import { useAuth } from '@/utils/auth-context';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, isAdmin, setLocation]);
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'User Management', href: '/admin/users' },
    { icon: FileText, label: 'Content & Feed', href: '/admin/content' },
    { icon: Database, label: 'Data Center', href: '/admin/data' },
    { icon: MessageSquare, label: 'Customer Service', href: '/admin/messages' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                window.location.pathname === item.href 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}>
                <item.icon size={18} />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-900">
        <div className="container mx-auto p-8 max-w-[1440px]">
          {children}
        </div>
      </main>
    </div>
  );
}