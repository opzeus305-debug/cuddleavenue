import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cuddle Avenue Academy | Montessori-Inspired Early Learning in Brooklyn',
  description: 'Nurturing, Montessori-inspired child care in Brooklyn—from infancy through preschool, including free NYC 3-K for All.',
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
