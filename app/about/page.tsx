export default function AboutPage() {
  const team = [
    { name: 'Sarah Chen', role: 'CEO & Co-Founder', bio: 'Former Goldman Sachs VP with 15 years in fintech.' },
    { name: 'Marcus Rivera', role: 'CTO & Co-Founder', bio: 'Ex-Stripe engineer, built payment infrastructure at scale.' },
    { name: 'Aisha Patel', role: 'Head of Product', bio: 'Product leader from Square and Robinhood.' },
    { name: 'James Okafor', role: 'Head of Security', bio: 'Cybersecurity expert, former NSA contractor.' },
  ];
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-green-400 font-medium tracking-widest text-sm uppercase mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Built for the <span className="gradient-text">next generation</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            NovaPay was founded in 2021 with a simple mission: make financial services accessible, transparent, and powerful for everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              We believe that financial freedom shouldn't be a privilege. Traditional banking has failed millions of people with high fees, opaque practices, and outdated technology.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              NovaPay is different. We combine cutting-edge technology with human-centered design to deliver a financial platform that works for you, not against you.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Founded', value: '2021' },
              { label: 'Employees', value: '340+' },
              { label: 'Countries', value: '47' },
              { label: 'Users', value: '2.4M+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 card-glow">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 card-glow text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#0a0f1e]">
                  {member.name[0]}
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-green-400 text-sm mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
