'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Waves } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sand/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-ocean rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-lagoon animate-wave" />
            </div>
            <span className="font-display text-xl text-ocean font-semibold tracking-tight">
              Fiji<span className="text-coral">Stays</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/experiences" className="text-slate/70 hover:text-ocean transition-colors text-sm font-medium">
              Experiences
            </Link>
            <Link href="/villages" className="text-slate/70 hover:text-ocean transition-colors text-sm font-medium">
              Villages
            </Link>
            <Link href="/about" className="text-slate/70 hover:text-ocean transition-colors text-sm font-medium">
              About
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-slate/70 hover:text-ocean transition-colors">
                  {user.firstName}
                </Link>
                {user.role === 'HOST' && (
                  <Link href="/host" className="badge-palm">Host dashboard</Link>
                )}
                <button onClick={logout} className="text-sm text-slate/50 hover:text-coral transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate/70 hover:text-ocean transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-slate/60" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-sand/60 bg-white px-4 py-4 space-y-3 animate-fade-in">
          <Link href="/experiences" className="block text-slate/70 hover:text-ocean py-2" onClick={() => setOpen(false)}>Experiences</Link>
          <Link href="/villages" className="block text-slate/70 hover:text-ocean py-2" onClick={() => setOpen(false)}>Villages</Link>
          <Link href="/about" className="block text-slate/70 hover:text-ocean py-2" onClick={() => setOpen(false)}>About</Link>
          <div className="pt-2 border-t border-sand/40 flex gap-3">
            {user ? (
              <button onClick={logout} className="text-sm text-coral">Sign out</button>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm py-2 px-4" onClick={() => setOpen(false)}>Sign in</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4" onClick={() => setOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
