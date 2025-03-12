import { Injectable, Logger } from "@nestjs/common";
import type { PrismaService } from "../../database/prisma.service";
import type { CreateServiceDto } from "../dto/create-service.dto";
import type { UpdateServiceDto } from "../dto/update-service.dto";
import type { Prisma } from "@prisma/client";

// Define Service type based on Prisma's generated types
type Service = Prisma.ServiceGetPayload<{
	include: {
		salon: {
			select: {
				id: true;
				name: true;
				ownerId?: true;
			};
		};
	};
}>;

interface FindManyOptions {
	skip?: number;
	take?: number;
	where?: Prisma.ServiceWhereInput;
	orderBy?: Prisma.ServiceOrderByWithRelationInput;
	include?: Prisma.ServiceInclude;
}

interface CountOptions {
	where?: Prisma.ServiceWhereInput;
}

@Injectable()
export class ServiceRepository {
	private readonly logger = new Logger(ServiceRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findMany(options: FindManyOptions): Promise<Service[]> {
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
			});
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

	async findById(id: string): Promise<Service | null> {
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
			});
		} catch (error) {
			this.logger.error(
				`Error finding service by ID ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findByIdForSalon(id: string, salonId: string): Promise<Service | null> {
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
			});
		} catch (error) {
			this.logger.error(
				`Error finding service by ID ${id} for salon ${salonId}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async create(data: CreateServiceDto & { salonId: string }): Promise<Service> {
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
			});
		} catch (error) {
			this.logger.error(
				`Error creating service: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async update(id: string, data: UpdateServiceDto): Promise<Service> {
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
			});
		} catch (error) {
			this.logger.error(
				`Error updating service ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async delete(id: string): Promise<Service> {
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
			});
		} catch (error) {
			this.logger.error(
				`Error deleting service ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}
}
