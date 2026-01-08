import type { Metadata, Viewport } from 'next';
import '@/globals.css';
import { AppWrapper } from '@/components/AppWrapper';

const basePath = process.env.NODE_ENV === 'production'
  ? (process.env.NEXT_PUBLIC_BASE_PATH || '')
  : '';
const icon32 = `${basePath}/Push Up League Logo 32.png`;
const icon192 = `${basePath}/Push Up League Logo 192.png`;

export const metadata: Metadata = {
  title: 'Push-Up League',
  description: 'A gamified fitness app centered on push-ups as the primary action',
  icons: {
    icon: [
      { url: icon32, sizes: '32x32', type: 'image/png' },
      { url: icon192, sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: icon192, sizes: '180x180', type: 'image/png' },
    ],
    shortcut: icon32,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0f1535',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ backgroundColor: '#0f1535' }}>
      <head>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ backgroundColor: '#0f1535' }}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
