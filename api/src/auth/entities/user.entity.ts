// src/auth/entities/user.entity.ts

/**
 * Represents a user in the system
 * Maps to the 'users' table in the database
 */
export class User {
  /**
   * Unique identifier for the user
   */
  id: string;
  
  /**
   * User's email address (unique)
   */
  email: string;
  
  /**
   * Hashed password
   */
  password: string;
  
  /**
   * User's first name
   */
  firstName: string;
  
  /**
   * User's last name (optional)
   */
  lastName?: string;
  
  /**
   * User's role in the system
   * @default 'user'
   */
  role: string;
  
  /**
   * Whether the user account is active
   * @default true
   */
  isActive: boolean;
  
  /**
   * Date when the user was created
   */
  createdAt: Date;
  
  /**
   * Date when the user was last updated
   */
  updatedAt: Date;
  
  /**
   * Token used for password reset (optional)
   */
  resetPasswordToken?: string;
  
  /**
   * URL to user's profile image (optional)
   */
  profileImage?: string;
  
  /**
   * User's phone number (optional)
   */
  phoneNumber?: string;
  
  /**
   * Full name of the user (derived property)
   */
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName;
  }
}