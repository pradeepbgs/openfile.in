import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/zustand/store';
import { checkout } from '~/service/api';
import Spinner from '~/components/spinner';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for light and personal use.',
        features: [
            '5 upload links per day',
            '2 upload per link',
            'Files expire in 24 hr',
            'Basic support',
        ],
        planKey: 'free',
    },
    {
        name: 'Pro',
        price: '$4.99/month',
        description: 'For active users who need flexibility.',
        features: [
            '100 upload links per day',
            '100 uploads per link',
            'Files expire in 15 days',
            '24/7 support',
        ],
        planKey: 'pro',
    },
];

export default function PlansPage() {
    const user: any = useAuth.getState().user;
    const currentPlan = user?.plan;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSelectPlan = async (planKey: string) => {
        if (planKey === 'free') {
            navigate('/plan/checkout')
            return
        }
        setLoading(true);
        const url = await checkout(import.meta.env.VITE_DODO_PRODUCT_ID)
        if (url) {
            window.location.href = url;
        }
        setLoading(false);
    };

    return (
        <div className="text-white px-6 py-16 flex flex-col items-center bg-[#111111]">
            <div className="text-center mb-12">
                <p className="text-xs font-semibold tracking-widest text-neutral-600 uppercase mb-3">Pricing</p>
                <h1 className="text-4xl font-bold text-white mb-3">Simple, Transparent Pricing</h1>
                <p className="text-neutral-500 text-base max-w-md mx-auto">Start free. Upgrade when you need more.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {plans.map((plan) => {
                    const isPro = plan.planKey === 'pro';
                    const isCurrent = currentPlan === plan.planKey;
                    return (
                        <div
                            key={plan.name}
                            className={`relative p-7 rounded-xl flex flex-col border transition-colors ${
                                isPro
                                    ? 'border-white/20 bg-[#1a1a1a]'
                                    : 'border-[#222222] bg-[#161616]'
                            }`}
                        >
                            {isPro && (
                                <div className="absolute -top-3 left-6">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-black">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="mb-5">
                                <h2 className="text-sm font-semibold text-neutral-400 mb-2 uppercase tracking-wide">{plan.name}</h2>
                                <p className="text-3xl font-bold text-white mb-1">{plan.price}</p>
                                <p className="text-neutral-500 text-sm">{plan.description}</p>
                            </div>
                            <ul className="text-sm space-y-2.5 mb-7 flex-1">
                                {plan.features.map((f, i) => (
                                    <li className="flex items-center gap-2.5 text-neutral-300" key={i}>
                                        <span className="text-neutral-500 text-xs">✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            {isCurrent ? (
                                <button
                                    disabled
                                    className="w-full bg-[#1e1e1e] text-neutral-600 border border-[#262626] py-2.5 rounded-lg cursor-not-allowed text-sm font-medium"
                                >
                                    Current Plan
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!user) return navigate('/auth');
                                        return handleSelectPlan(plan.planKey);
                                    }}
                                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isPro
                                            ? 'bg-white text-black hover:bg-neutral-100'
                                            : 'bg-[#1e1e1e] hover:bg-[#242424] border border-[#2a2a2a] text-white'
                                    }`}
                                >
                                    {loading ? <Spinner /> : isPro ? 'Get Pro' : 'Get Started'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
