import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NovaPay — The Future of Finance',
  description: 'Next-generation fintech platform for seamless payments, smart investments, and financial freedom.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0a0f1e] text-white antialiased`}>
        <div className="noise-overlay fixed inset-0 z-50 pointer-events-none" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
