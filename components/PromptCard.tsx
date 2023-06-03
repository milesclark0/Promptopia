"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { parseDateTime } from "@utils/parse";

import { Post, User } from "@globals/types";

type PromptCardProps = {
  post: Post;
  handleTagClick?: (tag: string) => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
};

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(post.prompt);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };
  if (typeof post.creator === "string") return null;
  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div>
          <Image src={post.creator.image} alt="user_image" width={40} height={40} className="rounded-full object-contain" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-satoshi font-semibold text-gray-900">{post.creator.username}</h3>
          <p className="font-inter text-sm text-gray-500">{parseDateTime(post.createdAt)}</p>
        </div>
        <div className="copy_btn" onClick={handleCopyPrompt}>
          <Image src={copied ? "assets/icons/tick.svg" : "assets/icons/copy.svg"} alt="copy" width={12} height={12} />
        </div>
      </div>
      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      {typeof post.tags !== 'string' && post.tags.map((tag, index) => (
        <span key={index} className="font-inter text-sm blue_gradient cursor-pointer" onClick={() => handleTagClick && handleTagClick(tag)}>
          {tag}{" "}
        </span>
      ))}

      {/* render buttons only if user is logged in and on profile page */}
      {session?.user?.id === post.creator._id &&  pathname === "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <p className="font-inter text-sm blue_gradient cursor-pointer" onClick={handleEdit}>Edit</p>
          <p className="font-inter text-sm orange_gradient cursor-pointer" onClick={handleDelete}>Delete</p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
