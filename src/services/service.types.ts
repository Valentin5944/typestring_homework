import type { Post } from "../domen/post/entity.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";


export interface PostService {
    getAll(category: string | undefined, take: string | undefined): Post[];
    getById(id: string): Post | undefined;
    createPost(newPost: CreatePostRequest): Promise<Post>;
}
