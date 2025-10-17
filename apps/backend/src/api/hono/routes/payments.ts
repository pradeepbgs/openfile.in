import { Context, Hono } from 'hono'
import { Checkout, CustomerPortal } from '@dodopayments/hono'
import { middleware, subscriptionRepository } from '../../../../server.conf'
import { User } from '../../../generated/prisma'
import { HTTPException } from 'hono/http-exception'




export const paymentsRouter = new Hono()


// For static (GET) link
paymentsRouter.get(
  '/dodo-checkout',
  middleware.authJwt,
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
  middleware.authJwt,
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
  middleware.authJwt,
  CustomerPortal({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL
  })
)



// async function paymentAuth(c: Context) {
//   try {
//     const user: User & {
//       subscription?: { planName: string } | null
//     } = c.get('user')

//     if (!user) {
//       throw new HTTPException(401, {
//         res: c.json({ message: 'Unauthorized', error: 'User not found in context' }, 401)
//       })
//     }

//     const plan = user.subscription?.planName || 'free'

//     if (plan === 'free') {

//     }

//   } catch (error) {

//   }
// }