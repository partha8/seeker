import { createSlice } from "@reduxjs/toolkit";

import { PostState } from "../types/posts.types";
import {
  addComment,
  addNewPost,
  deletePost,
  editSelectedPost,
  getBookmarkedPosts,
  getNewPosts,
  getNewUserPosts,
  getPosts,
  getUserPosts,
  handleBookmark,
  handleLike,
} from "../services/postServices";
import { updateProfileDetails } from "../services/authServices";

const initialState: PostState = {
  posts: [],
  postsLoading: false,
  latestDoc: 0,
  newPostsLoading: false,

  likeLoading: false,
  postModal: false,
  editPost: null,

  bookmarkedPosts: [],
  bookmarkedPostsLoading: false,

  userPosts: [],
  userPostsLoading: false,
  newUserPostsLoading: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPostModal(state, action) {
      state.postModal = action.payload;
    },
    setEditPost(state, action) {
      state.editPost = action.payload;
    },
    setPosts(state, action) {
      state.posts = action.payload;
    },
    setLastDoc(state) {
      state.latestDoc = null;
      state.userPosts = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPosts.pending, (state) => {
        state.postsLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.newPosts;
        state.latestDoc = action.payload.lastDoc;
        state.postsLoading = false;
      })

      .addCase(getNewPosts.pending, (state) => {
        state.newPostsLoading = true;
      })
      .addCase(getNewPosts.fulfilled, (state, action) => {
        state.posts = action.payload.newPosts;
        state.latestDoc = action.payload.lastDoc;
        state.newPostsLoading = false;
      })

      .addCase(getUserPosts.pending, (state) => {
        state.userPostsLoading = true;
      })

      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload.newPosts;
        state.latestDoc = action.payload.lastDoc;
        state.userPostsLoading = false;
      })

      .addCase(getNewUserPosts.pending, (state) => {
        state.newUserPostsLoading = true;
      })
      .addCase(getNewUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload.newPosts;
        state.latestDoc = action.payload.lastDoc;
        state.newUserPostsLoading = false;
      })
      // add a new post
      .addCase(addNewPost.fulfilled, (state, action) => {
        console.log(action.payload);
        state.posts = action.payload;

        state.postModal = false;
      })

      // delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post.postID !== action.payload
        );
        state.bookmarkedPosts = state.bookmarkedPosts.filter(
          (post) => post.postID !== action.payload
        );
        state.userPosts = state.userPosts.filter(
          (post) => post.postID !== action.payload
        );
      })

      // edit post
      .addCase(editSelectedPost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => {
          if (post.postID === action.payload.postID) {
            return { ...post, postDescription: action.payload.input };
          }
          return post;
        });

        state.bookmarkedPosts = state.bookmarkedPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return { ...post, postDescription: action.payload.input };
          }
          return post;
        });

        state.userPosts = state.userPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return { ...post, postDescription: action.payload.input };
          }
          return post;
        });
        state.postModal = false;
      })

      // handle like
      .addCase(handleLike.pending, (state) => {
        state.likeLoading = true;
      })
      .addCase(handleLike.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => {
          if (post.postID === action.payload.postID) {
            return {
              ...post,
              likes: action.payload.likedPostExists
                ? post.likes.filter((user) => user !== action.payload.uid)
                : [...post.likes, action.payload.uid],
            };
          }
          return post;
        });

        state.bookmarkedPosts = state.bookmarkedPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return {
              ...post,
              likes: action.payload.likedPostExists
                ? post.likes.filter((user) => user !== action.payload.uid)
                : [...post.likes, action.payload.uid],
            };
          }
          return post;
        });

        state.userPosts = state.userPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return {
              ...post,
              likes: action.payload.likedPostExists
                ? post.likes.filter((user) => user !== action.payload.uid)
                : [...post.likes, action.payload.uid],
            };
          }
          return post;
        });
        state.likeLoading = false;
      })

      // add a comment
      .addCase(addComment.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => {
          if (post.postID === action.payload.postID) {
            return {
              ...post,
              comments: [...post.comments, action.payload.newComment],
            };
          }
          return post;
        });

        state.bookmarkedPosts = state.bookmarkedPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return {
              ...post,
              comments: [...post.comments, action.payload.newComment],
            };
          }
          return post;
        });

        state.userPosts = state.userPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return {
              ...post,
              comments: [...post.comments, action.payload.newComment],
            };
          }
          return post;
        });
      })

      // get bookmarked posts
      .addCase(getBookmarkedPosts.pending, (state, action) => {
        state.bookmarkedPostsLoading = true;
      })
      .addCase(getBookmarkedPosts.fulfilled, (state, action) => {
        state.bookmarkedPostsLoading = false;
        state.bookmarkedPosts = action.payload;
      })

      .addCase(handleBookmark.fulfilled, (state, action) => {
        state.bookmarkedPosts = action.payload.bookmarkPostExists
          ? state.bookmarkedPosts.filter(
              (post) => post.postID !== action.payload.post.postID
            )
          : [...state.bookmarkedPosts, action.payload.post];
      })

      // update the posts with the new user details
      .addCase(
        updateProfileDetails.fulfilled,
        (state, { payload: { displayName, userName, id, photo } }) => {
          state.posts = state.posts.map((post) => {
            if (post.uid === id) {
              return {
                ...post,
                displayName,
                userName,
                photo: photo ? photo : post.photo,
              };
            }
            return post;
          });

          state.userPosts = state.userPosts.map((post) => {
            if (post.uid === id) {
              return {
                ...post,
                displayName,
                userName,
                photo: photo ? photo : post.photo,
              };
            }
            return post;
          });
        }
      );
  },
});

export const { setPostModal, setEditPost, setPosts, setLastDoc } =
  postsSlice.actions;

export default postsSlice.reducer;
