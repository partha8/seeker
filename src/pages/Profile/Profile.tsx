import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Navbar, PostCard, ProfileEditModal, Sidebar } from "../../components";
import { getPosts } from "../../features/postsSlice";
import styles from "./profile.module.css";

export const Profile = () => {
  const { userDetails, id } = useAppSelector((store) => store.auth);
  const { posts, postsLoading } = useAppSelector((store) => store.posts);
  const usersPosts = posts.filter((post) => post.uid === id);
  const dispatch = useAppDispatch();

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <main className="main-container">
          <div className={styles.profileContainer}>
            {userDetails?.photo ? (
              <img
                className="avatar avatar-standard"
                src="https://images6.alphacoders.com/119/1199914.png"
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
      </div>
    </div>
  );
};
