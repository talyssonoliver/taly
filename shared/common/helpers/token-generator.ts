import { Logger } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

const logger = new Logger("TokenGenerator");

/**
 * Generate a JWT token with the provided payload and secret
 *
 * @param payload - The data to encode in the token
 * @param secret - The secret key used to sign the token
 * @param expiresIn - Token expiration time in seconds or string format (e.g., '1h', '7d')
 * @returns The generated JWT token
 */
export function generateToken(
	payload: Record<string, unknown>,
	secret: string,
	expiresIn: string | number = "1h",
): string {
	try {
		return jwt.sign(payload, secret, { expiresIn });
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Token generation failed";
		logger.error(`Failed to generate token: ${message}`);
		throw new Error(`Token generation failed: ${message}`);
	}
}

/**
 * Verify and decode a JWT token
 *
 * @param token - The JWT token to verify and decode
 * @param secret - The secret key used to sign the token
 * @returns The decoded token payload
 */
export function verifyToken<T extends Record<string, unknown>>(
	token: string,
	secret: string,
): T {
	try {
		return jwt.verify(token, secret) as T;
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Token verification failed";
		logger.error(`Failed to verify token: ${message}`);
		throw new Error(`Token verification failed: ${message}`);
	}
}

/**
 * Generate a random token string of specified length
 *
 * @param length - The desired length of the token
 * @returns A random string token
 */
export function generateRandomToken(length = 32): string {
	try {
		const bytes = new Uint8Array(Math.ceil(length / 2));
		crypto.getRandomValues(bytes);
		return Array.from(bytes)
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("")
			.substring(0, length);
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Random token generation failed";
		logger.error(`Failed to generate random token: ${message}`);
		throw new Error(`Random token generation failed: ${message}`);
	}
}

/**
 * Create an email verification token
 *
 * @param userId - The user ID to encode in the token
 * @param email - The email address to encode in the token
 * @param secret - The secret key used to sign the token
 * @returns The generated email verification token
 */
export function createEmailVerificationToken(
	userId: string,
	email: string,
	secret: string,
): string {
	return generateToken(
		{ userId, email, purpose: "email_verification" },
		secret,
		"24h",
	);
}

/**
 * Create a password reset token
 *
 * @param userId - The user ID to encode in the token
 * @param secret - The secret key used to sign the token
 * @returns The generated password reset token
 */
export function createPasswordResetToken(
	userId: string,
	secret: string,
): string {
	return generateToken({ userId, purpose: "password_reset" }, secret, "1h");
}
