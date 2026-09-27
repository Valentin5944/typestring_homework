export interface CreatePostRequest {
    title: string;
    content: string;
    author: string;
    category: string;
}

export interface FilterPostQuery {
    category: string;
    take: string;
}