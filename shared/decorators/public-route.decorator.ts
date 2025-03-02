import { SetMetadata } from "@nestjs/common";

/**
 * A decorator to mark a route as publicly accessible, bypassing authentication.
 * When used with a global authentication guard, routes with this decorator
 * will not require a valid JWT token.
 *
 * Example usage:
 * @PublicRoute()
 * @Get('public')
 * getPublicData() {
 *   return 'This is a public resource.';
 * }
 */
export const IS_PUBLIC_KEY = "isPublic";
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
