import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AuthState,
  LoginDetails,
  OtherUsers,
  SignupDetails,
  UserDetails,
} from "../types/auth.types";
import { toast } from "react-toastify";

import { auth, db, storage } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { store } from "../app/store";
import { handleBookmark, handleLike } from "./postsSlice";

const initialState: AuthState = {
  userDetails: null,
  userDetailsLoading: true,
  id: "",
  allUsers: [],
  selectedUserDetails: null,
  selectedUserDetailsLoading: true,
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
      .addCase(getUserDetails.pending, (state) => {
        state.userDetailsLoading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.userDetailsLoading = false;
      })

      .addCase(getSelectedUserDetails.pending, (state) => {
        state.selectedUserDetailsLoading = true;
      })
      .addCase(getSelectedUserDetails.fulfilled, (state, action) => {
        state.selectedUserDetails = action.payload;
        state.selectedUserDetailsLoading = false;
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

      //case for bookmarked posts
      .addCase(handleBookmark.fulfilled, (state, action) => {
        state.userDetails!.bookmarkedPosts = action.payload.bookmarkPostExists
          ? state.userDetails!.bookmarkedPosts.filter(
              (postID) => postID !== action.payload.post.postID
            )
          : [...state.userDetails!.bookmarkedPosts, action.payload.post.postID];
      })

      //case for liking/disliking posts
      .addCase(handleLike.fulfilled, (state, action) => {
        state.userDetails!.likedPosts = action.payload.likedPostExists
          ? state.userDetails!.likedPosts.filter(
              (postID) => postID !== action.payload.postID
            )
          : [...state.userDetails!.likedPosts, action.payload.postID];
      })

      // profile update
      .addCase(
        updateProfileDetails.fulfilled,
        (
          state,
          { payload: { displayName, userName, bio, portfolioLink, photo } }
        ) => {
          const details = {
            ...state.userDetails,
            displayName,
            userName,
            bio,
            portfolioLink,
            photo: photo ? photo : state.userDetails?.photo,
          } as UserDetails;
          state.userDetails = details;
        }
      );
  },
});

export const { setUser, setAllUsers } = authSlice.actions;

export default authSlice.reducer;
