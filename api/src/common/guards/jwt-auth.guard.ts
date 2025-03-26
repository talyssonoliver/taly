import {
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../../users/interfaces/user.interface";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		// Check if route is public
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		// Check JWT
		return super.canActivate(context);
	}

	handleRequest<TUser = User>(
		err: Error | null,
		user: TUser | false,
		info: { message: string } | undefined,
	): TUser {
		if (err) {
			this.logger.error(`JWT authentication error: ${err.message}`, err.stack);
			throw err;
		}

		if (!user) {
			this.logger.warn(
				`JWT authentication failed: ${info?.message || "Invalid token"}`,
			);
			throw new UnauthorizedException(info?.message || "Invalid token");
		}

		this.logger.debug(
			`JWT authenticated successfully for user ID: ${(user).id}`,
		);
		return user as TUser;
	}
}
