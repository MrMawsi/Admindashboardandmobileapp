import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '../components/ui/shared';
import { Home, Repeat, User, MessageCircle } from 'lucide-react';
import { GlobeBackground } from '../components/mobile/GlobeBackground';
import { useAuth } from '@/utils/auth-context';

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && location !== '/app/login') {
      setLocation('/app/login');
    }
  }, [isAuthenticated, location, setLocation]);

  const navItems = [
    { icon: Home, label: 'Home', href: '/app' },
    { icon: Repeat, label: 'Trading', href: '/app/trading' },
    { icon: User, label: 'Profile', href: '/app/profile' },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center bg-black font-sans text-slate-100 overflow-hidden">
      <div className="relative w-full max-w-[480px] h-screen bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Animated Background */}
        <GlobeBackground />
        
        {/* Content Area */}
        <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden no-scrollbar pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-amber-500/20 pb-safe">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer gap-1">
                    <div className={cn(
                      "p-1.5 rounded-xl transition-all duration-300",
                      isActive ? "bg-amber-500/20 text-amber-400 translate-y-[-4px]" : "text-slate-500"
                    )}>
                      <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive ? "text-amber-400" : "text-slate-600"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}