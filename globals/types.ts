type Post = {
    _id: string;
    creator: string | User;
    prompt: string;
    tags: string[] | string;
    userId: string;
    likes: string[];
    createdAt: string;
}
const EmptyPostObj: Post = {
    _id: "",
    creator: "",
    prompt: "",
    tags: [],
    userId: "",
    likes: [],
    createdAt: "",
}

type SessionUser = {
    id: string;
    email: string;
    username: string;
    image: string;
}

const EmptySessionUserObj: SessionUser = {
    id: "",
    email: "",
    username: "",
    image: "",
}

type User = {
    _id: string;
    email: string;
    username: string;
    name?: string;
    image: string;
    password: string;
    posts: string[];
    likes: string[];
}

const EmptyUserObj: User = {
    _id: "",
    email: "",
    username: "",
    image: "",
    password: "",
    posts: [],
    likes: [],
    name: "",
}



export type { Post, SessionUser, User };
export { EmptyPostObj, EmptySessionUserObj, EmptyUserObj };