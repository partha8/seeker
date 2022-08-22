export type Posts = {
  comments: {
    uid: string;
    comment: string;
  }[];
  createdAt: any;
  likes: string[];
  postDescription: string;
  postPhoto: string;
  uid: string;
  displayName: string;
  photo: string;
  userName: string;
  postID: string;
};

export type PostState = {
  postsLoading: boolean;
  posts: Posts[];
  postModal: boolean;
  editPost: Posts | null;
  bookmarkedPosts: Posts[];
  bookmarkedPostsLoading: boolean;
  latestDoc: any;
  newPostsLoading: boolean;

  userPosts: Posts[];
  userPostsLoading: boolean;
  newUserPostsLoading: boolean;
  likeLoading: boolean;
};
