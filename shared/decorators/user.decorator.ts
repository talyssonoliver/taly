import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { User } from "../../../../shared/validation/schemas/user.schema";

interface CurrentUserOptions {
  key?: keyof User;
  defaultValue?: User[keyof User] | null;
}

export const CurrentUser = createParamDecorator(
  (data: CurrentUserOptions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      console.warn("No user found in the request object.");
      return data?.defaultValue ?? null;
    }

    if (data?.key && !Object.keys(user).includes(data.key)) {
      console.warn(`Invalid user property requested: ${data.key}`);
      return data?.defaultValue ?? null;
    }

    return data?.key ? (user[data.key] ?? data?.defaultValue) : user;
  }
);

// Example usage in a controller
// @Get()
// getProfile(@CurrentUser() user: User) {
//   return user;
// }

// @Get("email")
// getUserEmail(@CurrentUser({ key: "email", defaultValue: "No email provided" }) email: string) {
//   return `The email of the current user is ${email}`;
// }
