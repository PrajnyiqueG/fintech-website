import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-green-500/10 via-[#111827] to-cyan-500/10 border border-green-500/20 rounded-3xl p-16 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to take control<br />of your <span className="gradient-text">finances?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
              Join 2.4 million people who trust NovaPay with their financial future. Start free today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing" className="bg-green-500 hover:bg-green-400 text-[#0a0f1e] font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-500/25">
                Open free account
              </Link>
              <Link href="/contact" className="border border-[#1e293b] hover:border-green-500/50 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all">
                Talk to sales
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-6">No credit card required. Free forever on Starter plan.</p>
          </div>
        </div>
      </div>
    </section>
  );
}