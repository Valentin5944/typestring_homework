import type { Request, Response } from "express";
import type { PostService } from "../../services/service.types.js";
import type { PostHandler } from "./handler.types.js";
import type { CreatePostRequest } from "../dto/requests.js";


export function createPostHandler(postService: PostService): PostHandler {
    async function handleGetAll(req: Request<any, any, any, { category?: string; take?: string }>, res: Response): Promise<void | Response> {
        const { category, take } = req.query;
        const postsList = await postService.getAll(category, take);
        return res.json(postsList);
    }

    async function handleGetById(req: Request<{ id: string }>, res: Response): Promise<void | Response> {
        const postId = req.params.id;
        const foundPost = await postService.getById(postId);

        if (!foundPost) {
            return res.status(404).json({ error: "Пост не найден" });
        }

        return res.json(foundPost);
    }

    async function handleCreate(req: Request<any, any, CreatePostRequest>, res: Response): Promise<void | Response> {
        const newPostData = req.body;
        if (!newPostData.title || !newPostData.content) {
            return res.status(422).json({ error: "Нет title или content" });
        }

        const createdPost = await postService.createPost(newPostData);
        return res.status(201).json(createdPost);
    }

    return { handleGetAll, handleGetById, handleCreate };
}
