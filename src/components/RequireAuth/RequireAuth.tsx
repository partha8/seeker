import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export const RequireAuth = () => {
  const location = useLocation();
  const { id } = useAppSelector((store) => store?.auth);
  return id ? (
    <Outlet />
  ) : (
    <Navigate to="/welcome" state={{ from: location }} replace />
  );
};
