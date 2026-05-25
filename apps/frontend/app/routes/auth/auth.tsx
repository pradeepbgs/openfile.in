import { useState } from 'react';
import { Shield, Lock, Zap } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { GLOBAL_BG } from "constant";
import OpenfileLogo from '~/components/openfile-logo';
import { signup, login } from '~/service/api';

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/dashboard";

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'signup') {
                await signup(username, password);
            } else {
                await login(username, password);
            }
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${GLOBAL_BG} min-h-screen flex items-center justify-center px-4 py-12`}>
            <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-[#222222] grid md:grid-cols-2">

                {/* Left — Branding */}
                <div className="hidden md:flex flex-col justify-between bg-[#161616] p-10 border-r border-[#222222]">
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-10">
                            <OpenfileLogo />
                            <span className="text-base font-semibold text-white">OpenFile</span>
                        </Link>

                        <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
                            Receive files<br />privately & securely.
                        </h2>
                        <p className="text-neutral-500 text-sm mb-10 leading-relaxed">
                            Create encrypted upload links and let anyone send you files — no account needed for senders.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: <Shield size={14} />, text: "Client-side encryption — we never see your files" },
                                { icon: <Lock size={14} />, text: "Zero-knowledge architecture" },
                                { icon: <Zap size={14} />, text: "No signup needed for senders" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-400">
                                    <span className="text-neutral-500 flex-shrink-0">{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-neutral-700 mt-10">
                        © {new Date().getFullYear()} OpenFile
                    </p>
                </div>

                {/* Right — Login / Signup */}
                <div className="bg-[#111111] p-10 flex flex-col justify-center">
                    <Link to="/" className="flex items-center gap-2 mb-8 md:hidden">
                        <OpenfileLogo />
                        <span className="text-base font-semibold text-white">OpenFile</span>
                    </Link>

                    <div className="flex rounded-lg overflow-hidden border border-[#222222] mb-8">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                        >
                            Sign up
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h3>
                    <p className="text-neutral-500 text-sm mb-8">
                        {mode === 'login' ? 'Sign in with your username to continue.' : 'Choose a username and password to get started.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1.5 font-medium uppercase tracking-wide">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="your_username"
                                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#3a3a3a] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-neutral-500 mb-1.5 font-medium uppercase tracking-wide">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                placeholder="••••••••"
                                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#3a3a3a] transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-black py-2.5 rounded-lg text-sm font-semibold transition-colors"
                        >
                            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-neutral-700 mt-6">
                        By signing in you agree to our{' '}
                        <Link to="/privacy-policy" className="text-neutral-500 hover:text-neutral-300 underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
