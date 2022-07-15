import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AuthState,
  LoginDetails,
  OtherUsers,
  SignupDetails,
  UserDetails,
} from "../types/auth.types";
import { auth, db } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { store } from "../app/store";
import { handleBookmark } from "./postsSlice";

const initialState: AuthState = {
  userDetails: null,
  id: "",
  allUsers: [],
};

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
    try {
      toast.info("Signing up, wait a few seconds");

      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("Successfully signed up!");

      const user: any = auth.currentUser;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      await setDoc(doc(db, "users", auth.currentUser!.uid), {
        displayName: auth.currentUser!.displayName,
        email: auth.currentUser!.email,
        userName: userName,
        photo: null,
        followers: [],
        following: [],
        posts: [],
        likedPosts: [],
        bookmarkedPosts: [],
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload;
    },
    setAllUsers(state, action) {
      state.allUsers = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
      })
      .addCase(followHandler.fulfilled, (state, action) => {
        state.userDetails!.following = action.payload.isFollowing
          ? state.userDetails!.following.filter(
              (user) => user !== action.payload.personID
            )
          : [...state.userDetails!.following, action.payload.personID];

        state.allUsers = state.allUsers.map((user) => {
          if (user.id === action.payload.personID) {
            return {
              ...user,
              followers: [user.followers, action.payload.uid],
            } as OtherUsers;
          }
          return user as OtherUsers;
        });
      })
      .addCase(handleBookmark.fulfilled, (state, action) => {
        state.userDetails!.bookmarkedPosts = action.payload.bookmarkPostExists
          ? state.userDetails!.bookmarkedPosts.filter(
              (postID) => postID !== action.payload.post.postID
            )
          : [...state.userDetails!.bookmarkedPosts, action.payload.post.postID];
      });
  },
});

export const { setUser, setAllUsers } = authSlice.actions;

export default authSlice.reducer;
