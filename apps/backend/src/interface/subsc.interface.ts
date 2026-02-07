
export type StatusType =  'success' | 'failed' | 'processing' | 'user_not_found';

export interface ISubscriptionRepo {
    update_subscription_logs(
        data: {
            eventType: string
            status: StatusType | any
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
            error?: string | null
        }
    )
        : Promise<{
            id: number;
            eventType: string;
            status: StatusType | any;
            userEmail: string;
            userId: number;
            paymentId: string;
            subscriptionId: string | null;
            amount: number;
            currency: string;
            rawPayload: unknown;
            message: string;
            error: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null>


    update_plan(userId: number, planName?: string): Promise<{
        id: number;
        status: "ACTIVE" | "INACTIVE" | "CANCELLED" | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        planName: string;
        price: number;
        startDate: Date;
        endDate: Date | null;
        cancelAt: Date | null;
    } | null>
}