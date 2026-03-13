'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Waves, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = params.get('role') === 'HOST' ? 'HOST' : 'TOURIST';
  const { register } = useAuthStore();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', role: defaultRole,
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(form as any);
      router.push(form.role === 'HOST' ? '/host' : '/experiences');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
            <Waves className="w-5 h-5 text-lagoon" />
          </div>
          <span className="font-display text-xl text-ocean font-semibold">
            Fiji<span className="text-coral">Stays</span>
          </span>
        </div>

        <h1 className="font-display text-3xl text-slate font-bold mb-2">Create your account</h1>
        <p className="text-slate/50 mb-8 text-sm">Join thousands of travellers discovering authentic Fiji.</p>

        {/* Role toggle */}
        <div className="flex rounded-xl border border-sand-dark/30 overflow-hidden mb-6">
          {(['TOURIST', 'HOST'] as const).map(role => (
            <button key={role} type="button"
              onClick={() => setForm(f => ({ ...f, role }))}
              className={`flex-1 py-3 text-sm font-medium transition-all ${form.role === role ? 'bg-ocean text-white' : 'text-slate/60 hover:text-ocean'}`}>
              {role === 'TOURIST' ? '🌴 I\'m a traveller' : '🏡 I\'m a village host'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input type="text" required value={form.firstName} onChange={set('firstName')}
                placeholder="Sione" className="input" />
            </div>
            <div>
              <label className="label">Last name</label>
              <input type="text" required value={form.lastName} onChange={set('lastName')}
                placeholder="Taufa" className="input" />
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <input type="email" required value={form.email} onChange={set('email')}
              placeholder="you@example.com" className="input" />
          </div>

          <div>
            <label className="label">Phone (optional — for SMS booking confirmations)</label>
            <input type="tel" value={form.phone} onChange={set('phone')}
              placeholder="+679 9123456" className="input" />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required value={form.password}
                onChange={set('password')} placeholder="Min. 8 characters" className="input pr-10"
                minLength={8} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/40 hover:text-slate/70">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-coral bg-coral/5 border border-coral/20 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : `Create ${form.role === 'HOST' ? 'host' : 'traveller'} account`}
          </button>

          <p className="text-xs text-slate/40 text-center leading-relaxed">
            By registering you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-2 text-ocean">Terms of Service</Link>{' '}
            and acknowledge our{' '}
            <Link href="/privacy" className="underline underline-offset-2 text-ocean">Privacy Policy</Link>{' '}
            (Fiji Privacy Act 2021 compliant).
          </p>
        </form>

        <p className="text-center text-sm text-slate/50 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-ocean font-medium hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
