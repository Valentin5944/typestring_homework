import type { Post } from "../domen/post/entity.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";

export interface PostService {
    getAll(category: string | undefined, take: string | undefined): Promise<Post[]>;
    getById(id: string): Promise<Post | undefined>;
    createPost(newPost: CreatePostRequest): Promise<Post>;
}
