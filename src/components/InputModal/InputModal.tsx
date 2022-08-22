import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addNewPost,
  editSelectedPost,
  setEditPost,
  setPostModal,
} from "../../features/postsSlice";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./input.module.css";
import { MdClose } from "react-icons/md";
import { HiOutlinePhotograph } from "react-icons/hi";
import { toast } from "react-toastify";

export const InputModal = () => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [disablebtn, setDisablebtn] = useState(false);
  const filePickerRef = useRef<any>(null);

  const imageChangeHandler = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target!.result!.toString());
    };
  };

  const { postModal, editPost } = useAppSelector((store) => store?.posts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editPost) {
      setInput(editPost.postDescription);
      setSelectedFile(editPost?.postPhoto);
    } else {
      setInput("");
    }
  }, [editPost]);

  const domNode = useClickOutside(() => {
    dispatch(setPostModal(false));
    dispatch(setEditPost(null));
  });

  useEffect(() => {
    if (!postModal) {
      setInput("");
      setSelectedFile("");
      setDisablebtn(false);
    }
  }, [postModal]);

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
          rows={3}
          placeholder="What's on your mind?"
          className={styles.textArea}
        />
        {selectedFile && (
          <div className="relative">
            {!editPost && (
              <div
                onClick={() => setSelectedFile("")}
                className={`flex-center ${styles.closeContainer}`}
              >
                <MdClose className={styles.close} />
              </div>
            )}
            <img
              src={selectedFile}
              alt="postPhoto"
              className={styles.postPhoto}
            />
          </div>
        )}
        <section className={styles.btnContainer}>
          {!editPost && (
            <HiOutlinePhotograph
              onClick={() => filePickerRef.current.click()}
              className={`flex-center ${styles.icon}`}
            />
          )}
          <input
            onChange={imageChangeHandler}
            type="file"
            ref={filePickerRef}
            hidden
          />
          <button
            disabled={disablebtn}
            onClick={() => {
              if (editPost) {
                dispatch(
                  editSelectedPost({
                    input,
                    postID: editPost.postID,
                  })
                );
              } else {
                if (!input && !selectedFile) {
                  toast.error("Can't have an empty post!");
                } else {
                  setDisablebtn(true);
                  dispatch(
                    addNewPost({
                      postDescription: input,
                      postPhoto: selectedFile,
                    })
                  );
                }
              }
              setInput("");
            }}
            className="btn"
          >
            Post
          </button>
          <button
            disabled={disablebtn}
            onClick={() => {
              dispatch(setPostModal(false));
              setInput("");
              dispatch(setEditPost(null));
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
