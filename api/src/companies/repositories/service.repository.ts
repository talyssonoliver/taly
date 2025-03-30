import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreateServiceDto } from "../dto/create-service.dto";
import { UpdateServiceDto } from "../dto/update-service.dto";

// Define interfaces for the Service repository
export interface ServiceInclude {
	staff?: boolean;
	salon?: boolean;
}

export interface CountOptions {
	where?: Prisma.ServiceWhereInput;
}

export interface FindManyOptions {
	skip?: number;
	take?: number;
	where?: Prisma.ServiceWhereInput;
	orderBy?: Prisma.ServiceOrderByWithRelationInput;
	include?: ServiceInclude;
}

export interface ServiceWithRelations {
	id: string;
	name: string;
	description?: string;
	duration: number;
	price: number | string | { toNumber(): number }; // Support for Prisma Decimal
	salonId: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	staff?: {
		id: string;
		bio?: string;
		position?: string;
		user: {
			firstName: string;
			lastName: string;
			profileImage?: string;
		};
	}[];
}

/**
 * Helper function to convert Prisma result to ServiceWithRelations
 */
function convertToServiceWithRelations(service: any): ServiceWithRelations {
	// Convert Decimal to number
	const price =
		typeof service.price === "object" && "toNumber" in service.price
			? service.price.toNumber()
			: Number(service.price);

	return {
		...service,
		price,
	};
}

@Injectable()
export class ServiceRepository {
	private readonly logger = new Logger(ServiceRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findMany(options: FindManyOptions): Promise<ServiceWithRelations[]> {
		try {
			const { skip, take, where, orderBy, include } = options;

			const services = await this.prisma.service.findMany({
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
			});

			// Convert Prisma results to ServiceWithRelations
			return services.map(convertToServiceWithRelations);
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
			const service = await this.prisma.service.findUnique({
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
			});

			if (!service) return null;

			// Convert to ServiceWithRelations
			return convertToServiceWithRelations(service);
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
			const service = await this.prisma.service.findFirst({
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
			});

			if (!service) return null;

			// Convert to ServiceWithRelations
			return convertToServiceWithRelations(service);
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
			const service = await this.prisma.service.create({
				data,
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			// Convert to ServiceWithRelations
			return convertToServiceWithRelations(service);
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
			const service = await this.prisma.service.update({
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
			});

			// Convert to ServiceWithRelations
			return convertToServiceWithRelations(service);
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
			const service = await this.prisma.service.delete({
				where: { id },
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			// Convert to ServiceWithRelations
			return convertToServiceWithRelations(service);
		} catch (error) {
			this.logger.error(
				`Error deleting service ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}
}
