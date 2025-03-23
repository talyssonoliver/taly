import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { addMinutes } from "date-fns/addMinutes";
import { AppointmentStatus } from "../common/enums/appointment-status.enum";
import { PaginatedResult } from "../common/interfaces/paginated-result.interface";
import { PaginationUtil } from "../common/utils/pagination.util";
import { SalonsService } from "../companies/salons.service";
import { PrismaService } from "../database/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { APPOINTMENT_CONSTANTS } from "./constants/appointment.constants";
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { Appointment } from "./interfaces/appointment.interface";
import { TimeSlot } from "./interfaces/time-slot.interface";
import { AppointmentRepository } from "./repositories/appointment.repository";
import { TimeSlotRepository } from "./repositories/time-slot.repository";

@Injectable()
export class AppointmentsService {
	private readonly logger = new Logger(AppointmentsService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly timeSlotRepository: TimeSlotRepository,
		private readonly notificationsService: NotificationsService,
		private readonly salonsService: SalonsService,
	) {}

	async findAll(
		page: number,
		limit: number,
		options: {
			status?: AppointmentStatus;
			startDate?: string;
			endDate?: string;
			salonId?: string;
		} = {},
	): Promise<PaginatedResult<Appointment>> {
		try {
			const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
			const { status, startDate, endDate, salonId } = options;

			// Build filter
			const where: Prisma.AppointmentWhereInput = {};

			if (status) {
				where.status = status;
			}

			if (startDate && endDate) {
				where.startTime = {
					gte: new Date(startDate),
					lte: new Date(endDate),
				};
			} else if (startDate) {
				where.startTime = {
					gte: new Date(startDate),
				};
			} else if (endDate) {
				where.startTime = {
					lte: new Date(endDate),
				};
			}

			if (salonId) {
				where.salonId = salonId;
			}

			const [appointments, total] = await Promise.all([
				this.appointmentRepository.findMany({ skip, take, where }),
				this.appointmentRepository.count({ where }),
			]);

			return PaginationUtil.createPaginatedResult(
				appointments,
				total,
				page,
				limit,
			);
		} catch (error) {
			this.logger.error(`Error finding all appointments: ${error.message}`);
			throw error;
		}
	}

	async findById(id: string): Promise<Appointment | null> {
		try {
			return this.appointmentRepository.findById(id);
		} catch (error) {
			this.logger.error(`Error finding appointment by ID: ${error.message}`);
			throw error;
		}
	}

	async findByUserId(
		userId: string,
		page: number,
		limit: number,
		options: {
			status?: AppointmentStatus;
			upcoming?: boolean;
		} = {},
	): Promise<PaginatedResult<Appointment>> {
		try {
			const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
			const { status, upcoming } = options;

			// Build filter
			const where: Prisma.AppointmentWhereInput = { userId };

			if (status) {
				where.status = status;
			}

			if (upcoming) {
				where.startTime = {
					gte: new Date(),
				};
			}

			const [appointments, total] = await Promise.all([
				this.appointmentRepository.findMany({
					skip,
					take,
					where,
					orderBy: { startTime: upcoming ? "asc" : "desc" },
				}),
				this.appointmentRepository.count({ where }),
			]);

			return PaginationUtil.createPaginatedResult(
				appointments,
				total,
				page,
				limit,
			);
		} catch (error) {
			this.logger.error(
				`Error finding appointments for user: ${error.message}`,
			);
			throw error;
		}
	}

	async findBySalonId(
		salonId: string,
		page: number,
		limit: number,
		options: {
			status?: AppointmentStatus;
			startDate?: string;
			endDate?: string;
		} = {},
	): Promise<PaginatedResult<Appointment>> {
		try {
			const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
			const { status, startDate, endDate } = options;

			// Build filter
			const where: Prisma.AppointmentWhereInput = { salonId };

			if (status) {
				where.status = status;
			}

			if (startDate && endDate) {
				where.startTime = {
					gte: new Date(startDate),
					lte: new Date(endDate),
				};
			} else if (startDate) {
				where.startTime = {
					gte: new Date(startDate),
				};
			} else if (endDate) {
				where.startTime = {
					lte: new Date(endDate),
				};
			}

			const [appointments, total] = await Promise.all([
				this.appointmentRepository.findMany({ skip, take, where }),
				this.appointmentRepository.count({ where }),
			]);

			return PaginationUtil.createPaginatedResult(
				appointments,
				total,
				page,
				limit,
			);
		} catch (error) {
			this.logger.error(
				`Error finding appointments for salon: ${error.message}`,
			);
			throw error;
		}
	}

	async getAvailableTimeSlots(
		salonId: string,
		date: string,
		serviceId: string,
		staffId?: string,
	): Promise<TimeSlot[]> {
		try {
			// Validate date format
			if (!this.isValidDateFormat(date)) {
				throw new BadRequestException(
					"Invalid date format. Expected YYYY-MM-DD",
				);
			}

			// Get service details
			const service = await this.prisma.service.findFirst({
				where: { id: serviceId, salonId, isActive: true },
			});

			if (!service) {
				throw new NotFoundException(
					`Service with ID ${serviceId} not found for salon with ID ${salonId}`,
				);
			}

			// Get salon working hours for the day
			const dateObj = new Date(date);
			const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ...

			const workingHours = await this.prisma.workingHours.findFirst({
				where: { salonId, dayOfWeek },
			});

			if (!workingHours || !workingHours.isOpen) {
				return []; // Salon is closed on this day
			}

			// Generate time slots
			const timeSlots = this.generateTimeSlots(
				dateObj,
				workingHours.openTime,
				workingHours.closeTime,
				service.duration,
			);

			// Filter available time slots
			const availableTimeSlots = await this.filterAvailableTimeSlots(
				timeSlots,
				salonId,
				service.duration,
				staffId,
			);

			return availableTimeSlots;
		} catch (error) {
			this.logger.error(`Error getting available time slots: ${error.message}`);
			throw error;
		}
	}

	async create(
		createAppointmentDto: CreateAppointmentDto,
		userId: string,
	): Promise<Appointment> {
		try {
			const { salonId, serviceId, startTime, staffId, notes } =
				createAppointmentDto;

			// Check if salon and service exist
			const service = await this.prisma.service.findFirst({
				where: { id: serviceId, salonId, isActive: true },
			});

			if (!service) {
				throw new NotFoundException(
					`Service with ID ${serviceId} not found for salon with ID ${salonId}`,
				);
			}

			// Calculate end time based on service duration
			const startDateTime = new Date(startTime);
			const endDateTime = addMinutes(startDateTime, service.duration);

			// Validate the time slot is available
			const isAvailable = await this.isTimeSlotAvailable(
				salonId,
				startDateTime,
				endDateTime,
				staffId,
			);

			if (!isAvailable) {
				throw new ConflictException("The selected time slot is not available.");
			}

			// Create appointment
			const appointment = await this.appointmentRepository.create({
				userId,
				salonId,
				serviceId,
				staffId,
				startTime: startDateTime,
				endTime: endDateTime,
				status: AppointmentStatus.SCHEDULED,
				price: service.price,
				notes,
			});

			// Send appointment confirmation
			await this.notificationsService.sendAppointmentConfirmation(userId, {
				appointment,
				user: { id: userId },
				service,
			});

			// Create reminder for the appointment
			await this.createReminders(appointment.id, startDateTime);

			return appointment;
		} catch (error) {
			this.logger.error(`Error creating appointment: ${error.message}`);
			throw error;
		}
	}

	async update(
		id: string,
		updateAppointmentDto: UpdateAppointmentDto,
	): Promise<Appointment> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Validate if appointment can be updated
			if (
				appointment.status === AppointmentStatus.COMPLETED ||
				appointment.status === AppointmentStatus.CANCELLED ||
				appointment.status === AppointmentStatus.NO_SHOW
			) {
				throw new BadRequestException(
					`Cannot update a ${appointment.status} appointment`,
				);
			}

			// If notes is the only field being updated, just update notes
			if (
				Object.keys(updateAppointmentDto).length === 1 &&
				updateAppointmentDto.notes !== undefined
			) {
				return this.appointmentRepository.update(id, {
					notes: updateAppointmentDto.notes,
				});
			}

			// If changing service, validate and recalculate times
			if (updateAppointmentDto.serviceId) {
				const service = await this.prisma.service.findFirst({
					where: {
						id: updateAppointmentDto.serviceId,
						salonId: appointment.salonId,
						isActive: true,
					},
				});

				if (!service) {
					throw new NotFoundException(
						`Service with ID ${updateAppointmentDto.serviceId} not found for this salon`,
					);
				}

				// Recalculate end time
				const endTime = addMinutes(appointment.startTime, service.duration);

				// Check if the new time slot is available (only if service changed)
				if (service.id !== appointment.serviceId) {
					const isAvailable = await this.isTimeSlotAvailable(
						appointment.salonId,
						appointment.startTime,
						endTime,
						appointment.staffId,
						appointment.id, // Exclude current appointment
					);

					if (!isAvailable) {
						throw new ConflictException(
							"The new service duration conflicts with existing appointments.",
						);
					}
				}

				// Update with new service and end time
				return this.appointmentRepository.update(id, {
					...updateAppointmentDto,
					endTime,
					price: service.price,
				});
			}

			// Update appointment without changing times
			return this.appointmentRepository.update(id, updateAppointmentDto);
		} catch (error) {
			this.logger.error(`Error updating appointment: ${error.message}`);
			throw error;
		}
	}

	async reschedule(
		id: string,
		rescheduleDto: RescheduleAppointmentDto,
	): Promise<Appointment> {
		try {
			const { startTime, staffId } = rescheduleDto;
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Validate if appointment can be rescheduled
			if (
				appointment.status === AppointmentStatus.COMPLETED ||
				appointment.status === AppointmentStatus.CANCELLED ||
				appointment.status === AppointmentStatus.NO_SHOW
			) {
				throw new BadRequestException(
					`Cannot reschedule a ${appointment.status} appointment`,
				);
			}

			// Get the service to calculate end time
			const service = await this.prisma.service.findUnique({
				where: { id: appointment.serviceId },
			});

			if (!service) {
				throw new NotFoundException("Service for this appointment not found");
			}

			// Calculate new end time
			const newStartTime = new Date(startTime);
			const newEndTime = addMinutes(newStartTime, service.duration);

			// Validate the new time slot is available
			const isAvailable = await this.isTimeSlotAvailable(
				appointment.salonId,
				newStartTime,
				newEndTime,
				staffId || appointment.staffId,
				appointment.id, // Exclude current appointment
			);

			if (!isAvailable) {
				throw new ConflictException("The selected time slot is not available.");
			}

			// Update appointment with new times and status
			const updatedAppointment = await this.appointmentRepository.update(id, {
				startTime: newStartTime,
				endTime: newEndTime,
				staffId: staffId || appointment.staffId,
				status: AppointmentStatus.RESCHEDULED,
			});

			// Update reminders for the new time
			await this.prisma.reminder.deleteMany({ where: { appointmentId: id } });
			await this.createReminders(id, newStartTime);

			// Send rescheduling notification
			await this.notificationsService.sendAppointmentReschedule(
				appointment.userId,
				{
					appointment: updatedAppointment,
					user: { id: appointment.userId },
					service,
				},
			);

			return updatedAppointment;
		} catch (error) {
			this.logger.error(`Error rescheduling appointment: ${error.message}`);
			throw error;
		}
	}

	async cancel(
		id: string,
		cancelDto: CancelAppointmentDto,
	): Promise<Appointment> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Check if appointment is already cancelled or completed
			if (
				appointment.status === AppointmentStatus.CANCELLED ||
				appointment.status === AppointmentStatus.COMPLETED ||
				appointment.status === AppointmentStatus.NO_SHOW
			) {
				throw new BadRequestException(
					`Cannot cancel a ${appointment.status} appointment`,
				);
			}

			// Calculate cancellation fee based on salon policy
			const salon = await this.salonsService.findById(appointment.salonId);
			const appointmentTime = new Date(appointment.startTime);
			const currentTime = new Date();
			const hoursDifference =
				(appointmentTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

			let cancellationFee = 0;
			if (hoursDifference < APPOINTMENT_CONSTANTS.LATE_CANCELLATION_HOURS) {
				// Apply cancellation fee
				cancellationFee =
					(appointment.price *
						(salon.cancellationFeePercentage ||
							APPOINTMENT_CONSTANTS.DEFAULT_CANCELLATION_FEE_PERCENTAGE)) /
					100;
			}

			// Update appointment as cancelled
			const updatedAppointment = await this.appointmentRepository.update(id, {
				status: AppointmentStatus.CANCELLED,
				cancellationReason: cancelDto.reason,
				cancellationFee,
			});

			// Delete pending reminders
			await this.prisma.reminder.deleteMany({
				where: { appointmentId: id, sent: false },
			});

			// Send cancellation notification
			await this.notificationsService.sendAppointmentCancellation(
				appointment.userId,
				{
					appointment: updatedAppointment,
					reason: cancelDto.reason,
					user: { id: appointment.userId },
				},
			);

			return updatedAppointment;
		} catch (error) {
			this.logger.error(`Error cancelling appointment: ${error.message}`);
			throw error;
		}
	}

	async confirm(id: string): Promise<Appointment> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Check if appointment can be confirmed
			if (
				appointment.status !== AppointmentStatus.SCHEDULED &&
				appointment.status !== AppointmentStatus.PENDING
			) {
				throw new BadRequestException(
					`Cannot confirm a ${appointment.status} appointment`,
				);
			}

			// Update appointment as confirmed
			const updatedAppointment = await this.appointmentRepository.update(id, {
				status: AppointmentStatus.CONFIRMED,
			});

			// Send confirmation notification
			await this.notificationsService.sendAppointmentConfirmation(
				appointment.userId,
				{
					appointment: updatedAppointment,
					user: { id: appointment.userId },
				},
			);

			return updatedAppointment;
		} catch (error) {
			this.logger.error(`Error confirming appointment: ${error.message}`);
			throw error;
		}
	}

	async complete(id: string): Promise<Appointment> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Check if appointment can be completed
			if (
				appointment.status === AppointmentStatus.COMPLETED ||
				appointment.status === AppointmentStatus.CANCELLED ||
				appointment.status === AppointmentStatus.NO_SHOW
			) {
				throw new BadRequestException(
					`Cannot complete a ${appointment.status} appointment`,
				);
			}

			// Update appointment as completed
			const updatedAppointment = await this.appointmentRepository.update(id, {
				status: AppointmentStatus.COMPLETED,
			});

			// Delete all reminders
			await this.prisma.reminder.deleteMany({ where: { appointmentId: id } });

			// Send feedback request
			await this.notificationsService.sendFeedbackRequest(appointment.userId, {
				appointment: updatedAppointment,
				user: { id: appointment.userId },
			});

			return updatedAppointment;
		} catch (error) {
			this.logger.error(`Error completing appointment: ${error.message}`);
			throw error;
		}
	}

	async noShow(id: string): Promise<Appointment> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Check if appointment can be marked as no-show
			if (
				appointment.status === AppointmentStatus.COMPLETED ||
				appointment.status === AppointmentStatus.CANCELLED ||
				appointment.status === AppointmentStatus.NO_SHOW
			) {
				throw new BadRequestException(
					`Cannot mark a ${appointment.status} appointment as no-show`,
				);
			}

			// Calculate no-show fee based on salon policy
			const salon = await this.salonsService.findById(appointment.salonId);
			const noShowFee =
				(appointment.price *
					(salon.noShowFeePercentage ||
						APPOINTMENT_CONSTANTS.DEFAULT_NO_SHOW_FEE_PERCENTAGE)) /
				100;

			// Update appointment as no-show
			const updatedAppointment = await this.appointmentRepository.update(id, {
				status: AppointmentStatus.NO_SHOW,
				noShowFee,
			});

			// Delete all reminders
			await this.prisma.reminder.deleteMany({ where: { appointmentId: id } });

			// Send no-show notification
			await this.notificationsService.sendNoShowNotification(
				appointment.userId,
				{
					appointment: updatedAppointment,
					user: { id: appointment.userId },
				},
			);

			return updatedAppointment;
		} catch (error) {
			this.logger.error(
				`Error marking appointment as no-show: ${error.message}`,
			);
			throw error;
		}
	}

	async remove(id: string): Promise<void> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Delete reminders
			await this.prisma.reminder.deleteMany({ where: { appointmentId: id } });

			// Delete appointment
			await this.appointmentRepository.delete(id);
		} catch (error) {
			this.logger.error(`Error removing appointment: ${error.message}`);
			throw error;
		}
	}

	// Helper methods
	private generateTimeSlots(
		date: Date,
		openTime: string,
		closeTime: string,
		serviceDuration: number,
	): Array<{ startTime: Date; endTime: Date }> {
		const timeSlots = [];
		const [openHour, openMinute] = openTime.split(":").map(Number);
		const [closeHour, closeMinute] = closeTime.split(":").map(Number);

		// Create Date objects for opening and closing times
		const openDateTime = new Date(date);
		openDateTime.setHours(openHour, openMinute, 0, 0);

		const closeDateTime = new Date(date);
		closeDateTime.setHours(closeHour, closeMinute, 0, 0);

		// Generate time slots with the specified interval
		const interval = APPOINTMENT_CONSTANTS.TIME_SLOT_INTERVAL_MINUTES;
		let currentTime = new Date(openDateTime);

		while (addMinutes(currentTime, serviceDuration) <= closeDateTime) {
			// Only add future time slots
			if (currentTime > new Date()) {
				timeSlots.push({
					startTime: new Date(currentTime),
					endTime: addMinutes(currentTime, serviceDuration),
				});
			}

			currentTime = addMinutes(currentTime, interval);
		}

		return timeSlots;
	}

	private async filterAvailableTimeSlots(
		timeSlots: Array<{ startTime: Date; endTime: Date }>,
		salonId: string,
		serviceDuration: number,
		staffId?: string,
	): Promise<TimeSlot[]> {
		const availableTimeSlots: TimeSlot[] = [];

		for (const slot of timeSlots) {
			const isAvailable = await this.isTimeSlotAvailable(
				salonId,
				slot.startTime,
				slot.endTime,
				staffId,
			);

			availableTimeSlots.push({
				startTime: slot.startTime,
				endTime: slot.endTime,
				isAvailable: isAvailable,
			} as TimeSlot);
		}

		return availableTimeSlots.filter((slot) => slot.isAvailable);
	}

	private async isTimeSlotAvailable(
		salonId: string,
		startTime: Date,
		endTime: Date,
		staffId?: string,
		excludeAppointmentId?: string,
	): Promise<boolean> {
		// Check existing appointments
		const where: Prisma.AppointmentWhereInput = {
			salonId,
			status: {
				in: [
					AppointmentStatus.SCHEDULED,
					AppointmentStatus.CONFIRMED,
					AppointmentStatus.RESCHEDULED,
				],
			},
			OR: [
				// Starts during the requested slot
				{
					startTime: {
						gte: startTime,
						lt: endTime,
					},
				},
				// Ends during the requested slot
				{
					endTime: {
						gt: startTime,
						lte: endTime,
					},
				},
				// Encompasses the requested slot
				{
					startTime: {
						lte: startTime,
					},
					endTime: {
						gte: endTime,
					},
				},
			],
		};

		// Add staff filter if provided
		if (staffId) {
			where.staffId = staffId;
		}

		// Exclude current appointment if provided
		if (excludeAppointmentId) {
			where.id = {
				not: excludeAppointmentId,
			};
		}

		const conflictingAppointmentsCount = await this.appointmentRepository.count(
			{ where },
		);

		// Check staff availability if staffId is provided
		if (staffId) {
			const dayOfWeek = startTime.getDay();
			const startHour = startTime.getHours();
			const startMinute = startTime.getMinutes();
			const formattedStartTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;

			const endHour = endTime.getHours();
			const endMinute = endTime.getMinutes();
			const formattedEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

			// Check if staff is scheduled to work during the requested time slot
			const staffSchedule = await this.prisma.staffSchedule.findFirst({
				where: {
					staffId,
					salonId,
					dayOfWeek,
					isUnavailable: false,
					startTime: {
						lte: formattedStartTime,
					},
					endTime: {
						gte: formattedEndTime,
					},
				},
			});

			// Check if staff has marked time off during the requested slot
			const timeOff = await this.prisma.staffSchedule.findFirst({
				where: {
					staffId,
					salonId,
					isUnavailable: true,
					dayOfWeek,
					startTime: {
						lte: formattedEndTime,
					},
					endTime: {
						gte: formattedStartTime,
					},
				},
			});

			if (!staffSchedule || timeOff) {
				return false; // Staff is not available or has time off
			}
		}

		return conflictingAppointmentsCount === 0;
	}

	private async createReminders(
		appointmentId: string,
		appointmentTime: Date,
	): Promise<void> {
		// Create reminders based on configuration
		const reminderTimes = [
			{ hours: 24, type: "EMAIL" }, // 24 hours before appointment
			{ hours: 2, type: "SMS" }, // 2 hours before appointment
		];

		for (const reminder of reminderTimes) {
			const reminderTime = new Date(appointmentTime);
			reminderTime.setHours(reminderTime.getHours() - reminder.hours);

			if (reminderTime > new Date()) {
				await this.prisma.reminder.create({
					data: {
						appointmentId,
						reminderTime,
						sent: false,
						type: reminder.type,
					},
				});
			}
		}
	}

	// Helper method to validate date format
	private isValidDateFormat(date: string): boolean {
		// Simple regex for YYYY-MM-DD format
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(date)) return false;

		// Validate the date is actually valid
		const parsedDate = new Date(date);
		return !Number.isNaN(parsedDate.getTime());
	}
}
