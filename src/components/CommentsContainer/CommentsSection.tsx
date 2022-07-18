import { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { MdSend } from "react-icons/md";
import styles from "./comments-container.module.css";
import { addComment } from "../../features/postsSlice";

type Prop = {
  comments: {
    uid: string;
    comment: string;
  }[];
  postID: string;
};

export const CommentsSection = ({ comments, postID }: Prop) => {
  const { userDetails, allUsers } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();

  const getDetails = (uid: string) => {
    const details = allUsers.find((user) => user.id === uid);
    return {
      photo: details?.photo,
      displayName: details?.displayName,
      userName: details?.userName,
    };
  };

  const [commentInput, setCommentInput] = useState("");
  return (
    <div className={styles.container}>
      <section className={styles.inputContainer}>
        {userDetails?.photo ? (
          <img
            className="avatar avatar-standard"
            src={userDetails?.photo}
            alt="gojo"
          />
        ) : (
          <BsPersonCircle className="avatar-small" />
        )}
        <textarea
          className={styles.input}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="write a comment"
        />
        <MdSend
          onClick={() => {
            dispatch(addComment({ comment: commentInput, postID }));
            setCommentInput("");
          }}
          className={styles.postComment}
        />
      </section>

      {comments.map((value) => {
        const { uid, comment } = value;
        const { photo, displayName, userName } = getDetails(uid);
        return (
          <div className={styles.commentContainer} key={comment}>
            <section className={styles.postAccountDetails}>
              {photo ? (
                <img className="avatar avatar-small" src={photo} alt="gojo" />
              ) : (
                <BsPersonCircle className="avatar-small" />
              )}
              <p className={styles.displayName}>{displayName}</p>
              <span className={styles.userName}>@{userName}</span>
            </section>

            <section className={styles.post}>
              <p>{comment}</p>
            </section>
          </div>
        );
      })}
    </div>
  );
};
