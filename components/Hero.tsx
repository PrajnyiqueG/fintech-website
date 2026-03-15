import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Background grid */}
      <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
          <span className="text-green-400 text-sm font-medium">Now live in 47 countries</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 animate-slide-up">
          Finance that<br />
          <span className="gradient-text">works for you</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Send money globally, grow your wealth, and manage your finances with the most powerful fintech platform ever built.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/pricing" className="bg-green-500 hover:bg-green-400 text-[#0a0f1e] font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-500/25">
            Start for free
          </Link>
          <Link href="/about" className="border border-[#1e293b] hover:border-green-500/50 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all">
            Learn more →
          </Link>
        </div>
        {/* Dashboard mockup */}
        <div className="mt-20 relative">
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 max-w-3xl mx-auto card-glow">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{ label: 'Balance', value: '$24,891.50', change: '+12.4%' }, { label: 'Savings', value: '$8,320.00', change: '+5.2%' }, { label: 'Investments', value: '$41,200.00', change: '+18.7%' }].map((card) => (
                <div key={card.label} className="bg-[#0a0f1e] rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">{card.label}</p>
                  <p className="font-bold text-lg">{card.value}</p>
                  <p className="text-green-400 text-xs">{card.change}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0a0f1e] rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-slate-400 text-xs">Recent Transactions</p>
                <p className="text-green-400 text-xs">View all</p>
              </div>
              {[{ name: 'Netflix', amount: '-$15.99', date: 'Today' }, { name: 'Salary Deposit', amount: '+$4,500.00', date: 'Yesterday' }, { name: 'Amazon', amount: '-$67.23', date: 'Mar 12' }].map((tx) => (
                <div key={tx.name} className="flex items-center justify-between py-2 border-b border-[#1e293b] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center text-xs">{tx.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium">{tx.name}</p>
                      <p className="text-slate-500 text-xs">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-slate-300'}`}>{tx.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
