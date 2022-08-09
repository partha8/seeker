import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard } from "../../components";
import { getPosts } from "../../features/postsSlice";

export const Explore = () => {
  const { postsLoading, posts } = useAppSelector((store) => store?.posts);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPosts());
  }, []);

  return (
    <>
      <main className="main-container">
        <h4 className="title">Explore</h4>

        {postsLoading ? (
          <h2>Loading...</h2>
        ) : (
          posts?.map((post) => {
            return <PostCard key={post.postID} {...post} />;
          })
        )}
      </main>
    </>
  );
};
