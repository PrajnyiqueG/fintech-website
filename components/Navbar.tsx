"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [['Home', '/'], ['About', '/about'], ['Pricing', '/pricing'], ['Contact', '/contact']];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-[#1e293b]'  : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-[#0a0f1e] font-bold text-sm">N</div>
          <span className="font-bold text-xl tracking-tight">NovaPay</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">{label}</Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Log in</Link>
          <Link href="/pricing" className="bg-green-500 hover:bg-green-400 text-[#0a0f1e] font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">Get Started</Link>
        </div>
        <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#111827] border-t border-[#1e293b] px-6 py-4 space-y-4">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white transition-colors">{label}</Link>
          ))}
          <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block bg-green-500 text-[#0a0f1e] font-semibold text-center py-2.5 rounded-xl">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
