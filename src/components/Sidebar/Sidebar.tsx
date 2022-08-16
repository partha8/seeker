import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.css";
import {
  MdOutlineFeed,
  MdExplore,
  MdPeopleAlt,
  MdBookmark,
} from "react-icons/md";
import { BsPersonCircle, BsThreeDots } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPostModal } from "../../features/postsSlice";
import { useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { GiSittingDog } from "react-icons/gi";

export const Sidebar = () => {
  const [dropDown, setDropDown] = useState<Boolean>(false);
  const { userDetails, id } = useAppSelector((store) => store.auth);
  const domNode = useClickOutside(() => setDropDown(false));

  const dispatch = useAppDispatch();

  return (
    <nav className={styles.nav}>
      <section className={styles.logo}>
        <GiSittingDog className={styles.icon} />
      </section>

      <section className={styles.icons}>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles.iconContainer} ${styles.active} `
              : `${styles.iconContainer}`
          }
          to="/"
        >
          <MdOutlineFeed className={styles.icon} />
          <p className="flex-center">Home</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles.iconContainer} ${styles.active} `
              : `${styles.iconContainer}`
          }
          to="/explore"
        >
          <MdExplore className={styles.icon} />{" "}
          <p className="flex-center">Explore</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles.iconContainer} ${styles.active} `
              : `${styles.iconContainer}`
          }
          to="/bookmark"
        >
          <MdBookmark className={styles.icon} />{" "}
          <p className="flex-center">Bookmarks</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles.iconContainer} ${styles.active} `
              : `${styles.iconContainer}`
          }
          to="/people"
        >
          <MdPeopleAlt className={styles.icon} />{" "}
          <p className="flex-center">People</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles.iconContainer} ${styles.active} `
              : `${styles.iconContainer}`
          }
          to={`/profile/${id}`}
        >
          <BsPersonCircle className={styles.icon} />
          <p className="flex-center">My Profile</p>
        </NavLink>
      </section>

      <section
        onClick={() => dispatch(setPostModal(true))}
        className={styles.btnContainer}
      >
        <button className={`btn ${styles.newBtn}`}>
          <AiOutlinePlus />
        </button>
        <p>New Post</p>
      </section>

      <section className={styles.accountSetting}>
        <div className={styles.account}>
          {userDetails?.photo ? (
            <img
              className="avatar avatar-standard"
              src={userDetails?.photo}
              alt="profile"
            />
          ) : (
            <BsPersonCircle className="avatar avatar-standard" />
          )}

          <span className="flex-center">{userDetails?.displayName}</span>
        </div>

        <BsThreeDots
          onClick={() => setDropDown(true)}
          className={styles.more}
        />
      </section>

      {dropDown && (
        <div ref={domNode} className={styles.dropdown}>
          <ul>
            <li onClick={() => signOut(auth)} className={styles.item}>
              Log out
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
