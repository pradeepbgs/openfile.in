import {  ContextType, Diesel } from "diesel-core";
import { dieselAuthController, dieselMiddleware } from "@/container";


export const diesel_auth_router = new Diesel({
    logger: true,
})

diesel_auth_router
  .get('/', (c: ContextType) => {
    //c.setHeader('Content-Type', 'text/plain')
    return c.text('auth route mounted to diesel')
  })
  // .post("/google", dieselAuthController.handleGoogleSignIn)  // OAuth disabled
  .post("/signup", dieselAuthController.signup)
  .post("/login", dieselAuthController.login)
  .get('/check', dieselMiddleware.authJwt, dieselAuthController.checkAuth)
  .get('/logout', dieselAuthController.logout)
  .get('/refresh-token', dieselMiddleware.fetchUserFromRefreshToken, dieselAuthController.refresh_token)
