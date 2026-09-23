import { requireSession } from '@/lib/auth/user';
import { getAuditLogs } from '@/lib/domain/audit';

export default async function SettingsPage() {
  const user = await requireSession();
  const logs = await getAuditLogs(user.id);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex justify-between items-start pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-slate-400">Manage your profile and review system activity</p>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Profile Details
        </h2>
        <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-hidden max-w-2xl">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 border-b border-slate-800/50 pb-4">
              <span className="text-slate-500 font-medium">First Name</span>
              <span className="col-span-2 text-white">{user.firstName}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-800/50 pb-4">
              <span className="text-slate-500 font-medium">Last Name</span>
              <span className="col-span-2 text-white">{user.lastName}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-800/50 pb-4">
              <span className="text-slate-500 font-medium">Email</span>
              <span className="col-span-2 text-white">{user.email}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-800/50 pb-4">
              <span className="text-slate-500 font-medium">Role</span>
              <span className="col-span-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {user.role}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="col-span-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Audit Logs
        </h2>
        {logs.length === 0 ? (
          <div className="bg-[#131A26] rounded-xl p-12 border border-slate-800 text-center">
            <h3 className="text-lg font-medium text-white mb-2">No audit events found</h3>
            <p className="text-slate-400">Perform an action like adding a property or tenant to generate logs.</p>
          </div>
        ) : (
          <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Entity Type</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Entity ID</th>
                  <th className="px-6 py-4 font-medium">Metadata Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-amber-500 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {log.entityId}
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] text-slate-400 font-mono bg-[#0B101A] p-2 rounded border border-slate-800 overflow-x-auto max-w-xs">
                        {log.metadata}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
