import { Injectable, Logger } from "@nestjs/common";
import type { PrismaService } from "../../database/prisma.service";
import type { CreateServiceDto } from "../dto/create-service.dto";
import type { UpdateServiceDto } from "../dto/update-service.dto";
import type { Service } from "@prisma/client";

// Define interface for salon information included with service
interface SalonInfo {
	id: string;
	name: string;
	ownerId?: string;
}

// Define the complete service entity with included relations
interface ServiceWithRelations extends Service {
	salon: SalonInfo;
}

interface ServiceWhereInput {
	id?: string | { equals?: string; in?: string[] };
	salonId?: string | { equals?: string };
	name?: string | { contains?: string; mode?: "insensitive" | "default" };
	price?: number | { gte?: number; lte?: number };
	[key: string]: unknown; // For other dynamic filters
}

interface ServiceOrderByInput {
	id?: "asc" | "desc";
	name?: "asc" | "desc";
	price?: "asc" | "desc";
	createdAt?: "asc" | "desc";
	updatedAt?: "asc" | "desc";
	[key: string]: "asc" | "desc" | undefined;
}

interface ServiceInclude {
	salon?:
		| boolean
		| { select?: { id?: boolean; name?: boolean; ownerId?: boolean } };
}

// Define repository method parameter interfaces
interface FindManyOptions {
	skip?: number;
	take?: number;
	where?: ServiceWhereInput;
	orderBy?: ServiceOrderByInput | ServiceOrderByInput[];
	include?: ServiceInclude;
}

interface CountOptions {
	where?: ServiceWhereInput;
}

@Injectable()
export class ServiceRepository {
	private readonly logger = new Logger(ServiceRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findMany(options: FindManyOptions): Promise<ServiceWithRelations[]> {
		try {
			const { skip, take, where, orderBy, include } = options;

			return this.prisma.service.findMany({
				skip,
				take,
				where,
				orderBy: orderBy || { createdAt: "desc" },
				include: include || {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}) as Promise<ServiceWithRelations[]>;
		} catch (error) {
			this.logger.error(
				`Error finding services: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async count(options: CountOptions): Promise<number> {
		try {
			const { where } = options;

			return this.prisma.service.count({
				where,
			});
		} catch (error) {
			this.logger.error(
				`Error counting services: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findById(id: string): Promise<ServiceWithRelations | null> {
		try {
			return this.prisma.service.findUnique({
				where: { id },
				include: {
					salon: {
						select: {
							id: true,
							name: true,
							ownerId: true,
						},
					},
				},
			}) as Promise<ServiceWithRelations | null>;
		} catch (error) {
			this.logger.error(
				`Error finding service by ID ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findByIdForSalon(
		id: string,
		salonId: string,
	): Promise<ServiceWithRelations | null> {
		try {
			return this.prisma.service.findFirst({
				where: {
					id,
					salonId,
				},
				include: {
					salon: {
						select: {
							id: true,
							name: true,
							ownerId: true,
						},
					},
				},
			}) as Promise<ServiceWithRelations | null>;
		} catch (error) {
			this.logger.error(
				`Error finding service by ID ${id} for salon ${salonId}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async create(
		data: CreateServiceDto & { salonId: string },
	): Promise<ServiceWithRelations> {
		try {
			return this.prisma.service.create({
				data,
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}) as Promise<ServiceWithRelations>;
		} catch (error) {
			this.logger.error(
				`Error creating service: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async update(
		id: string,
		data: UpdateServiceDto,
	): Promise<ServiceWithRelations> {
		try {
			return this.prisma.service.update({
				where: { id },
				data,
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}) as Promise<ServiceWithRelations>;
		} catch (error) {
			this.logger.error(
				`Error updating service ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async delete(id: string): Promise<ServiceWithRelations> {
		try {
			return this.prisma.service.delete({
				where: { id },
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}) as Promise<ServiceWithRelations>;
		} catch (error) {
			this.logger.error(
				`Error deleting service ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}
}
