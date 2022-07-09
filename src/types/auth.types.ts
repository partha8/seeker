export type UserDetails = {
  displayName: string;
  email: string;
  userName: string;
  photo: string;
  followers: {
    id: string;
  }[];
  posts: any;
};

export type OtherUsers = {
  displayName: string;
  // photo: string;
  userName: string;
  id: string;
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
