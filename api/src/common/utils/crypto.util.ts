import * as crypto from "node:crypto";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_SALT_ROUNDS = 10;
const DEFAULT_ITERATIONS = 10000;
const DEFAULT_KEYLEN = 64;
const DEFAULT_DIGEST = "sha512";

/**
 * Hashes a password using bcrypt
 * @param password Plain text password
 * @param saltRounds Number of salt rounds (default: 10)
 * @returns Hashed password
 */
export async function hashPassword(
	password: string,
	saltRounds: number = DEFAULT_SALT_ROUNDS,
): Promise<string> {
	return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password
 * @param password Plain text password
 * @param hash Hashed password
 * @returns True if password matches hash, false otherwise
 */
export async function comparePassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * Generates a random token
 * @returns Random token (UUID)
 */
export function generateToken(): string {
	return uuidv4();
}

/**
 * Generates a secure random string
 * @param length Length of the string (default: 32)
 * @returns Secure random string
 */
export function generateSecureRandomString(length = 32): string {
	return crypto.randomBytes(length).toString("hex").substring(0, length);
}

/**
 * Creates a hash of data using PBKDF2
 * @param data Data to hash
 * @param salt Salt to use (will be generated if not provided)
 * @param iterations Number of iterations (default: 10000)
 * @param keylen Key length (default: 64)
 * @param digest Digest algorithm (default: sha512)
 * @returns Object containing the hash and salt
 */
export async function createHash(
	data: string,
	salt?: string,
	iterations: number = DEFAULT_ITERATIONS,
	keylen: number = DEFAULT_KEYLEN,
	digest: string = DEFAULT_DIGEST,
): Promise<{ hash: string; salt: string }> {
	// Generate salt if not provided
	const usedSalt = salt || crypto.randomBytes(16).toString("hex");

	return new Promise((resolve, reject) => {
		crypto.pbkdf2(
			data,
			usedSalt,
			iterations,
			keylen,
			digest,
			(err, derivedKey) => {
				if (err) {
					reject(err);
				} else {
					resolve({
						hash: derivedKey.toString("hex"),
						salt: usedSalt,
					});
				}
			},
		);
	});
}

/**
 * Verifies a hash against data
 * @param data Data to verify
 * @param hash Hash to verify against
 * @param salt Salt used to create the hash
 * @param iterations Number of iterations (default: 10000)
 * @param keylen Key length (default: 64)
 * @param digest Digest algorithm (default: sha512)
 * @returns True if data matches hash, false otherwise
 */
export async function verifyHash(
	data: string,
	hash: string,
	salt: string,
	iterations: number = DEFAULT_ITERATIONS,
	keylen: number = DEFAULT_KEYLEN,
	digest: string = DEFAULT_DIGEST,
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(data, salt, iterations, keylen, digest, (err, derivedKey) => {
			if (err) {
				reject(err);
			} else {
				resolve(derivedKey.toString("hex") === hash);
			}
		});
	});
}
