import { prisma } from "../config/db";
import { ISubscriptionRepo } from "../interface/subsc.interface";

export class SubscriptionRepository implements ISubscriptionRepo {
    private static instance: SubscriptionRepository

    private constructor() { }

    static getInstance() {
        if (!SubscriptionRepository.instance) {
            SubscriptionRepository.instance = new SubscriptionRepository();
        }
        return SubscriptionRepository.instance
    }

    async update_subscription_logs(
        data: {
            eventType: string
            status: 'success' | 'failed' | 'processing' | 'user_not_found'
            userEmail: string
            userId?: number | null
            paymentId: string
            subscriptionId?: string | null
            amount: number
            currency: string
            rawPayload: any
            message?: string
            createdAt: Date
            updatedAt: Date
            error?: String
        }
    ) {

        return await prisma.subscriptionLog.upsert({
            where: {
                paymentId: data.paymentId,
            },
            update: {
                ...data,
                rawPayload:
                    typeof data.rawPayload === 'string'
                        ? data.rawPayload
                        : JSON.stringify(data.rawPayload),
            },
            create: {
                ...data,
                rawPayload:
                    typeof data.rawPayload === 'string'
                        ? data.rawPayload
                        : JSON.stringify(data.rawPayload)
            }
        });
    }

    // Update User Plan
    async update_plan(userId: number, planName: string = 'pro') {
        return await prisma.subscription.update({
            where: {
                userId
            },
            data: {
                planName
            }
        })
    }
}