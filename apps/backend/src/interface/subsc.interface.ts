
export interface ISubscriptionRepo {
    update_subscription_logs(
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
    )

    update_plan(userId: number, planName: string)
}