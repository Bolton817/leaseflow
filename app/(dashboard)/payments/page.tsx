import { requireSession } from '@/lib/auth/user';
import { getPayments } from '@/lib/domain/payments';
import Link from 'next/link';

export default async function PaymentsPage() {
  const user = await requireSession();
  const payments = await getPayments(user.id);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments Ledger</h1>
          <p className="text-slate-400">Master record of all incoming rent collections</p>
        </div>
      </header>

      {payments.length === 0 ? (
        <div className="bg-[#131A26] rounded-xl p-12 border border-slate-800 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No payments received yet</h3>
          <p className="text-slate-400 mb-6">Record a payment from an invoice details page.</p>
          <Link 
            href="/invoices" 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            View Invoices
          </Link>
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
    </div>
  );
}
