import { Posts } from "../types/posts.types";

export const useFilterPosts = (posts: Posts[], sortBy: string) => {
  let newPosts = [...posts];
  if (sortBy === "OLDEST") {
    newPosts = newPosts.sort((a, b) => a["createdAt"] - b["createdAt"]);
  }
  if (sortBy === "TRENDING") {
    newPosts = newPosts.sort((a, b) => b.likes.length - a.likes.length);
  }
  return newPosts;
};
