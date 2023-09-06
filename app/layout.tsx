import SupabaseProvider from './supabase-provider';
import DisableRightClick from '@/components/DisableRightClick';
import Toastify from '@/components/Toastify';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { PropsWithChildren, Suspense } from 'react';
import 'styles/main.css';

const GTM_ID = 'G-6JEW58HYC4';

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
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`
          }}
        />
      </body>
    </html>
  );
}
