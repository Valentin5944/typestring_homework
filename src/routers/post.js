import { Router } from "express";
import { postHandler } from "../handlers/post.js";
const postRouter = Router();

postRouter.get("/", postHandler.handleGetAll);
postRouter.get("/:id", postHandler.handleGetById);
postRouter.post("/", postHandler.handleCreate);

export default postRouter;