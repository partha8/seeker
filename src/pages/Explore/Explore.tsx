import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Navbar, PostCard, Recommendations, Sidebar } from "../../components";
import { getPosts } from "../../features/postsSlice";

export const Explore = () => {
  const { postsLoading, posts } = useAppSelector((store) => store?.posts);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPosts());
  }, []);

  return (
    <>
      <div className="container">
        <Sidebar />
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
        <Recommendations />
      </div>
    </>
  );
};
