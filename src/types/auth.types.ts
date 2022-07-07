export type UserDetails = {
  displayName: string;
  email: string;
};

export type AuthState = {
  userDetails: UserDetails | null;
  id: string;
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
};
