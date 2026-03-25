import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginHandler } from "~/service/api";
import { Shield, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { GLOBAL_BG } from "constant";
import OpenfileLogo from '~/components/openfile-logo';

export default function AuthPage() {
    const handleGoogleLogin = useGoogleLoginHandler();

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

                {/* Right — Login */}
                <div className="bg-black/50 backdrop-blur-md p-10 flex flex-col justify-center">
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8 md:hidden">
                        <OpenfileLogo />
                        <span className="text-lg font-bold text-white">OpenFile</span>
                    </Link>

                    <h3 className="text-2xl font-bold text-white mb-1">Welcome back</h3>
                    <p className="text-gray-400 text-sm mb-8">Sign in with your Google account to continue.</p>

                    <div className="flex justify-center mb-8">
                        <GoogleLogin
                            onSuccess={(res) => handleGoogleLogin(res.credential)}
                            onError={() => console.log('Login Failed')}
                        />
                    </div>

                    <p className="text-center text-xs text-gray-600 mt-6">
                        By signing in you agree to our{' '}
                        <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-400 underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
