import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'FijiStays — Authentic Village Eco-Tourism',
  description: 'Book authentic village experiences, eco-tours, and cultural ceremonies directly with Fijian communities. 87% of every booking goes straight to the village.',
  keywords: ['Fiji', 'village tourism', 'eco tourism', 'cultural experiences', 'kava ceremony', 'Yasawa', 'Navala'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
