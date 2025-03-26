import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import type { PrismaService } from "../database/prisma.service";
import { User } from "../users/interfaces/user.interface";
import type { UsersService } from "../users/users.service";
import type { ForgotPasswordDto } from "./dto/forgot-password.dto";
import type { LoginDto } from "./dto/login.dto";
import type { RefreshTokenDto } from "./dto/refresh-token.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { TokenService } from "./token.service";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly tokenService: TokenService,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	/**
	 * Validate a user by email and password
	 * @param email User's email
	 * @param password User's password
	 * @returns User without password or null
	 */
	async validateUser(
		email: string,
		password: string,
	): Promise<Omit<User, "password"> | null> {
		this.logger.debug(`Attempting to validate user: ${email}`);
		try {
			const user = await this.prismaService.user.findUnique({
				where: { email },
			});

			if (!user) {
				this.logger.warn(
					`User validation failed: No user found with email ${email}`,
				);
				return null;
			}

			if (!user.isActive) {
				this.logger.warn(`User validation failed: User ${email} is not active`);
				return null;
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				this.logger.warn(
					`User validation failed: Invalid password for ${email}`,
				);
				return null;
			}

			const { password: _, ...result } = user;
			this.logger.log(`User validated successfully: ${email}`);
			return result;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(
					`User validation error: ${error.message}`,
					error.stack,
				);
			} else {
				this.logger.error(`User validation error: ${String(error)}`);
			}
			return null;
		}
	}

	async register(registerDto: RegisterDto) {
		try {
			// Check if user already exists
			const existingUser = await this.prismaService.user.findUnique({
				where: { email: registerDto.email },
			});

			if (existingUser) {
				this.logger.warn(
					`Registration failed: Email already in use: ${registerDto.email}`,
				);
				throw new ConflictException("Email already in use");
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(registerDto.password, 10);

			// Create user in a transaction
			return await this.prismaService.$transaction(async (tx) => {
				const user = await tx.user.create({
					data: {
						email: registerDto.email,
						password: hashedPassword,
						firstName: registerDto.firstName,
						lastName: registerDto.lastName,
						role: "USER",
						isActive: true,
					},
				});

				// Generate tokens
				const tokens = await this.tokenService.generateTokens(user);

				this.logger.log(`User registered successfully: ${user.email}`);

				// Return user data (excluding password) and tokens
				return {
					user: {
						id: user.id,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						role: user.role,
					},
					...tokens,
				};
			});
		} catch (error) {
			if (error instanceof ConflictException) {
				throw error;
			}
			if (error instanceof Error) {
				this.logger.error(`Registration failed: ${error.message}`, error.stack);
			} else {
				this.logger.error(`Registration failed: ${String(error)}`);
			}
			throw new InternalServerErrorException("Registration failed");
		}
	}

	async login(loginDto: LoginDto) {
		try {
			// Find user
			const user = await this.validateUser(loginDto.email, loginDto.password);

			// Check if user exists and password is correct
			if (!user) {
				this.logger.warn(
					`Login failed: Invalid credentials for email: ${loginDto.email}`,
				);
				throw new UnauthorizedException("Invalid credentials");
			}

			// Generate tokens
			const tokens = await this.tokenService.generateTokens(user);

			this.logger.log(`User logged in successfully: ${user.email}`);

			// Return user data and tokens
			return {
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
				},
				...tokens,
			};
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			if (error instanceof Error) {
				this.logger.error(`Login failed: ${error.message}`, error.stack);
			} else {
				this.logger.error(`Login failed: ${String(error)}`);
			}
			throw new InternalServerErrorException("Login failed");
		}
	}

	async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
		try {
			const { email } = forgotPasswordDto;
			// Find user
			const user = await this.prismaService.user.findUnique({
				where: { email },
			});

			if (!user) {
				this.logger.warn(
					`Password reset requested for non-existent email: ${email}`,
				);
				// Don't reveal if the user exists for security
				return { success: true };
			}

			// Generate password reset token
			const payload = { sub: user.id, email: user.email };
			const resetToken = this.jwtService.sign(payload, {
				secret: process.env.JWT_RESET_SECRET || "resetSecret",
				expiresIn: "1h",
			});

			// In a real application, send email with reset link
			// For now, just log it
			this.logger.log(`Password reset token generated for user: ${email}`);

			// Return success without revealing if user exists
			return { success: true };
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(
					`Password reset failed: ${error.message}`,
					error.stack,
				);
			} else {
				this.logger.error(`Password reset failed: ${String(error)}`);
			}
			throw new InternalServerErrorException("Password reset request failed");
		}
	}

	async refreshTokens(refreshTokenDto: RefreshTokenDto) {
		try {
			// Validate and generate new tokens
			const tokens = await this.tokenService.refreshTokens(
				refreshTokenDto.refreshToken,
			);

			this.logger.log("Token refreshed successfully");
			return tokens;
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(
					`Token refresh failed: ${error.message}`,
					error.stack,
				);
			} else {
				this.logger.error(`Token refresh failed: ${String(error)}`);
			}
			throw new UnauthorizedException("Invalid refresh token");
		}
	}

	async logout(userId: string) {
		try {
			// Remove refresh token from database
			await this.prismaService.refreshToken.deleteMany({
				where: { userId },
			});

			this.logger.log(`User logged out successfully: ${userId}`);
			return { success: true };
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`Logout failed: ${error.message}`, error.stack);
			} else {
				this.logger.error(`Logout failed: ${String(error)}`);
			}
			throw new InternalServerErrorException("Logout failed");
		}
	}

	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
	) {
		try {
			// Find user
			const user = await this.prismaService.user.findUnique({
				where: { id: userId },
			});

			if (!user) {
				throw new UnauthorizedException("User not found");
			}

			// Verify current password
			const isPasswordValid = await bcrypt.compare(
				currentPassword,
				user.password,
			);

			if (!isPasswordValid) {
				this.logger.warn(
					`Password change failed: Current password incorrect for user ${userId}`,
				);
				throw new UnauthorizedException("Current password is incorrect");
			}

			// Hash new password
			const hashedPassword = await bcrypt.hash(newPassword, 10);

			// Update password
			await this.prismaService.user.update({
				where: { id: userId },
				data: { password: hashedPassword },
			});

			this.logger.log(`Password changed successfully for user: ${userId}`);
			return { success: true };
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			if (error instanceof Error) {
				this.logger.error(
					`Password change failed: ${error.message}`,
					error.stack,
				);
			} else {
				this.logger.error(`Password change failed: ${String(error)}`);
			}
			throw new InternalServerErrorException("Password change failed");
		}
	}

	async resetPassword(token: string, newPassword: string) {
		try {
			// Verify the reset token
			const payload = this.jwtService.verify(token, {
				secret: process.env.JWT_RESET_SECRET || "resetSecret",
			});

			const userId = payload.sub;

			// Check if the user exists
			const user = await this.usersService.findById(userId);
			if (!user) {
				this.logger.warn(
					`Password reset failed: Invalid token or user not found for userId: ${userId}`,
				);
				throw new BadRequestException("Invalid or expired token");
			}

			// Hash new password
			const hashedPassword = await bcrypt.hash(newPassword, 10);

			// Update the user's password
			await this.prismaService.user.update({
				where: { id: userId },
				data: { password: hashedPassword },
			});

			this.logger.log(`Password reset successfully for user ID: ${userId}`);

			return { success: true, message: "Password has been reset successfully" };
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			if (error instanceof Error) {
				this.logger.error(
					`Password reset failed: ${error.message}`,
					error.stack,
				);
			} else {
				this.logger.error(`Password reset failed: ${String(error)}`);
			}
			throw new BadRequestException("Invalid or expired token");
		}
	}
}
