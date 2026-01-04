import type { Metadata, Viewport } from 'next';
import '@/globals.css';
import { AppWrapper } from '@/components/AppWrapper';

export const metadata: Metadata = {
  title: 'Push-Up League',
  description: 'A gamified fitness app centered on push-ups as the primary action',
  icons: {
    icon: [
      { url: '/Push Up League Logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '48x48', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '64x64', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '128x128', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: [
      { url: '/Push Up League Logo.png', sizes: '180x180', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '167x167', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '152x152', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '120x120', type: 'image/png' },
    ],
    shortcut: '/Push Up League Logo.png',
    other: [
      { url: '/Push Up League Logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/Push Up League Logo.png', sizes: '512x512', type: 'image/png' },
      { url: '/Push Up League Logo 1024.png', sizes: '1024x1024', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
