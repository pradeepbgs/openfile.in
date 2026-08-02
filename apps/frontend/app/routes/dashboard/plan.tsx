import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/zustand/store';
import { checkout } from '~/service/api';
import Spinner from '~/components/spinner';
import { NBBadge, NBCard, nbButtonClass, type NBColor } from '~/components/ui/neobrutal';

const plans: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
    planKey: string;
    color: NBColor;
}> = [
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
        color: 'blue',
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
        color: 'yellow',
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
        <div className="text-black px-6 py-16 flex flex-col items-center bg-[#FFF8E7]">
            <div className="text-center mb-12">
                <p className="text-xs font-extrabold tracking-widest text-black/60 uppercase mb-3">Pricing</p>
                <h1 className="text-4xl font-extrabold text-black mb-3">Simple, Transparent Pricing</h1>
                <p className="text-black/70 text-base max-w-md mx-auto font-medium">Start free. Upgrade when you need more.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                {plans.map((plan) => {
                    const isPro = plan.planKey === 'pro';
                    const isCurrent = currentPlan === plan.planKey;
                    return (
                        <NBCard key={plan.name} color="white" shadow="lg" className="relative p-7 flex flex-col">
                            {isPro && (
                                <div className="absolute -top-4 left-6">
                                    <NBBadge color={plan.color}>Most Popular</NBBadge>
                                </div>
                            )}
                            <NBBadge color={plan.color} className="w-fit mb-5 rounded-md uppercase tracking-wide">
                                {plan.name}
                            </NBBadge>
                            <div className="mb-5">
                                <p className="text-3xl font-extrabold text-black mb-1">{plan.price}</p>
                                <p className="text-black/70 text-sm font-medium">{plan.description}</p>
                            </div>
                            <ul className="text-sm space-y-2.5 mb-7 flex-1">
                                {plan.features.map((f, i) => (
                                    <li className="flex items-center gap-2.5 text-black font-medium" key={i}>
                                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center bg-black text-white text-[9px] font-extrabold rounded-sm">✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            {isCurrent ? (
                                <button
                                    disabled
                                    className="w-full bg-black/5 text-black/40 border-2 border-black/20 py-2.5 rounded-lg cursor-not-allowed text-sm font-extrabold"
                                >
                                    Current Plan
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (!user) return navigate('/auth');
                                        return handleSelectPlan(plan.planKey);
                                    }}
                                    className={nbButtonClass({ color: plan.color, className: 'w-full py-2.5' })}
                                >
                                    {loading ? <Spinner color="black" /> : isPro ? 'Get Pro' : 'Get Started'}
                                </button>
                            )}
                        </NBCard>
                    );
                })}
            </div>
        </div>
    );
}
