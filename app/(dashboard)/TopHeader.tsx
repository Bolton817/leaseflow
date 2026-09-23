'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, Search } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

export function TopHeader({ 
  user 
}: { 
  user: { firstName: string, lastName: string, email: string, avatarUrl?: string | null } 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 md:static flex items-center justify-between px-4 py-3 md:px-8 md:py-6 bg-slate-50 dark:bg-[#131A26] md:bg-transparent md:dark:bg-transparent border-b border-slate-200 dark:border-slate-800 md:border-none">
      
      {/* Mobile Logo */}
      <div className="md:hidden">
        <Image src="/logos/leaseflow-logo.png" alt="LeaseFlow" width={120} height={32} unoptimized={true} className="h-8 w-auto object-contain dark:invert-0 invert" />
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl mr-8 relative">
        <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search properties, tenants, invoices..." 
          className="w-full bg-slate-100 dark:bg-[#131A26] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-black dark:text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-500"
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Profile" width={40} height={40} className="w-full h-full object-cover" unoptimized={true} />
            ) : (
              <span className="text-sm font-bold text-amber-500">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.email}</p>
            </div>
            <div className="p-1.5">
              <Link 
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
              <form action={logoutAction}>
                <button 
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
