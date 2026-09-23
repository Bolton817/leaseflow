import { requireSession } from '@/lib/auth/user';
import { getPropertyById } from '@/lib/domain/properties';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddUnitForm from './AddUnitForm';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSession();
  const { id } = await params;
  
  const property = await getPropertyById(user.id, id);

  if (!property) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 pb-4 border-b border-slate-800">
        <Link href="/properties" className="text-amber-500 hover:text-amber-400 text-sm mb-4 inline-block">
          &larr; Back to Properties
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{property.name}</h1>
            <p className="text-slate-400">{property.address}, {property.city}</p>
          </div>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
            Edit Property
          </button>
        </div>
        {property.description && (
          <p className="mt-4 text-slate-300 text-sm max-w-3xl">{property.description}</p>
        )}
      </header>

      <AddUnitForm propertyId={property.id} />

      <h2 className="text-xl font-semibold text-white mb-4">Units ({property.units.length})</h2>
      
      {property.units.length === 0 ? (
        <div className="bg-[#131A26] rounded-xl p-8 border border-slate-800 text-center text-slate-400">
          No units have been added to this property yet.
        </div>
      ) : (
        <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Unit Number</th>
                <th className="px-6 py-4 font-medium">Bedrooms</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Monthly Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {property.units.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{unit.unitNumber}</td>
                  <td className="px-6 py-4">{unit.bedrooms ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">${unit.monthlyRent.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
