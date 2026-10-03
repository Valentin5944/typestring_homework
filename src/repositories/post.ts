import type { Post } from "../domen/post/entity.ts";
import type { PostRepository } from "../domen/post/repositories.ts";
import type { CreatePostRequest } from "../transport/dto/requests.ts";

const posts: Post[] = [
    { id: 1, title: "Пост 1", content: ".", author: "Валентин", category: "general" },
    { id: 2, title: "Пост 2", content: ".", author: "Валентин", category: "programming" },
    { id: 3, title: "Пост 3", content: ".", author: "Валентин", category: "programming" },
    { id: 4, title: "Пост 4", content: ".", author: "Валентин", category: "programming" },
    { id: 5, title: "Пост 5", content: ".", author: "Валентин", category: "games" }
];

export function createPostRepository(): PostRepository {
    function getAll(category: string | undefined, take: string | undefined): Post[] {
        let result = posts;
        if (category) {
            result = result.filter(post => post.category === category);
        }
        if (take && Number(take) > 0) {
            result = result.slice(0, Number(take));
        }
        return result;
    }

    function getById(id: string): Post | undefined {
        return posts.find(post => post.id === Number(id));
    }

    function addPost(newPost: CreatePostRequest): Promise<Post> {
    return new Promise((resolve) => {
        const post: Post = { 
            id: posts.length + 1, 
            author: newPost.author,
            category: newPost.category,
            title: newPost.title,
            content: newPost.content
        };
        posts.push(post);
        resolve(post);
    });
}


    return { getAll, getById, addPost };
}
