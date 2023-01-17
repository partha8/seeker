import { createSlice } from "@reduxjs/toolkit";
import { AuthState, OtherUsers, UserDetails } from "../types/auth.types";
import { handleBookmark, handleLike } from "../services/postServices";
import {
  getUserDetails,
  getSelectedUserDetails,
  followHandler,
  updateProfileDetails,
} from "../services/authServices";

const initialState: AuthState = {
  userDetails: null,
  userDetailsLoading: true,
  id: "",
  allUsers: [],
  selectedUserDetails: null,
  selectedUserDetailsLoading: true,
};

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

        if (state.selectedUserDetails!.id === action.payload.uid) {
          state.selectedUserDetails!.following = action.payload.isFollowing
            ? state.selectedUserDetails!.following.filter(
                (user) => user !== action.payload.personID
              )
            : [
                ...state.selectedUserDetails!.following,
                action.payload.personID,
              ];
        }

        if (state.selectedUserDetails!.id === action.payload.personID) {
          state.selectedUserDetails!.followers = action.payload.isFollowing
            ? state.selectedUserDetails!.followers.filter(
                (user) => user !== action.payload.personID
              )
            : [
                ...state.selectedUserDetails!.followers,
                action.payload.personID,
              ];
        }

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
          state.selectedUserDetails = details;
        }
      );
  },
});

export const { setUser, setAllUsers } = authSlice.actions;

export default authSlice.reducer;
