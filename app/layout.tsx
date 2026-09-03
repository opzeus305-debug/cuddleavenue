import type { Metadata } from 'next';
import '@fontsource-variable/newsreader/standard.css';
import '@fontsource-variable/newsreader/standard-italic.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cuddleavenue-brooklyn.netlify.app'),
  title: 'Cuddle Avenue Academy | Early Education in Brooklyn',
  description: 'Academic care with the warmth of home. Montessori-inspired early education in Brooklyn for ages 6 weeks–5 years, including free NYC 3-K.',
  openGraph: {
    title: 'Cuddle Avenue Academy',
    description: 'The first five years, taken seriously. Academic care for children from 6 weeks to age 5 in Brooklyn.',
    type: 'website',
    images: [{ url: '/og.png', width: 1733, height: 908, alt: 'Cuddle Avenue Academy — Childhood is not a rehearsal.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuddle Avenue Academy',
    description: 'The first five years, taken seriously. Academic care for children from 6 weeks to age 5 in Brooklyn.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/assets/ca-bears.png',
    apple: '/assets/ca-bears.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
