import { GiSittingDog } from "react-icons/gi";
import { NavLink } from "react-router-dom";

import styles from "./welcome.module.css";

export const Welcome = () => {
  return (
    <div className={styles.welcome}>
      <div className={`reveal-text ${styles.logo}`}>
        <GiSittingDog className={styles.icon} />
        <h1>Seeker</h1>
      </div>
      <div className={` ${styles.headline}`}>
        <h1>
          Seek out and connect with your people,{" "}
          <span className="underline">your tribe!</span>
        </h1>
      </div>

      <div className={styles.btnContainer}>
        <NavLink to="/signup">
          <button className="btn">Signup</button>
        </NavLink>
        <NavLink to="/login">
          <button className="btn btn-outline">Login</button>
        </NavLink>
      </div>
    </div>
  );
};
