import { requireSession } from '@/lib/auth/user';
import { getAuditLogs } from '@/lib/domain/audit';

export default async function AuditLogsPage() {
  const user = await requireSession();
  const logs = await getAuditLogs(user.id);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Audit Logs</h1>
          <p className="text-slate-400">An immutable historical trail of all sensitive system actions.</p>
        </div>
      </header>

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
    </div>
  );
}
