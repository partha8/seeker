import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Navbar, PostCard, Sidebar } from "../../components";
import { getPosts } from "../../features/postsSlice";

export const Explore = () => {
  const { postsLoading, posts } = useAppSelector((store) => store?.posts);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPosts());
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <main className="main-container">
          {postsLoading ? (
            <h2>Loading...</h2>
          ) : (
            posts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })
          )}
        </main>
      </div>
    </div>
  );
};
