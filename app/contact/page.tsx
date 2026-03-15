"use client";
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-green-400 font-medium tracking-widest text-sm uppercase mb-4">Contact</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in <span className="gradient-text">touch</span>
          </h1>
          <p className="text-xl text-slate-400">Our team is here to help, 24/7.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            {[{ label: 'Email', value: 'hello@novapay.io' }, { label: 'Phone', value: '+1 (888) 668-2729' }, { label: 'Address', value: '100 Market St, San Francisco, CA 94105' }].map((item) => (
              <div key={item.label} className="mb-6">
                <p className="text-green-400 text-sm font-medium mb-1">{item.label}</p>
                <p className="text-slate-300">{item.value}</p>
              </div>
            ))}
            <div className="mt-12 bg-[#111827] border border-[#1e293b] rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Office Hours</h3>
              <p className="text-slate-400 text-sm">Monday – Friday: 9am – 6pm PST</p>
              <p className="text-slate-400 text-sm">Weekend: 10am – 4pm PST</p>
              <p className="text-green-400 text-sm mt-3">24/7 emergency support available</p>
            </div>
          </div>
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-3">Message sent!</h3>
                <p className="text-slate-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {[{ id: 'name', label: 'Name', type: 'text' }, { id: 'email', label: 'Email', type: 'email' }, { id: 'subject', label: 'Subject', type: 'text' }].map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{field.label}</label>
                    <input type={field.type} required value={form[field.id as keyof typeof form]} onChange={(e) => setForm({...form, [field.id]: e.target.value})}
                      className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full bg-[#0a0f1e] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-[#0a0f1e] font-semibold py-3 rounded-xl transition-all">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
