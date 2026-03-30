'use client';

import { useState } from 'react';
import { signIn } from '@/app/actions/auth';
import Link from 'next/link';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F6] px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1D9E75' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M8 2v8M5 5l3-3 3 3M3 11v2h10v-2"/>
            </svg>
          </div>
          <span className="font-display text-lg text-slate-800">Career Coach</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8">
          <h1 className="text-xl font-medium text-slate-800 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to your Career Coach account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="neha@example.com"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#1D9E75] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Your password"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#1D9E75] transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
              style={{ background: isLoading ? '#9FE1CB' : '#1D9E75' }}
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>
                : <><LogIn className="w-4 h-4" />Sign In</>
              }
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium" style={{ color: '#1D9E75' }}>
              Sign up free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}