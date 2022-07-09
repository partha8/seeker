import { signOut } from "firebase/auth";
import React from "react";
import { GiSittingDog } from "react-icons/gi";
import { auth } from "../../firebase.config";
import styles from "./navbar.module.css";

export const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <h2>
        <span className="flex-center">
          <GiSittingDog />
        </span>
        Seeker
      </h2>
      <button onClick={() => signOut(auth)} className="btn">
        Logout
      </button>
    </nav>
  );
};
