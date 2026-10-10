import type { PostRepository } from "../domen/post/repositories.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";
import type { PostService } from "./service.types.js";
import type { Post } from "../domen/post/entity.js";


export function createPostService(postRepository: PostRepository): PostService {
    const getAll = async (category: string | undefined, take: string | undefined): Promise<Post[]> => {
        return await postRepository.getAll(category, take);
    };

    const getById = async (id: string): Promise<Post | undefined> => {
        return await postRepository.getById(id);
    };

    const createPost = async (newPost: CreatePostRequest): Promise<Post> => {
        return await postRepository.addPost(newPost);
    };

    return { getAll, getById, createPost };
}
