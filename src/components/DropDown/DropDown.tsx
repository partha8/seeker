import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Posts } from "../../types/posts.types";
import {
  deletePost,
  handleBookmark,
  setEditPost,
  setPostModal,
} from "../../features/postsSlice";

export const DropDown = (prop: Posts) => {
  const [dropdown, setDropdown] = useState(false);
  const { id, userDetails } = useAppSelector((store) => store?.auth);
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
            <li onClick={() => dispatch(handleBookmark(prop))} className="item">
              {userDetails?.bookmarkedPosts.some((post) => post === prop.postID)
                ? "Remove from bookmarks"
                : "Add to bookmarks"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
