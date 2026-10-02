import type { Metadata } from 'next';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { PORTAL_ORIGIN } from '@/lib/site';
import './globals.css';

// Same type system as www.nairobix.com: Geist for UI, Geist Mono for labels, Fraunces for display.
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  axes: ['opsz', 'SOFT'],
});

export const metadata: Metadata = {
  metadataBase: new URL(PORTAL_ORIGIN),
  title: 'NairobiX Portal',
  description: 'Your growth. Your systems. One connected workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${fraunces.variable} font-sans bg-canvas text-fg antialiased`}>
        {children}
      </body>
    </html>
  );
}
