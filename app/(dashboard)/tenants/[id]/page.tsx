import { requireSession } from '@/lib/auth/user';
import { getTenantById } from '@/lib/domain/tenants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/currency';
import TenantActions from './TenantActions';

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSession();
  const { id } = await params;
  
  const tenant = await getTenantById(user.id, id);

  if (!tenant) {
    notFound();
  }

  const canDelete = tenant.invoices.length === 0 && tenant.notifications.length === 0;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 pb-4 border-b border-slate-800">
        <Link href="/tenants" className="text-amber-500 hover:text-amber-400 text-sm mb-4 inline-block">
          &larr; Back to Tenants
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {tenant.firstName} {tenant.lastName}
            </h1>
            <p className="text-slate-400">
              Tenant since {tenant.moveInDate.toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              tenant.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
              tenant.status === 'NOTICE' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
              'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {tenant.status}
            </span>
            <TenantActions 
              tenant={{
                id: tenant.id,
                unitId: tenant.unitId,
                firstName: tenant.firstName,
                lastName: tenant.lastName,
                email: tenant.email,
                phone: tenant.phone,
                status: tenant.status,
                moveInDate: tenant.moveInDate,
                moveOutDate: tenant.moveOutDate,
              }}
              canDelete={canDelete} 
              isActive={tenant.status === 'ACTIVE'}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Contact Info</h2>
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Email</span>
              <span className="text-slate-300">{tenant.email || 'Not provided'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</span>
              <span className="text-slate-300">{tenant.phone || 'Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Lease Details</h2>
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Property & Unit</span>
              <Link href={`/properties/${tenant.unit.propertyId}`} className="text-amber-500 hover:text-amber-400 transition-colors">
                {tenant.unit.property.name}, Unit {tenant.unit.unitNumber}
              </Link>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Rent</span>
              <span className="text-slate-300 font-medium">{formatCurrency(tenant.unit.monthlyRent, tenant.unit.currency as 'USD' | 'KES')}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Lease End</span>
              <span className="text-slate-300">{tenant.moveOutDate ? tenant.moveOutDate.toLocaleDateString() : 'Month-to-month'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Financial History</h2>
          
          {tenant.invoices.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No invoices have been generated for this tenant yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap md:whitespace-normal">
                <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice #</th>
                    <th className="px-4 py-3 font-medium">Period</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tenant.invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/invoices/${invoice.id}`} className="text-amber-500 hover:text-amber-400">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{invoice.billingPeriod}</td>
                      <td className="px-4 py-3">{invoice.dueDate.toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' :
                          invoice.status === 'PARTIALLY_PAID' ? 'bg-blue-500/10 text-blue-500' :
                          invoice.status === 'ISSUED' ? 'bg-slate-500/10 text-slate-400' :
                          invoice.status === 'OVERDUE' ? 'bg-red-500/10 text-red-500' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white">
                        {formatCurrency(invoice.amount, invoice.currency as 'USD' | 'KES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg">
          <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Communication Log</h2>
          
          {tenant.notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No communications have been sent to this tenant yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap md:whitespace-normal">
                <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Channel</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Context</th>
                    <th className="px-4 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tenant.notifications.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">
                        {note.sentAt ? new Date(note.sentAt).toLocaleString() : 'Pending'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {note.channel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {note.type.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3">
                        {note.invoiceId ? (
                          <Link href={`/invoices/${note.invoiceId}`} className="text-amber-500 hover:text-amber-400 text-xs">
                            {note.invoice?.invoiceNumber}
                          </Link>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
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
      </div>
    </div>
  );
}
