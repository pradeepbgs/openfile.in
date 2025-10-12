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
        <div className={`min-h-screen text-white p-6 flex flex-col items-center ${GLOBAL_BG}`}>
            <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`p-6 rounded-2xl shadow-xl transition duration-300 ${currentPlan === plan.planKey
                            ? 'border border-purple-500 bg-white/5 backdrop-blur-md'
                            : 'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500'
                            }`}
                    >
                        <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                        <p className="text-purple-400 text-2xl font-bold mb-4">{plan.price}</p>
                        <p className="text-gray-300 mb-4">{plan.description}</p>
                        <ul className="text-sm space-y-2 text-gray-200">
                            {plan.features.map((f, i) => (
                                <li className="text-green-400" key={i}>
                                    ✓ {f}
                                </li>
                            ))}
                        </ul>

                        {currentPlan === plan.planKey ? (
                            <button
                                disabled
                                className="mt-6 w-full bg-gray-700 text-white/70 py-2 rounded-md cursor-not-allowed"
                            >
                                Your Current Plan
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (!user) return navigate('/auth');
                                    return handleSelectPlan(plan.planKey);

                                    return navigate('/plan/checkout')
                                }}
                                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                                {
                                    loading ? (
                                        <Spinner />
                                    ) : (
                                        "CheckOut"
                                    )
                                }
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
