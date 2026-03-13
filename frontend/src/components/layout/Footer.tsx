import Link from 'next/link';
import { Waves, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ocean text-white/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-lagoon" />
              </div>
              <span className="font-display text-xl text-white font-semibold">
                Fiji<span className="text-coral-light">Stays</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Connecting visitors with authentic Fijian village life. 87% of every booking goes directly to the community.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/experiences" className="hover:text-white transition-colors">All experiences</Link></li>
              <li><Link href="/villages" className="hover:text-white transition-colors">Villages</Link></li>
              <li><Link href="/experiences?type=HOMESTAY" className="hover:text-white transition-colors">Homestays</Link></li>
              <li><Link href="/experiences?type=KAVA_CEREMONY" className="hover:text-white transition-colors">Kava ceremonies</Link></li>
              <li><Link href="/experiences?type=ECO_TOUR" className="hover:text-white transition-colors">Eco tours</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Host a village</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/host/register" className="hover:text-white transition-colors">List your village</Link></li>
              <li><Link href="/host" className="hover:text-white transition-colors">Host dashboard</Link></li>
              <li><Link href="/about#tltb" className="hover:text-white transition-colors">TLTB requirements</Link></li>
              <li><Link href="/about#protocols" className="hover:text-white transition-colors">Cultural protocols</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of service</Link></li>
              <li><a href="mailto:vinaka@fijistays.com.fj" className="hover:text-white transition-colors">vinaka@fijistays.com.fj</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} FijiStays. Registered in Fiji.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-coral fill-coral" /> in Suva, Fiji
          </p>
        </div>
      </div>
    </footer>
  );
}
