import { Posts } from "../../types/posts.types";
import { BsPersonCircle } from "react-icons/bs";
import styles from "./postcard.module.css";
import Moment from "moment";
import moment from "moment";
import { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { DropDown } from "../DropDown/DropDown";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { handleLike } from "../../features/postsSlice";
import { CommentsSection } from "../CommentsContainer/CommentsSection";

export const PostCard = (prop: Posts) => {
  const {
    comments,
    // createdAt,
    displayName,
    likes,
    photo,
    postDescription,
    postID,
    uid,
    userName,
  } = prop;

  // const time = createdAt ? moment(createdAt.toDate()).fromNow() : null;
  // let time;
  // if (createdAt) {
  //   time = moment(createdAt?.toDate()).fromNow();
  // }

  const { id } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();
  const [openCommentsSection, setOpenCommentsSection] = useState(false);

  return (
    <div className={styles.postContainer}>
      <section className={styles.postAccountDetails}>
        {photo ? (
          <img
            className="avatar avatar-standard"
            src="https://images6.alphacoders.com/119/1199914.png"
            alt="gojo"
          />
        ) : (
          <BsPersonCircle className="avatar-standard" />
        )}
        <p className={styles.displayName}>{displayName}</p>
        <span className={styles.userName}>@{userName}</span>
        {/* <span className={styles.time}>{time}</span> */}
        <DropDown {...prop} />
      </section>

      <section className={styles.post}>
        <p>{postDescription}</p>
      </section>

      <section className={styles.buttons}>
        <span
          onClick={() => dispatch(handleLike(postID))}
          className="icon-action"
        >
          {likes.some((user) => user === id) ? <BsHeartFill /> : <BsHeart />}
          {likes.length}
        </span>
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
