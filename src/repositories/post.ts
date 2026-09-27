const posts = [
    { id: 1, title: "Пост 1", content: ".", author: "Валентин", category: "general" },
    { id: 2, title: "Пост 2", content: ".", author: "Валентин", category: "programming" },
    { id: 3, title: "Пост 3", content: ".", author: "Валентин", category: "programming" },
    { id: 4, title: "Пост 4", content: ".", author: "Валентин", category: "programming" },
    { id: 5, title: "Пост 5", content: ".", author: "Валентин", category: "games" }
];

function getAll(category: string | undefined, take: string | undefined) {
    let result = posts;
    if (category) {
        result = result.filter(post => post.category === category);
    }
    if (take && Number(take) > 0) {
        result = result.slice(0, Number(take));
    }
    return result;
}

function getById(id: string) {
    return posts.find(post => post.id === Number(id));
}
function addPost(newPost: any) {
    return new Promise((resolve) => {
        const post = { id: posts.length + 1, ...newPost };
        posts.push(post);
        resolve(post);
    });
}

export const postRepository = { getAll, getById, addPost};
