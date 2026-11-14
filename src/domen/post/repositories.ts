import type { NewPostData, Post, PostCategory } from "./entity.js";
import type { CreatePostRequest } from "../../transport/dto/requests.js";

export interface PostRepository {
    getAll(category: string | undefined, take: string | undefined): Promise<Post[]>;
    getById(id: string): Promise<Post | undefined>;
    addPost(data: NewPostData): Promise<Post>;
    findCategoryByName(name: string): Promise<PostCategory | undefined>;
    getByAuthorId(authorId: number): Promise<Post[]>;
}
