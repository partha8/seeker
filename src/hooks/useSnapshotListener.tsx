import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";

export const useSnapshotListener = () => {
  // useEffect(() => {
  //   const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
  //     snapshot.docChanges().forEach((change) => {
  //       if (change.type === "added") {
  //       //   console.log("New ", change.doc.data());
  //       }
  //       if (change.type === "modified") {
  //       //   console.log("Modified  ", change.doc.data());
  //       }
  //       if (change.type === "removed") {
  //       //   console.log("Removed ", change.doc.data());
  //       }
  //     });
  //   });
  //   return () => unsub();
  // }, []);
};
