import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard, PostLoader } from "../../components";
import { getBookmarkedPosts } from "../../features/postsSlice";

export const Bookmark = () => {
  const { bookmarkedPosts, bookmarkedPostsLoading } = useAppSelector(
    (store) => store?.posts
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getBookmarkedPosts());
  }, []);
  return (
    <>
      <main className="main-container">
        <h4 className="title">Bookmarks</h4>

        {bookmarkedPostsLoading ? (
          <PostLoader />
        ) : (
          bookmarkedPosts?.map((post) => {
            return <PostCard key={post.postID} {...post} />;
          })
        )}
      </main>
    </>
  );
};
