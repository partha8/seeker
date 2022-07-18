import React, { useEffect } from "react";
import { useAuthObserver } from "./hooks/useAuthObserver";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import {
  Bookmark,
  Explore,
  Feed,
  Login,
  People,
  Profile,
  Signup,
} from "./pages";
import { InputModal, RequireAuth } from "./components";
import { useGetAllUser } from "./hooks/useGetAllUser";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getUserDetails } from "./features/authSlice";

export const App = () => {
  const { posts } = useAppSelector((store) => store.posts);
  const { id } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();
  useAuthObserver();
  useGetAllUser();

  useEffect(() => {
    if (id) {
      dispatch(getUserDetails(id));
    }
  }, [id, posts]);

  return (
    <>
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

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Feed />} />
          <Route path="/people" element={<People />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};
