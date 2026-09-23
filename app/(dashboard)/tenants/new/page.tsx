import { requireSession } from '@/lib/auth/user';
import { getProperties } from '@/lib/domain/properties';
import TenantForm from './TenantForm';
import Link from 'next/link';

export default async function NewTenantPage() {
  const user = await requireSession();
  
  // We need all properties (with units) to populate the selection dropdowns
  const properties = await getProperties(user.id);
  
  // We'll also fetch full property details to get the units, since getProperties only gets the _count
  // In a real app we might write a specialized query, but we'll fetch them here.
  const prisma = (await import('@/lib/db')).default;
  const propertiesWithUnits = await prisma.property.findMany({
    where: { ownerId: user.id, isActive: true },
    include: {
      units: {
        orderBy: { unitNumber: 'asc' },
        include: {
          // Check if unit is available
          tenants: {
            where: { status: 'ACTIVE' },
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  const serializedProperties = propertiesWithUnits.map(p => ({
    ...p,
    units: p.units.map(u => ({
      ...u,
      monthlyRent: u.monthlyRent.toString(),
    }))
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8 pb-4 border-b border-slate-800">
        <Link href="/tenants" className="text-amber-500 hover:text-amber-400 text-sm mb-4 inline-block">
          &larr; Back to Tenants
        </Link>
        <h1 className="text-2xl font-bold text-white">Register New Tenant</h1>
      </header>

      <div className="bg-[#131A26] rounded-xl p-8 border border-slate-800 shadow-2xl">
        <TenantForm properties={serializedProperties} />
      </div>
    </div>
  );
}
