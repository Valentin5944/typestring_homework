import type { Post } from "./entity.js";
import type { CreatePostRequest } from "../../transport/dto/requests.js";

export interface PostRepository {
    getAll(category: string | undefined, take: string | undefined): Promise<Post[]>;
    getById(id: string): Promise<Post | undefined>;
    addPost(newPost: CreatePostRequest): Promise<Post>;
}
