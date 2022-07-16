import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Navbar, PostCard, Sidebar } from "../../components";
import { getPosts } from "../../features/postsSlice";
import styles from "./profile.module.css";

export const Profile = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <main className="main-container">
          <section className={styles.profileContainer}>
            
          </section>
        </main>
      </div>
    </div>
  );
};
