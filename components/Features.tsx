export default function Features() {
  const features = [
    { icon: "[Fast]", title: "Instant Transfers", description: "Send money anywhere in the world in seconds. No delays, no hidden fees. Just fast, reliable transfers." },
    { icon: "[Grow]", title: "Smart Investing", description: "Auto-invest your spare change and grow your wealth with AI-powered portfolio management." },
    { icon: "[Lock]", title: "Bank-Grade Security", description: "256-bit encryption, biometric authentication, and real-time fraud detection keep your money safe." },
    { icon: "[Globe]", title: "Multi-Currency", description: "Hold, exchange, and spend in 150+ currencies with best-in-class exchange rates." },
    { icon: "[Chart]", title: "Smart Analytics", description: "Understand your spending habits with beautiful charts and personalized financial insights." },
    { icon: "[Star]", title: "Rewards Program", description: "Earn cashback on every purchase. Redeem for travel, gift cards, or invest it back." },
  ];
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-green-400 font-medium tracking-widest text-sm uppercase mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need,<br /><span className="gradient-text">nothing you don&apos;t</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">A complete financial ecosystem built for the modern world.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-[#111827] border border-[#1e293b] rounded-2xl p-8 card-glow hover:-translate-y-1 transition-all duration-300">
              <div className="text-green-400 font-mono text-sm mb-6 bg-green-500/10 inline-block px-3 py-1 rounded-lg">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}