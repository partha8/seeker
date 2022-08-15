import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard, PostLoader, ProfileEditModal } from "../../components";
import { getUserDetails } from "../../features/authSlice";
import {
  getNewPosts,
  getNewUserPosts,
  getPosts,
  getUserPosts,
  setLastDoc,
} from "../../features/postsSlice";
import styles from "./profile.module.css";

export const Profile = () => {
  const { userDetails, id } = useAppSelector((store) => store.auth);
  const { posts, postsLoading, latestDoc } = useAppSelector(
    (store) => store.posts
  );

  const dispatch = useAppDispatch();

  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [emptyFeedMessage, setEmptyFeedMessage] = useState(false);

  useEffect(() => {
    dispatch(setLastDoc());
    dispatch(getUserPosts(id));
    dispatch(getUserDetails(id));
  }, []);

  useEffect(() => {
    if (
      latestDoc !== null &&
      posts.length !== 0 &&
      !postsLoading &&
      document.body.clientHeight === window.innerHeight
    ) {
      dispatch(getNewUserPosts({ latestDoc, id }));
      setLoader(true);
    } else {
      setLoader(false);
    }

    if (
      posts.length === 0 &&
      document.body.clientHeight === window.innerHeight &&
      latestDoc === undefined
    ) {
      setEmptyFeedMessage(true);
    } else {
      setEmptyFeedMessage(false);
    }
  }, [latestDoc]);

  return (
    <>
      <main className="main-container">
        <h4 className="title">Profile</h4>

        <div className={styles.profileContainer}>
          {userDetails?.photo ? (
            <img
              className={`avatar ${styles.profilePhoto}`}
              src={userDetails?.photo}
              alt="gojo"
            />
          ) : (
            <BsPersonCircle className={styles.profilePhoto} />
          )}

          <section className={styles.profileInfo}>
            <div>
              <p className={styles.displayName}>{userDetails?.displayName}</p>
              <p className={styles.userName}>@{userDetails?.userName}</p>
            </div>

            <p>{userDetails?.bio}</p>

            <div className={styles.followerFollowing}>
              <p>{userDetails?.followers.length} Followers</p>
              <p>{userDetails?.following.length} Following</p>
            </div>

            {userDetails?.portfolioLink && (
              <a
                className={styles.portfolioLink}
                href={userDetails.portfolioLink}
                target="__blank"
              >
                {userDetails.portfolioLink}
              </a>
            )}
          </section>

          <button onClick={() => setShowModal(true)} className="btn">
            Edit
          </button>
        </div>

        {postsLoading ? (
          <PostLoader />
        ) : (
          <InfiniteScroll
            dataLength={posts.length} //This is important field to render the next data
            next={() => dispatch(getNewUserPosts({ latestDoc, id }))}
            hasMore={latestDoc === undefined ? false : true}
            loader={<PostLoader />}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {posts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })}
          </InfiniteScroll>
        )}

        {loader && !postsLoading && <PostLoader />}

        {emptyFeedMessage && <h2>Start posting already!</h2>}

        <ProfileEditModal
          setShowModal={() => setShowModal(false)}
          showModal={showModal}
        />
      </main>
    </>
  );
};
