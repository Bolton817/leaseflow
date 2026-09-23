'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Users, 
  Wallet,
  Settings 
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Tenants', href: '/tenants', icon: Users },
  { name: 'Financials', href: '/financials', icon: Wallet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item) => {
        // Special check for dashboard vs other routes to prevent matching all routes when just '/'
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
              isActive 
                ? 'bg-amber-500/10 text-amber-500 font-medium shadow-[inset_0_1px_0_0_rgba(245,158,11,0.1)]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {/* Active Indicator Bar */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-1 bg-amber-500 rounded-r-full shadow-[0_0_8px_0_rgba(245,158,11,0.6)]" />
            )}
            
            <Icon 
              className={`w-5 h-5 transition-transform duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            
            <span className="relative z-10">{item.name}</span>
            
            {/* Hover shine effect */}
            {!isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[800ms] ease-in-out" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
