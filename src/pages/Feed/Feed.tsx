import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import styles from "./feed.module.css";

export const Feed = () => {
  return (
    <>
      <button onClick={() => signOut(auth)}>Logout</button>
    </>
  );
};
