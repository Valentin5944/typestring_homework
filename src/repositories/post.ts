import type { PostRepository } from "../domen/post/repositories.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";
import type { NewPostData, Post, PostCategory } from "../domen/post/entity.js";

export function createPostRepository(db: any): PostRepository {
    const withRelations = () =>
        db.orm.public.Post
            .include("author", (author: any) => author.select("id", "email"))
            .include("category", (category: any) => category.select("id", "name"));
    async function getAll(category?: string, take?: string): Promise<Post[]> {
        let query = withRelations();

        if (category) {
            const found = await findCategoryByName(category);
            if (!found) {
                return [];
            }
            query = query.where({ categoryId: found.id });
        }

        if (take && Number(take) > 0) {
            query = query.limit(Number(take));
        }
        return await query.all();
    }
    async function getById(id: string): Promise<Post | undefined> {
        const post = await withRelations().where({ id: Number(id) }).first();
        return post || undefined;

    }
   
    async function addPost(data: NewPostData): Promise<Post> {
        const created = await db.orm.public.Post.create({
            title: data.title,
            content: data.content,
            authorId: data.authorId,
            categoryId: data.categoryId
        });
        return await withRelations().where({ id: created.id }).first();
    }
    async function findCategoryByName(name: string): Promise<PostCategory | undefined> {
        const category = await db.orm.public.Category.where({ name }).first();
        return category || undefined;
    }

    return { getAll, getById, addPost, findCategoryByName };
}
