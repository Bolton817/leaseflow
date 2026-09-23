import Link from 'next/link';
import { logoutAction } from '@/lib/auth/actions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B101A] text-slate-200 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-[#131A26] border-b md:border-r border-slate-800 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LeaseFlow</h1>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/dashboard" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/properties" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            Properties
          </Link>
          <Link href="/tenants" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            Tenants
          </Link>
          <Link href="/invoices" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            Invoices
          </Link>
          <Link href="/payments" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            Payments
          </Link>
          <Link href="/communications" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            Communications
          </Link>
          <Link href="/audit" className="px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white">
            Audit Logs
          </Link>
        </div>
        
        <div className="mt-auto pt-6 border-t border-slate-800">
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign out
            </button>
          </form>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
