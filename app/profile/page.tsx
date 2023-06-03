"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";
import { Post } from "@globals/types";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // fetch data
    const fetchPosts = async () => {
      if (!session?.user?.id) return;
      const res = await fetch(`/api/users/${session.user.id}/posts`);
      const data = await res.json();
      setPosts(data.prompts);
    };
    fetchPosts();
  }, [, session]);

  const handleEdit = (post: Post) => {
    router.push("/edit-prompt?id=" + post._id);
  };
  const handleDelete = async (post: Post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?");
    if (!hasConfirmed) return;
    try {
      const res = await fetch(`/api/prompt/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts.filter((p: Post) => p._id !== post._id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return <Profile name="My" desc="Welcome to your personal profile page" data={posts} handleEdit={handleEdit} handleDelete={handleDelete} />;
};

export default ProfilePage;
