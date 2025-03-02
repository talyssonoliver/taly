import { SetMetadata } from "@nestjs/common";

export enum UserRole {
  ADMIN = "ADMIN",
  COMPANY_OWNER = "COMPANY_OWNER",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}

export const ROLES_KEY = "roles";

export const Roles = (...roles: UserRole[]) => {
  const uniqueRoles = Array.from(
    new Set(roles.length > 0 ? roles : [UserRole.CUSTOMER])
  );

  console.info(`Assigning roles to route: ${uniqueRoles.join(", ")}`);

  return SetMetadata(ROLES_KEY, uniqueRoles);
};
