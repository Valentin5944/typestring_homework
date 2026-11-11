import type { PostRepository } from "../domen/post/repositories.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";
import type { PostService } from "./service.types.js";
import type { Post } from "../domen/post/entity.js";
import type { UserRepository } from "../domen/user/repositories.js";
import { appError } from "./auth.js";


export function createPostService(postRepository: PostRepository, userRepository: UserRepository): PostService {
    const getAll = async (category: string | undefined, take: string | undefined): Promise<Post[]> => {
        return await postRepository.getAll(category, take);
    };

    const getById = async (id: string): Promise<Post | undefined> => {
        return await postRepository.getById(id);
    };

    const createPost = async (newPost: CreatePostRequest): Promise<Post> => {
        const author = await userRepository.findById(newPost.authorId);
        if (!author) {
            throw appError(404, "Author not found");
        }

        const category = await postRepository.findCategoryByName(newPost.category);
        if (!category) {
            throw appError(404, `Category not found`);
        }

        return await postRepository.addPost({
            title: newPost.title,
            content: newPost.content,
            authorId: author.id,
            categoryId: category.id
        });
    };

    return { getAll, getById, createPost };
}
