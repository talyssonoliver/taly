import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import type { User } from "../../users/interfaces/user.interface";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(LocalStrategy.name);

	constructor(private readonly authService: AuthService) {
		super({
			usernameField: "email",
			passwordField: "password",
		});
	}

	async validate(
		email: string,
		password: string,
	): Promise<Omit<User, "password">> {
		try {
			const user = await this.authService.validateUser(email, password);

			if (!user) {
				this.logger.warn(`Login failed for email: ${email}`);
				throw new UnauthorizedException("Invalid credentials");
			}

			this.logger.debug(`User ${email} authenticated successfully`);
			return user;
		} catch (error: unknown) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}

			if (error instanceof Error) {
				this.logger.error(
					`Local validation error: ${error.message}`,
					error.stack,
				);
			} else {
				this.logger.error(`Local validation error: ${String(error)}`);
			}

			throw new UnauthorizedException("Authentication failed");
		}
	}
}
