import { Injectable, Logger } from "@nestjs/common";
import type { PrismaService } from "../../database/prisma.service";
import type { WorkingHoursDto } from "../dto/working-hours.dto";
import type { DayOfWeek } from "../entities/working-hours.entity";

@Injectable()
export class WorkingHoursRepository {
	private readonly logger = new Logger(WorkingHoursRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Find working hours for a specific salon
	 * @param salonId - The salon identifier
	 */
	async findBySalonId(salonId: string) {
		try {
			return this.prisma.workingHours.findMany({
				where: { salonId },
				orderBy: {
					// Order by day of the week (Monday first)
					dayOfWeek: "asc",
				},
			});
		} catch (error) {
			this.logger.error(
				`Error finding working hours for salon: ${salonId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Create new working hours
	 */
	async create(data: WorkingHoursDto & { salonId: string }) {
		try {
			return this.prisma.workingHours.create({
				data,
			});
		} catch (error) {
			this.logger.error('Error creating working hours', error);
			throw error;
		}
	}

	/**
	 * Update existing working hours
	 */
	async update(id: string, data: Partial<WorkingHoursDto>) {
		try {
			return this.prisma.workingHours.update({
				where: { id },
				data,
			});
		} catch (error) {
			this.logger.error(`Error updating working hours: ${id}`, error);
			throw error;
		}
	}

	/**
	 * Delete working hours by ID
	 */
	async delete(id: string) {
		try {
			return this.prisma.workingHours.delete({
				where: { id },
			});
		} catch (error) {
			this.logger.error(`Error deleting working hours: ${id}`, error);
			throw error;
		}
	}

	/**
	 * Delete all working hours for a salon
	 */
	async deleteBySalonId(salonId: string) {
		try {
			return this.prisma.workingHours.deleteMany({
				where: { salonId },
			});
		} catch (error) {
			this.logger.error(
				`Error deleting working hours for salon: ${salonId}`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Upsert working hours for a specific day
	 */
	async upsertWorkingHours(
		salonId: string,
		dayOfWeek: DayOfWeek,
		data: WorkingHoursDto,
	) {
		try {
			const existingHours = await this.prisma.workingHours.findFirst({
				where: {
					salonId,
					dayOfWeek,
				},
			});

			if (existingHours) {
				return this.prisma.workingHours.update({
					where: { id: existingHours.id },
					data,
				});
			}
			
			return this.prisma.workingHours.create({
				data: {
					...data,
					salonId,
					dayOfWeek,
				},
			});
		} catch (error) {
			this.logger.error(
				`Error upserting working hours for salon: ${salonId}, day: ${dayOfWeek}`,
				error,
			);
			throw error;
		}
	}
}
