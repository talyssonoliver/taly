import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {
		const jwtSecret = configService.get<string>("JWT_SECRET");

		if (!jwtSecret) {
			throw new Error("JWT_SECRET is not defined in environment variables");
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		});

		this.logger.log("JWT authentication strategy initialized");
	}

	async validate(payload: JwtPayload) {
		try {
			const user = await this.prismaService.user.findUnique({
				where: { id: payload.sub },
			});

			if (!user || !user.isActive) {
				this.logger.warn(
					`Authentication failed: User ${payload.sub} not found or inactive`,
				);
				throw new UnauthorizedException("User not found or inactive");
			}

			this.logger.debug(`User ${user.email} authenticated successfully`);

			// Return only necessary information
			return {
				sub: payload.sub,
				email: payload.email,
				role: payload.roles,
			};
		} catch (error) {
			this.logger.error(`JWT validation error: ${error.message}`);
			throw error;
		}
	}
}
