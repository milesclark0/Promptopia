import { type Post } from "@globalTypes/types";
import Link from "next/link";

interface FormProps {
  type: string;
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  submitting: boolean;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
}

const parseTags = (tags: string) => {
  //remove all whitespace and split by #
  let parsedTags = tags.replace(/\s/g, "").split("#");
  //remove empty strings, and prepend # to each tag
  parsedTags = parsedTags.filter((tag) => tag !== "").map((tag) => `#${tag}`);
  return parsedTags;
};

const Form = ({ type, post, setPost, submitting, handleSubmit }: FormProps) => {
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and Share amazing prompts with the world, and let your imagination run wild with any AI platform!
      </p>
      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">Your AI Prompt</span>{" "}
          <textarea
            value={post.prompt}
            onChange={(event) => setPost({ ...post, prompt: event.target.value })}
            placeholder="Write your prompt here..."
            required
            className="form_textarea"
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">Tags </span>
          <span className="font-normal">(#idea #developer #react)</span>{" "}
          <input
            onChange={(event) => setPost({ ...post, tags: parseTags(event.target.value) })}
            placeholder="#tags"
            required
            className="form_input"
          />
        </label>
        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>
          <button disabled={submitting} type="submit" className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white">
            {submitting ? `${type}ing...` : type} Post
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
