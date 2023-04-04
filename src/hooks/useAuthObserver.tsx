import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import { setUser } from "../features/authSlice";
import { useAppDispatch } from "../app/hooks";
import { getUserDetails } from "../services/authServices";

export const useAuthObserver = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (
          location.pathname === "/welcome" ||
          location.pathname === "/signup" ||
          location.pathname === "/login" ||
          location.pathname === "/"
        ) {
          navigate("/");
        } else {
          navigate(location.pathname);
        }
        dispatch(setUser(user.uid));
        dispatch(getUserDetails(user.uid));
      } else {
        dispatch(setUser(null));
      }
    });
    return unsub;
  }, []);
};
