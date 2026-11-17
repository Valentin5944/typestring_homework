export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    authorId: number;
    categoryId: number;
    author: PostAuthor | null;
    category: PostCategory | null;
}
export interface PostCategory {
    id: number;
    name: string;
}
export interface PostAuthor {
    id: number;
    email: string;
}

export interface NewPostData {
    title: string;
    content: string;
    authorId: number;
    categoryId: number;
}
