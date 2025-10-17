import { Hono } from 'hono'
import { Checkout, CustomerPortal } from '@dodopayments/hono'

export const paymentsRouter = new Hono()


// For static (GET) link
paymentsRouter.get(
  '/dodo-checkout',
  Checkout({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
    type: 'static'  
  })
)

// For dynamic (POST) link where you might send order amount etc.
paymentsRouter.post(
  '/dodo-checkout',
  Checkout({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
    type: 'dynamic'
  })
)

// Customer Portal (for managing subscriptions etc.)

paymentsRouter.post(
  '/dodo-customer-portal',
  CustomerPortal({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL
  })
)
