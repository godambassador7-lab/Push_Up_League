import type { Metadata, Viewport } from 'next';
import '@/globals.css';
import { AppWrapper } from '@/components/AppWrapper';

export const metadata: Metadata = {
  title: 'Push-Up League',
  description: 'A gamified fitness app centered on push-ups as the primary action',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
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
