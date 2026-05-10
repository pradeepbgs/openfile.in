import { Diesel } from 'diesel-core'
import { registry } from './metrics'
import { diesel_auth_router } from './src/api/diesel/routes/auth.routes'
import { diesel_link_router } from './src/api/diesel/routes/link.routes'
import { diesel_file_router } from './src/api/diesel/routes/file.routes'
// import { webhookRouter } from './src/api/hono/routes/webhook'   // uses @dodopayments/hono — needs separate port
// import { paymentsRouter } from './src/api/hono/routes/payments' // uses @dodopayments/hono — needs separate port
import {cors} from 'diesel-core/cors'
const app = new Diesel({ logger: true })

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || []

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

// TODO: secure headers middleware — Hono specific, needs diesel equivalent
// TODO: prometheus metrics middleware — Hono specific, needs diesel equivalent

app.get("/", () => new Response("Welcome to openfile"))
app.get('/health', (c: any) => c.text("i'm good lady boy!"))

app.get('/metrics', async (c: any) => {
    const metrics = await registry.metrics()
    return c.text(metrics, 200, { 'Content-Type': registry.contentType })
})

app.route('/api/v1/auth', diesel_auth_router)
app.route('/api/v1/link', diesel_link_router)
app.route('/api/v1/file', diesel_file_router)

export default app
