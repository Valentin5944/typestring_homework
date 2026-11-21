import type { PostRepository } from "../domain/post/repositories.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";
import type { NewPostData, Post, PostCategory } from "../domain/post/entity.js";

type Database = typeof import("../prisma/db.js").db;

export function createPostRepository(db: Database): PostRepository {
    const withRelations = () =>
        db.orm.public.Post
            .include("author", (author) => author.select("id", "email"))
            .include("category", (category) => category.select("id", "name"));

    const findCategory = (name: string) =>
        db.orm.public.Category.where({ name }).first();

    return {
        async getAll(category, take) {
            let query = withRelations();

            if (category) {
                const found = await findCategory(category);
                if (!found) {
                    return [];
                }
                query = query.where({ categoryId: found.id });
            }

            if (take && Number(take) > 0) {
                query = query.limit(Number(take));
            }
            return await query.all();
        },
        async getById(id) {
            return await withRelations().where({ id: Number(id) }).first();
        },

        async addPost(data) {
            const created = await db.orm.public.Post.create({
                title: data.title,
                content: data.content,
                authorId: data.authorId,
                categoryId: data.categoryId,
            });
            return await withRelations().where({ id: created.id }).all().firstOrThrow();
        },

        async findCategoryByName(name) {
            return await findCategory(name);
        },

        async getByAuthorId(authorId) {
            return await withRelations().where({ authorId }).all();
        },
    };
}

//     const withRelations = () =>
//         db.orm.public.Post
//             .include("author", (author) => author.select("id", "email"))
//             .include("category", (category) => category.select("id", "name"));


//         if (category) {
//             const found = await findCategoryByName(category);
//             if (!found) {
//                 return [];
//             }
//             query = query.where({ categoryId: found.id });
//         }

//         if (take && Number(take) > 0) {
//             query = query.limit(Number(take));
//         }
//         return await query.all();
//     }
//     async function getById(id: string): Promise<Post | undefined> {
//         const post = await withRelations().where({ id: Number(id)}).first();
//         return post || undefined;

//     }
   
//     async function addPost(data: NewPostData): Promise<Post> {
//         const created = await db.orm.public.Post.create({
//             title: data.title,
//             content: data.content,
//             authorId: data.authorId,
//             categoryId: data.categoryId
//         });
//         return await withRelations().where({ id: created.id }).first();
//     }
//     async function findCategoryByName(name: string): Promise<PostCategory | undefined> {
//         const category = await db.orm.public.Category.where({ name }).first();
//         return category || undefined;
//     }
//     async function getByAuthorId(authorId: number): Promise<Post[]> {
//     return await withRelations().where({ authorId }).all();
// }


//     return { getAll, getById, addPost, findCategoryByName, getByAuthorId };
// }
