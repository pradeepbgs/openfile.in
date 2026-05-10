import {  ContextType, Diesel } from "diesel-core";
import { dieselAuthController, dieselMiddleware } from "../../../../server.conf";
import { cors } from "diesel-core/cors";


export const diesel_auth_router = new Diesel({
    logger: true,
})
diesel_auth_router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
diesel_auth_router
    .get('/', (c: ContextType) => {
        //c.setHeader('Content-Type', 'text/plain')
        return c.text('auth route mounted to diesel')
    })
    // .post("/google", dieselAuthController.handleGoogleSignIn)  // OAuth disabled
    .post("/signup", dieselAuthController.signup)
    .post("/login", dieselAuthController.login)
    .get('/check', dieselMiddleware.authJwt as any, dieselAuthController.checkAuth)
    .get('/logout', dieselAuthController.logout)
