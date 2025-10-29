export interface JwtPayload {
  id: string;
  exp: number;
}

export interface AuthResponse {
  email: string;
  id: string;
  token: string;
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
