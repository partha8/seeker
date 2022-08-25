import React, { useEffect } from "react";
import { useAuthObserver } from "./hooks/useAuthObserver";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  Bookmark,
  Explore,
  Feed,
  Login,
  People,
  Profile,
  Signup,
  Welcome,
} from "./pages";
import {
  InputModal,
  Recommendations,
  RequireAuth,
  Sidebar,
} from "./components";
import { useGetAllUser } from "./hooks/useGetAllUser";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getUserDetails } from "./features/authSlice";
import { AppLoader } from "./components/AppLoader/AppLoader";

export const App = () => {
  const { id, userDetailsLoading } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();
  useAuthObserver();
  useGetAllUser();

  useEffect(() => {
    if (id) {
      dispatch(getUserDetails(id));
    }
  }, [
    id,
    performance.getEntriesByType("navigation")[0].toJSON().type === "reload",
  ]);

  const location = useLocation();

  if (userDetailsLoading && id !== null) {
    return <AppLoader />;
  }

  return (
    <div
      className={`${
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/welcome" &&
        "container"
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <InputModal />
      {id && <Sidebar />}
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Feed />} />
          <Route path="/people" element={<People />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/profile/:profileID" element={<Profile />} />
        </Route>
      </Routes>
      {id && <Recommendations />}
    </div>
  );
};
