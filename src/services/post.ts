import type { PostRepository } from "../domen/post/repositories.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";
import type { PostService } from "./service.types.js";
import type { Post } from "../domen/post/entity.js";


export function createPostService(postRepository: PostRepository): PostService {
    const getAll = (category: string | undefined, take: string | undefined): Post[] => {
        return postRepository.getAll(category, take);
    };

    const getById = (id: string): Post | undefined => {
        return postRepository.getById(id);
    };

    const createPost = (newPost: CreatePostRequest): Promise<Post> => {
        return postRepository.addPost(newPost);
    };

    return { getAll, getById, createPost };
}
