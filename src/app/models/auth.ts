export interface JwtPayload {
  id: string;
  username: string;
  // Version du token : le back la compare à auth.tokenVersion pour révoquer les sessions
  v?: number;
  exp: number;
}

export interface AuthResponse {
  email: string;
  id: string;
  username: string;
  isTemporary: boolean;
  token: string;
}

export interface ConflictError {
  emailAlreadyExists: boolean;
  usernameAlreadyExists: boolean;
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

export interface UpgradeAccountParams {
  email: string;
  password: string;
  username?: string;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

// Contraintes alignées sur la validation du back (src/validation/user.js)
export const PASSWORD_MIN_LENGTH = 8;
// bcrypt ignore tout ce qui dépasse 72 octets
export const PASSWORD_MAX_LENGTH = 72;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
