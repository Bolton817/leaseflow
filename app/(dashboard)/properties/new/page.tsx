'use client';

import { useActionState } from 'react';
import { createPropertyAction } from '@/app/actions/property';
import Link from 'next/link';

export default function NewPropertyPage() {
  const [state, formAction, isPending] = useActionState(createPropertyAction, null);

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8 pb-4 border-b border-slate-800">
        <Link href="/properties" className="text-amber-500 hover:text-amber-400 text-sm mb-4 inline-block">
          &larr; Back to Properties
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Property</h1>
      </header>

      <div className="bg-[#131A26] rounded-xl p-8 border border-slate-800 shadow-2xl">
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="name">
              Property Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g., Sunset Apartments"
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="address">
              Street Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              placeholder="123 Main St"
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              placeholder="Nairobi"
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="description">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-slate-800">
            <Link 
              href="/properties"
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
