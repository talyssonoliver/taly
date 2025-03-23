import type { Role } from "../../common/enums/roles.enum";
import type { TokenResponse } from "../interfaces/token-response.interface";

/**
 * Class representation of token response for Swagger documentation
 */
export class TokenResponseClass implements TokenResponse {
  /**
   * JWT access token
   */
  accessToken: string;
  
  /**
   * JWT refresh token
   */
  refreshToken: string;
  
  /**
   * Token expiration time string (e.g. '1h', '1d')
   */
  expiresIn: string;
  
  /**
   * User information included with the token
   */
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
}
