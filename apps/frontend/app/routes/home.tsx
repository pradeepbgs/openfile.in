import { Shield, Upload, ArrowRight, Zap, Globe, Lock, Users, Key, Link2, Eye, FileCheck } from 'lucide-react';
import { Link } from 'react-router';
import Header from '~/components/header';
import Footer from '~/components/footer';
import PlansPage from './dashboard/plan';
import { GLOBAL_BG } from 'constant';

function App() {
  return (
    <div className={`min-h-screen text-white ${GLOBAL_BG} overflow-x-hidden`}>
      <Header />

      <main>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">

          {/* Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute top-10 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          </div>

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10 max-w-6xl mx-auto">

            {/* Badge */}
            <div className="flex justify-center mb-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/8 text-purple-300 text-sm font-medium">
                <Lock className="w-3.5 h-3.5" />
                End-to-end encrypted by default
              </div>
            </div>

            {/* Headline */}
            <div className="text-center max-w-4xl mx-auto mb-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
                The private way to
                <br />
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
                    receive files
                  </span>
                </span>
                {' '}from anyone.
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Generate a secure upload link. Share it. Receive files — encrypted in the sender's browser before they ever leave their device.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg shadow-purple-900/40 hover:shadow-purple-700/40 hover:scale-[1.02]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/6 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200"
              >
                See how it works
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600 mb-16">
              {['No account needed for senders', 'Zero-knowledge — we never see your files', 'Free to start'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">✓</span> {t}
                </span>
              ))}
            </div>

            {/* Product mockup */}
            <div className="relative max-w-3xl mx-auto">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-blue-600/20 rounded-3xl blur-2xl" />

              <div className="relative rounded-2xl border border-white/10 bg-[#0c0c14] shadow-2xl overflow-hidden">
                {/* Window bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-white/3">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-3 text-xs text-gray-600 font-mono">openfile.in/dashboard</span>
                </div>

                {/* Mock dashboard content */}
                <div className="p-6 grid md:grid-cols-2 gap-5">
                  {/* Left — form */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                        <Link2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-white">Create Secure Link</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Link name</div>
                      <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-gray-400">Client project files</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Max uploads</div>
                        <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-gray-300">3</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Expires in</div>
                        <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-gray-300">24 hours</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-3.5 h-3.5 rounded bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[8px]">✓</span>
                      </div>
                      Download encryption key file
                    </div>

                    <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg py-2 text-center text-xs font-semibold text-white">
                      Generate Link
                    </div>
                  </div>

                  {/* Right — generated link + stats */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Generated link</div>
                      <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                        <div className="text-[10px] text-indigo-400 break-all font-mono leading-relaxed">
                          https://openfile.in/u?token=ey<span className="text-indigo-300">J...</span>
                          <span className="text-gray-600">#key=a1b2c3&iv=d4e5f6</span>
                        </div>
                        <div className="flex gap-2 mt-2.5">
                          <div className="flex-1 bg-white/5 rounded-md py-1 text-center text-[10px] text-gray-400">Copy Link</div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-md px-2 py-1 text-[10px] text-green-400">✓ Copied!</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Total Links', val: '12', color: 'text-blue-400', border: 'border-l-blue-500/40' },
                        { label: 'Active', val: '8', color: 'text-green-400', border: 'border-l-green-500/40' },
                        { label: 'Uploads', val: '34', color: 'text-yellow-400', border: 'border-l-yellow-500/40' },
                        { label: 'Storage', val: '1.2 GB', color: 'text-red-400', border: 'border-l-red-400/40' },
                      ].map(s => (
                        <div key={s.label} className={`bg-white/3 border border-white/8 border-l-2 ${s.border} rounded-lg px-3 py-2`}>
                          <div className="text-[9px] text-gray-500 uppercase tracking-wide">{s.label}</div>
                          <div className={`text-sm font-bold ${s.color} mt-0.5`}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ───────────────────────────────────────── */}
        <section className="px-6 py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/6 rounded-2xl overflow-hidden border border-white/8">
            {[
              { num: 'AES-256', label: 'Encryption standard' },
              { num: '0 bytes', label: 'Of your files we store unencrypted' },
              { num: '100%', label: 'Client-side encryption' },
              { num: 'Free', label: 'To start, no credit card' },
            ].map((s, i) => (
              <div key={i} className="bg-[#080810] px-6 py-6 text-center">
                <div className="text-2xl font-extrabold text-white mb-1">{s.num}</div>
                <div className="text-xs text-gray-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES BENTO ──────────────────────────────────── */}
        <section id="features" className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold tracking-widest text-purple-400 uppercase mb-4 px-3 py-1 rounded-full border border-purple-500/25 bg-purple-500/8">
                Why OpenFile
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built for privacy, first.</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Every part of OpenFile is designed so that your files stay yours — always.
              </p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Big card — encryption */}
              <div className="md:col-span-2 group relative rounded-2xl border border-white/8 bg-white/3 p-8 overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Client-side Encryption</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                    Files are encrypted in the sender's browser using AES-256 before upload. The key never touches our servers — only you hold it. Not even we can open your files.
                  </p>
                  {/* Visual: encryption flow */}
                  <div className="flex items-center gap-2 text-xs">
                    {['Your file', '→ AES-256 →', 'Encrypted blob', '→ S3 storage'].map((step, i) => (
                      <span key={i} className={i % 2 === 1 ? 'text-purple-400 font-mono' : 'px-2 py-1 rounded-lg bg-white/5 border border-white/8 text-gray-400'}>{step}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Zero knowledge */}
              <div className="group relative rounded-2xl border border-white/8 bg-white/3 p-8 overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The encryption key lives only in your link URL fragment — never sent to our server. We're structurally unable to read your files.
                  </p>
                </div>
              </div>

              {/* No signup */}
              <div className="group relative rounded-2xl border border-white/8 bg-white/3 p-8 overflow-hidden hover:border-pink-500/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">No Signup for Senders</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Anyone can upload to your link — no account, no tracking, no friction. Just open the link and drop files.
                  </p>
                </div>
              </div>

              {/* Expiry control */}
              <div className="group relative rounded-2xl border border-white/8 bg-white/3 p-8 overflow-hidden hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">You Control the Key</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Set expiry, max upload count, or one-time use. Your link, your rules. Download the key file as a backup anytime.
                  </p>
                </div>
              </div>

              {/* Verified delivery */}
              <div className="group relative rounded-2xl border border-white/8 bg-white/3 p-8 overflow-hidden hover:border-green-500/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25 group-hover:scale-105 transition-transform duration-300">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Instant Dashboard</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    All received files appear in your encrypted dashboard. Preview or download — decrypted locally in your browser.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────── */}
        <section id="how-it-works" className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase mb-4 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/8">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Three steps. That's it.</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                No complex setup. No IT department needed.
              </p>
            </div>

            <div className="relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-[2.25rem] left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px">
                <div className="w-full h-full bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-pink-500/40" style={{ backgroundImage: 'repeating-linear-gradient(to right, rgba(139,92,246,0.4) 0, rgba(139,92,246,0.4) 6px, transparent 6px, transparent 14px)' }} />
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    num: '01', icon: <Link2 className="w-8 h-8 text-white" />,
                    gradient: 'from-purple-600 to-indigo-600', glow: 'shadow-purple-500/30', color: 'text-purple-400',
                    title: 'Create a Link',
                    desc: 'In your dashboard, generate a private encrypted upload link in seconds. Set expiry and upload limits.',
                  },
                  {
                    num: '02', icon: <Upload className="w-8 h-8 text-white" />,
                    gradient: 'from-blue-600 to-cyan-600', glow: 'shadow-blue-500/30', color: 'text-blue-400',
                    title: 'Share It',
                    desc: 'Send the link to anyone — a client, a colleague, a stranger. They open it in their browser, no account needed.',
                  },
                  {
                    num: '03', icon: <Zap className="w-8 h-8 text-white" />,
                    gradient: 'from-pink-600 to-rose-500', glow: 'shadow-pink-500/30', color: 'text-pink-400',
                    title: 'Receive Securely',
                    desc: 'Files encrypt in their browser before upload. You decrypt and download from your dashboard — only you can.',
                  },
                ].map(step => (
                  <div key={step.num} className="flex flex-col items-center text-center relative">
                    <div className={`w-[4.5rem] h-[4.5rem] bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-xl ${step.glow} z-10`}>
                      {step.icon}
                    </div>
                    <span className={`text-xs font-bold tracking-widest uppercase mb-2 ${step.color}`}>Step {step.num}</span>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────── */}
        <section id="pricing" className="py-4">
          <PlansPage />
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-blue-600/20 rounded-3xl blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#0c0c14] px-8 py-14 text-center overflow-hidden">
              {/* Corner glows */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl" />

              {/* Top line accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/25 bg-green-500/8 text-green-300 text-xs font-semibold mb-6">
                  <Globe className="w-3.5 h-3.5" />
                  Trusted by users worldwide
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Start receiving files
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    privately today.
                  </span>
                </h2>

                <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                  No credit card. No commitment. Free forever for personal use.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/dashboard"
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-purple-900/40 hover:shadow-purple-700/40 hover:scale-[1.02]"
                  >
                    Create your first link
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <a
                    href="#pricing"
                    className="inline-flex items-center justify-center gap-2 bg-white/6 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200"
                  >
                    See pricing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;
