export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type SignupRequest = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

export type AuthUser = {
  firstName?: string;
  lastName?: string;
  name?: string;
  displayName?: string;
  email?: string;
  username: string;
  role?: string;
};

export type AuthSession = {
  token: string;
  message?: string;
  user: AuthUser;
};

export type ApiMessage = {
  message: string;
};

export type BackendAuthResponse = string | {
  token?: string;
  jwt?: string;
  accessToken?: string;
  message?: string;
  username?: string;
  email?: string;
  role?: string;
  user?: Partial<AuthUser>;
};
