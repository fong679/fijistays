'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { MapPin, Calendar, Users, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  PENDING:   { label: 'Awaiting payment', icon: Clock,        color: 'text-amber-600 bg-amber-50 border-amber-200' },
  CONFIRMED: { label: 'Confirmed',        icon: CheckCircle,  color: 'text-palm bg-palm/5 border-palm/20' },
  CANCELLED: { label: 'Cancelled',        icon: XCircle,      color: 'text-slate/40 bg-slate/5 border-slate/10' },
  COMPLETED: { label: 'Completed',        icon: CheckCircle,  color: 'text-ocean bg-ocean/5 border-ocean/20' },
  REFUNDED:  { label: 'Refunded',         icon: XCircle,      color: 'text-slate/40 bg-slate/5 border-slate/10' },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => { if (!user) router.push('/login?redirect=/dashboard'); }, [user]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/bookings').then(r => r.data),
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-palm font-medium text-sm uppercase tracking-wider mb-1">Dashboard</p>
        <h1 className="font-display text-3xl text-slate font-bold">
          Bula, {user.firstName}! 🌺
        </h1>
        <p className="text-slate/50 mt-1">Manage your village experience bookings.</p>
      </div>

      {/* Quick stats */}
      {!isLoading && bookings && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total bookings', value: bookings.length },
            { label: 'Confirmed', value: bookings.filter((b: any) => b.status === 'CONFIRMED').length },
            { label: 'Completed', value: bookings.filter((b: any) => b.status === 'COMPLETED').length },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-sand/50 rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-ocean">{stat.value}</div>
              <div className="text-xs text-slate/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-slate font-semibold">My bookings</h2>
          <Link href="/experiences" className="text-sm text-ocean hover:underline underline-offset-2 flex items-center gap-1">
            Browse more <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-5 animate-pulse flex gap-4">
                <div className="w-24 h-20 rounded-xl bg-sand/50 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-sand/50 rounded w-3/4" />
                  <div className="h-3 bg-sand/30 rounded w-1/2" />
                  <div className="h-3 bg-sand/30 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!bookings || bookings.length === 0) && (
          <div className="text-center py-16 card">
            <div className="text-5xl mb-4">🌴</div>
            <h3 className="font-display text-xl text-slate/50 mb-2">No bookings yet</h3>
            <p className="text-slate/40 text-sm mb-6">Your Fiji adventure awaits.</p>
            <Link href="/experiences" className="btn-primary inline-flex items-center gap-2">
              Browse experiences <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!isLoading && bookings && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking: any) => {
              const status = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = status?.icon || Clock;
              const exp = booking.experience;
              const bookingDate = new Date(booking.bookingDate);

              return (
                <div key={booking.id} className="card p-5 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-20 rounded-xl bg-sand/30 overflow-hidden flex-shrink-0">
                    {exp?.images?.[0]?.url ? (
                      <img src={exp.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ocean/20 to-lagoon/20" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-slate text-sm leading-snug line-clamp-2">
                        {exp?.title || 'Experience'}
                      </h3>
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border flex-shrink-0 ${status?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status?.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate/50 mt-1">
                      {exp?.village && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {exp.village.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(bookingDate, 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {booking.guestCount} guest{booking.guestCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-display font-bold text-ocean text-sm">
                        FJ${booking.totalFjd.toFixed(2)}
                      </span>
                      {booking.status === 'PENDING' && (
                        <Link href={`/pay/${booking.id}`} className="text-xs btn-coral py-1.5 px-3">
                          Complete payment
                        </Link>
                      )}
                      {booking.status === 'COMPLETED' && !booking.review && (
                        <Link href={`/review/${booking.id}`} className="text-xs text-ocean border border-ocean/30 rounded-lg py-1.5 px-3 hover:bg-ocean/5 transition-colors">
                          Leave review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
