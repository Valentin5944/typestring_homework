export interface CreatePostRequest {
    title: string;
    content: string;
    category: string;
    authorId: number;
}
export interface RegisterRequest {
    email: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface FilterPostQuery {
    category?: string;
    take?: string;
}