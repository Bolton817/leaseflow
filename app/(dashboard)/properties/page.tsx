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
              <div className="bg-[#131A26] rounded-xl overflow-hidden border border-slate-800 shadow-lg hover:border-slate-600 transition-all flex flex-col h-full">
                {property.imageUrl ? (
                  <div className="h-48 w-full overflow-hidden bg-slate-900 relative">
                    <img 
                      src={property.imageUrl} 
                      alt={property.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-slate-800/50 flex items-center justify-center border-b border-slate-800/50">
                    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-amber-500 transition-colors">
                    {property.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 truncate">{property.address}, {property.city}</p>
                  <div className="flex items-center text-sm font-medium text-slate-300 mt-auto">
                    <span className="bg-slate-800 px-3 py-1 rounded-full">
                      {property._count.units} {property._count.units === 1 ? 'Unit' : 'Units'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
