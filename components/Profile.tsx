import { Post } from "@globals/types";
import PromptCard from "./PromptCard";

type ProfileProps = {
  name: string;
  desc: string;
  data: any;
  handleEdit: (post: Post) => void;
  handleDelete: (post: Post) => void;
};

const Profile = ({ name, desc, data, handleEdit, handleDelete }: ProfileProps) => {
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>
      <div className="mt-16 prompt_layout">
        {data.map((post: Post) => (
          <PromptCard key={post._id} post={post} handleEdit={() => handleEdit(post)} handleDelete={() => handleDelete(post)} />
        ))}
        {data.length === 0 && (
          <div className="flex-start flex-col gap-5">
            <p className="font-inter text-sm text-gray-500">You have not created any prompts yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
