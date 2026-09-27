import type { Request, Response } from "express";
import {postService} from "../../services/post.js";

function handleGetAll(req: Request, res: Response) {

    const category = req.query.category;
    const take = req.query.take;


    const postsList = postService.getAll(category as string | undefined, take as string | undefined);

    res.json(postsList);
}

function handleGetById(req: Request, res: Response) {

    const postId = req.params.id;


    const foundPost = postService.getById(postId as string);

    if (!foundPost) {

        return res.status(404).json({ error: "Пост не найден" });
    }

    res.json(foundPost);
}


async function handleCreate(req: Request, res: Response) {

    const newPostData = req.body;

    if (!newPostData.title || !newPostData.content) {

        return res.status(422).json({ error: "Нет title или content" });
    }
    const createdPost = await postService.createPost(newPostData);
    res.status(201).json(createdPost);
}


export const postHandler = { handleGetAll, handleGetById, handleCreate};
