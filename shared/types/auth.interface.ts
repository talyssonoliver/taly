import { User } from "./user.interface";

export interface JwtPayload {
	sub: string; // User ID
	email: string;
	roles: string[];
	iat?: number; // Issued at timestamp
	exp?: number; // Expiration timestamp
	tokenType?: string;
}

export interface RefreshToken {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	createdAt: Date;

	// Relations - optional, used for includes
	user?: User;
}

export interface PasswordReset {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	createdAt: Date;
}

export interface TokenResponse {
	accessToken: string;
	refreshToken?: string;
	expiresIn: string;
	user: {
		id: string;
		email: string;
		firstName: string;
		lastName?: string;
		role: string;
	};
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	firstName: string;
	lastName?: string;
}

export interface OAuthUser {
	email: string;
	firstName: string;
	lastName: string;
	provider: string;
	providerId: string;
	photo?: string;
}
