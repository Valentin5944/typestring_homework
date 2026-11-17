import type { NewPostData, Post, PostCategory } from "./entity.js";
import type { CreatePostRequest } from "../../transport/dto/requests.js";

export interface PostRepository {
    getAll(category?: string, take?: string): Promise<Post[]>;
    getById(id: string): Promise<Post | null>;
    addPost(data: NewPostData): Promise<Post>;
    findCategoryByName(name: string): Promise<PostCategory | null>;
    getByAuthorId(authorId: number): Promise<Post[]>;
}
