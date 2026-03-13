'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus, MapPin, CheckCircle, Clock, Users, ArrowRight, AlertCircle } from 'lucide-react';

export default function HostDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login?redirect=/host');
    else if (user.role !== 'HOST' && user.role !== 'ADMIN') router.push('/dashboard');
  }, [user]);

  const { data: villages, isLoading } = useQuery({
    queryKey: ['my-villages'],
    queryFn: () => api.get('/villages/my').then(r => r.data),
    enabled: !!user,
  });

  if (!user) return null;

  const totalExperiences = villages?.reduce((sum: number, v: any) => sum + (v.experiences?.length || 0), 0) || 0;
  const verifiedVillages = villages?.filter((v: any) => v.isVerified).length || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-palm font-medium text-sm uppercase tracking-wider mb-1">Host dashboard</p>
          <h1 className="font-display text-3xl text-slate font-bold">
            Bula, {user.firstName}! 🌺
          </h1>
          <p className="text-slate/50 mt-1">Manage your villages and experiences.</p>
        </div>
        <Link href="/host/villages/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add village
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Villages', value: villages?.length || 0 },
          { label: 'Verified', value: verifiedVillages },
          { label: 'Experiences', value: totalExperiences },
        ].map(s => (
          <div key={s.label} className="bg-white border border-sand/50 rounded-xl p-5 text-center">
            <div className="font-display text-3xl font-bold text-ocean">{s.value}</div>
            <div className="text-xs text-slate/50 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Villages */}
      <div>
        <h2 className="font-display text-xl text-slate font-semibold mb-4">Your villages</h2>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse space-y-3">
                <div className="h-5 bg-sand/50 rounded w-1/3" />
                <div className="h-3 bg-sand/30 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!villages || villages.length === 0) && (
          <div className="text-center py-16 card">
            <div className="text-5xl mb-4">🏡</div>
            <h3 className="font-display text-xl text-slate/50 mb-2">No villages yet</h3>
            <p className="text-slate/40 text-sm mb-6">Register your village to start accepting bookings.</p>
            <Link href="/host/villages/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Register village
            </Link>
          </div>
        )}

        {!isLoading && villages && villages.length > 0 && (
          <div className="space-y-6">
            {villages.map((village: any) => (
              <div key={village.id} className="card p-6">
                {/* Village header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg text-slate font-semibold">{village.name}</h3>
                      {village.isVerified ? (
                        <span className="badge-palm text-xs"><CheckCircle className="w-3 h-3" /> Verified</span>
                      ) : (
                        <span className="badge-coral text-xs"><Clock className="w-3 h-3" /> Pending verification</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-slate/50 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {village.island} · {village.islandGroup?.replace('_', ' ')}
                    </div>
                  </div>
                  <Link href={`/host/villages/${village.id}/experiences/new`}
                    className="text-sm flex items-center gap-1.5 text-ocean border border-ocean/30 rounded-lg px-3 py-2 hover:bg-ocean/5 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add experience
                  </Link>
                </div>

                {/* TLTB warning */}
                {!village.tltbPermitUrl && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-sm text-amber-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Upload your TLTB permit to get verified and accept bookings.</span>
                  </div>
                )}

                {/* Experiences */}
                {village.experiences && village.experiences.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-slate/50 uppercase tracking-wider mb-3">Experiences ({village.experiences.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {village.experiences.map((exp: any) => {
                        const upcomingSlots = exp.availability?.filter((a: any) =>
                          new Date(a.date) >= new Date() && !a.isClosed
                        ).length || 0;

                        return (
                          <div key={exp.id} className="flex items-start gap-3 p-3 rounded-xl bg-sand/20 border border-sand/40">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate line-clamp-1">{exp.title}</p>
                              <div className="flex items-center gap-3 text-xs text-slate/50 mt-1">
                                <span>FJ${exp.pricePerPerson}/person</span>
                                <span className="flex items-center gap-0.5">
                                  <Users className="w-3 h-3" /> {exp.maxGuests} max
                                </span>
                                <span>{upcomingSlots} dates available</span>
                              </div>
                            </div>
                            {upcomingSlots === 0 && (
                              <Link href={`/api/v1/experiences/${exp.id}/availability/seed`}
                                className="text-xs text-ocean underline underline-offset-2 flex-shrink-0">
                                Add dates
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
