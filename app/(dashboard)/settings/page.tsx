import { requireSession } from '@/lib/auth/user';
import { getAuditLogs } from '@/lib/domain/audit';
import { EditProfileModal } from './EditProfileModal';
import Image from 'next/image';

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
        <div className="bg-[#131A26] rounded-3xl border border-slate-800 p-8 w-full flex flex-col md:flex-row items-center md:items-start gap-8 shadow-lg">
          {/* Circular Avatar */}
          <div className="w-24 h-24 shrink-0 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" unoptimized={true} />
            ) : (
              <span className="text-3xl font-bold text-amber-500 tracking-wider">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full space-y-6 text-center md:text-left">
            {/* Header row: Name, Email, Badges & Edit Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-slate-400 mt-1">{user.email}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {user.role}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <EditProfileModal user={user} />
              </div>
            </div>

            {/* Footer row: Account ID */}
            <div className="pt-6 border-t border-slate-800/80">
              <p className="text-sm text-slate-500">
                Account ID: <span className="font-mono text-slate-400 ml-1">{user.id}</span>
              </p>
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
