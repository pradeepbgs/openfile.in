import { Shield } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] mt-8">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">OpenFile</span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mb-4">
              Secure, zero-knowledge file receiving. Your files are encrypted before they leave the sender's device.
            </p>
            <a
              href="mailto:exvillagerbgs@gmail.com"
              className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              exvillagerbgs@gmail.com
            </a>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Security', href: '/privacy-policy/#security' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-neutral-500 hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Contact', href: '/privacy-policy/#contact' },
                { label: 'Help Center', href: '/privacy-policy/' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-neutral-500 hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e1e1e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} OpenFile. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Shield className="w-3 h-3" />
            End-to-end encrypted
          </div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
