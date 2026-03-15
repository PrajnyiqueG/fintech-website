import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#1e293b] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-[#0a0f1e] font-bold text-sm">N</div>
              <span className="font-bold text-xl">NovaPay</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">The future of finance, built for everyone.</p>
          </div>
          {[{ title: 'Product', links: [['Features', '/'], ['Pricing', '/pricing'], ['Security', '/']] }, { title: 'Company', links: [['About', '/about'], ['Blog', '/'], ['Careers', '/']] }, { title: 'Support', links: [['Contact', '/contact'], ['Help Center', '/'], ['Status', '/']] }].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-slate-400 hover:text-white text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1e293b] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">&copy; 2025 NovaPay Inc. All rights reserved.</p>
          <p className="text-slate-500 text-sm">Licensed and regulated. FDIC insured up to $250,000.</p>
        </div>
      </div>
    </footer>
  );
}
