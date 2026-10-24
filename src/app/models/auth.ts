export interface JwtPayload {
  id: string;
  exp?: number;
}

export interface AccountModel {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isGuest: boolean;
}

export interface AuthResponse {
  token: string;
  account: AccountModel;
}

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

export interface SignInParams {
  login: string;
  password: string;
}

export interface SignUpConflict {
  emailAlreadyExists: boolean;
  usernameAlreadyExists: boolean;
}
