import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Voi Watcher',
  description: 'Monitor the economic performance of the Voi Network.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='bg-gray-50 text-gray-900'>
        <Header />
        <main className='max-w-7xl mx-auto px-4 py-8'>{children}</main>
      </body>
    </html>
  );
}
