import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

/**
 * A decorator to extract the IP address from the request object.
 * Supports standard and proxy-based headers (e.g., X-Forwarded-For).
 *
 * Example usage:
 * @Get('track')
 * trackUser(@RequestIp() ip: string) {
 *   return `User's IP address is ${ip}`;
 * }
 */
export const RequestIp = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.ip ||
      request.headers["x-forwarded-for"]?.split(",")[0] ||
      "Unknown IP"
    );
  }
);
