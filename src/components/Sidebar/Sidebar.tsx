import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.css";
import { MdOutlineFeed, MdExplore, MdPeopleAlt } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { useAppDispatch } from "../../app/hooks";
import { setPostModal } from "../../features/postsSlice";

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.asideLinks}>
        <NavLink
          className={({ isActive }) => (isActive ? styles.active : "")}
          to="/"
        >
          <MdOutlineFeed /> My Feed
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active : "")}
          to="/explore"
        >
          <MdExplore /> Explore
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active : "")}
          to="/people"
        >
          <MdPeopleAlt /> People
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active : "")}
          to="/profile"
        >
          <BsPersonCircle /> My Profile
        </NavLink>
      </div>
      <button
        onClick={() => dispatch(setPostModal(true))}
        className={`btn ${styles.post}`}
      >
        Post
      </button>
    </aside>
  );
};
