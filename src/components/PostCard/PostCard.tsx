import { Posts } from "../../types/posts.types";
import { BsPersonCircle } from "react-icons/bs";
import styles from "./postcard.module.css";
import Moment from "moment";
import moment from "moment";
import { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";

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

  const time = moment(createdAt.toDate()).fromNow();

  const [openCommentSection, setOpenCommentSection] = useState(false);

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
        <span className={styles.time}>{time}</span>
      </section>

      <section className={styles.post}>
        <p>{postDescription}</p>
      </section>

      <section className={styles.buttons}>
        <span className="icon-action">
          <BsHeart /> 2
        </span>
        <span className="icon-action">
          <FaRegComment /> 2
        </span>
      </section>
    </div>
  );
};
