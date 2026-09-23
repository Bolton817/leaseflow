'use client';

import { useState } from 'react';
import { generateInvoicesAction } from '@/app/actions/invoice';

export default function GenerateInvoicesButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const res = await generateInvoicesAction();
      if (res.error) {
        setMessage({ text: res.error, type: 'error' });
      } else {
        setMessage({ 
          text: res.count > 0 
            ? `Generated ${res.count} new invoices for ${res.period}!` 
            : `All active tenants are already billed for ${res.period}.`, 
          type: 'success' 
        });
      }
    } catch (e) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button 
        onClick={handleGenerate}
        disabled={isLoading}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Running...' : 'Run Billing Cycle'}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
