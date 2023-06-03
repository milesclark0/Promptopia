"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Post, EmptyPostObj } from "@globals/types";
import { parseTags } from "@utils/parse";

import Form from "@components/Form";

const EditPromptPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState<Post>(EmptyPostObj);
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams?.get("id");

  useEffect(() => {
    const getPrompt = async () => {
      if (!promptId) return;
      const res = await fetch(`/api/prompt/${promptId}`);
      const data = await res.json();
      setPost({
        ...data,
        prompt: data.prompt.prompt,
        tags: data.prompt.tags.join(" "),
      } as Post);
    };
    getPrompt();
  }, [promptId]);
  console.log(post)

  const editPrompt = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (!promptId) alert("No prompt id");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tags: typeof post.tags === "string" ? parseTags(post.tags) : post.tags,
        }),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return <Form type="Edit" post={post} setPost={setPost} submitting={submitting} handleSubmit={editPrompt} />;
};

export default EditPromptPage;
