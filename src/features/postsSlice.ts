import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
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

const initialState: PostState = {
  // Feed posts state
  feedPosts: [],
  feedPostsLoading: false,
  explorePosts: [],
  explorePostsLoading: false,
  postModal: false,
  editPost: null,
};

export const getFeedPosts = createAsyncThunk(
  "posts/getFeedPosts",
  async (_, thunkAPI) => {
    try {
      let feedPosts = [];
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const feedPostsSnapShot = await getDocs(q);
      for await (const feedPost of feedPostsSnapShot.docs) {
        const userSnapshot = await getDoc(
          doc(db, "users", feedPost.data().uid)
        );
        feedPosts.push({
          postID: feedPost.id,
          displayName: userSnapshot.data()?.displayName,
          photo: userSnapshot.data()?.photo,
          userName: userSnapshot.data()?.userName,
          ...feedPost.data(),
          // comments: feedPost.data().comments,
          // createdAt: JSON.stringify(feedPost.data().createdAt),
          // likes: feedPost.data().likes,
          // postDescription: feedPost.data().postDescription,
          // uid: feedPost.data().uid,
        });
      }

      return feedPosts as Posts[];
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

      const post = {
        postID: postRef.id,
        uid: auth.id,
        comments: [],
        createdAt,
        likes: [],
        postDescription,
        displayName: auth.userDetails?.displayName,
        photo: auth.userDetails?.photo,
        userName: auth.userDetails?.userName,
      };
      const newFeedPosts = [post, ...posts.feedPosts];
      return newFeedPosts as Posts[];
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
  },
  extraReducers(builder) {
    builder
      .addCase(getFeedPosts.pending, (state) => {
        state.feedPostsLoading = true;
      })
      .addCase(getFeedPosts.fulfilled, (state, action) => {
        state.feedPosts = action.payload;
        state.feedPostsLoading = false;
      })

      // add a new post
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.feedPosts = action.payload;
        state.postModal = false;
      })

      // delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.feedPosts = state.feedPosts.filter(
          (post) => post.postID !== action.payload
        );
      })

      // edit post
      .addCase(editSelectedPost.fulfilled, (state, action) => {
        state.feedPosts = state.feedPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return { ...post, postDescription: action.payload.input };
          }
          return post;
        });
        state.postModal = false;
      })

      // handle like
      .addCase(handleLike.fulfilled, (state, action) => {
        state.feedPosts = state.feedPosts.map((post) => {
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
        state.feedPosts = state.feedPosts.map((post) => {
          if (post.postID === action.payload.postID) {
            return {
              ...post,
              comments: [...post.comments, action.payload.newComment],
            };
          }
          return post;
        });
      });
  },
});

export const { setPostModal, setEditPost } = postsSlice.actions;

export default postsSlice.reducer;
