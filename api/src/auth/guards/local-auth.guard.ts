import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../common/interfaces/jwt-payload.interface";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
	private readonly logger = new Logger(LocalAuthGuard.name);

	handleRequest<TUser = User>(
		err: Error | null,
		user: TUser | false,
		info: { message: string } | undefined,
	): TUser {
		if (err) {
			this.logger.error(`Authentication error: ${err.message}`, err.stack);
			throw err;
		}

		if (!user) {
			const errorMessage = info?.message || "Invalid credentials";
			this.logger.warn(`Authentication failed: ${errorMessage}`);
			throw new UnauthorizedException(errorMessage);
		}

		this.logger.debug("User authenticated successfully");
		return user as TUser;
	}
}