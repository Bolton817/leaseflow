'use client';

import { useActionState } from 'react';
import { registerAction } from '@/lib/auth/actions';
import Link from 'next/link';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="bg-[#131A26] rounded-xl p-8 border border-slate-800 shadow-2xl">
      <h2 className="text-xl font-semibold mb-6 text-white">Create Account</h2>
      
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
            {state.error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="password">
            Password (min 8 characters)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isPending ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
