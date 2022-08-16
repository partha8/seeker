import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { followHandler } from "../../features/authSlice";
import { useGetAllUser } from "../../hooks/useGetAllUser";
import { OtherUsers } from "../../types/auth.types";
import { shuffleArray } from "../../utils/shuffleArray";
import styles from "./recommendations.module.css";

export const Recommendations = () => {
  const { allUsers, id, userDetails } = useAppSelector((store) => store.auth);
  const [shuffledUsers, setShuffledUsers] = useState<OtherUsers[]>([]);

  const location = useLocation();

  useEffect(() => {
    setShuffledUsers(() =>
      shuffleArray(allUsers.filter((user) => user.id !== id))
    );
  }, [location, id, userDetails?.userName]);

  const dispatch = useAppDispatch();
  return (
    <aside className={styles.aside}>
      <p className={styles.containerTitle}>Who to follow</p>
      {shuffledUsers.slice(0, 4).map((user: OtherUsers) => {
        const { id, photo, displayName, userName } = user;
        return (
          <div key={id} className={styles.userContainer}>
            {photo ? (
              <img className="avatar avatar-standard" src={photo} alt="gojo" />
            ) : (
              <BsPersonCircle className="avatar-standard" />
            )}

            <NavLink className={styles.details} to={`/profile/${id}`}>
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
      <NavLink className={styles.suggestMore} to="/people">
        Show More
      </NavLink>
    </aside>
  );
};
