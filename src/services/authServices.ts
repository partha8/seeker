import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User, updateProfile } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { store } from "../app/store";
import { auth, db, storage } from "../firebase.config";
import { LoginDetails, SignupDetails, UserDetails } from "../types/auth.types";

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }: LoginDetails, thunkAPI) => {
      try {
        toast.info("Logging in, wait a few seconds");
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  );
  
  export const signup = createAsyncThunk(
    "auth/signup",
    async (
      { email, password, firstName, lastName, userName }: SignupDetails,
      thunkAPI
    ) => {
      toast.info("Signing up, wait a few seconds");
  
      try {
        await createUserWithEmailAndPassword(auth, email, password);
  
        toast.success("Successfully signed up!");
  
        const user: User | null = auth.currentUser;
        await updateProfile(user!, {
          displayName: `${firstName} ${lastName}`,
        });
  
        await setDoc(doc(db, "users", auth.currentUser!.uid), {
          displayName: auth.currentUser!.displayName,
          email: auth.currentUser!.email,
          userName: userName,
          photo: "",
          followers: [],
          following: [],
          posts: [],
          likedPosts: [],
          bookmarkedPosts: [],
          bio: "",
          portfolioLink: "",
        });
      } catch (error: any) {
        toast.error(error.message);
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getUserDetails = createAsyncThunk(
    "auth/getUserDetails",
    async (id: string, thunkAPI) => {
      try {
        const docData = await getDoc(doc(db, "users", id));
        return docData.data() as UserDetails;
      } catch (error) {
        console.error(error);
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getSelectedUserDetails = createAsyncThunk(
    "auth/getSelectedUserDetails",
    async (id: string, thunkAPI) => {
      try {
        const docData = await getDoc(doc(db, "users", id));
        return docData.data() as UserDetails;
      } catch (error) {
        console.error(error);
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const followHandler = createAsyncThunk(
    "auth/followHandler",
    async (personID: string, thunkAPI) => {
      try {
        const { auth } = store.getState();
        const isFollowing = auth.userDetails?.following.some(
          (user) => user === personID
        );
  
        await updateDoc(doc(db, "users", auth.id), {
          following: isFollowing ? arrayRemove(personID) : arrayUnion(personID),
        });
  
        await updateDoc(doc(db, "users", personID), {
          followers: isFollowing ? arrayRemove(auth.id) : arrayUnion(auth.id),
        });
        return { isFollowing, personID, uid: auth.id };
      } catch (error: any) {
        toast.error(error.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  export const updateProfileDetails = createAsyncThunk(
    "auth/updateProfileDetails",
    async (
      {
        displayName,
        userName,
        portfolioLink,
        bio,
        photo,
      }: {
        displayName: string;
        userName: string;
        portfolioLink: string;
        bio: string;
        photo: string;
      },
      thunkAPI
    ) => {
      const { auth } = store.getState();
      toast.info("Updating profile details...");
      try {
        await updateDoc(doc(db, "users", auth.id), {
          displayName,
          userName,
          bio,
          portfolioLink,
        });
        const imageRef = ref(storage, `users/${auth.id}/image`);
        let downloadURL = "";
        if (photo) {
          await uploadString(imageRef, photo, "data_url").then(async () => {
            downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "users", auth.id), {
              photo: downloadURL,
            });
          });
        }
        toast.success("Profile successfully updated!");
        return {
          displayName,
          userName,
          portfolioLink,
          bio,
          photo: downloadURL,
          id: auth.id,
        };
      } catch (error: any) {
        toast.error(error.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );