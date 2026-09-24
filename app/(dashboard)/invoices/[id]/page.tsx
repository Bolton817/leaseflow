import { requireSession } from '@/lib/auth/user';
import { getInvoiceById } from '@/lib/domain/invoices';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RecordPaymentForm from './RecordPaymentForm';
import { formatCurrency } from '@/lib/utils/currency';

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSession();
  const { id } = await params;
  
  const invoice = await getInvoiceById(user.id, id);

  if (!invoice) {
    notFound();
  }

  const currentPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalAmount = Number(invoice.amount);
  const remainingBalance = totalAmount - currentPaid;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 pb-4 border-b border-slate-800">
        <Link href="/invoices" className="text-amber-500 hover:text-amber-400 text-sm mb-4 inline-block">
          &larr; Back to Invoices
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-slate-400">
              Billing Period: {invoice.billingPeriod}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
              invoice.status === 'PARTIALLY_PAID' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
              invoice.status === 'ISSUED' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
              invoice.status === 'OVERDUE' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
              'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {invoice.status}
            </span>
          </div>
        </div>
      </header>

      {invoice.status !== 'PAID' && (
        <RecordPaymentForm 
          invoiceId={invoice.id} 
          remainingBalance={remainingBalance} 
          currency={invoice.currency as 'USD' | 'KES'}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Billed To</h2>
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant</span>
              <Link href={`/tenants/${invoice.tenantId}`} className="text-amber-500 hover:text-amber-400">
                {invoice.tenant.firstName} {invoice.tenant.lastName}
              </Link>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Property & Unit</span>
              <span className="text-slate-300">
                {invoice.unit.property.name}, Unit {invoice.unit.unitNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Total Billed</span>
                <span className="text-xl font-medium text-white">{formatCurrency(totalAmount, invoice.currency as 'USD' | 'KES')}</span>
              </div>
              <div className="text-right">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Remaining Balance</span>
                <span className="text-2xl font-bold text-amber-500">{formatCurrency(remainingBalance, invoice.currency as 'USD' | 'KES')}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/50">
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</span>
              <span className="text-slate-300">{invoice.dueDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
        <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Payment History</h2>
        
        {invoice.payments.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            No payments have been recorded for this invoice yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap md:whitespace-normal">
              <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {invoice.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">{payment.paymentDate.toLocaleDateString()}</td>
                    <td className="px-4 py-3">{payment.paymentMethod}</td>
                    <td className="px-4 py-3">{payment.referenceNumber || '-'}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-500">
                      {formatCurrency(payment.amount, payment.currency as 'USD' | 'KES')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-slate-800 bg-slate-800/20">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium text-slate-400">Total Paid:</td>
                  <td className="px-4 py-3 text-right font-bold text-white">{formatCurrency(currentPaid, invoice.currency as 'USD' | 'KES')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
