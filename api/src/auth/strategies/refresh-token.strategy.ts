import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {
	ExtractJwt,
	Strategy,
	type StrategyOptionsWithRequest,
} from "passport-jwt";
import type { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import type { UsersService } from "../../users/users.service";
import type { JwtPayload } from "../../common/interfaces/jwt-payload.interface";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	"refresh-token",
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey:
				configService.get<string>("JWT_REFRESH_SECRET") ||
				configService.get<string>("JWT_SECRET"),
			ignoreExpiration: false,
			passReqToCallback: true,
		} as StrategyOptionsWithRequest);
	}

	async validate(req: Request, payload: JwtPayload) {
		if (payload.tokenType !== "refresh") {
			throw new UnauthorizedException("Invalid token type");
		}

		const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

		if (!refreshToken) {
			throw new UnauthorizedException("Refresh token not found");
		}

		const user = await this.usersService.findById(payload.sub);

		if (!user) {
			throw new UnauthorizedException("User not found");
		}

		if (!user.isActive) {
			throw new UnauthorizedException("User is inactive");
		}

		return {
			...user,
			refreshToken,
		};
	}
}
