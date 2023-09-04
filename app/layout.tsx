import SupabaseProvider from './supabase-provider';
import DisableRightClick from '@/components/DisableRightClick';
import Toastify from '@/components/Toastify';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { PropsWithChildren, Suspense } from 'react';
import 'styles/main.css';

const meta = {
  title: 'Primabela',
  description: 'Encontre acompanhantes por todos os cantos do país',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://primabela.lol',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@primabela',
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage
  }
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-black loading">
        <SupabaseProvider>
          <Suspense fallback={null}>
            <Navbar />
            <DisableRightClick />
            <Toastify />
          </Suspense>
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
          >
            {children}
          </main>
          <Footer />
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}
