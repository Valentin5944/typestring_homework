import { Router } from "express";
import type { PostHandler } from "../handlers/handler.types.js";
import { requireAuth } from "../middlewares/auth.js";

export function createPostRouter(postHandler: PostHandler): Router {
    const postRouter = Router();

    postRouter.get("/", postHandler.handleGetAll);
    postRouter.get("/my", requireAuth, postHandler.handleGetMyPosts);
    postRouter.get("/:id", postHandler.handleGetById);
    postRouter.post("/", postHandler.handleCreate);

    return postRouter;
}
