import { requireSession } from '@/lib/auth/user';
import { getDashboardMetrics } from '@/lib/domain/metrics';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireSession();
  const metrics = await getDashboardMetrics(user.id);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 pb-4 border-b border-slate-800 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {user.firstName}</h1>
          <p className="text-slate-400">Here is what is happening with your portfolio today.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Properties / Units</h3>
          <p className="text-3xl font-bold text-white">
            {metrics.propertiesCount} <span className="text-xl text-slate-500 font-medium">/ {metrics.unitsCount}</span>
          </p>
        </div>

        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Occupancy Rate</h3>
          <p className="text-3xl font-bold text-white">
            {metrics.occupancyRate.toFixed(1)}%
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${metrics.occupancyRate}%` }}></div>
          </div>
        </div>

        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-emerald-500">
            ${metrics.monthlyRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-2">Collected this month</p>
        </div>

        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Outstanding Balance</h3>
          <p className="text-3xl font-bold text-red-400">
            ${metrics.outstandingBalance.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-2">Across all unpaid invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg lg:col-span-1">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/properties/new" className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-between group">
              <span>Add Property</span>
              <span className="text-slate-500 group-hover:text-amber-500 transition-colors">&rarr;</span>
            </Link>
            <Link href="/tenants/new" className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-between group">
              <span>Register Tenant</span>
              <span className="text-slate-500 group-hover:text-amber-500 transition-colors">&rarr;</span>
            </Link>
            <Link href="/financials" className="px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg transition-colors flex items-center justify-between group">
              <span className="font-medium">Run Billing Cycle</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg lg:col-span-2">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-lg font-medium text-white">Recent Activity</h2>
          </div>
          
          {metrics.activity.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No recent activity found.
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      item.type === 'PAYMENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {item.type === 'PAYMENT' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.type === 'PAYMENT' ? 'Payment Received' : 'Invoice Generated'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.tenant} • {item.date.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${item.type === 'PAYMENT' ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {item.type === 'PAYMENT' ? '+' : ''}${item.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
