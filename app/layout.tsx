import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cuddle-avenue-academy-revamp.netlify.app'),
  title: 'Cuddle Avenue Academy | The First Five Years Deserve Intention',
  description: 'Serious early learning with the warmth of home. Montessori-inspired care in Brooklyn for ages 6 weeks–5 years, including free NYC 3-K.',
  openGraph: {
    title: 'Cuddle Avenue Academy',
    description: 'The first five years deserve intention.',
    type: 'website',
    images: [{ url: '/og.png', width: 1734, height: 907, alt: 'Cuddle Avenue Academy — The first five years deserve intention.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuddle Avenue Academy',
    description: 'The first five years deserve intention.',
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
