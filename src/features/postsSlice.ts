import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { Posts, PostState } from "../types/posts.types";

const initialState: PostState = {
  // Feed posts state
  feedPosts: [],
  feedPostsLoading: false,
  explorePosts: [],
  explorePostsLoading: false,
};

export const getFeedPosts = createAsyncThunk(
  "posts/getFeedPosts",
  async (_, thunkAPI) => {
    try {
      let feedPosts = [];
      const feedPostsSnapShot = await getDocs(collection(db, "posts"));
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
        });
      }

      return feedPosts as Posts[];
    } catch (error: any) {
      console.error(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getFeedPosts.pending, (state) => {
      state.feedPostsLoading = true;
    });
    builder.addCase(getFeedPosts.fulfilled, (state, action) => {
      state.feedPosts = action.payload;
      state.feedPostsLoading = false;
    });
  },
});

export default postsSlice.reducer;
