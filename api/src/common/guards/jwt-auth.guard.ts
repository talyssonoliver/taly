import {
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

interface JwtUser {
	id: string;
	email: string;
	role: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		return super.canActivate(context);
	}

	handleRequest<TUser extends JwtUser>(
		err: unknown,
		user: TUser | undefined,
		info: Error | undefined,
		context: ExecutionContext,
	): TUser {
		const request: Request = context.switchToHttp().getRequest();

		if (err || !user) {
			const errorMessage = info?.message || "Unauthorized access";
			this.logger.warn(
				`Failed authentication attempt: ${errorMessage} - IP: ${request.ip}, Path: ${request.path}`,
			);
			throw err || new UnauthorizedException(errorMessage);
		}

		this.logger.log(
			`User ${user.email || user.id} authenticated successfully - IP: ${request.ip}, Path: ${request.path}`,
		);

		return user;
	}
}
