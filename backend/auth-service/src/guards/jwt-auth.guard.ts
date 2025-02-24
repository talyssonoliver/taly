import {
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Reflector } from "@nestjs/core";
import { Observable, firstValueFrom } from "rxjs";
import type { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivateResult = super.canActivate(context);

    if (canActivateResult instanceof Observable) {
      return firstValueFrom(canActivateResult);
    }

    return canActivateResult;
  }

  handleRequest<TUser = JwtPayload>(
    err: Error | null,
    user: TUser | null,
    info: Record<string, unknown>,
    context: ExecutionContext,
    status?: number
  ): TUser {
    if (err) {
      console.error("JWT Authentication Error:", err);
      throw new UnauthorizedException("Invalid token or unauthorized access");
    }

    if (!user) {
      console.warn("JWT Authentication Warning:", {
        info,
        contextType: context.getType(),
        status,
      });
      throw new UnauthorizedException("User not found or unauthorized");
    }

    return user;
  }
}
