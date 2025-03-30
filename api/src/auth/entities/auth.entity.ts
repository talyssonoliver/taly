// src/auth/entities/auth.entity.ts

/**
 * Represents authentication-related data structures
 */
export class Auth {
  /**
   * User's authentication tokens
   */
  tokens: {
    /**
     * JWT access token
     */
    accessToken: string;
    
    /**
     * JWT refresh token (if applicable)
     */
    refreshToken?: string;
    
    /**
     * Token expiration timeframe
     */
    expiresIn: string;
  };
  
  /**
   * Authenticated user data
   */
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    role: string;
  };
}