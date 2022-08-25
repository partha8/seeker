import styles from "./app-loader.module.css";
import { GiSittingDog } from "react-icons/gi";

export const AppLoader = () => {
  return (
    <div className={styles.center}>
      <GiSittingDog
        className={`${styles.circle} ${styles.pulse} ${styles.blue}`}
      />
    </div>
  );
};

