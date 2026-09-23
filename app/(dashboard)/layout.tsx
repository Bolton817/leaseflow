import Link from 'next/link';
import Image from 'next/image';
import { requireSession } from '@/lib/auth/user';
import { SidebarNav } from './SidebarNav';
import { TopHeader } from './TopHeader';

import { LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B101A] text-black dark:text-slate-200 flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Navigation (Bottom Bar on Mobile, Sidebar on Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:w-64 md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-slate-50 dark:bg-[#131A26] border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 p-2 md:p-6 flex flex-col justify-between">
        <div className="flex flex-row md:flex-col gap-1 md:gap-6 w-full">
          <div className="hidden md:block">
            <Image src="/logos/leaseflow-logo.png" alt="LeaseFlow" width={150} height={40} unoptimized={true} className="h-10 w-auto object-contain dark:invert-0 invert" />
          </div>
          
          <SidebarNav />
        </div>

        {/* Desktop Sign Out Button at Bottom */}
        <div className="hidden md:block mt-6">
          <form action={logoutAction}>
            <button 
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </form>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader user={user} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
