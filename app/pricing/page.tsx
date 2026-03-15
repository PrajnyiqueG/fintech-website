"use client";
import { useState } from 'react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for individuals getting started',
      features: ['Free debit card', '$500/mo transfers', 'Basic analytics', 'Mobile app', '24/7 support'],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      monthlyPrice: 19,
      annualPrice: 15,
      description: 'For power users and small businesses',
      features: ['Premium metal card', 'Unlimited transfers', 'Advanced analytics', 'Investment tools', 'Priority support', 'Multi-currency'],
      cta: 'Start Pro Trial',
      highlighted: true,
    },
    {
      name: 'Business',
      monthlyPrice: 79,
      annualPrice: 59,
      description: 'For growing teams and enterprises',
      features: ['Team cards', 'Bulk payments', 'API access', 'Custom integrations', 'Dedicated manager', 'SLA guarantee', 'Compliance tools'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-green-400 font-medium tracking-widest text-sm uppercase mb-4">Pricing</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h1>
          <p className="text-xl text-slate-400 mb-8">No hidden fees. No surprises. Cancel anytime.</p>
          <div className="inline-flex items-center gap-3 bg-[#111827] border border-[#1e293b] rounded-full p-1">
            <button onClick={() => setAnnual(false)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-green-500 text-[#0a0f1e]' : 'text-slate-400'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-green-500 text-[#0a0f1e]' : 'text-slate-400'}`}>Annual <span className="text-xs ml-1 text-green-400">Save 20%</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 border ${plan.highlighted ? 'bg-gradient-to-b from-green-500/10 to-[#111827] border-green-500/50 relative' : 'bg-[#111827] border-[#1e293b]'} card-glow`}>
              {plan.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-[#0a0f1e] text-xs font-bold px-4 py-1.5 rounded-full">MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">${annual ? plan.annualPrice : plan.monthlyPrice}</span>
                <span className="text-slate-400 ml-2">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.highlighted ? 'bg-green-500 hover:bg-green-400 text-[#0a0f1e]' : 'border border-[#1e293b] hover:border-green-500/50 text-white'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
