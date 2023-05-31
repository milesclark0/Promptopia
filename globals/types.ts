type Post = {
    _id: string;
    creator: string;
    prompt: string;
    tags: string[];
    userId: string;
    likes: string[];
}
const EmptyPostObj: Post = {
    _id: "",
    creator: "",
    prompt: "",
    tags: [],
    userId: "",
    likes: [],
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