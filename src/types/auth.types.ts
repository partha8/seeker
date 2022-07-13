export type UserDetails = {
  displayName: string;
  email: string;
  userName: string;
  photo: string | null;
  followers: string[];
  following: string[] ;
  posts: string[];
  likedPosts: string[];
  bookmarkedPosts: string[];
};

export type OtherUsers = {
  displayName: string;
  email: string;
  userName: string;
  photo: string | null;
  id: string;
  followers: string[];
  following: string[];
  posts: string[];
  likedPosts: string[];
  bookmarkedPosts: string[];
};

export type AuthState = {
  userDetails: UserDetails | null;
  id: string;
  allUsers: OtherUsers[];
};

export type LoginDetails = {
  email: string;
  password: string;
};

export type SignupDetails = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
};
