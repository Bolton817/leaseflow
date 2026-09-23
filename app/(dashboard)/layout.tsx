import Link from 'next/link';
import Image from 'next/image';
import { logoutAction } from '@/lib/auth/actions';
import { SidebarNav } from './SidebarNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B101A] text-slate-200 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#131A26] border-b border-slate-800 sticky top-0 z-40">
        <Image src="/logos/leaseflow-logo.png" alt="LeaseFlow" width={120} height={32} className="h-8 w-auto object-contain" />
        <form action={logoutAction}>
          <button type="submit" className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </form>
      </header>

      {/* Navigation (Bottom Bar on Mobile, Sidebar on Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:w-64 md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-[#131A26] border-t md:border-t-0 md:border-r border-slate-800 p-2 md:p-6 flex flex-row md:flex-col gap-1 md:gap-6">
        <div className="hidden md:block">
          <Image src="/logos/leaseflow-logo.png" alt="LeaseFlow" width={150} height={40} className="h-10 w-auto object-contain" />
        </div>
        
        <SidebarNav />
        
        <div className="hidden md:block mt-auto pt-6 border-t border-slate-800">
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign out
            </button>
          </form>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
