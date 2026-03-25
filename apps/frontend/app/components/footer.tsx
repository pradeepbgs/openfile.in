import { Shield } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

function Footer() {
    return (
        <footer className="relative border-t border-white/6 mt-8">
            {/* Top gradient line accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 py-14">
                <div className="grid md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">OpenFile</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-4">
                            Secure, zero-knowledge file receiving. Your files are encrypted before they leave the sender's device.
                        </p>
                        <a
                            href="mailto:exvillagerbgs@gmail.com"
                            className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
                        >
                            exvillagerbgs@gmail.com
                        </a>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Product</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Features', href: '#features' },
                                { label: 'Pricing', href: '#pricing' },
                                { label: 'Security', href: '/privacy-policy/#security' },
                                { label: 'Dashboard', href: '/dashboard' },
                            ].map(l => (
                                <li key={l.label}>
                                    <a href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">{l.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Privacy Policy', href: '/privacy-policy' },
                                { label: 'Contact', href: '/privacy-policy/#contact' },
                                { label: 'Help Center', href: '/privacy-policy/' },
                            ].map(l => (
                                <li key={l.label}>
                                    <a href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">{l.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} OpenFile. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Shield className="w-3 h-3 text-green-500/60" />
                        End-to-end encrypted
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default React.memo(Footer);
