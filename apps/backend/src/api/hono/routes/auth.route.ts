import { Hono } from "hono";
import { authController, middleware } from "../../../../server.conf";


export const authRouter = new Hono()
    // .post("/google", authController.handleGoogleSignIn)  // OAuth disabled
    .post("/signup", authController.signup)
    .post("/login", authController.login)
    .get('/check', middleware.authJwt, authController.checkAuth)
    .get('/logout', authController.logout)