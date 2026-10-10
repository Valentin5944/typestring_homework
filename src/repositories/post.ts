import type { PostRepository } from "../domen/post/repositories.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";
import type { Post } from "../domen/post/entity.js";

export function createPostRepository(database: any): PostRepository {
    async function getAll(category: string | undefined, take: string | undefined): Promise<Post[]> {
        let query = database.orm.public.Post;

        if (category) {
            query = query.where({ category });
        }

        if (take && Number(take) > 0) {
            query = query.limit(Number(take));
        }
        return await query.all();
    }
    async function getById(id: string): Promise<Post | undefined> {
        const post = await database.orm.public.Post.where({ id: Number(id) }).first();
        return post || undefined;
    }
    async function addPost(newPost: CreatePostRequest): Promise<Post> {
        return await database.orm.public.Post.create({
            title: newPost.title,
            content: newPost.content,
            author: newPost.author,
            category: newPost.category
        });
    }

    return { getAll, getById, addPost };
}
