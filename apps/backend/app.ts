import { Hono } from 'hono'
import { linkRouter } from './src/routes/link.routes'
import { cors } from 'hono/cors'
import { fileRouter } from './src/routes/file.route'
import { secureHeaders } from 'hono/secure-headers'
import { logger } from 'hono/logger'
import { webhookRouter } from './src/routes/webhook'
import { paymentsRouter } from './src/routes/payments'
import { diesel_auth_router } from './src/diesel/routes/auth.routes'
import { httpRequestsCounter, httpResponseTime, registry } from './metrics'
import { diesel_file_router } from './src/diesel/routes/file.routes'




const app = new Hono()


app.use(logger())

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const duration = (Date.now() - start) / 1000;

  const path = c.req.url;
  const method = c.req.method;
  const status = c?.status || 200;

  httpRequestsCounter.labels(method, path, status.toString()).inc();
  httpResponseTime.labels(method, path, status.toString()).observe(duration);

  return c.res;
});

app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN,
    // allowHeaders : ['Access-Control-Allow-Credentials: true'],
    credentials: true
  })
)

app.use(
  '*',
  secureHeaders({
    strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    referrerPolicy: 'no-referrer',
    xXssProtection: '0',
    // contentSecurityPolicy: "default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    xContentTypeOptions: 'nosniff',
  })
)

app
  .get('/', (c) => c.text('welcome lady boy!'))
  .get('/health', (c) => c.text("i'm good lady boy!"))



app
  // .route("/api/v1/auth", authRouter)
  .mount('/api/v1/auth', diesel_auth_router.fetch())
  .route("/api/v1/link", linkRouter)
  .mount('/api/v1/file/upload-url', diesel_file_router.fetch())
  .route('/api/v1/file', fileRouter)
  //
  .route('/api/v1/webhooks', webhookRouter)
  .route('/api/v1/payments', paymentsRouter)


// for monitoring

app.get("/metrics", async (c) => {
  const metrics = await registry.metrics();
  return c.text(metrics, 200, { "Content-Type": registry.contentType });
});

// app.onError((err, c) => {
//   console.error(`checking err : ${err?.message}`)
//   return c.json({ message: err.message }, 500)
// })

export default app
