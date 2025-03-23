import { Injectable, Logger } from "@nestjs/common";
import type { PrismaService } from "../../database/prisma.service";
import type {
	TimeSlotOrderByInput,
	TimeSlotUpdateInput,
	TimeSlotWhereInput,
} from "../interfaces/time-slot-query.interface";

@Injectable()
export class TimeSlotRepository {
	private readonly logger = new Logger(TimeSlotRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findMany(options: {
		skip?: number;
		take?: number;
		where?: TimeSlotWhereInput;
		orderBy?: TimeSlotOrderByInput;
	}) {
		try {
			const { skip, take, where, orderBy } = options;

			return this.prisma.timeSlot.findMany({
				skip,
				take,
				where,
				orderBy: orderBy || { startTime: "asc" },
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
					staff: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							email: true,
							phone: true,
						},
					},
				},
			});
		} catch (error) {
			this.logger.error(`Error finding time slots: ${error.message}`);
			throw error;
		}
	}

	async count(options: { where?: TimeSlotWhereInput }) {
		try {
			const { where } = options;

			return this.prisma.timeSlot.count({
				where,
			});
		} catch (error) {
			this.logger.error(`Error counting time slots: ${error.message}`);
			throw error;
		}
	}

	async findById(id: string) {
		try {
			return this.prisma.timeSlot.findUnique({
				where: { id },
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
					staff: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							email: true,
							phone: true,
						},
					},
				},
			});
		} catch (error) {
			this.logger.error(`Error finding time slot by ID: ${error.message}`);
			throw error;
		}
	}

	async create(data: {
		salonId: string;
		startTime: Date;
		endTime: Date;
		staffId?: string;
		isAvailable?: boolean;
		notes?: string;
	}) {
		try {
			return this.prisma.timeSlot.create({
				data,
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
					staff: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							email: true,
							phone: true,
						},
					},
				},
			});
		} catch (error) {
			this.logger.error(`Error creating time slot: ${error.message}`);
			throw error;
		}
	}

	async update(id: string, data: TimeSlotUpdateInput) {
		try {
			return this.prisma.timeSlot.update({
				where: { id },
				data,
				include: {
					salon: {
						select: {
							id: true,
							name: true,
						},
					},
					staff: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							email: true,
							phone: true,
						},
					},
				},
			});
		} catch (error) {
			this.logger.error(`Error updating time slot: ${error.message}`);
			throw error;
		}
	}

	async delete(id: string) {
		try {
			return this.prisma.timeSlot.delete({
				where: { id },
			});
		} catch (error) {
			this.logger.error(`Error deleting time slot: ${error.message}`);
			throw error;
		}
	}

	async findOverlappingTimeSlots(
		salonId: string,
		startTime: Date,
		endTime: Date,
		staffId?: string,
		excludeId?: string,
	) {
		try {
			return this.prisma.timeSlot.findMany({
				where: {
					salonId,
					isAvailable: false,
					OR: [
						{
							startTime: {
								gte: startTime,
								lt: endTime,
							},
						},
						{
							endTime: {
								gt: startTime,
								lte: endTime,
							},
						},
						{
							startTime: {
								lte: startTime,
							},
							endTime: {
								gte: endTime,
							},
						},
					],
					...(staffId && { staffId }),
					...(excludeId && { id: { not: excludeId } }),
				},
			});
		} catch (error) {
			this.logger.error(
				`Error finding overlapping time slots: ${error.message}`,
			);
			throw error;
		}
	}

	async findAvailableTimeSlots(salonId: string, date: Date, staffId?: string) {
		try {
			const startOfDay = new Date(date);
			startOfDay.setHours(0, 0, 0, 0);

			const endOfDay = new Date(date);
			endOfDay.setHours(23, 59, 59, 999);

			return this.prisma.timeSlot.findMany({
				where: {
					salonId,
					isAvailable: true,
					startTime: {
						gte: startOfDay,
						lte: endOfDay,
					},
					...(staffId && { staffId }),
				},
				orderBy: {
					startTime: "asc",
				},
			});
		} catch (error) {
			this.logger.error(`Error finding available time slots: ${error.message}`);
			throw error;
		}
	}

	async blockTimeSlot(id: string) {
		try {
			return this.prisma.timeSlot.update({
				where: { id },
				data: {
					isAvailable: false,
				},
			});
		} catch (error) {
			this.logger.error(`Error blocking time slot: ${error.message}`);
			throw error;
		}
	}

	async generateTimeSlotsForSalon(
		salonId: string,
		startDate: Date,
		endDate: Date,
		staffIds: string[],
	) {
		this.logger.log(
			`Generating time slots for salon ${salonId} from ${startDate} to ${endDate}`,
		);
	}
}
