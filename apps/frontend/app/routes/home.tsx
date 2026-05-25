import { Shield, Upload, ArrowRight, Link2, Eye, Key, FileCheck, Users } from 'lucide-react';
import { Link } from 'react-router';
import Header from '~/components/header';
import Footer from '~/components/footer';
import PlansPage from './dashboard/plan';

function App() {
  return (
    <div className="min-h-screen text-white bg-[#111111] overflow-x-hidden">
      <Header />

      <main>

        {/* HERO */}
        <section className="px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-neutral-400 text-xs font-medium mb-8">
              <Shield className="w-3 h-3" />
              End-to-end encrypted by default
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
              The private way to<br />receive files from anyone.
            </h1>

            <p className="text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto mb-10">
              Generate a secure upload link. Share it. Receive files — encrypted in the sender's browser before they ever leave their device.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3 rounded-lg font-semibold text-sm hover:bg-neutral-100 transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center border border-[#2a2a2a] text-neutral-300 hover:text-white hover:border-[#3a3a3a] px-7 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                See how it works
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-neutral-600">
              {['No account needed for senders', 'Zero-knowledge — we never see your files', 'Free to start'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1e1e1e] border border-[#1e1e1e] rounded-xl overflow-hidden">
            {[
              { num: 'AES-256', label: 'Encryption standard' },
              { num: '0 bytes', label: 'Stored unencrypted' },
              { num: '100%', label: 'Client-side encryption' },
              { num: 'Free', label: 'No credit card required' },
            ].map((s, i) => (
              <div key={i} className="bg-[#161616] px-6 py-6 text-center">
                <div className="text-xl font-bold text-white mb-1">{s.num}</div>
                <div className="text-xs text-neutral-600 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-6 py-20 border-t border-[#1e1e1e]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase mb-3">Why OpenFile</p>
              <h2 className="text-4xl font-bold text-white mb-3">Built for privacy, first.</h2>
              <p className="text-neutral-500 max-w-md mx-auto text-sm">
                Every part of OpenFile is designed so that your files stay yours — always.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  icon: <Shield className="w-4 h-4 text-neutral-300" />,
                  title: 'Client-side Encryption',
                  desc: 'Files are encrypted in the sender\'s browser using AES-256 before upload. The key never touches our servers.',
                },
                {
                  icon: <Eye className="w-4 h-4 text-neutral-300" />,
                  title: 'Zero-Knowledge',
                  desc: 'The encryption key lives only in your link URL fragment — never sent to our server. We\'re structurally unable to read your files.',
                },
                {
                  icon: <Users className="w-4 h-4 text-neutral-300" />,
                  title: 'No Signup for Senders',
                  desc: 'Anyone can upload to your link — no account, no tracking, no friction. Just open the link and drop files.',
                },
                {
                  icon: <Key className="w-4 h-4 text-neutral-300" />,
                  title: 'You Control the Key',
                  desc: 'Set expiry, max upload count, or one-time use. Your link, your rules. Download the key file as a backup anytime.',
                },
                {
                  icon: <FileCheck className="w-4 h-4 text-neutral-300" />,
                  title: 'Instant Dashboard',
                  desc: 'All received files appear in your encrypted dashboard. Preview or download — decrypted locally in your browser.',
                },
                {
                  icon: <Link2 className="w-4 h-4 text-neutral-300" />,
                  title: 'Simple Sharing',
                  desc: 'One link, shareable anywhere. Works in any browser with no plugins, extensions, or apps required.',
                },
              ].map((f, i) => (
                <div key={i} className="bg-[#161616] border border-[#222222] rounded-xl p-6">
                  <div className="w-8 h-8 bg-[#1e1e1e] rounded-lg flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="px-6 py-20 border-t border-[#1e1e1e]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase mb-3">How It Works</p>
              <h2 className="text-4xl font-bold text-white mb-3">Three steps. That's it.</h2>
              <p className="text-neutral-500 max-w-md mx-auto text-sm">No complex setup. No IT department needed.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  num: '01',
                  title: 'Create a Link',
                  desc: 'In your dashboard, generate a private encrypted upload link in seconds. Set expiry and upload limits.',
                },
                {
                  num: '02',
                  title: 'Share It',
                  desc: 'Send the link to anyone — a client, a colleague, a stranger. They open it in their browser, no account needed.',
                },
                {
                  num: '03',
                  title: 'Receive Securely',
                  desc: 'Files encrypt in their browser before upload. You decrypt and download from your dashboard — only you can.',
                },
              ].map(step => (
                <div key={step.num} className="flex flex-col">
                  <span className="text-4xl font-bold text-[#222222] mb-5 select-none tabular-nums">{step.num}</span>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-t border-[#1e1e1e]">
          <PlansPage />
        </section>

        {/* CTA */}
        <section className="px-6 py-24 border-t border-[#1e1e1e]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start receiving files privately today.
            </h2>
            <p className="text-neutral-400 text-lg mb-10">
              No credit card. No commitment. Free forever for personal use.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-semibold text-sm hover:bg-neutral-100 transition-colors"
              >
                Create your first link
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center border border-[#2a2a2a] text-neutral-300 hover:text-white hover:border-[#3a3a3a] px-8 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                See pricing
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;
