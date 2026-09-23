import { requireSession } from '@/lib/auth/user';
import { getNotifications } from '@/lib/domain/notifications';
import Link from 'next/link';

export default async function CommunicationsPage() {
  const user = await requireSession();
  const notifications = await getNotifications(user.id);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Communications Outbox</h1>
          <p className="text-slate-400">Log of all messages sent to your tenants</p>
        </div>
      </header>

      {notifications.length === 0 ? (
        <div className="bg-[#131A26] rounded-xl p-12 border border-slate-800 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No messages sent yet</h3>
          <p className="text-slate-400">Generate an invoice or record a payment to trigger automated notifications.</p>
        </div>
      ) : (
        <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Recipient (Tenant)</th>
                <th className="px-6 py-4 font-medium">Channel</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Context</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {notifications.map((note) => (
                <tr key={note.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {note.sentAt ? new Date(note.sentAt).toLocaleString() : 'Pending'}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/tenants/${note.tenantId}`} className="text-amber-500 hover:text-amber-400">
                      {note.tenant.firstName} {note.tenant.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {note.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {note.type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    {note.invoiceId ? (
                      <Link href={`/invoices/${note.invoiceId}`} className="text-amber-500 hover:text-amber-400 text-xs">
                        {note.invoice?.invoiceNumber}
                      </Link>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {note.status}
                    </span>
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
