import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard } from "../../components";
import { getNewPosts, getPosts, setLastDoc } from "../../features/postsSlice";
import InfiniteScroll from "react-infinite-scroll-component";

export const Explore = () => {
  const { postsLoading, posts, latestDoc } = useAppSelector(
    (store) => store?.posts
  );

  console.log(latestDoc, "latestDoc");

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setLastDoc());
    dispatch(getPosts(latestDoc));
  }, []);

  const fetchDataHandler = () => {
    dispatch(getNewPosts(latestDoc));
  };

  return (
    <>
      <main className="main-container">
        <h4 className="title">Explore</h4>

        {/* {postsLoading ? (
          <h2>Loading...</h2>
        ) : (
          posts?.map((post) => {
            return <PostCard key={post.postID} {...post} />;
          })
        )} */}

        {postsLoading ? (
          <h2>Loading...</h2>
        ) : (
          <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={fetchDataHandler}
            hasMore={latestDoc === undefined ? false : true}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {posts.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })}
          </InfiniteScroll>
        )}
      </main>
    </>
  );
};
