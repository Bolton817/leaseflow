'use client';

import { useActionState, useRef } from 'react';
import { createUnitAction } from '@/app/actions/unit';

export default function AddUnitForm({ propertyId }: { propertyId: string }) {
  const [state, formAction, isPending] = useActionState(createUnitAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  // If successful, reset the form. In a real app we might close a modal here.
  if (state?.success && formRef.current) {
    formRef.current.reset();
  }

  return (
    <div className="bg-[#131A26] rounded-xl p-6 border border-slate-800 shadow-lg mb-8">
      <h3 className="text-lg font-medium text-white mb-4">Add a Unit</h3>
      <form ref={formRef} action={formAction} className="flex flex-col md:flex-row gap-4 items-end">
        <input type="hidden" name="propertyId" value={propertyId} />
        
        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="unitNumber">Unit Number</label>
          <input 
            id="unitNumber" 
            name="unitNumber" 
            type="text" 
            required
            placeholder="e.g., 101 or 1A"
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
        </div>

        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="monthlyRent">Monthly Rent</label>
          <input 
            id="monthlyRent" 
            name="monthlyRent" 
            type="number" 
            step="0.01"
            min="0"
            required
            placeholder="e.g., 1200.00"
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
        </div>

        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="bedrooms">Bedrooms (Opt)</label>
          <input 
            id="bedrooms" 
            name="bedrooms" 
            type="number" 
            min="0"
            placeholder="e.g., 2"
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {isPending ? 'Adding...' : 'Add Unit'}
        </button>
      </form>
      
      {state?.error && (
        <div className="mt-4 text-red-500 text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mt-4 text-green-500 text-sm">
          Unit added successfully!
        </div>
      )}
    </div>
  );
}
