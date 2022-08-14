import styles from "./post-loader.module.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const PostLoader = () => {
  return (
    <div className={styles.postContainer}>
      <section className={styles.postAccountDetails}>
        <Skeleton className="avatar avatar-standard" circle />

        <div className={styles.flex}>
          <Skeleton height={10} width={80} className={styles.displayName} />
          <Skeleton height={10} width={60} className={styles.userName} />
        </div>

        <span className={styles.timedate}>
          <Skeleton width={60} />, <Skeleton width={60} />
        </span>
      </section>

      <section className={styles.post}>
        <Skeleton className={styles.text} count={3} />
        <Skeleton height={150} />
      </section>

      <section className={styles.buttons}>
        <Skeleton width={20} height={20} circle />
        <Skeleton width={20} height={20} circle />
      </section>
    </div>
  );
};
