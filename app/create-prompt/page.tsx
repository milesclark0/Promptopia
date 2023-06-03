"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Post, EmptyPostObj } from "@globals/types";
import { parseTags } from "@utils/parse";

import Form from "@components/Form";

const CreatePromptPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState<Post>(EmptyPostObj);
  
  const {data: session} = useSession();
  const router = useRouter();


  const createPrompt = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("You must be signed in to create a post.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          tags: typeof post.tags === "string" ? parseTags(post.tags) : post.tags,
          userId: session.user.id
        })
      })
      if (response.ok) {
        router.push("/")
      }
    } catch(error) {
      console.log(error)
    } finally {
      setSubmitting(false);
    }

  };

  return <Form type="Create" post={post} setPost={setPost} submitting={submitting} handleSubmit={createPrompt} />;
};

export default CreatePromptPage;
