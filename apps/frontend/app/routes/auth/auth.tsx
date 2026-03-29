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
            <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 grid md:grid-cols-2">

                {/* Left — Branding */}
                <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-purple-950/80 via-indigo-950/60 to-black p-10">
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                    />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-10">
                            <OpenfileLogo />
                            <span className="text-xl font-bold text-white">OpenFile</span>
                        </Link>

                        <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
                            Receive files<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                privately & securely.
                            </span>
                        </h2>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                            Create encrypted upload links and let anyone send you files — no account needed for senders.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: <Shield size={15} />, text: "Client-side encryption — we never see your files" },
                                { icon: <Lock size={15} />, text: "Zero-knowledge architecture" },
                                { icon: <Zap size={15} />, text: "No signup needed for senders" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                    <span className="text-purple-400 flex-shrink-0">{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-gray-600 mt-10">
                        © {new Date().getFullYear()} OpenFile
                    </p>
                </div>

                {/* Right — Login / Signup */}
                <div className="bg-black/50 backdrop-blur-md p-10 flex flex-col justify-center">
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8 md:hidden">
                        <OpenfileLogo />
                        <span className="text-lg font-bold text-white">OpenFile</span>
                    </Link>

                    {/* Toggle */}
                    <div className="flex rounded-lg overflow-hidden border border-white/10 mb-8">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Sign up
                        </button>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1">
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-8">
                        {mode === 'login' ? 'Sign in with your username to continue.' : 'Choose a username and password to get started.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="your_username"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-600 mt-6">
                        By signing in you agree to our{' '}
                        <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-400 underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
