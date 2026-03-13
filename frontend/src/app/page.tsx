import Link from 'next/link';
import { ArrowRight, Shield, Users, Leaf, Star, MapPin, Clock, ChevronRight } from 'lucide-react';

const FEATURED = [
  {
    id: 'e0000001-0000-0000-0000-000000000001',
    title: 'Highland Village Day — Kava, Culture & Panoramic Hike',
    village: 'Navala Village',
    island: 'Viti Levu',
    type: 'Cultural Tour',
    price: 125,
    hours: 8,
    guests: 12,
    rating: 4.9,
    reviews: 47,
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  },
  {
    id: 'e0000003-0000-0000-0000-000000000003',
    title: 'Yasawa Island Village & Reef Snorkel',
    village: 'Wayasewa Village',
    island: 'Waya Island, Yasawa',
    type: 'Eco Tour',
    price: 155,
    hours: 7,
    guests: 10,
    rating: 5.0,
    reviews: 31,
    img: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
  },
  {
    id: 'e0000006-0000-0000-0000-000000000006',
    title: 'Manta Ray Encounter & Village Conservation Tour',
    village: 'Natokalau Village',
    island: 'Kadavu Island',
    type: 'Eco Tour',
    price: 145,
    hours: 5,
    guests: 8,
    rating: 4.8,
    reviews: 22,
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  },
];

const STATS = [
  { value: '87%', label: 'Goes to villages', icon: '🏡' },
  { value: '3', label: 'Verified villages', icon: '✓' },
  { value: '6', label: 'Unique experiences', icon: '🌴' },
  { value: '5★', label: 'Average rating', icon: '⭐' },
];

const ISLANDS = [
  { name: 'Viti Levu', desc: 'Highlands & cultural villages', img: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=600&q=80', slug: 'VITI_LEVU' },
  { name: 'Yasawa', desc: 'Pristine beaches & blue lagoons', img: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80', slug: 'YASAWA' },
  { name: 'Kadavu', desc: 'World-class reefs & mantas', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', slug: 'KADAVU' },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-ocean-dark">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80')" }}
        />
        {/* Wave pattern overlay */}
        <div className="absolute inset-0 bg-wave-pattern opacity-20" />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/60 via-ocean-dark/40 to-ocean-dark/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            {/* Pre-headline badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-palm-light animate-pulse" />
              87% of every booking goes directly to the village community
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white leading-tight mb-6 animate-fade-up">
              Experience Fiji the{' '}
              <span className="text-sand italic">way it was</span>{' '}
              meant to be
            </h1>

            <p className="text-xl text-white/70 leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Book authentic kava ceremonies, village homestays, and eco-tours directly with
              Fijian communities — cutting out resort middlemen entirely.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/experiences" className="btn-coral flex items-center gap-2 text-base">
                Browse experiences <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all text-base">
                How it works
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {STATS.map((s) => (
                <div key={s.label} className="px-6 py-5 text-center">
                  <div className="text-2xl font-display text-white font-bold">{s.value}</div>
                  <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────── */}
      <section className="bg-sand/30 border-b border-sand/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate/60">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-palm" /> iTaukei Land Trust verified villages</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-palm" /> Cultural protocols built in</div>
            <div className="flex items-center gap-2"><Leaf className="w-4 h-4 text-palm" /> Fiji Privacy Act 2021 compliant</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-coral fill-coral" /> Secure payments via Stripe</div>
          </div>
        </div>
      </section>

      {/* ── Featured experiences ─────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-palm font-medium text-sm uppercase tracking-wider mb-2">Featured</p>
            <h2 className="section-title">Unforgettable experiences</h2>
          </div>
          <Link href="/experiences" className="hidden md:flex items-center gap-1 text-ocean hover:text-ocean-dark font-medium text-sm transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED.map((exp, i) => (
            <Link href={`/experiences/${exp.id}`} key={exp.id}
              className="card-hover group"
              style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img src={exp.img} alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="badge-ocean text-xs">{exp.type}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="font-display text-ocean font-bold">FJ${exp.price}</span>
                  <span className="text-slate/50 text-xs"> / person</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-slate font-semibold leading-snug mb-2 group-hover:text-ocean transition-colors line-clamp-2">
                  {exp.title}
                </h3>
                <div className="flex items-center gap-1 text-slate/50 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.village} · {exp.island}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-slate/50">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exp.hours}h</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {exp.guests}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-coral fill-coral" />
                    <span className="font-medium text-slate">{exp.rating}</span>
                    <span className="text-slate/40">({exp.reviews})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/experiences" className="btn-secondary inline-flex items-center gap-2">
            View all experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Browse by island ─────────────────────────────── */}
      <section className="py-24 bg-ocean/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-palm font-medium text-sm uppercase tracking-wider mb-2">Discover</p>
            <h2 className="section-title">Explore by island group</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ISLANDS.map((island) => (
              <Link href={`/experiences?islandGroup=${island.slug}`} key={island.name}
                className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer">
                <img src={island.img} alt={island.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/80 via-ocean-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl text-white font-bold">{island.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{island.desc}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-palm font-medium text-sm uppercase tracking-wider mb-2">Simple process</p>
          <h2 className="section-title">How FijiStays works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: '01', title: 'Browse & choose', desc: 'Explore verified village experiences filtered by island, type, and date. Every listing shows exactly what cultural protocols apply.' },
            { step: '02', title: 'Acknowledge & book', desc: 'Review the village\'s cultural protocols (sevusevu, dress code, photography). Confirm and pay securely. Your booking is instantly confirmed.' },
            { step: '03', title: 'Experience & review', desc: 'Arrive with your sevusevu kava gift. Your village host handles everything else. After your experience, leave a review that helps future travellers.' },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="text-7xl font-display text-ocean/10 font-bold leading-none mb-4">{item.step}</div>
              <h3 className="font-display text-xl text-slate font-semibold mb-3">{item.title}</h3>
              <p className="text-slate/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 bg-ocean">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
            Ready to experience the real Fiji?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Join hundreds of travellers who've connected directly with Fijian villages — no resort markup, no middlemen.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/experiences" className="btn-coral flex items-center gap-2 text-base">
              Find your experience <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register?role=HOST" className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all text-base">
              List your village
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
