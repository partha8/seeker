import { BsPersonCircle } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { followHandler } from "../../features/authSlice";
import styles from "./people.module.css";

export const People = () => {
  const { allUsers, id, userDetails } = useAppSelector((store) => store.auth);
  const otherUsers = allUsers.filter((user) => user.id !== id);
  const dispatch = useAppDispatch();
  return (
    <>
      <main className="main-container">
        <h4 className="title">People</h4>

        {otherUsers.map((user) => {
          const { id, photo, displayName, userName } = user;
          return (
            <div className={styles.userContainer}>
              {photo ? (
                <img
                  className="avatar avatar-standard"
                  src={photo}
                  alt="profile"
                />
              ) : (
                <BsPersonCircle className="avatar-standard" />
              )}
              <NavLink to={`/profile/${id}`}>
                <p className={styles.displayName}>{displayName}</p>
                <p className={styles.userName}>@{userName}</p>
              </NavLink>

              {userDetails?.following.some((user) => user === id) ? (
                <button
                  onClick={() => dispatch(followHandler(id))}
                  className="btn btn-outline"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => dispatch(followHandler(id))}
                  className="btn"
                >
                  Follow
                </button>
              )}
            </div>
          );
        })}
      </main>
    </>
  );
};
