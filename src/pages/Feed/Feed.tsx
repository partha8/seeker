import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Navbar, PostCard, Sidebar } from "../../components";
import { getPosts } from "../../features/postsSlice";
import { useFilterPosts } from "../../hooks/useFilterPosts";
import styles from "./feed.module.css";

export const Feed = () => {
  const { postsLoading, posts } = useAppSelector((store) => store?.posts);
  const auth = useAppSelector((store) => store.auth);

  const dispatch = useAppDispatch();

  const [sortBy, setSortBy] = useState("LATEST");

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const filteredPosts = posts.filter(
    (post) =>
      post.uid === auth.id ||
      auth.userDetails?.following.some((user) => user === post.uid)
  );
  const sortedPosts = useFilterPosts(filteredPosts, sortBy);

  return (
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <main className="main-container">
          <section className={styles.filterSection}>
            <button
              onClick={() =>
                sortBy === "LATEST" ? setSortBy("OLDEST") : setSortBy("LATEST")
              }
              className={`${styles.filterbtn} ${
                (sortBy === "LATEST" || sortBy === "OLDEST") && styles.active
              } `}
            >
              {sortBy === "LATEST" ? "Oldest" : "Latest"}
            </button>
            <button
              onClick={() => setSortBy("TRENDING")}
              className={`${styles.filterbtn} ${
                sortBy === "TRENDING" && styles.active
              }`}
            >
              Trending
            </button>
          </section>
          {postsLoading ? (
            <h2>Loading...</h2>
          ) : (
            sortedPosts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })
          )}
        </main>
      </div>
    </div>
  );
};
