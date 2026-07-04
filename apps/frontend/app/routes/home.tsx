import { Link } from 'react-router';
import Header from '~/components/header';
import Footer from '~/components/footer';
import PlansPage from './dashboard/plan';

const features = [
  { title: 'Client-side Encryption', desc: "Files encrypt in the sender's browser using AES-256 before upload. The key never touches our servers." },
  { title: 'Zero-Knowledge', desc: "The encryption key lives only in the link URL fragment — never sent to our server. We're structurally unable to read your files." },
  { title: 'No Signup for Senders', desc: 'Anyone can upload to your link — no account, no tracking, no friction.' },
  { title: 'You Control the Key', desc: 'Set expiry, max upload count, or one-time use. Download the key file as a backup anytime.' },
  { title: 'Instant Dashboard', desc: 'All received files appear in your dashboard. Preview or download — decrypted locally in your browser.' },
  { title: 'Simple Sharing', desc: 'One link, shareable anywhere. Works in any browser with no plugins required.' },
];

const steps = [
  { num: '01', title: 'Create a link', desc: 'Generate a private encrypted upload link from your dashboard in seconds.' },
  { num: '02', title: 'Share it', desc: 'Send the link to anyone. They open it in their browser — no account needed.' },
  { num: '03', title: 'Receive securely', desc: 'Files encrypt in their browser before upload. Only you can decrypt and download.' },
];

export default function App() {
  return (
    <div className="min-h-screen text-white bg-[#111111]">
      <Header />
      <main>
        {/* Hero */}
        <section className="px-6 pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-5">
              Receive files privately.
            </h1>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
              Create an encrypted upload link. Share it. Anyone can send you files —
              encrypted in their browser before they leave their device.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center bg-white text-black px-7 py-2.5 rounded-lg font-semibold text-sm hover:bg-neutral-100 transition-colors"
              >
                Get Started Free
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center border border-[#2a2a2a] text-neutral-400 hover:text-white px-7 py-2.5 rounded-lg font-semibold text-sm transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-16 border-t border-[#1e1e1e]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-base font-semibold text-white mb-8">Why OpenFile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-7">
              {features.map((f) => (
                <div key={f.title}>
                  <h3 className="text-sm font-medium text-white mb-1">{f.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="px-6 py-16 border-t border-[#1e1e1e]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-base font-semibold text-white mb-8">How it works</h2>
            <ol className="space-y-7">
              {steps.map((s) => (
                <li key={s.num} className="flex gap-5">
                  <span className="text-xs font-mono text-neutral-600 pt-0.5 w-6 flex-shrink-0">{s.num}</span>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">{s.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-[#1e1e1e]">
          <PlansPage />
        </section>
      </main>
      <Footer />
    </div>
  );
}
