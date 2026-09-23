import { requireSession } from '@/lib/auth/user';
import { getInvoices } from '@/lib/domain/invoices';
import { getPayments } from '@/lib/domain/payments';
import Link from 'next/link';
import GenerateInvoicesButton from '../invoices/GenerateInvoicesButton';

export default async function FinancialsPage() {
  const user = await requireSession();
  const [invoices, payments] = await Promise.all([
    getInvoices(user.id),
    getPayments(user.id),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <header className="flex justify-between items-start mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Financials</h1>
            <p className="text-slate-400">Manage billing and view rent collections</p>
          </div>
          <GenerateInvoicesButton />
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Invoices
          </h2>
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
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Payments Ledger
          </h2>
          {payments.length === 0 ? (
            <div className="bg-[#131A26] rounded-xl p-12 border border-slate-800 text-center">
              <h3 className="text-lg font-medium text-white mb-2">No payments received yet</h3>
              <p className="text-slate-400">Record a payment from an invoice details page.</p>
            </div>
          ) : (
            <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Invoice #</th>
                    <th className="px-6 py-4 font-medium">Tenant</th>
                    <th className="px-6 py-4 font-medium">Method & Ref</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        {payment.paymentDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {payment.invoice ? (
                          <Link href={`/invoices/${payment.invoice.id}`} className="text-amber-500 hover:text-amber-400">
                            {payment.invoice.invoiceNumber}
                          </Link>
                        ) : (
                          <span className="text-slate-500">Unlinked</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {payment.tenant.firstName} {payment.tenant.lastName}
                        <div className="text-xs text-slate-500 font-normal">
                          {payment.unit.property.name}, Unit {payment.unit.unitNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {payment.paymentMethod}
                        {payment.referenceNumber && (
                          <div className="text-xs text-slate-500 font-normal">Ref: {payment.referenceNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-500">
                        + ${payment.amount.toString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
