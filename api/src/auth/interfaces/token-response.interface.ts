export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
