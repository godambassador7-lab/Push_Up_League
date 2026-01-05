import type { Metadata, Viewport } from 'next';
import '@/globals.css';
import { AppWrapper } from '@/components/AppWrapper';

export const metadata: Metadata = {
  title: 'Push-Up League',
  description: 'A gamified fitness app centered on push-ups as the primary action',
  icons: {
    icon: [
      { url: '/Push Up League Logo 32.png', sizes: '32x32', type: 'image/png' },
      { url: '/Push Up League Logo 192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/Push Up League Logo 192.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/Push Up League Logo 32.png',
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
