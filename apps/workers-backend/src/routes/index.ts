import { ContextType, Diesel } from 'diesel-core'
import { Hono } from 'hono'
import { dieselAuthController, dieselMiddleware } from '../../../backend/server.conf'

export const diesel_auth_router = new Diesel({ logger: true })

diesel_auth_router
    .get('/', (c: ContextType) => {
        c.setHeader('Content-Type', 'text/plain')
        return c.text('auth route mounted to diesel')
    })
    .post("/google", dieselAuthController.handleGoogleSignIn)
    .get('/check', dieselMiddleware.authJwt as any, dieselAuthController.checkAuth)
    .get('/logout', dieselAuthController.logout)

export const diesel_file_router = new Diesel()
export const linkRouter = new Hono()
export const fileRouter = new Hono()



