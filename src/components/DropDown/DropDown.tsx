import styles from "./dropdown.module.css";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Posts } from "../../types/posts.types";
import {
  deletePost,
  setEditPost,
  setPostModal,
} from "../../features/postsSlice";

export const DropDown = (prop: Posts) => {
  const [dropdown, setDropdown] = useState(false);
  const { id } = useAppSelector((store) => store?.auth);
  const dispatch = useAppDispatch();

  const domNode = useClickOutside(() => setDropdown(false));
  return (
    <div className="menu-btn">
      <BsThreeDots onClick={() => setDropdown(!dropdown)} />
      {dropdown && (
        <div ref={domNode} className="stacked dropdown">
          <ul>
            {prop.uid === id && (
              <li
                onClick={() => {
                  dispatch(setEditPost(prop));
                  dispatch(setPostModal(true));
                  setDropdown(false);
                }}
                className="item"
              >
                Edit
              </li>
            )}
            {prop.uid === id && (
              <li
                onClick={() => dispatch(deletePost(prop.postID))}
                className="item"
              >
                Delete
              </li>
            )}
            <li className="item">Bookmark</li>
          </ul>
        </div>
      )}
    </div>
  );
};
