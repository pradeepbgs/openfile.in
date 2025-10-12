import {  Hono } from 'hono'
import { Webhooks } from '@dodopayments/hono'
import { PaymentSucceededData, WebhookEvent } from '../../type';
import logger from '../utils/logger';
import { notificationService, subscriptionRepo, userRepository } from '../../server.conf';

export const webhookRouter = new Hono()


const subscription_logs = async (
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
) => {
    const isSuccessFull = await subscriptionRepo.update_subscription_logs(data)
    if (!isSuccessFull) console.warn(`error while saving subscription logs to DB`)
    logger.info(`[DB LOG] Saved subscription log for PaymentID: ${data.paymentId}`)
    console.log(`[DB LOG] Saved subscription log for PaymentID: ${data.paymentId}`)
}

const updatePlan = async (email: string, paymentData: PaymentSucceededData, retry: number = 0) => {
    if (!email) {
        console.warn('No customer email in payload');
        return;
    }

    try {
        console.log(`checking exitence of user: ${email}`)

        const existingUser = await userRepository.findUserByEmail(email);
        if (!existingUser) {
            console.warn('User not found');

            await subscription_logs({
                eventType: 'payment.succeeded',
                status: 'user_not_found',
                userEmail: email,
                userId: null,
                paymentId: paymentData.payment_id,
                subscriptionId: paymentData.subscription_id,
                amount: paymentData.total_amount,
                currency: paymentData.currency,
                rawPayload: JSON.stringify(paymentData),
                createdAt: new Date(paymentData.created_at),
                updatedAt: new Date(paymentData.updated_at),
                message: 'User not found',
                error: 'User not found'
            })
            return;
        }

        console.log(`found user: ${existingUser.email}, updating plan...`)
        const updatingPlan = await subscriptionRepo.update_plan(existingUser.id, 'pro')

        if (!updatingPlan) {
            console.warn(`Subscription record missing for user: ${email}`);

            await subscription_logs({
                eventType: 'payment.succeeded',
                status: 'failed',
                userEmail: email,
                userId: existingUser.id,
                paymentId: paymentData.payment_id,
                subscriptionId: paymentData.subscription_id,
                amount: paymentData.total_amount,
                currency: paymentData.currency,
                rawPayload: JSON.stringify(paymentData),
                createdAt: new Date(paymentData.created_at),
                updatedAt: new Date(paymentData.updated_at),
                message: 'No subscription record found for user',
                error: 'No subscription record found for user'
            })
            return;
        }

        console.log(`Plan successfully upgraded for user: ${existingUser.email}`)

        await subscription_logs({
            eventType: 'payment.succeeded',
            status: 'success',
            userEmail: email,
            userId: existingUser.id,
            paymentId: paymentData.payment_id,
            subscriptionId: paymentData.subscription_id,
            amount: paymentData.total_amount,
            currency: paymentData.currency,
            rawPayload: JSON.stringify(paymentData),
            createdAt: new Date(paymentData.created_at),
            updatedAt: new Date(paymentData.updated_at),
            message: 'Plan successfully upgraded to Pro',
            error: null
        })

        // sending mail
        notificationService.sendSubscriptionSuccessEmail(
            existingUser.email,
            paymentData.total_amount,
            paymentData.currency
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error updating plan for ${email}: ${message}`)

        if (retry < 3) {
            const delay = 2000 * (retry + 1)
            console.warn(`Retrying update in ${delay / 1000}s (Attempt ${retry + 2}/3)`)
            setTimeout(() => updatePlan(email, paymentData, retry + 1), delay);
        }
        else {
            console.error(`Max retries reached for ${email}, giving up.`)
            await subscription_logs({
                eventType: 'payment.succeeded',
                status: 'failed',
                userEmail: email,
                userId: 0,
                paymentId: paymentData.payment_id,
                subscriptionId: paymentData.subscription_id,
                amount: paymentData.total_amount,
                currency: paymentData.currency,
                rawPayload: JSON.stringify(paymentData),
                createdAt: new Date(paymentData.created_at),
                updatedAt: new Date(paymentData.updated_at),
                message: 'Error updating plan, retrying',
                error: String(message)
            })
        }
    }
}

webhookRouter.post('/dodo-payments', Webhooks({
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    onPayload: async (payload: WebhookEvent) => {
        console.log('---processing payment---')
        if (payload.type === 'payment.succeeded' && payload.data.status === 'succeeded') {
            const paymentData = payload.data;
            console.log('--- got payment data ---')
            console.log('--- updating plan ---')
            updatePlan(paymentData.customer.email, paymentData, 0)
        }
    }
}))