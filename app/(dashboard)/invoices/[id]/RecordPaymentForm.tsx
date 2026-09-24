'use client';

import { useActionState, useRef, useEffect } from 'react';
import { recordPaymentAction } from '@/app/actions/payment';

export default function RecordPaymentForm({ 
  invoiceId, 
  remainingBalance,
  currency = 'USD'
}: { 
  invoiceId: string; 
  remainingBalance: number;
  currency?: 'USD' | 'KES';
}) {
  const [state, formAction, isPending] = useActionState(recordPaymentAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  return (
    <div className="bg-[#131A26] rounded-xl p-6 border border-amber-500/30 shadow-lg mb-8">
      <h3 className="text-lg font-medium text-white mb-4">Record a Payment</h3>
      <form ref={formRef} action={formAction} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <input type="hidden" name="invoiceId" value={invoiceId} />
        
        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="amount">Amount ({currency})</label>
          <input 
            id="amount" 
            name="amount" 
            type="number" 
            step="0.01"
            min="0.01"
            max={remainingBalance}
            defaultValue={remainingBalance}
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
        </div>

        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="paymentMethod">Method</label>
          <select 
            id="paymentMethod" 
            name="paymentMethod" 
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
          >
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="MPESA">M-Pesa / Mobile Money</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>

        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="paymentDate">Date</label>
          <input 
            id="paymentDate" 
            name="paymentDate" 
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
        </div>

        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="referenceNumber">Ref # (Opt)</label>
          <input 
            id="referenceNumber" 
            name="referenceNumber" 
            type="text" 
            placeholder="e.g. TXN123"
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full md:w-auto px-6 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Record'}
        </button>
      </form>
      
      {state?.error && (
        <div className="mt-4 text-red-500 text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mt-4 text-emerald-500 text-sm">
          Payment successfully recorded!
        </div>
      )}
    </div>
  );
}
