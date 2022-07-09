import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./auth.module.css";
import { useAppDispatch } from "../../app/hooks";
import { login } from "../../features/authSlice";

export const Login = () => {
  const userRef = useRef<any>(null);
  const errRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <section className="flex-center-container">
      <section className={styles.formBox}>
        <p
          ref={errRef}
          className={errMsg ? styles.errmsg : styles.offscreen}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input
              type="email"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label className="flex-center" htmlFor="email">
              Email
            </label>
          </div>

          <div className={styles.inputBox}>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <label className="flex-center" htmlFor="password">
              Password
            </label>
          </div>

          <button className="btn">Sign In</button>
        </form>

        <br />
        <div className={styles.actionLinks}>
          <Link to="/signup">Need an account? Sign up!</Link>
        </div>
      </section>
    </section>
  );
};
