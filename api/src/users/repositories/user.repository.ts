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
}

@Injectable()
export class UserRepository {
	private readonly logger = new Logger(UserRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Find multiple users with pagination and filtering
	 */
	async findMany(options: FindOptions): Promise<User[]> {
		try {
			const { skip, take, where, orderBy } = options;
			return await this.prisma.user.findMany({
				skip,
				take,
				where,
				orderBy: orderBy || { createdAt: "desc" },
			});
		} catch (error) {
			this.logger.error(`Error finding users: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Count users with optional filtering
	 */
	async count(options: { where?: Record<string, unknown> }): Promise<number> {
		try {
			const { where } = options;
			return this.prisma.user.count({ where });
		} catch (error) {
			this.logger.error(`Error counting users: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Find a user by ID with staff relation
	 */
	async findById(id: string): Promise<User | null> {
		try {
			return this.prisma.user.findUnique({
				where: { id },
				include: { staff: true },
			});
		} catch (error) {
			this.logger.error(
				`Error finding user by ID: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	/**
	 * Find a user by email with staff relation
	 */
	async findByEmail(email: string): Promise<User | null> {
		try {
			return this.prisma.user.findUnique({
				where: { email },
				include: { staff: true },
			});
		} catch (error) {
			this.logger.error(
				`Error finding user by email: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	/**
	 * Create a new user
	 */
	async create(data: CreateUserDto): Promise<User> {
		try {
			return this.prisma.user.create({ data });
		} catch (error) {
			this.logger.error(`Error creating user: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Update an existing user
	 */
	async update(id: string, data: Partial<UpdateUserDto>): Promise<User> {
		try {
			return this.prisma.user.update({
				where: { id },
				data,
			});
		} catch (error) {
			this.logger.error(`Error updating user: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Delete a user
	 */
	async delete(id: string): Promise<User> {
		try {
			return this.prisma.user.delete({
				where: { id },
			});
		} catch (error) {
			this.logger.error(`Error deleting user: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Find users with staff role and include staff relation
	 */
	async findWithStaff(options: FindOptions): Promise<User[]> {
		try {
			const { skip, take, where, orderBy } = options;

			return this.prisma.user.findMany({
				skip,
				take,
				where: {
					...where,
					role: "staff",
				},
				orderBy: orderBy || { createdAt: "desc" },
				include: {
					staff: true,
				},
			});
		} catch (error) {
			this.logger.error(
				`Error finding users with staff: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}
}
