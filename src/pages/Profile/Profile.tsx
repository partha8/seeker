import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard, PostLoader, ProfileEditModal } from "../../components";
import {
  followHandler,
  getSelectedUserDetails,
} from "../../features/authSlice";
import {
  getNewUserPosts,
  getUserPosts,
  setLastDoc,
} from "../../features/postsSlice";
import styles from "./profile.module.css";

export const Profile = () => {
  const { userDetails, selectedUserDetails, id, selectedUserDetailsLoading } =
    useAppSelector((store) => store.auth);
  const { userPosts, latestDoc, newUserPostsLoading, userPostsLoading } =
    useAppSelector((store) => store.posts);

  const dispatch = useAppDispatch();
  const { profileID } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [emptyFeedMessage, setEmptyFeedMessage] = useState(false);

  useEffect(() => {
    dispatch(setLastDoc());
    dispatch(getUserPosts(profileID || ""));
    dispatch(getSelectedUserDetails(profileID || ""));
  }, [profileID]);

  useEffect(() => {
    if (
      latestDoc &&
      userPosts.length !== 0 &&
      !userPostsLoading &&
      document.body.clientHeight === window.innerHeight
    ) {
      dispatch(getNewUserPosts({ latestDoc, id: profileID }));
    }

    if (
      userPosts.length === 0 &&
      document.body.clientHeight === window.innerHeight &&
      latestDoc === undefined
    ) {
      setEmptyFeedMessage(true);
    } else {
      setEmptyFeedMessage(false);
    }
  }, [latestDoc]);

  if (selectedUserDetailsLoading) {
    return (
      <>
        <main className="main-container">
          <h4 className="title">Profile</h4>
          <h2>Loading...</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="main-container">
        <h4 className="title">Profile</h4>

        <div className={styles.profileContainer}>
          {selectedUserDetails?.photo ? (
            <img
              className={`avatar ${styles.profilePhoto}`}
              src={selectedUserDetails?.photo}
              alt="gojo"
            />
          ) : (
            <BsPersonCircle className={styles.profilePhoto} />
          )}

          <section className={styles.profileInfo}>
            <div>
              <p className={styles.displayName}>
                {selectedUserDetails?.displayName}
              </p>
              <p className={styles.userName}>
                @{selectedUserDetails?.userName}
              </p>
            </div>

            <p>{selectedUserDetails?.bio}</p>

            <div className={styles.followerFollowing}>
              <p>{selectedUserDetails?.followers.length} Followers</p>
              <p>{selectedUserDetails?.following.length} Following</p>
            </div>

            {selectedUserDetails?.portfolioLink && (
              <a
                className={styles.portfolioLink}
                href={selectedUserDetails.portfolioLink}
                target="__blank"
              >
                {selectedUserDetails.portfolioLink}
              </a>
            )}
          </section>

          {id === profileID && (
            <button onClick={() => setShowModal(true)} className="btn">
              Edit
            </button>
          )}

          {id !== profileID &&
            (userDetails?.following.some((user) => user === profileID) ? (
              <button
                onClick={() => dispatch(followHandler(profileID || ""))}
                className="btn btn-outline"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => dispatch(followHandler(profileID || ""))}
                className="btn"
              >
                Follow
              </button>
            ))}
        </div>

        {userPostsLoading ? (
          <PostLoader />
        ) : (
          <InfiniteScroll
            dataLength={userPosts.length} //This is important field to render the next data
            next={() => dispatch(getNewUserPosts({ latestDoc, id: profileID }))}
            hasMore={latestDoc === undefined ? false : true}
            loader={<PostLoader />}
            endMessage={
              !emptyFeedMessage && (
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              )
            }
          >
            {userPosts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })}
          </InfiniteScroll>
        )}

        {newUserPostsLoading && <PostLoader />}

        {emptyFeedMessage && id === profileID && (
          <h2>Start posting already!</h2>
        )}

        {emptyFeedMessage && id !== profileID && <h2>Wow... so empty..</h2>}

        <ProfileEditModal
          setShowModal={() => setShowModal(false)}
          showModal={showModal}
        />
      </main>
    </>
  );
};
