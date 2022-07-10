import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import {
  addDoc,
  arrayUnion,
  collection,
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

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPostModal(state, action) {
      state.postModal = action.payload;
      console.log(action.payload);
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
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.feedPosts = action.payload;
        state.postModal = false;
      });
  },
});

export const { setPostModal } = postsSlice.actions;

export default postsSlice.reducer;
