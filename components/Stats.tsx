export default function Stats() {
  const stats = [
    { value: "$2.4B+", label: "Total Volume Processed", sub: "across 47 countries" },
    { value: "2.4M+", label: "Active Users", sub: "and growing fast" },
    { value: "99.99%", label: "Uptime SLA", sub: "enterprise reliability" },
    { value: "0.3s", label: "Avg. Transfer Time", sub: "fastest in the industry" },
  ];
  return (
    <section className="py-16 border-y border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-white font-medium mb-1">{stat.label}</div>
              <div className="text-slate-500 text-sm">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}