export type UserDetails = {
  displayName: string;
  email: string;
  userName: string;
  photo: string;
  followers: string[];
  following: string[];
  posts: string[];
  likedPosts: string[];
  bookmarkedPosts: string[];
  bio: string;
  portfolioLink: string;
};

export type OtherUsers = {
  displayName: string;
  email: string;
  userName: string;
  photo: string;
  id: string;
  followers: string[];
  following: string[];
  posts: string[];
  likedPosts: string[];
  bookmarkedPosts: string[];
  bio: string;
  portfolioLink: string;
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

export type AuthState = {
  userDetails: UserDetails | null;
  userDetailsLoading: boolean;
  id: string;
  allUsers: OtherUsers[];
  selectedUserDetails: UserDetails | null;
  selectedUserDetailsLoading: boolean;
};
