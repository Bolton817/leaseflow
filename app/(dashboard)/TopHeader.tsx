'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

export function TopHeader({ 
  user 
}: { 
  user: { firstName: string, lastName: string, avatarUrl?: string | null } 
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
    <header className="h-16 border-b border-slate-800 bg-[#131A26]/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-end px-4 md:px-8">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Profile" width={36} height={36} className="w-full h-full object-cover" unoptimized={true} />
            ) : (
              <span className="text-sm font-bold text-amber-500">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#131A26] border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/20">
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
            </div>
            <div className="p-1">
              <Link 
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-amber-500/10 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
              <form action={logoutAction}>
                <button 
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
