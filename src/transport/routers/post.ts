import { Router } from "express";
import type { PostHandler } from "../handlers/handler.types.js";

export function createPostRouter(postHandler: PostHandler): Router {
    const postRouter = Router();

    postRouter.get("/", postHandler.handleGetAll);
    postRouter.get("/:id", postHandler.handleGetById);
    postRouter.post("/", postHandler.handleCreate);

    return postRouter;
}
