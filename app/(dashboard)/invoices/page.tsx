import { requireSession } from '@/lib/auth/user';
import { getInvoices } from '@/lib/domain/invoices';
import Link from 'next/link';
import GenerateInvoicesButton from './GenerateInvoicesButton';

export default async function InvoicesPage() {
  const user = await requireSession();
  const invoices = await getInvoices(user.id);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-slate-400">Manage billing and rent collection</p>
        </div>
        <GenerateInvoicesButton />
      </header>

      {invoices.length === 0 ? (
        <div className="bg-[#131A26] rounded-xl p-12 border border-slate-800 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No invoices found</h3>
          <p className="text-slate-400 mb-6">Run a billing cycle to generate invoices for active tenants.</p>
        </div>
      ) : (
        <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Period</th>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    <Link href={`/invoices/${invoice.id}`} className="hover:text-amber-500 transition-colors">
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{invoice.billingPeriod}</td>
                  <td className="px-6 py-4">
                    {invoice.tenant.firstName} {invoice.tenant.lastName}
                    <div className="text-xs text-slate-500 font-normal">
                      {invoice.unit.property.name}, Unit {invoice.unit.unitNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">{invoice.dueDate.toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      invoice.status === 'ISSUED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      invoice.status === 'OVERDUE' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white">
                    ${invoice.amount.toString()}
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
