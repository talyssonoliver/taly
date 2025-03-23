import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import * as crypto from "node:crypto";
import type { PrismaService } from "../database/prisma.service";

interface TokenPayload {
	sub: string;
	email: string;
	role?: string;
}

@Injectable()
export class TokenService {
	private readonly logger = new Logger(TokenService.name);

	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {}

	async generateTokens(user: { id: string; email: string; role?: string }) {
		const payload: TokenPayload = {
			sub: user.id,
			email: user.email,
			role: user.role,
		};

		// Generate access token
		const accessToken = this.jwtService.sign(payload, {
			secret: this.configService.get<string>("JWT_SECRET"),
			expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
		});

		// Generate refresh token
		const refreshToken = this.jwtService.sign(payload, {
			secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
			expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN", "7d"),
		});

		// Save refresh token hash to database
		const refreshTokenHash = crypto
			.createHash("sha256")
			.update(refreshToken)
			.digest("hex");

		await this.prismaService.refreshToken.upsert({
			where: { userId: user.id },
			update: {
				token: refreshTokenHash,
				expires: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
				),
			},
			create: {
				userId: user.id,
				token: refreshTokenHash,
				expires: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
				),
			},
		});

		this.logger.log(`Tokens generated for user: ${user.email}`);

		return {
			accessToken,
			refreshToken,
		};
	}

	async refreshTokens(refreshToken: string) {
		try {
			// Verify the refresh token
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
			});

			// Find user in database
			const user = await this.prismaService.user.findUnique({
				where: { id: payload.sub },
			});

			if (!user) {
				this.logger.warn(
					`Token refresh failed: user not found for token payload: ${JSON.stringify(payload)}`,
				);
				throw new UnauthorizedException("Invalid refresh token");
			}

			// Verify that the refresh token exists in the database
			const refreshTokenHash = crypto
				.createHash("sha256")
				.update(refreshToken)
				.digest("hex");

			const storedToken = await this.prismaService.refreshToken.findFirst({
				where: {
					userId: user.id,
					token: refreshTokenHash,
					expires: { gt: new Date() },
				},
			});

			if (!storedToken) {
				this.logger.warn(
					`Token refresh failed: invalid or expired token for user: ${user.email}`,
				);
				throw new UnauthorizedException("Invalid or expired refresh token");
			}

			// Generate new tokens
			const tokens = await this.generateTokens(user);
			this.logger.log(`Tokens refreshed for user: ${user.email}`);
			return tokens;
		} catch (error) {
			this.logger.error(`Token refresh failed: ${error.message}`);
			throw new UnauthorizedException("Invalid refresh token");
		}
	}
}
