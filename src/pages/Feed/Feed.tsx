import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { InputModal, Navbar, PostCard, Sidebar } from "../../components";
import { getFeedPosts } from "../../features/postsSlice";
import styles from "./feed.module.css";

export const Feed = () => {
  const { feedPosts, feedPostsLoading } = useAppSelector(
    (store) => store?.posts
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFeedPosts());
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <main className="main-container">
          {feedPostsLoading ? (
            <h2>Loading...</h2>
          ) : (
            feedPosts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })
          )}
          
        </main>
      </div>
    </div>
  );
};
