import { Injectable, Logger } from "@nestjs/common";
import type { PrismaService } from "../../database/prisma.service";
import type { CreateUserDto } from "../dto/create-user.dto";
import type { UpdateUserDto } from "../dto/update-user.dto";
import type { User } from "../interfaces/user.interface";

interface FindOptions {
	skip?: number;
	take?: number;
	where?: Record<string, unknown>;
	orderBy?: Record<string, unknown>;
	include?: Record<string, boolean>;
}

@Injectable()
export class UserRepository {
	private readonly logger = new Logger(UserRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Find multiple users with pagination and filtering
	 * @param options - Query options including pagination, filters, and sorting
	 * @returns Array of users matching the criteria
	 */
	async findMany(options: FindOptions): Promise<User[]> {
		return this.executeWithErrorHandling("finding users", () =>
			this.prisma.user.findMany({
				...options,
				orderBy: options.orderBy || { createdAt: "desc" },
			}),
		);
	}

	/**
	 * Count users with optional filtering
	 * @param where - Filter criteria
	 * @returns Total count of users matching the criteria
	 */
	async count(where?: Record<string, unknown>): Promise<number> {
		return this.executeWithErrorHandling("counting users", () =>
			this.prisma.user.count({ where }),
		);
	}

	/**
	 * Find a user by ID with staff relation
	 * @param id - User ID
	 * @returns User with staff information or null if not found
	 */
	async findById(id: string): Promise<User | null> {
		return this.executeWithErrorHandling("finding user by ID", () =>
			this.prisma.user.findUnique({
				where: { id },
				include: { staff: true },
			}),
		);
	}

	/**
	 * Find a user by email with staff relation
	 * @param email - User email
	 * @returns User with staff information or null if not found
	 */
	async findByEmail(email: string): Promise<User | null> {
		return this.executeWithErrorHandling("finding user by email", () =>
			this.prisma.user.findUnique({
				where: { email },
				include: { staff: true },
			}),
		);
	}

	/**
	 * Create a new user
	 * @param data - User creation data
	 * @returns Created user
	 */
	async create(data: CreateUserDto): Promise<User> {
		return this.executeWithErrorHandling("creating user", () =>
			this.prisma.user.create({ data }),
		);
	}

	/**
	 * Update an existing user
	 * @param id - User ID
	 * @param data - Updated user data
	 * @returns Updated user
	 */
	async update(id: string, data: Partial<UpdateUserDto>): Promise<User> {
		return this.executeWithErrorHandling("updating user", () =>
			this.prisma.user.update({
				where: { id },
				data,
			}),
		);
	}

	/**
	 * Delete a user
	 * @param id - User ID
	 * @returns Deleted user
	 */
	async delete(id: string): Promise<User> {
		return this.executeWithErrorHandling("deleting user", () =>
			this.prisma.user.delete({
				where: { id },
			}),
		);
	}

	/**
	 * Find users with staff role and include staff relation
	 * @param options - Query options
	 * @returns Array of staff users with their staff information
	 */
	async findWithStaff(options: FindOptions): Promise<User[]> {
		return this.executeWithErrorHandling("finding users with staff", () =>
			this.prisma.user.findMany({
				...options,
				where: {
					...options.where,
					role: "staff",
				},
				orderBy: options.orderBy || { createdAt: "desc" },
				include: { staff: true },
			}),
		);
	}

	/**
	 * Execute a database operation with consistent error handling
	 * @param operation - Description of the operation for error logging
	 * @param callback - Database operation to execute
	 * @returns Result of the operation
	 */
	private async executeWithErrorHandling<T>(
		operation: string,
		callback: () => Promise<T>,
	): Promise<T> {
		try {
			return await callback();
		} catch (error) {
			this.logger.error(`Error ${operation}: ${error.message}`, error.stack);
			throw error;
		}
	}
}
