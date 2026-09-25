import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Provider } from '@/components/provider';
import site from '@/site.config.json';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { template: '%s – Colyseus', default: 'Colyseus' },
  description: 'Colyseus: Multiplayer Framework for Node.js',
  applicationName: 'Colyseus',
  appleWebApp: { title: 'Colyseus' },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon0.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: '/apple-icon.png',
  },
  twitter: { card: 'summary_large_image', site: '@colyseus' },
  other: { 'msapplication-TileColor': '#ffffff', 'msapplication-TileImage': '/icon1.png' },
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
