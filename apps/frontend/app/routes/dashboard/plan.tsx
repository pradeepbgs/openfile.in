import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/zustand/store';

import { checkout } from '~/service/api';
import Spinner from '~/components/spinner';
import { GLOBAL_BG } from 'constant';

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
    // {
    //     name: 'Enterprise',
    //     price: '$4.99/month',
    //     description: 'For teams and high-volume usage.',
    //     features: [
    //         'Unlimited upload links',
    //         '100 uploads per link',
    //         'Files expire in 30 days',
    //         '24/7 support',
    //     ],
    //     planKey: 'enterprise',
    // },
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
        <div className={`text-white px-6 py-16 flex flex-col items-center ${GLOBAL_BG}`}>
            <div className="text-center mb-12">
                <span className="inline-block text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10">
                    Pricing
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-3">Simple, Transparent Pricing</h1>
                <p className="text-gray-400 text-lg max-w-md mx-auto">Start free. Upgrade when you need more.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                {plans.map((plan) => {
                    const isPro = plan.planKey === 'pro';
                    const isCurrent = currentPlan === plan.planKey;
                    return (
                        <div
                            key={plan.name}
                            className={`relative p-7 rounded-2xl shadow-xl transition duration-300 flex flex-col ${
                                isPro
                                    ? 'border border-purple-500 bg-gradient-to-b from-purple-950/40 to-black/40 backdrop-blur-md shadow-purple-500/20'
                                    : isCurrent
                                        ? 'border border-purple-500 bg-white/5 backdrop-blur-md'
                                        : 'border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
                            }`}
                        >
                            {isPro && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
                                        ⭐ Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-white mb-1">{plan.name}</h2>
                                <p className="text-3xl font-extrabold text-white mb-1">{plan.price}</p>
                                <p className="text-gray-400 text-sm">{plan.description}</p>
                            </div>
                            <ul className="text-sm space-y-2.5 mb-7 flex-1">
                                {plan.features.map((f, i) => (
                                    <li className="flex items-center gap-2 text-gray-300" key={i}>
                                        <span className="text-green-400 font-bold">✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            {isCurrent ? (
                                <button
                                    disabled
                                    className="w-full bg-white/10 text-white/50 py-2.5 rounded-xl cursor-not-allowed text-sm font-medium"
                                >
                                    Your Current Plan
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!user) return navigate('/auth');
                                        return handleSelectPlan(plan.planKey);
                                    }}
                                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isPro
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]'
                                            : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white'
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
