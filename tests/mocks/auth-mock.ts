import type { JwtPayload } from "../../api/src/common/interfaces/jwt-payload.interface";
import { Role } from "../../api/src/common/enums/roles.enum";

// Mock JWT payload
export const mockJwtPayload: JwtPayload = {
	sub: "mock-user-id",
	email: "test@example.com",
	roles: [Role.USER],
	iat: Math.floor(Date.now() / 1000),
	exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
	tokenType: "access",
};

// Mock refresh token payload
export const mockRefreshJwtPayload: JwtPayload = {
	sub: mockJwtPayload.sub,
	email: mockJwtPayload.email,
	roles: mockJwtPayload.roles,
	iat: mockJwtPayload.iat,
	exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Expires in 7 days
	tokenType: "refresh",
};

// Enhanced token generation with token type support
export const generateMockToken = (
	payload: Partial<JwtPayload> = mockJwtPayload,
	tokenType: "access" | "refresh" = "access",
): string => {
	const basePayload =
		tokenType === "access" ? mockJwtPayload : mockRefreshJwtPayload;
	const finalPayload = { ...basePayload, ...payload, tokenType };

	return `mock-jwt-${btoa(JSON.stringify(finalPayload))}`;
};

export const mockUser = {
	id: mockJwtPayload.sub,
	email: mockJwtPayload.email,
	firstName: "Test",
	lastName: "User",
	role: mockJwtPayload.roles,
	isActive: true,
	createdAt: new Date(),
	updatedAt: new Date(),
};

// Admin user mock
export const mockAdminUser = {
	id: "admin-user-id",
	email: "admin@example.com",
	firstName: "Admin",
	lastName: "User",
	role: [Role.ADMIN],
	isActive: true,
	createdAt: new Date(),
	updatedAt: new Date(),
};

// Example: Mock OAuth user
export const mockOAuthUser = {
	id: "oauth-user-id",
	email: "oauth@example.com",
	firstName: "OAuth",
	lastName: "User",
	provider: "google",
};

// Mock authentication helpers
export const mockAuthHelpers = {
	login: (
		userId: string = mockUser.id,
		roles: Role[] = [Role.USER],
	): { accessToken: string; refreshToken: string } => {
		const accessToken = generateMockToken({ sub: userId, roles }, "access");
		const refreshToken = generateMockToken({ sub: userId, roles }, "refresh");

		return { accessToken, refreshToken };
	},

	validateToken: (token: string): JwtPayload | null => {
		try {
			if (!token.startsWith("mock-jwt-")) return null;
			const payloadBase64 = token.replace("mock-jwt-", "");
			return JSON.parse(atob(payloadBase64));
		} catch {
			return null;
		}
	},

	getAuthHeader: (
		token: string = generateMockToken(),
	): { Authorization: string } => {
		return { Authorization: `Bearer ${token}` };
	},
};
