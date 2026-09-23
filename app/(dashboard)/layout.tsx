import Link from 'next/link';
import Image from 'next/image';
import { requireSession } from '@/lib/auth/user';
import { SidebarNav } from './SidebarNav';
import { TopHeader } from './TopHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();

  return (
    <div className="min-h-screen bg-[#0B101A] text-slate-200 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Mobile Top Header (Logo only) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#131A26] border-b border-slate-800 sticky top-0 z-40">
        <Image src="/logos/leaseflow-logo.png" alt="LeaseFlow" width={120} height={32} unoptimized={true} className="h-8 w-auto object-contain" />
      </header>

      {/* Navigation (Bottom Bar on Mobile, Sidebar on Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:w-64 md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-[#131A26] border-t md:border-t-0 md:border-r border-slate-800 p-2 md:p-6 flex flex-row md:flex-col gap-1 md:gap-6">
        <div className="hidden md:block">
          <Image src="/logos/leaseflow-logo.png" alt="LeaseFlow" width={150} height={40} unoptimized={true} className="h-10 w-auto object-contain" />
        </div>
        
        <SidebarNav />
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
