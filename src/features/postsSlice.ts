import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Posts, PostState } from "../types/posts.types";
import { store } from "../app/store";
import { toast } from "react-toastify";
import { updateProfileDetails } from "./authSlice";

const initialState: PostState = {
  posts: [],
  postsLoading: false,
  postModal: false,
  editPost: null,
  bookmarkedPosts: [],
  bookmarkedPostsLoading: false,
};

export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (_, thunkAPI) => {
    try {
      let posts = [];
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const postsSnapShot = await getDocs(q);
      for await (const feedPost of postsSnapShot.docs) {
        const userSnapshot = await getDoc(
          doc(db, "users", feedPost.data().uid)
        );
        posts.push({
          postID: feedPost.id,
          displayName: userSnapshot.data()?.displayName,
          photo: userSnapshot.data()?.photo,
          userName: userSnapshot.data()?.userName,
          ...feedPost.data(),
        });
      }

      return posts as Posts[];
    } catch (error: any) {
      console.error(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (postDescription: string, { rejectWithValue, getState }) => {
    const { auth, posts } = store.getState();
    try {
      const createdAt = serverTimestamp();

      const postRef = await addDoc(collection(db, "posts"), {
        postDescription,
        comments: [],
        createdAt: createdAt,
        likes: [],
        uid: auth.id,
      });

      // update the post array in user collection
      await updateDoc(doc(db, "users", auth.id), {
        posts: arrayUnion(postRef.id),
      });

      const newPostref = await getDoc(doc(db, "posts", postRef.id));

      const post = {
        postID: postRef.id,
        uid: auth.id,
        comments: [],
        createdAt: newPostref.data()?.createdAt,
        likes: [],
        postDescription,
        displayName: auth.userDetails?.displayName,
        photo: auth.userDetails?.photo,
        userName: auth.userDetails?.userName,
      };
      const newposts = [post, ...posts.posts];
      return newposts as Posts[];
    } catch (error: any) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postID: string, thunkAPI) => {
    const { auth } = store.getState();
    try {
      await deleteDoc(doc(db, "posts", postID));
      await updateDoc(doc(db, "users", auth.id), {
        posts: arrayRemove(postID),
      });
      return postID;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editSelectedPost = createAsyncThunk(
  "posts/editSelectedPost",
  async ({ input, postID }: any, thunkAPI) => {
    try {
      await updateDoc(doc(db, "posts", postID), {
        postDescription: input,
      });
      return { input, postID } as any;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const handleLike = createAsyncThunk(
  "posts/handleLike",
  async (postID: string, thunkAPI) => {
    const { auth } = store.getState();
    try {
      const likedPostExists = auth.userDetails?.likedPosts.some(
        (post) => post === postID
      );
      await updateDoc(doc(db, "users", auth.id), {
        likedPosts: likedPostExists ? arrayRemove(postID) : arrayUnion(postID),
      });
      await updateDoc(doc(db, "posts", postID), {
        likes: likedPostExists ? arrayRemove(auth.id) : arrayUnion(auth.id),
      });
      return { likedPostExists, postID, uid: auth.id };
    } catch (error: any) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getBookmarkedPosts = createAsyncThunk(
  "posts/getBookmarkedPosts",
  async (_, thunkAPI) => {
    const { auth } = store.getState();
    try {
      let bookmarkPosts = [];

      for await (const postID of auth.userDetails!.bookmarkedPosts) {
        const bookmarkSnapshot = await getDoc(doc(db, "posts", postID));
        if (bookmarkSnapshot.exists()) {
          const authorSnapshot = await getDoc(
            doc(db, "users", bookmarkSnapshot.data().uid)
          );
          bookmarkPosts.push({
            postID: bookmarkSnapshot.id,
            displayName: authorSnapshot.data()?.displayName,
            userName: authorSnapshot.data()?.userName,
            photo: authorSnapshot.data()?.photo,
            ...bookmarkSnapshot.data(),
          });
        }
      }
      return bookmarkPosts as Posts[];
    } catch (error: any) {
      console.error(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const handleBookmark = createAsyncThunk(
  "posts/handleBookmark",
  async (postInfo: Posts, thunkAPI) => {
    const { auth } = store.getState();
    try {
      const bookmarkPostExists = auth.userDetails?.bookmarkedPosts.some(
        (post) => post === postInfo.postID
      );

      await updateDoc(doc(db, "users", auth.id), {
        bookmarkedPosts: bookmarkPostExists
          ? arrayRemove(postInfo.postID)
          : arrayUnion(postInfo.postID),
      });
      return { bookmarkPostExists, post: postInfo };
    } catch (error: any) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ comment, postID }: any, thunkAPI) => {
    const { auth } = store.getState();
    try {
      const newComment = {
        uid: auth.id,
        comment,
      };
      await updateDoc(doc(db, "posts", postID), {
        comments: arrayUnion(newComment),
      });
      return { postID, newComment };
    } catch (error: any) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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
      console.log(state.posts);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPosts.pending, (state) => {
        state.postsLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.postsLoading = false;
      })

      // add a new post
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.postModal = false;
      })

      // delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post.postID !== action.payload
        );
        state.bookmarkedPosts = state.posts.filter(
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
        state.postModal = false;
      })

      // handle like
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
              return { ...post, displayName, userName, photo };
            }
            return post;
          });
        }
      );
  },
});

export const { setPostModal, setEditPost, setPosts } = postsSlice.actions;

export default postsSlice.reducer;
