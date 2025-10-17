import { Hono } from "hono";
import { linkController, middleware } from "../../server.conf";


export const linkRouter = new Hono()
    // wrote test for this
    .get("/", middleware.fetchUserLinks, linkController.getUserLinks)

    .get("/count", middleware.fetchUser, linkController.getLinksCount)

    // wrote test for this
    .get("/validate", linkController.validateLink)

    // wrote test for this
    .post("/", middleware.authJwt, linkController.generateLink)

    // worte for this
    .delete("/:id", middleware.fetchLinkWithUser, linkController.deleteLink)