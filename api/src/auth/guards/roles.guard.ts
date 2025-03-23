import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>("roles", context.getHandler());
		if (!roles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		return user && user.roles && this.matchRoles(roles, user.roles);
	}

	private matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
		return requiredRoles.some((role) => userRoles.includes(role));
	}
}
