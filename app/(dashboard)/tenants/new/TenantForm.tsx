'use client';

import { useActionState, useState } from 'react';
import { createTenantAction } from '@/app/actions/tenant';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/currency';

export default function TenantForm({ properties }: { properties: any[] }) {
  const [state, formAction, isPending] = useActionState(createTenantAction, null);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
  
  // Only show units that don't have an ACTIVE tenant
  const availableUnits = selectedProperty?.units.filter((u: any) => u.tenants.length === 0) || [];

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="firstName">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="lastName">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="email">
            Email Address (Opt)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="phone">
            Phone Number (Opt)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 mt-6">
        <h3 className="text-lg font-medium text-white mb-4">Unit Assignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="propertySelect">
              Property
            </label>
            <select
              id="propertySelect"
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select a property...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="unitId">
              Unit
            </label>
            <select
              id="unitId"
              name="unitId"
              required
              disabled={!selectedPropertyId || availableUnits.length === 0}
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              <option value="">
                {!selectedPropertyId ? 'Select property first' : availableUnits.length === 0 ? 'No available units' : 'Select a unit...'}
              </option>
              {availableUnits.map((u: any) => (
                <option key={u.id} value={u.id}>Unit {u.unitNumber} ({formatCurrency(u.monthlyRent, u.currency)}/mo)</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="leaseStart">
            Lease Start Date
          </label>
          <input
            id="leaseStart"
            name="leaseStart"
            type="date"
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="leaseEnd">
            Lease End Date (Opt)
          </label>
          <input
            id="leaseEnd"
            name="leaseEnd"
            type="date"
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-4 border-t border-slate-800">
        <Link 
          href="/tenants"
          className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Registering...' : 'Register Tenant'}
        </button>
      </div>
    </form>
  );
}
