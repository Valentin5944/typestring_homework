import type { Request, Response } from "express";
import type { PostService } from "../../services/service.types.js";
import type { PostHandler } from "./handler.types.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import type { CreatePostRequest, FilterPostQuery } from "../dto/requests.js";
import { sendError } from "./auth.js";


export function createPostHandler(postService: PostService): PostHandler {
    async function handleGetAll(req: Request<{}, any, any, FilterPostQuery>, res: Response): Promise<void | Response> {
        const { category, take } = req.query;
        const postsList = await postService.getAll(category, take);
        return res.json(postsList);
    }

    async function handleGetById(req: Request<{ id: string }>, res: Response): Promise<void | Response> {
        const foundPost = await postService.getById(req.params.id);

        if (!foundPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.json(foundPost);
    }

    async function handleCreate(req: Request<{}, any, Partial<CreatePostRequest>>, res: Response): Promise<void | Response> {
        const { title, content, category, authorId } = req.body ?? {};

        if (!title || !content || !category) {
            return res.status(422).json({ error: "Title, content and category are required" });
        }
        if (typeof authorId !== "number" || !Number.isInteger(authorId)) {
            return res.status(422).json({ error: "Number needed" });
        }

        try {
            const createdPost = await postService.createPost({ title, content, category, authorId });
            return res.status(201).json(createdPost);
        } catch (error) {
            return sendError(res, error);
        }
    }

    async function handleGetMyPosts(req: AuthenticatedRequest, res: Response): Promise<void | Response> {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const myPosts = await postService.getByAuthorId(req.user.userId);
    return res.json(myPosts);
}

    return { handleGetAll, handleGetById, handleCreate, handleGetMyPosts };
}