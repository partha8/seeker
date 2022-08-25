import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard, PostLoader } from "../../components";
import { getNewPosts, getPosts, setLastDoc } from "../../features/postsSlice";
import { useFilterPosts } from "../../hooks/useFilterPosts";
import styles from "./feed.module.css";

export const Feed = () => {
  const { postsLoading, posts, latestDoc, newPostsLoading } = useAppSelector(
    (store) => store?.posts
  );
  const auth = useAppSelector((store) => store.auth);

  const dispatch = useAppDispatch();

  const [sortBy, setSortBy] = useState("LATEST");

  useEffect(() => {
    if (
      auth.userDetails?.following.length !== 0 ||
      auth.userDetails?.posts.length !== 0
    ) {
      dispatch(setLastDoc());
      dispatch(getPosts(latestDoc));
    }
  }, []);

  const fetchDataHandler = () => {
    dispatch(getNewPosts(latestDoc));
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.uid === auth.id ||
      auth.userDetails?.following.some((user) => user === post.uid)
  );
  const sortedPosts = useFilterPosts(filteredPosts, sortBy);

  useEffect(() => {
    if (
      latestDoc &&
      posts.length !== 0 &&
      !postsLoading &&
      document.body.clientHeight === window.innerHeight &&
      (auth.userDetails?.following.length !== 0 ||
        auth.userDetails?.posts.length !== 0)
    ) {
      dispatch(getNewPosts(latestDoc));
    }

  }, [latestDoc]);

  return (
    <>
      <main className="main-container">
        <h4 className="title">Home</h4>

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

        {auth.userDetails?.following.length === 0 &&
        auth.userDetails?.posts.length === 0 ? (
          <h4>Start following people already!</h4>
        ) : postsLoading ? (
          <PostLoader />
        ) : (
          <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={fetchDataHandler}
            hasMore={latestDoc === undefined ? false : true}
            loader={<PostLoader />}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <h4>Yay! You have seen it all</h4>
              </p>
            }
          >
            {sortedPosts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })}
          </InfiniteScroll>
        )}

        {newPostsLoading && <PostLoader />}
      </main>
    </>
  );
};
