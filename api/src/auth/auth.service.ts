import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import type { PrismaService } from "../database/prisma.service";
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
	) {}

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
			return await this.prismaService.$transaction(
				async (tx: Prisma.TransactionClient) => {
					const user = await tx.user.create({
						data: {
							email: registerDto.email,
							password: hashedPassword,
							firstName: registerDto.firstName,
							lastName: registerDto.lastName,
							role: "USER",
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
				},
			);
		} catch (error) {
			if (error instanceof ConflictException) {
				throw error;
			}
			this.logger.error(`Registration failed: ${error.message}`, error.stack);
			throw new InternalServerErrorException("Registration failed");
		}
	}

	async login(loginDto: LoginDto) {
		try {
			// Find user
			const user = await this.prismaService.user.findUnique({
				where: { email: loginDto.email },
			});

			// Check if user exists and password is correct
			if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
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
			this.logger.error(`Login failed: ${error.message}`, error.stack);
			throw new InternalServerErrorException("Login failed");
		}
	}

	async refreshTokens(refreshTokenDto: RefreshTokenDto) {
		try {
			return await this.tokenService.refreshTokens(
				refreshTokenDto.refreshToken,
			);
		} catch (error) {
			this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
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
			this.logger.error(`Logout failed: ${error.message}`, error.stack);
			throw new InternalServerErrorException("Logout failed");
		}
	}
}
