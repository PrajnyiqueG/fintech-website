export default function Testimonials() {
  const testimonials = [
    { name: "Alex Thompson", role: "Startup Founder", text: "NovaPay transformed how I manage my business finances. The multi-currency support alone saves me thousands in fees every month.", avatar: "A" },
    { name: "Maria Santos", role: "Freelance Designer", text: "Finally a fintech app that actually makes sense. The interface is beautiful and payments are instant. I have recommended it to everyone.", avatar: "M" },
    { name: "David Kim", role: "Software Engineer", text: "The investment features are incredible. I have grown my portfolio by 23% in just 8 months using their AI recommendations.", avatar: "D" },
  ];
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-green-400 font-medium tracking-widest text-sm uppercase mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by <span className="gradient-text">2.4 million</span> users
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#111827] border border-[#1e293b] rounded-2xl p-8 card-glow">
              <div className="flex gap-1 mb-4">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-green-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-[#0a0f1e] font-bold">{t.avatar}</div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-slate-400 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}