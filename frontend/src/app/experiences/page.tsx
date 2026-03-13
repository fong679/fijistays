'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { MapPin, Clock, Users, Star, Filter, Search } from 'lucide-react';

const TYPES = ['All', 'HOMESTAY', 'KAVA_CEREMONY', 'GUIDED_HIKE', 'REEF_FISHING', 'COOKING_CLASS', 'ECO_TOUR', 'CULTURAL_TOUR', 'MULTI_DAY_PACKAGE'];
const TYPE_LABELS: Record<string, string> = {
  HOMESTAY: 'Homestay', KAVA_CEREMONY: 'Kava Ceremony', GUIDED_HIKE: 'Guided Hike',
  REEF_FISHING: 'Reef Fishing', COOKING_CLASS: 'Cooking Class', ECO_TOUR: 'Eco Tour',
  CULTURAL_TOUR: 'Cultural Tour', MULTI_DAY_PACKAGE: 'Multi-Day Package',
};

const PLACEHOLDER_IMGS: Record<string, string> = {
  HOMESTAY: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
  KAVA_CEREMONY: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=600&q=80',
  GUIDED_HIKE: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
  REEF_FISHING: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80',
  COOKING_CLASS: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  ECO_TOUR: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  CULTURAL_TOUR: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=600&q=80',
  MULTI_DAY_PACKAGE: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80',
};

export default function ExperiencesPage() {
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);

  const { data, isLoading, error } = useQuery({
    queryKey: ['experiences', type, maxPrice],
    queryFn: () => api.get('/experiences', {
      params: {
        ...(type !== 'All' && { type }),
        maxPrice,
      },
    }).then(r => r.data),
  });

  const filtered = (data || []).filter((e: any) =>
    search === '' ||
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.village?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="section-title mb-3">All experiences</h1>
        <p className="text-slate/60 text-lg">Authentic village encounters across Fiji's most beautiful islands.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/40" />
          <input
            type="text" placeholder="Search experiences or villages…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        {/* Max price */}
        <div className="flex items-center gap-3 bg-white border border-sand-dark/30 rounded-lg px-4 py-2 min-w-52">
          <Filter className="w-4 h-4 text-slate/40 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate/50 mb-1">
              <span>Max price</span>
              <span className="font-medium text-ocean">FJ${maxPrice}</span>
            </div>
            <input type="range" min={50} max={500} step={25} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-ocean" />
          </div>
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TYPES.map(t => (
          <button key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              type === t
                ? 'bg-ocean text-white border-ocean'
                : 'bg-white text-slate/60 border-sand-dark/30 hover:border-ocean/40 hover:text-ocean'
            }`}>
            {t === 'All' ? 'All types' : TYPE_LABELS[t] || t}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-sand/60" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-sand/60 rounded w-3/4" />
                <div className="h-3 bg-sand/40 rounded w-1/2" />
                <div className="h-3 bg-sand/40 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-slate/50">Could not load experiences. Make sure the API is running.</p>
          <p className="text-sm text-slate/30 mt-2 font-mono">GET /api/v1/experiences</p>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-display text-slate/30 mb-2">No experiences found</p>
          <p className="text-slate/40">Try adjusting your filters</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp: any) => (
            <Link href={`/experiences/${exp.id}`} key={exp.id} className="card-hover group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={exp.images?.[0]?.url || PLACEHOLDER_IMGS[exp.type] || PLACEHOLDER_IMGS.ECO_TOUR}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge-ocean text-xs">{TYPE_LABELS[exp.type] || exp.type}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="font-display text-ocean font-bold">FJ${exp.pricePerPerson}</span>
                  <span className="text-slate/50 text-xs"> / person</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-slate font-semibold leading-snug mb-2 group-hover:text-ocean transition-colors line-clamp-2">
                  {exp.title}
                </h3>
                {exp.village && (
                  <div className="flex items-center gap-1 text-slate/50 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{exp.village.name} · {exp.village.island}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-slate/50">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exp.durationHours}h</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {exp.maxGuests}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate/40">
                    <Star className="w-3.5 h-3.5 text-coral fill-coral" />
                    <span className="font-medium text-slate">New</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
