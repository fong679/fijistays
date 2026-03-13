'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';
import {
  MapPin, Clock, Users, Star, Shield, CheckCircle, AlertCircle,
  ChevronRight, Calendar, ArrowLeft, Leaf, Utensils, Bus
} from 'lucide-react';
import Link from 'next/link';

const TYPE_LABELS: Record<string, string> = {
  HOMESTAY: 'Homestay', KAVA_CEREMONY: 'Kava Ceremony', GUIDED_HIKE: 'Guided Hike',
  REEF_FISHING: 'Reef Fishing', COOKING_CLASS: 'Cooking Class', ECO_TOUR: 'Eco Tour',
  CULTURAL_TOUR: 'Cultural Tour', MULTI_DAY_PACKAGE: 'Multi-Day Package',
};

const PLACEHOLDER_IMGS: Record<string, string> = {
  HOMESTAY: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
  KAVA_CEREMONY: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=1200&q=80',
  GUIDED_HIKE: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
  ECO_TOUR: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
  CULTURAL_TOUR: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=1200&q=80',
  COOKING_CLASS: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  REEF_FISHING: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80',
  MULTI_DAY_PACKAGE: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&q=80',
};

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [ackedProtocols, setAckedProtocols] = useState<Set<string>>(new Set());
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingStep, setBookingStep] = useState<'select' | 'protocols' | 'confirm' | 'success'>('select');
  const [bookedId, setBookedId] = useState('');

  const { data: exp, isLoading } = useQuery({
    queryKey: ['experience', params.id],
    queryFn: () => api.get(`/experiences/${params.id}`).then(r => r.data),
  });

  const bookMutation = useMutation({
    mutationFn: (payload: any) => api.post('/bookings', payload).then(r => r.data),
    onSuccess: (data) => {
      setBookedId(data.id);
      setBookingStep('success');
    },
  });

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-96 bg-sand/50 rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-sand/50 rounded w-3/4" />
          <div className="h-4 bg-sand/30 rounded w-1/2" />
          <div className="h-32 bg-sand/30 rounded" />
        </div>
      </div>
    </div>
  );

  if (!exp) return (
    <div className="text-center py-32">
      <p className="text-slate/40 text-lg">Experience not found</p>
      <Link href="/experiences" className="btn-primary mt-4 inline-flex">Browse all experiences</Link>
    </div>
  );

  const mandatoryProtocols = exp.village?.protocols
    ?.filter((vp: any) => vp.protocol.isMandatory)
    ?.map((vp: any) => vp.protocol) || [];

  const allProtocols = exp.village?.protocols?.map((vp: any) => vp.protocol) || [];

  const allMandatoryAcked = mandatoryProtocols.every((p: any) => ackedProtocols.has(p.id));

  const totalPrice = exp.pricePerPerson * guestCount;
  const platformFee = +(totalPrice * 0.13).toFixed(2);
  const villageGets = +(totalPrice - platformFee).toFixed(2);

  const availableDates = exp.availability
    ?.filter((a: any) => (a.spotsTotal - a.spotsBooked) >= guestCount)
    ?.slice(0, 30) || [];

  const toggleProtocol = (id: string) => {
    setAckedProtocols(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBook = () => {
    if (!user) { router.push('/login?redirect=' + encodeURIComponent(window.location.pathname)); return; }
    bookMutation.mutate({
      experienceId: exp.id,
      bookingDate: selectedDate,
      guestCount,
      specialRequests: specialRequests || undefined,
      protocolAcks: Array.from(ackedProtocols),
    });
  };

  const heroImg = exp.images?.[0]?.url || PLACEHOLDER_IMGS[exp.type] || PLACEHOLDER_IMGS.ECO_TOUR;

  return (
    <div className="pb-24">
      {/* Hero image */}
      <div className="relative h-80 md:h-[460px] overflow-hidden">
        <img src={heroImg} alt={exp.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Link href="/experiences" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <span className="badge-ocean mb-3 inline-block">{TYPE_LABELS[exp.type] || exp.type}</span>
          <h1 className="text-3xl md:text-4xl font-display text-white font-bold leading-tight drop-shadow">
            {exp.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left: Details ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Village + quick stats */}
            <div>
              <div className="flex items-center gap-2 text-slate/60 mb-4">
                <MapPin className="w-4 h-4 text-palm" />
                <Link href={`/villages/${exp.village?.id}`} className="hover:text-ocean transition-colors font-medium">
                  {exp.village?.name}
                </Link>
                <span>·</span>
                <span>{exp.village?.island}</span>
                {exp.village?.isVerified && (
                  <span className="badge-palm ml-1">
                    <Shield className="w-3 h-3" /> TLTB verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate/60">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-ocean" />{exp.durationHours} hours</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-ocean" />Max {exp.maxGuests} guests</span>
                {exp.includesFood && <span className="flex items-center gap-1.5"><Utensils className="w-4 h-4 text-ocean" />Includes food</span>}
                {exp.includesTransfer && <span className="flex items-center gap-1.5"><Bus className="w-4 h-4 text-ocean" />Transfer included</span>}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl text-slate font-semibold mb-3">About this experience</h2>
              <p className="text-slate/70 leading-relaxed">{exp.description}</p>
            </div>

            {/* Cultural protocols */}
            {allProtocols.length > 0 && (
              <div>
                <h2 className="font-display text-xl text-slate font-semibold mb-2">Cultural protocols</h2>
                <p className="text-slate/60 text-sm mb-4">
                  Please read these before booking. Mandatory protocols must be acknowledged at checkout.
                </p>
                <div className="space-y-3">
                  {allProtocols.map((p: any) => (
                    <div key={p.id} className="protocol-card">
                      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${p.isMandatory ? 'bg-coral/20 text-coral' : 'bg-palm/20 text-palm'}`}>
                        {p.isMandatory ? <AlertCircle className="w-3.5 h-3.5" /> : <Leaf className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate text-sm">{p.name}</span>
                          {p.isMandatory && <span className="badge-coral text-xs">Required</span>}
                        </div>
                        <p className="text-slate/60 text-sm leading-relaxed">{p.descriptionEn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community impact */}
            <div className="bg-palm/5 border border-palm/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-palm/10 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-palm" />
                </div>
                <div>
                  <h3 className="font-display text-slate font-semibold mb-1">Community impact</h3>
                  <p className="text-slate/60 text-sm leading-relaxed">
                    87% of your booking fee (FJ${villageGets.toFixed(0)} for {guestCount} guest{guestCount > 1 ? 's' : ''}) goes directly to {exp.village?.name || 'the village'}.
                    FijiStays retains 13% to operate the platform, provide host support, and fund cultural protocol training.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Booking panel ──────────────────── */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">

              {bookingStep === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-palm/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-palm" />
                  </div>
                  <h3 className="font-display text-xl text-slate font-semibold mb-2">Booking confirmed!</h3>
                  <p className="text-slate/60 text-sm mb-6">
                    Your spot is reserved. Check your email for confirmation and cultural protocol reminders.
                  </p>
                  <Link href="/dashboard" className="btn-primary w-full text-center block">
                    View my bookings
                  </Link>
                </div>
              ) : (
                <>
                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-3xl font-display font-bold text-ocean">FJ${exp.pricePerPerson}</span>
                    <span className="text-slate/50"> / person</span>
                  </div>

                  {/* Step 1: Date + guests */}
                  {bookingStep === 'select' && (
                    <div className="space-y-4">
                      <div>
                        <label className="label">Select a date</label>
                        {availableDates.length === 0 ? (
                          <p className="text-sm text-slate/50 italic">No dates available — check back soon.</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                            {availableDates.map((a: any) => {
                              const d = new Date(a.date);
                              const label = d.toLocaleDateString('en-FJ', { weekday: 'short', month: 'short', day: 'numeric' });
                              const spots = a.spotsTotal - a.spotsBooked;
                              const dateStr = d.toISOString().split('T')[0];
                              return (
                                <button key={a.id}
                                  onClick={() => setSelectedDate(dateStr)}
                                  className={`p-2.5 rounded-lg border text-left transition-all ${selectedDate === dateStr ? 'border-ocean bg-ocean/5 text-ocean' : 'border-sand-dark/30 hover:border-ocean/40 text-slate/70'}`}>
                                  <div className="text-xs font-medium">{label}</div>
                                  <div className="text-xs text-slate/40 mt-0.5">{spots} spot{spots !== 1 ? 's' : ''} left</div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="label">Number of guests</label>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                            className="w-9 h-9 rounded-lg border border-sand-dark/30 flex items-center justify-center text-slate/60 hover:border-ocean hover:text-ocean transition-all font-medium">
                            −
                          </button>
                          <span className="w-8 text-center font-medium text-slate">{guestCount}</span>
                          <button onClick={() => setGuestCount(Math.min(exp.maxGuests, guestCount + 1))}
                            className="w-9 h-9 rounded-lg border border-sand-dark/30 flex items-center justify-center text-slate/60 hover:border-ocean hover:text-ocean transition-all font-medium">
                            +
                          </button>
                          <span className="text-sm text-slate/40">max {exp.maxGuests}</span>
                        </div>
                      </div>

                      {/* Price breakdown */}
                      {selectedDate && (
                        <div className="bg-sand/30 rounded-xl p-4 space-y-2 text-sm">
                          <div className="flex justify-between text-slate/60">
                            <span>FJ${exp.pricePerPerson} × {guestCount} guest{guestCount > 1 ? 's' : ''}</span>
                            <span>FJ${totalPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-slate/60">
                            <span>Platform fee (13%)</span>
                            <span>FJ${platformFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-palm text-xs">
                            <span>Village receives</span>
                            <span>FJ${villageGets.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-sand pt-2 flex justify-between font-semibold text-slate">
                            <span>Total</span>
                            <span>FJ${totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setBookingStep('protocols')}
                        disabled={!selectedDate}
                        className="btn-primary w-full flex items-center justify-center gap-2">
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>

                      {!user && (
                        <p className="text-center text-xs text-slate/40">
                          <Link href="/login" className="text-ocean underline underline-offset-2">Sign in</Link> to complete your booking
                        </p>
                      )}
                    </div>
                  )}

                  {/* Step 2: Protocol acknowledgments */}
                  {bookingStep === 'protocols' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-slate mb-1">Cultural acknowledgment</h3>
                        <p className="text-xs text-slate/50 mb-4">Please confirm you've read and will follow the village's cultural protocols.</p>
                        <div className="space-y-3">
                          {allProtocols.map((p: any) => (
                            <label key={p.id} className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-all ${ackedProtocols.has(p.id) ? 'border-palm/50 bg-palm/5' : 'border-sand-dark/30'}`}>
                              <input type="checkbox"
                                checked={ackedProtocols.has(p.id)}
                                onChange={() => toggleProtocol(p.id)}
                                className="mt-0.5 accent-palm flex-shrink-0" />
                              <div>
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate">
                                  {p.name}
                                  {p.isMandatory && <span className="text-coral text-xs">*required</span>}
                                </div>
                                <p className="text-xs text-slate/50 mt-0.5 leading-relaxed line-clamp-2">{p.descriptionEn}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="label">Special requests (optional)</label>
                        <textarea
                          value={specialRequests}
                          onChange={e => setSpecialRequests(e.target.value)}
                          placeholder="Dietary requirements, accessibility needs, etc."
                          className="input resize-none h-20 text-sm"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setBookingStep('select')}
                          className="btn-secondary flex-1 text-sm py-2.5">
                          Back
                        </button>
                        <button
                          onClick={handleBook}
                          disabled={!allMandatoryAcked || bookMutation.isPending || !user}
                          className="btn-coral flex-1 text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
                          {bookMutation.isPending ? 'Booking…' : `Book — FJ$${totalPrice.toFixed(0)}`}
                        </button>
                      </div>

                      {!user && (
                        <p className="text-center text-xs text-coral">
                          You must <Link href="/login" className="underline underline-offset-2">sign in</Link> to book
                        </p>
                      )}

                      {bookMutation.isError && (
                        <p className="text-xs text-coral text-center">
                          {(bookMutation.error as any)?.response?.data?.message || 'Booking failed. Please try again.'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Safety note */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate/40">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Secure payment via Stripe. Free cancellation 24h before.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
