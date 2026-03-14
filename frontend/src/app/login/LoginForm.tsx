'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Waves, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-lagoon" />
            </div>
            <span className="font-display text-xl text-ocean font-semibold">
              Fiji<span className="text-coral">Stays</span>
            </span>
          </div>
          <h1 className="font-display text-3xl text-slate font-bold mb-2">Welcome back</h1>
          <p className="text-slate/50 mb-8 text-sm">Sign in to manage your bookings and experiences.</p>
          <div className="bg-ocean/5 border border-ocean/20 rounded-xl p-4 mb-6 text-xs text-slate/60 space-y-1">
            <p className="font-medium text-slate/80 mb-2">Demo accounts</p>
            <p>Tourist: <span className="font-mono text-ocean">sarah@example.com</span> / <span className="font-mono">Tourist1234!</span></p>
            <p>Host: <span className="font-mono text-ocean">sione@navala.fj</span> / <span className="font-mono">Host1234!</span></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/40 hover:text-slate/70">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-coral bg-coral/5 border border-coral/20 rounded-lg px-4 py-3">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-sm text-slate/50 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-ocean font-medium hover:underline underline-offset-2">Get started free</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80" alt="Fiji village" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ocean-dark/40" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="font-display text-2xl text-white leading-snug mb-4">
            "The most authentic experience of my life."
          </blockquote>
          <p className="text-white/60 text-sm">Sarah Johnson · Melbourne, Australia</p>
        </div>
      </div>
    </div>
  );
}
