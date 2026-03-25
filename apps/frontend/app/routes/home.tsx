import { Shield, Upload, Download, ArrowRight, Zap, Globe, Lock, Users, Star } from 'lucide-react';
import { Link } from 'react-router';
import Header from '~/components/header';
import Footer from '~/components/footer';
import PlansPage from './dashboard/plan';
import { GLOBAL_BG } from 'constant';

function App() {
  return (
    <div className={`min-h-screen text-white ${GLOBAL_BG}`}>
      <Header />

      <main>

        {/* Hero Section */}
        <section className="relative text-center px-6 py-28 md:py-36 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full opacity-25 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              <Lock className="w-3.5 h-3.5" />
              End-to-End Encrypted by default
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                Receive Files
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Privately & Securely
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                OpenFile lets you receive files without revealing personal details.<br className="hidden md:block" />
                No sign-up needed for senders. Zero knowledge. Always encrypted.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to={'/dashboard'}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/40 hover:scale-105"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href='#how-it-works'
                  className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 hover:bg-white/15 text-gray-200 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                >
                  How It Works
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> No signup for senders</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Zero-knowledge architecture</span>
                <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Free to get started</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10">
                Why OpenFile
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 mt-3">Built for Privacy First</h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto">
                The most secure and private way to receive files from anyone.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Encryption */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 hover:bg-white/8 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Client-side Encryption</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Files are encrypted before they leave your device. Only you can decrypt them — not even we can access them.
                </p>
              </div>

              {/* Zero Knowledge */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 hover:bg-white/8 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge Privacy</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  You hold the key — literally. We never see your files or decrypt them. You're in full control at all times.
                </p>
              </div>

              {/* No Account Needed */}
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 hover:bg-white/8 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Private & Effortless</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  No signup needed for senders. Anyone can upload via your link. Files land securely in your encrypted dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-3 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 mt-3">Three Simple Steps</h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto">
                Let anyone send files to you — securely and anonymously.
              </p>
            </div>

            <div className="relative grid md:grid-cols-3 gap-8">
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20 z-10">
                  <Upload className="w-9 h-9 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-400 tracking-widest uppercase mb-2">Step 01</span>
                <h3 className="text-lg font-bold text-white mb-3">Create a Unique Link</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
                  Generate a private, encrypted upload link from your dashboard in seconds.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 z-10">
                  <Users className="w-9 h-9 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2">Step 02</span>
                <h3 className="text-lg font-bold text-white mb-3">Share the Link</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
                  Send the link to anyone — clients, colleagues, or friends. No account required for them.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-pink-500/20 z-10">
                  <Download className="w-9 h-9 text-white" />
                </div>
                <span className="text-xs font-bold text-pink-400 tracking-widest uppercase mb-2">Step 03</span>
                <h3 className="text-lg font-bold text-white mb-3">Receive Files Securely</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
                  Files are encrypted on their device and land in your dashboard — only you can decrypt them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-10">
          <PlansPage />
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-12 text-center">
              {/* Glow behind */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-xs font-semibold mb-6">
                  <Star className="w-3 h-3" />
                  Free to get started
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Ready to Receive Files<br />Privately?
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                  Join users who trust OpenFile to receive sensitive files — privately, safely, effortlessly.
                </p>
                <Link
                  to={'/dashboard'}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/30"
                >
                  Start for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
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
