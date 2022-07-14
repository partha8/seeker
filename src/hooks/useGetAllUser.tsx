import { getDocs, collection, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { setAllUsers } from "../features/authSlice";
import { db } from "../firebase.config";
import { OtherUsers } from "../types/auth.types";
export const useGetAllUser = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    let allUsers: OtherUsers[];
    allUsers = [];
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      allUsers = snapshot.docs.map((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        return data as OtherUsers;
      });
      dispatch(setAllUsers(allUsers));
    });
    return unsub;
  }, []);
};
