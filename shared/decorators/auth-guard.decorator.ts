import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../../../../shared/guards/roles.guard";

/**
 * A decorator that applies both authentication and role-based guards
 * to a route or controller. This ensures the route is protected by JWT
 * authentication and that role-based access control is enforced.
 *
 * Example usage:
 * @Authenticated()
 * @Get('protected')
 * getProtectedData() {
 *   return 'This is a protected resource.';
 * }
 */
export function Authenticated() {
  return applyDecorators(UseGuards(AuthGuard("jwt"), RolesGuard));
}
