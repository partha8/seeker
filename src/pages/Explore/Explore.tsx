import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard, PostLoader } from "../../components";
import { getNewPosts, getPosts, setLastDoc } from "../../features/postsSlice";
import InfiniteScroll from "react-infinite-scroll-component";

export const Explore = () => {
  const { postsLoading, posts, latestDoc, newPostsLoading } = useAppSelector(
    (store) => store?.posts
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setLastDoc());
    dispatch(getPosts(latestDoc));
  }, []);

  const fetchDataHandler = () => {
    dispatch(getNewPosts(latestDoc));
  };

  useEffect(() => {
    if (
      latestDoc &&
      posts.length !== 0 &&
      !postsLoading &&
      document.body.clientHeight === window.innerHeight
    ) {
      dispatch(getNewPosts(latestDoc));
    }
  }, [latestDoc]);

  return (
    <>
      <main className="main-container">
        <h4 className="title">Explore</h4>

        {postsLoading ? (
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
            {posts.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })}
          </InfiniteScroll>
        )}
        {newPostsLoading && <PostLoader />}
      </main>
    </>
  );
};
