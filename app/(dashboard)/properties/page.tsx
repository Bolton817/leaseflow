import { requireSession } from '@/lib/auth/user';
import { getProperties } from '@/lib/domain/properties';
import Link from 'next/link';

export default async function PropertiesPage() {
  const user = await requireSession();
  const properties = await getProperties(user.id);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Properties</h1>
          <p className="text-slate-400">Manage your real estate portfolio</p>
        </div>
        <Link 
          href="/properties/new" 
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold rounded-lg transition-colors"
        >
          Add Property
        </Link>
      </header>

      {properties.length === 0 ? (
        <div className="bg-[#131A26] rounded-xl p-12 border border-slate-800 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No properties yet</h3>
          <p className="text-slate-400 mb-6">Get started by adding your first property.</p>
          <Link 
            href="/properties/new" 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Add Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`} className="block group">
              <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg hover:border-slate-600 transition-all">
                <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-amber-500 transition-colors">
                  {property.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 truncate">{property.address}, {property.city}</p>
                <div className="flex items-center text-sm font-medium text-slate-300">
                  <span className="bg-slate-800 px-3 py-1 rounded-full">
                    {property._count.units} {property._count.units === 1 ? 'Unit' : 'Units'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
