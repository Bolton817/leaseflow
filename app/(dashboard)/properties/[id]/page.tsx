import { requireSession } from '@/lib/auth/user';
import { getPropertyById } from '@/lib/domain/properties';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddUnitForm from './AddUnitForm';
import { formatCurrency } from '@/lib/utils/currency';
import PropertyActions from './PropertyActions';
import UnitActions from './UnitActions';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSession();
  const { id } = await params;
  
  const prisma = (await import('@/lib/db')).default;
  const property = await prisma.property.findFirst({
    where: { id, ownerId: user.id, isActive: true },
    include: {
      units: {
        orderBy: { unitNumber: 'asc' },
        include: {
          _count: { select: { tenants: true, invoices: true, payments: true } }
        }
      }
    }
  });

  if (!property) {
    notFound();
  }

  // Serialize Prisma Decimals for Client Components
  const serializedProperty = {
    ...property,
    units: property.units.map(unit => ({
      ...unit,
      monthlyRent: unit.monthlyRent.toNumber()
    }))
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 pb-4 border-b border-slate-800">
        <Link href="/properties" className="text-amber-500 hover:text-amber-400 text-sm mb-4 inline-block">
          &larr; Back to Properties
        </Link>
        <div className="flex justify-between items-start gap-6">
          <div className="flex items-start gap-6 flex-1">
            {property.imageUrl && (
              <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{property.name}</h1>
              <p className="text-slate-400 text-lg">{property.address}, {property.city}</p>
              {property.description && (
                <p className="mt-4 text-slate-300 max-w-2xl">{property.description}</p>
              )}
            </div>
          </div>
          <PropertyActions property={serializedProperty} />
        </div>
      </header>

      <AddUnitForm propertyId={property.id} />

      <h2 className="text-xl font-semibold text-white mb-4">Units ({property.units.length})</h2>
      
      {property.units.length === 0 ? (
        <div className="bg-[#131A26] rounded-xl p-8 border border-slate-800 text-center text-slate-400">
          No units have been added to this property yet.
        </div>
      ) : (
        <div className="bg-[#131A26] rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap md:whitespace-normal">
            <thead className="bg-[#0B101A] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Unit Number</th>
                <th className="px-6 py-4 font-medium">Bedrooms</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Monthly Rent</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {serializedProperty.units.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{unit.unitNumber}</td>
                  <td className="px-6 py-4">{unit.bedrooms ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(unit.monthlyRent, unit.currency as 'USD' | 'KES')}</td>
                  <td className="px-6 py-4 text-right">
                    <UnitActions unit={unit} propertyId={property.id} />
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
