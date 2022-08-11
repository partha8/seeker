import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostCard, ProfileEditModal } from "../../components";
import { getUserDetails } from "../../features/authSlice";
import { getPosts } from "../../features/postsSlice";
import styles from "./profile.module.css";

export const Profile = () => {
  const { userDetails, id } = useAppSelector((store) => store.auth);
  const { posts, postsLoading } = useAppSelector((store) => store.posts);
  const usersPosts = posts.filter((post) => post.uid === id);
  const dispatch = useAppDispatch();

  const [postNumber, setPostNumber] = useState(0);

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(getPosts(postNumber));
    dispatch(getUserDetails(id));
  }, []);

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
          <h2>Loading...</h2>
        ) : (
          usersPosts?.map((post) => {
            return <PostCard key={post.postID} {...post} />;
          })
        )}

        <ProfileEditModal
          setShowModal={() => setShowModal(false)}
          showModal={showModal}
        />
      </main>
    </>
  );
};
