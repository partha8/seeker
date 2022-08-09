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
  } = prop;

  let time, date;
  if (createdAt) {
    time = moment(createdAt?.toDate()).fromNow();
    date = createdAt.toDate().toString().split(" ").splice(0, 4).join(" ");
  }

  const { id } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();
  const [openCommentsSection, setOpenCommentsSection] = useState(false);

  return (
    <div className={styles.postContainer}>
      <section className={styles.postAccountDetails}>
        {photo ? (
          <img className="avatar avatar-standard" src={photo} alt="gojo" />
        ) : (
          <BsPersonCircle className="avatar-standard" />
        )}

        <div>
          <p className={styles.displayName}>{displayName}</p>
          <p className={styles.userName}>@{userName}</p>
        </div>

        <span className={styles.timedate}>
          <span>{time}</span>,<span>{date}</span>
        </span>
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
