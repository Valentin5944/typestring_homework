import type { Request, Response } from "express";
import { postRepository } from "../repositories/post.js";
import type { CreatePostRequest, FilterPostQuery } from "../dto/requests.js";

const getAll = (category: string | undefined, take: string | undefined) => {
    return postRepository.getAll(category, take);
}
const getById = (id: string) => {
    return postRepository.getById(id);
}
const createPost = (newPost: CreatePostRequest) =>{
    return postRepository.addPost(newPost);
}
export const postService = { getAll, getById, createPost };