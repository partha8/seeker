import { BsPersonCircle } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Navbar, Sidebar } from "../../components";
import { followHandler } from "../../features/authSlice";
import styles from "./people.module.css";

export const People = () => {
  const { allUsers, id, userDetails } = useAppSelector((store) => store.auth);
  const otherUsers = allUsers.filter((user) => user.id !== id);
  console.log(otherUsers);
  const dispatch = useAppDispatch();
  return (
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <main className="main-container">
          {otherUsers.map((user) => {
            const { id, photo, displayName, userName } = user;
            return (
              <div className={styles.userContainer}>
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
                <button
                  onClick={() => dispatch(followHandler(id))}
                  className="btn"
                >
                  {userDetails?.following.some((user) => user === id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
};
