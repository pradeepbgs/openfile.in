import { Diesel } from 'diesel-core'
import { diesel_link_controller, dieselMiddleware } from '../../../../server.conf'
import { cors } from 'diesel-core/cors'

export const diesel_link_router = new Diesel({ logger: true })
diesel_link_router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
diesel_link_router
    .get('/', dieselMiddleware.fetchUserLinks as any, diesel_link_controller.getUserLinks)
    .get('/count', dieselMiddleware.fetchUser as any, diesel_link_controller.getLinksCount)
    .get('/validate', diesel_link_controller.validateLink)
    .post('/', dieselMiddleware.authJwt as any, diesel_link_controller.generateLink)
    .delete('/:id', dieselMiddleware.fetchLinkWithUser as any, diesel_link_controller.deleteLink)
