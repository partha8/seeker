import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signup } from "../../features/authSlice";
import { db } from "../../firebase.config";
import styles from "./auth.module.css";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useAppDispatch();
  const { allUsers } = useAppSelector((store) => store.auth);

  useEffect(() => {
    setValidMatch(password === matchPassword);
  }, [matchPassword, password]);

  useEffect(() => {
    setErrMsg("");
  }, [password, matchPassword, email, userName]);

  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch(signup({ email, password, firstName, lastName, userName }));
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (userName) {
      timeout = setTimeout(async () => {
        const q = query(
          collection(db, "users"),
          where("userName", "==", userName)
        );
        const docs = await getDocs(q);
        if (!docs.empty) {
          setErrMsg("User already exists");
        }
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [allUsers, userName]);

  return (
    <section className={styles.formBox}>
      <h2>Sign Up!</h2>{" "}
      <p
        className={errMsg ? styles.errmsg : styles.offscreen}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form onSubmit={submitHandler}>
        {/* firstName */}
        <div className={styles.inputBox}>
          <input
            type="text"
            id="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="off"
            value={firstName}
            required
          />
          <label htmlFor="firstName" className="flex-center">
            First Name
          </label>
        </div>

        <div className={styles.inputBox}>
          <input
            type="text"
            id="lastName"
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="off"
            value={lastName}
            required
          />
          <label htmlFor="lastName" className="flex-center">
            Last Name
          </label>
        </div>

        {/* username */}
        <div className={styles.inputBox}>
          <input
            type="text"
            id="userName"
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="off"
            value={userName}
            required
          />
          <label htmlFor="lastName" className="flex-center">
            User Name
          </label>
        </div>

        {/* email */}
        <div className={styles.inputBox}>
          <input
            type="text"
            id="email"
            onChange={(e) => setemail(e.target.value)}
            autoComplete="off"
            value={email}
            required
          />
          <label htmlFor="email" className="flex-center">
            Email
          </label>
        </div>

        {/* Password */}
        <div className={styles.inputBox}>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <label htmlFor="password" className="flex-center">
            Password
          </label>
        </div>

        {/* confirm password */}
        <p
          id="confirmnote"
          className={!validMatch ? styles.instructions : styles.offscreen}
        >
          Must match the first password input field.
        </p>
        <div className={styles.inputBox}>
          <input
            type="password"
            id="confirm_password"
            onChange={(e) => setMatchPassword(e.target.value)}
            value={matchPassword}
            required
          />
          <label htmlFor="confirm_password" className="flex-center">
            Confirm Password
          </label>
        </div>

        {/* submit button */}
        <button className="btn">Sign Up!</button>
        <div className={styles.actionLinks}>
          <Link to="/login">Already have an account? Login!</Link>
        </div>
      </form>
    </section>
  );
};
