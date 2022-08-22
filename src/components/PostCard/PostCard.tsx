import { Posts } from "../../types/posts.types";
import { BsPersonCircle } from "react-icons/bs";
import styles from "./postcard.module.css";
import moment from "moment";
import { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { DropDown } from "../DropDown/DropDown";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { handleLike } from "../../features/postsSlice";
import { CommentsSection } from "../CommentsContainer/CommentsSection";
import { NavLink } from "react-router-dom";
import ReactLoading from "react-loading";

export const PostCard = (prop: Posts) => {
  const {
    comments,
    createdAt,
    displayName,
    likes,
    photo,
    postDescription,
    postID,
    uid,
    userName,
    postPhoto,
  } = prop;

  let time, date;
  if (createdAt) {
    time = moment(createdAt?.toDate()).fromNow();
    date = createdAt.toDate().toString().split(" ").splice(0, 4).join(" ");
  }

  const { id } = useAppSelector((store) => store.auth);
  const { likeLoading } = useAppSelector((store) => store.posts);
  const dispatch = useAppDispatch();
  const [openCommentsSection, setOpenCommentsSection] = useState(false);
  const [likedPost, setLikedPost] = useState("");

  return (
    <div className={styles.postContainer}>
      <section className={styles.postAccountDetails}>
        {photo ? (
          <img className="avatar avatar-standard" src={photo} alt="profile" />
        ) : (
          <BsPersonCircle className="avatar-standard" />
        )}

        <NavLink to={`/profile/${uid}`}>
          <p className={styles.displayName}>{displayName}</p>
          <p className={styles.userName}>@{userName}</p>
        </NavLink>

        {uid === "1NLpnRF5M9XPh1QyYfn4WAHk4i03" && (
          <p className={styles.creatorTag}>Creator</p>
        )}
        <span className={styles.timedate}>
          <span>{time}</span>,<span>{date}</span>
        </span>
        <DropDown {...prop} />
      </section>

      <section className={styles.post}>
        <p>{postDescription}</p>
      </section>

      {postPhoto && (
        <img src={postPhoto} alt="post" className={styles.postPhoto} />
      )}

      <section className={styles.buttons}>
        {likeLoading && likedPost === postID ? (
          <ReactLoading
            height={"1.3rem"}
            width={"1.3rem"}
            type="spin"
            color="#fff"
          />
        ) : (
          <span
            onClick={async () => {
              setLikedPost(postID);
              await dispatch(handleLike(postID));
              setLikedPost("");
            }}
            className="icon-action"
          >
            {likes.some((user) => user === id) ? (
              <BsHeartFill style={{ color: "red" }} />
            ) : (
              <BsHeart />
            )}
            {likes.length}
          </span>
        )}

        <span
          onClick={() => setOpenCommentsSection(!openCommentsSection)}
          className="icon-action"
        >
          <FaRegComment /> {comments.length}
        </span>
      </section>
      {openCommentsSection && (
        <CommentsSection postID={postID} comments={comments} />
      )}
    </div>
  );
};
