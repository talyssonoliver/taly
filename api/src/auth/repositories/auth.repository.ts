import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * Type guard to check if an error has message and stack properties
 */
function isErrorWithMessage(error: unknown): error is { message: string; stack?: string } {
  return (
    typeof error === 'object' && 
    error !== null && 
    'message' in error && 
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Repository for authentication-related database operations
 */
@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);
  
  constructor(private readonly prisma: PrismaService) {}
  
  /**
   * Find a user by email address
   * @param email User's email address
   * @returns Found user or null
   */
  async findUserByEmail(email: string) {
    try {
      return this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error';
      const errorStack = isErrorWithMessage(error) && error.stack ? error.stack : undefined;
      this.logger.error(`Error finding user by email: ${errorMessage}`, errorStack);
      throw error;
    }
  }
  
  /**
   * Create a refresh token for a user
   * @param userId User ID
   * @param token Refresh token
   * @param expiresAt Expiration date
   * @returns Created refresh token
   */
  async createRefreshToken(
    userId: string, 
    token: string, 
    expiresAt: Date
  ) {
    try {
      return this.prisma.refreshToken.upsert({
        where: { userId },
        update: {
          token,
          expiresAt,
        },
        create: {
          userId,
          token,
          expiresAt,
        },
      });
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error';
      const errorStack = isErrorWithMessage(error) && error.stack ? error.stack : undefined;
      this.logger.error(`Error creating refresh token: ${errorMessage}`, errorStack);
      throw error;
    }
  }
  
  /**
   * Find refresh token by token value
   * @param token Refresh token
   * @returns Found token or null
   */
  async findRefreshToken(token: string) {
    try {
      return this.prisma.refreshToken.findFirst({
        where: { 
          token,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error';
      const errorStack = isErrorWithMessage(error) && error.stack ? error.stack : undefined;
      this.logger.error(`Error finding refresh token: ${errorMessage}`, errorStack);
      throw error;
    }
  }
  
  /**
   * Delete a user's refresh tokens
   * @param userId User ID
   * @returns Operation result
   */
  async deleteRefreshTokens(userId: string) {
    try {
      return this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error';
      const errorStack = isErrorWithMessage(error) && error.stack ? error.stack : undefined;
      this.logger.error(`Error deleting refresh tokens: ${errorMessage}`, errorStack);
      throw error;
    }
  }
  
  /**
   * Create a password reset token
   * @param userId User ID
   * @param token Reset token
   * @param expiresAt Expiration date
   * @returns Created password reset token
   */
  async createPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    try {
      return this.prisma.passwordReset.upsert({
        where: { userId },
        update: {
          token,
          expiresAt,
        },
        create: {
          userId,
          token,
          expiresAt,
        },
      });
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error';
      const errorStack = isErrorWithMessage(error) && error.stack ? error.stack : undefined;
      this.logger.error(`Error creating password reset token: ${errorMessage}`, errorStack);
      throw error;
    }
  }
  
  /**
   * Find password reset token
   * @param token Reset token
   * @returns Found token or null
   */
  async findPasswordResetToken(token: string) {
    try {
      return this.prisma.passwordReset.findFirst({
        where: {
          token,
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error';
      const errorStack = isErrorWithMessage(error) && error.stack ? error.stack : undefined;
      this.logger.error(`Error finding password reset token: ${errorMessage}`, errorStack);
      throw error;
    }
  }
  
  /**
   * Delete a password reset token
   * @param id Token ID
   * @returns Operation result
   */
  async deletePasswordResetToken(id: string) {
    try {
      return this.prisma.passwordReset.delete({
        where: { id },
      });
    } catch (error: unknown) {
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error';
      const errorStack = isErrorWithMessage(error) && error.stack ? error.stack : undefined;
      this.logger.error(`Error deleting password reset token: ${errorMessage}`, errorStack);
      throw error;
    }
  }
}