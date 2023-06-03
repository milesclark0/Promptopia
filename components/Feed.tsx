"use client";
import { useState, useEffect, use } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@globals/types";

type PromptCardListProps = {
  data: Post[];
  handleTagClick: (tag: string) => void;
};
const PromptCardList = ({ data, handleTagClick }: PromptCardListProps) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post: Post) => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    // fetch data
    const fetchPosts = async () => {
      const res = await fetch("/api/prompt");
      const data = await res.json();
      setPosts(data.prompts);
      setFilteredPosts(data.prompts);
    };
    fetchPosts();
  }, []);

  const handleSearchChange = (searchValue: string) => {
    setSearchText(searchValue);
    const filteredByPrompt = posts.filter((post) => post.prompt.toLowerCase().includes(searchValue.toLowerCase()));
    const filteredByTags = posts.filter(
      (post) => typeof post.tags !== "string" && post.tags.some((tag) => tag.toLowerCase().includes(searchValue.toLowerCase()))
    );
    const filteredByCreator = posts.filter(
      (post) => typeof post.creator !== "string" && post.creator.username.toLowerCase().includes(searchValue.toLowerCase())
    );
    const filtered = new Set([...filteredByPrompt, ...filteredByTags, ...filteredByCreator]);
    setFilteredPosts(Array.from(filtered));
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a prompt"
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList data={filteredPosts} handleTagClick={ handleSearchChange} />
    </section>
  );
};

export default Feed;
