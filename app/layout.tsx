import SupabaseProvider from './supabase-provider';
import DisableRightClick from '@/components/DisableRightClick';
import Toastify from '@/components/Toastify';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { PropsWithChildren, Suspense } from 'react';
import 'styles/main.css';

const GA_MEASUREMENT_ID = 'G-6JEW58HYC4';

const meta = {
  title: 'Primabela - Acompanhantes em todo Brasil',
  description:
    'Encontre acompanhantes mulheres, trans e homens por todos os cantos do país',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  
  url: 'https://primabela.lol',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  robots: meta.robots,
  maskIcon: meta.favicon,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: meta.title
      }
    ],
    siteName: meta.title
  }
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: PropsWithChildren) {
  return (
    <html lang="en">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <body className="bg-black loading">
        <SupabaseProvider>
          <Suspense fallback={<div className="min-h-[64px]"></div>}>
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
