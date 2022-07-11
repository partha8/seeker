import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addNewPost, setPostModal } from "../../features/postsSlice";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./input.module.css";

export const InputModal = () => {
  const [input, setInput] = useState("");

  const { postModal } = useAppSelector((store) => store?.posts);
  const dispatch = useAppDispatch();

  const domNode = useClickOutside(() => dispatch(setPostModal(false)));

  return (
    <div
      className={`${
        postModal
          ? `${styles.modalOverlay} ${styles.showModal}`
          : `${styles.modalOverlay}`
      }`}
    >
      <div ref={domNode} className={styles.modalContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          cols={30}
          rows={10}
          placeholder="What's on your mind?"
          className={styles.textArea}
        />
        <section className={styles.btnContainer}>
          <button
            onClick={() => {
              dispatch(addNewPost(input));
              setInput("");
            }}
            className="btn"
          >
            Post
          </button>
          <button
            onClick={() => {
              dispatch(setPostModal(false));
              setInput("");
            }}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </section>
      </div>
    </div>
  );
};
