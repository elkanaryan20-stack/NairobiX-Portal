import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { PORTAL_ORIGIN } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
      <body className={`${inter.variable} ${fraunces.variable} font-sans bg-white text-neutral-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
