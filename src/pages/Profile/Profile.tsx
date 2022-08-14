import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard, PostLoader, ProfileEditModal } from "../../components";
import { getUserDetails } from "../../features/authSlice";
import { getNewPosts, getPosts, setLastDoc } from "../../features/postsSlice";
import styles from "./profile.module.css";

export const Profile = () => {
  const { userDetails, id } = useAppSelector((store) => store.auth);
  const { posts, postsLoading, latestDoc } = useAppSelector(
    (store) => store.posts
  );
  const usersPosts = posts.filter((post) => post.uid === id);
  const dispatch = useAppDispatch();

  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [emptyFeedMessage, setEmptyFeedMessage] = useState(false);

  useEffect(() => {
    dispatch(setLastDoc());
    dispatch(getPosts(latestDoc));
    dispatch(getUserDetails(id));
  }, []);

  useEffect(() => {
    if (
      latestDoc !== null &&
      posts.length !== 0 &&
      !postsLoading &&
      document.body.clientHeight === window.innerHeight
    ) {
      dispatch(getNewPosts(latestDoc));
      setLoader(true);
    } else {
      setLoader(false);
    }

    if (
      usersPosts.length === 0 &&
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
            next={() => dispatch(getNewPosts(latestDoc))}
            hasMore={latestDoc === undefined ? false : true}
            loader={<PostLoader />}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {usersPosts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })}
          </InfiniteScroll>
        )}

        {loader && !postsLoading && <PostLoader />}

        {emptyFeedMessage && <h2>Start following people now!</h2>}

        <ProfileEditModal
          setShowModal={() => setShowModal(false)}
          showModal={showModal}
        />
      </main>
    </>
  );
};
