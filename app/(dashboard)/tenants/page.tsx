import { requireSession } from '@/lib/auth/user';
import { getTenants } from '@/lib/domain/tenants';
import Link from 'next/link';

export default async function TenantsPage() {
  const user = await requireSession();
  const tenants = await getTenants(user.id);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Tenants</h1>
          <p className="text-slate-400">Manage your active and historical tenants</p>
        </div>
        <Link 
          href="/tenants/new" 
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold rounded-lg transition-colors"
        >
          Add Tenant
        </Link>
      </header>

      {tenants.length === 0 ? (
        <div className="bg-[#131A26] rounded-xl p-12 border border-slate-800 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No tenants found</h3>
          <p className="text-slate-400 mb-6">Assign a tenant to one of your properties to get started.</p>
          <Link 
            href="/tenants/new" 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Add Tenant
          </Link>
        </div>
      ) : (
        <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Property & Unit</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {tenant.firstName} {tenant.lastName}
                    {tenant.email && <div className="text-xs text-slate-500 font-normal">{tenant.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {tenant.unit.property.name}
                    <div className="text-xs text-slate-500 font-normal">Unit {tenant.unit.unitNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      tenant.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' :
                      tenant.status === 'NOTICE' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/tenants/${tenant.id}`}
                      className="text-amber-500 hover:text-amber-400 font-medium"
                    >
                      View
                    </Link>
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
