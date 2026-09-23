'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/auth/actions';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="bg-[#131A26] rounded-xl p-8 border border-slate-800 shadow-2xl">
      <h2 className="text-xl font-semibold mb-6 text-white">Sign In</h2>
      
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
            {state.error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full bg-[#0B101A] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-amber-500 hover:bg-amber-400 text-[#0B101A] font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-amber-500 hover:text-amber-400 transition-colors">
          Create one
        </Link>
      </div>
    </div>
  );
}
