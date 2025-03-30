import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { AppointmentStatus, Prisma } from "@prisma/client";
import addMinutes from "date-fns/addMinutes";
import { PaginatedResult } from "../common/interfaces/paginated-result.interface";
import { PaginationUtil } from "../common/utils/pagination.util";
import { PrismaService } from "../database/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { APPOINTMENT_CONSTANTS } from "./constants/appointment.constants";
import { AppointmentWhereInput } from "./dto/appointment-where.input";
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { Appointment } from "./interfaces/appointment.interface";
import { TimeSlot } from "./interfaces/time-slot.interface";
import { AppointmentRepository } from "./repositories/appointment.repository";

@Injectable()
export class AppointmentsService {
	private readonly logger = new Logger(AppointmentsService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly notificationsService: NotificationsService,
	) {}

	// =============== FIND METHODS ===============

	/**
	 * Find all appointments with pagination and filtering
	 */
	async findAllWithPagination(
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
			this.handleError("finding all appointments", error);
			throw error;
		}
	}

	/**
	 * Find appointment by ID
	 */
	async findById(id: string): Promise<Appointment | null> {
		try {
			return this.appointmentRepository.findById(id);
		} catch (error) {
			this.handleError(`finding appointment by ID: ${id}`, error);
			throw error;
		}
	}

	/**
	 * GraphQL-compatible method to find one appointment with relationships
	 */
	async findOne(id: string): Promise<Appointment> {
		try {
			const appointment = await this.prisma.appointment.findUnique({
				where: { id },
				include: {
					service: true,
					client: true,
					salon: true,
				},
			});

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			return appointment;
		} catch (error) {
			this.handleError(`finding appointment by ID: ${id}`, error);
			throw error;
		}
	}

	/**
	 * Find appointments by user ID with pagination and filtering
	 */
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

			const where: Prisma.AppointmentWhereInput = { clientId: userId };

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
			this.handleError(`finding appointments for user: ${userId}`, error);
			throw error;
		}
	}

	/**
	 * Find appointments by salon ID with pagination and filtering
	 */
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
			this.handleError(`finding appointments for salon: ${salonId}`, error);
			throw error;
		}
	}

	/**
	 * GraphQL-compatible method to find all appointments with complex filtering
	 */
	async findAll(params: AppointmentWhereInput): Promise<Appointment[]> {
		try {
			const where = this.buildWhereClause(params);

			return this.prisma.appointment.findMany({
				where,
				include: {
					service: true,
					client: true,
					salon: true,
				},
			});
		} catch (error: unknown) {
			this.handleError("finding appointments with filters", error);
			throw error;
		}
	}

	// =============== AVAILABILITY METHODS ===============

	/**
	 * Get available time slots for a service on a specific date
	 */
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

			if (!workingHours || workingHours.isClosed) {
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
				staffId,
			);

			return availableTimeSlots;
		} catch (error: unknown) {
			this.handleError("getting available time slots", error);
			throw error;
		}
	}

	/**
	 * Find available slots for a service on a specific date
	 */
	async findAvailableSlots(serviceId: string, date: Date): Promise<TimeSlot[]> {
		try {
			const service = await this.prisma.service.findUnique({
				where: { id: serviceId },
				include: { salon: true },
			});

			if (!service) {
				return [];
			}

			const duration = service.duration;
			const salonId = service.salonId;

			// Format date to YYYY-MM-DD string
			const dateStr = date.toISOString().split("T")[0];

			// Use existing method to get available time slots
			return await this.getAvailableTimeSlots(salonId, dateStr, serviceId);
		} catch (error: unknown) {
			this.handleError(
				`finding available slots for service: ${serviceId}`,
				error,
			);
			return [];
		}
	}

	// =============== CRUD OPERATIONS ===============

	/**
	 * Create a new appointment
	 */
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
				staffId: staffId || null, // Ensuring null for undefined staffId
				startTime: startDateTime,
				endTime: endDateTime,
				status: AppointmentStatus.SCHEDULED, // Using proper enum
				price: new Prisma.Decimal(service.price.toString()), // Convert to Decimal
				notes,
			});

			// Send appointment confirmation
			await this.notificationsService.sendAppointmentConfirmation({
				appointment,
				user: { id: userId },
				service,
			});

			// Create reminder for the appointment
			await this.createReminders(appointment.id, startDateTime);

			return appointment;
		} catch (error) {
			this.handleError("creating appointment", error);
			throw error;
		}
	}

	/**
	 * Update an appointment with validated data
	 */
	async update(
		id: string,
		updateAppointmentDto: UpdateAppointmentDto,
	): Promise<Appointment> {
		try {
			const appointment = await this.appointmentRepository.findById(id);
			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Check if the appointment is in a status that can be updated
			const allowedStatuses = [
				AppointmentStatus.PENDING,
				AppointmentStatus.CONFIRMED,
			];

			if (!allowedStatuses.includes(appointment.status)) {
				throw new BadRequestException(
					`Cannot update appointment with status ${appointment.status}`,
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
						appointment.id, // Exclude this appointment from availability check
					);

					if (!isAvailable) {
						throw new ConflictException("The new time slot is not available");
					}
				}

				// Update the appointment with the new service and end time
				return this.appointmentRepository.update(id, {
					...updateAppointmentDto,
					endTime,
					price: service.price
						? new Prisma.Decimal(service.price.toString()).toNumber()
						: null,
				});
			}

			// For other updates, just apply the changes directly
			return this.appointmentRepository.update(id, updateAppointmentDto);
		} catch (error: unknown) {
			this.handleError(`updating appointment with ID ${id}`, error);
			throw error;
		}
	}

	/**
	 * Delete an appointment
	 */
	async remove(id: string): Promise<void> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Delete reminders using utility method
			await this.removeRemindersForAppointment(id);

			// Delete appointment
			await this.appointmentRepository.delete(id);
		} catch (error) {
			this.handleError(`removing appointment: ${id}`, error);
			throw error;
		}
	}

	// =============== STATUS CHANGE METHODS ===============

	/**
	 * Reschedule an appointment
	 */
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
			if (this.isAppointmentFinalized(appointment.status)) {
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

			// Update reminders
			await this.removeRemindersForAppointment(id);
			await this.createReminders(id, newStartTime);

			// Send rescheduling notification
			await this.notificationsService.sendAppointmentReschedule({
				appointment: updatedAppointment,
				user: { id: appointment.userId },
				service,
			});

			return updatedAppointment;
		} catch (error) {
			this.handleError(`rescheduling appointment: ${id}`, error);
			throw error;
		}
	}

	/**
	 * Cancel an appointment
	 */
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
			if (this.isAppointmentFinalized(appointment.status)) {
				throw new BadRequestException(
					`Cannot cancel a ${appointment.status} appointment`,
				);
			}

			// Calculate cancellation fee based on policy
			const appointmentTime = new Date(appointment.startTime);
			const currentTime = new Date();
			const hoursDifference =
				(appointmentTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

			let cancellationFee = new Prisma.Decimal(0);
			const cancellationFeePercentage =
				APPOINTMENT_CONSTANTS.DEFAULT_CANCELLATION_FEE_PERCENTAGE;

			// Convert price to Decimal before calculating fee
			const price =
				typeof appointment.price === "number"
					? new Prisma.Decimal(appointment.price)
					: appointment.price;

			if (hoursDifference < APPOINTMENT_CONSTANTS.LATE_CANCELLATION_HOURS) {
				// Apply cancellation fee with proper Decimal handling
				cancellationFee = price
					.mul(new Prisma.Decimal(cancellationFeePercentage))
					.div(new Prisma.Decimal(100));
			}

			// Update appointment as cancelled
			const updatedAppointment = await this.appointmentRepository.update(id, {
				status: AppointmentStatus.CANCELLED,
				cancellationReason: cancelDto.reason,
				cancellationFee,
			});

			// Delete pending reminders
			await this.removeRemindersForAppointment(id);

			// Send cancellation notification
			await this.notificationsService.sendAppointmentCancellation({
				appointment: updatedAppointment,
				reason: cancelDto.reason,
				user: { id: appointment.userId },
			});

			return updatedAppointment;
		} catch (error) {
			this.handleError(`cancelling appointment: ${id}`, error);
			throw error;
		}
	}

	/**
	 * Confirm an appointment
	 */
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
			await this.notificationsService.sendAppointmentConfirmation({
				appointment: updatedAppointment,
				user: { id: appointment.userId },
			});

			return updatedAppointment;
		} catch (error) {
			this.handleError(`confirming appointment: ${id}`, error);
			throw error;
		}
	}

	/**
	 * Complete an appointment
	 */
	async complete(id: string): Promise<Appointment> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Check if appointment can be completed
			if (this.isAppointmentFinalized(appointment.status)) {
				throw new BadRequestException(
					`Cannot complete a ${appointment.status} appointment`,
				);
			}

			// Update appointment as completed
			const updatedAppointment = await this.appointmentRepository.update(id, {
				status: AppointmentStatus.COMPLETED,
			});

			// Delete all reminders using utility method
			await this.removeRemindersForAppointment(id);

			// Send feedback request
			await this.notificationsService.sendFeedbackRequest(appointment.userId, {
				appointment: updatedAppointment,
				user: { id: appointment.userId },
			});

			return updatedAppointment;
		} catch (error) {
			this.handleError(`completing appointment: ${id}`, error);
			throw error;
		}
	}

	/**
	 * Mark appointment as no-show
	 */
	async noShow(id: string): Promise<Appointment> {
		try {
			const appointment = await this.findById(id);

			if (!appointment) {
				throw new NotFoundException(`Appointment with ID ${id} not found`);
			}

			// Check if appointment can be marked as no-show
			if (this.isAppointmentFinalized(appointment.status)) {
				throw new BadRequestException(
					`Cannot mark a ${appointment.status} appointment as no-show`,
				);
			}

			// Calculate no-show fee based on policy with proper Decimal handling
			const noShowFeePercentage =
				APPOINTMENT_CONSTANTS.DEFAULT_NO_SHOW_FEE_PERCENTAGE;

			// Convert price to Decimal before calculating fee
			const price =
				typeof appointment.price === "number"
					? new Prisma.Decimal(appointment.price)
					: appointment.price;

			const noShowFee = price
				.mul(new Prisma.Decimal(noShowFeePercentage))
				.div(new Prisma.Decimal(100));

			// Update appointment as no-show
			const updatedAppointment = await this.appointmentRepository.update(id, {
				status: AppointmentStatus.NO_SHOW,
				noShowFee,
			});

			// Delete all reminders
			await this.removeRemindersForAppointment(id);

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
			this.handleError(`marking appointment as no-show: ${id}`, error);
			throw error;
		}
	}

	// =============== HELPER METHODS ===============

	/**
	 * Check if appointment status is finalized (completed, cancelled, or no-show)
	 */
	private isAppointmentFinalized(status: AppointmentStatus): boolean {
		return [
			AppointmentStatus.COMPLETED,
			AppointmentStatus.CANCELLED,
			AppointmentStatus.NO_SHOW,
		].includes(status);
	}

	/**
	 * Clean update data by removing fields that don't exist in schema
	 */
	private cleanUpdateData(data: any): void {
		// Remove fields that don't exist in schema
		delete data.reminder;
		delete data.cancellationFeePercentage;
		delete data.noShowFeePercentage;
	}

	/**
	 * Generate time slots for a given day and opening hours
	 */
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

	/**
	 * Filter time slots to only those that are available
	 */
	private async filterAvailableTimeSlots(
		timeSlots: Array<{ startTime: Date; endTime: Date }>,
		salonId: string,
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

	/**
	 * Check if a time slot is available
	 */
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
			const formattedStartTime = this.formatTimeForQuery(startTime);
			const formattedEndTime = this.formatTimeForQuery(endTime);

			// Check if staff is scheduled to work during the requested time slot
			const staffSchedule = await this.prisma.staffSchedule.findFirst({
				where: {
					staffId,
					dayOfWeek,
					startTime: {
						lte: formattedStartTime,
					},
					endTime: {
						gte: formattedEndTime,
					},
				},
			});

			// Instead of using staffTimeOff, check for unavailable time in staff schedule
			const hasTimeOff = await this.prisma.staffSchedule.findFirst({
				where: {
					staffId,
					dayOfWeek,
					startTime: {
						lte: formattedEndTime,
					},
					endTime: {
						gte: formattedStartTime,
					},
				},
			});

			if (!staffSchedule || hasTimeOff) {
				return false; // Staff is not available or has time off
			}
		}

		return conflictingAppointmentsCount === 0;
	}

	/**
	 * Format time for database queries
	 */
	private formatTimeForQuery(date: Date): string {
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${hours}:${minutes}`;
	}

	/**
	 * Remove reminders for an appointment
	 */
	private async removeRemindersForAppointment(
		appointmentId: string,
	): Promise<void> {
		try {
			await this.prisma.notification.deleteMany({
				where: {
					appointmentId,
					sent: false,
				},
			});
		} catch (error) {
			this.logger.warn(
				`Could not remove reminders for appointment: ${appointmentId}`,
				error instanceof Error ? error.stack : undefined,
			);
		}
	}

	/**
	 * Create reminders for an appointment
	 */
	private async createReminders(
		appointmentId: string,
		appointmentTime: Date,
	): Promise<void> {
		// Create reminders based on configuration
		const reminderTimes = [
			{ hours: 24, type: "EMAIL" }, // 24 hours before appointment
			{ hours: 2, type: "SMS" }, // 2 hours before appointment
		];

		try {
			const appointment = await this.prisma.appointment.findUnique({
				where: { id: appointmentId },
				include: {
					client: true,
					service: true,
					salon: true,
				},
			});

			if (!appointment) {
				this.logger.warn(
					`Cannot create reminders for non-existent appointment ${appointmentId}`,
				);
				return;
			}

			for (const reminder of reminderTimes) {
				const reminderTime = new Date(appointmentTime);
				reminderTime.setHours(reminderTime.getHours() - reminder.hours);

				// Only schedule reminders in the future
				if (reminderTime > new Date()) {
					await this.prisma.notification.create({
						data: {
							userId: appointment.userId,
							appointmentId,
							scheduledFor: reminderTime,
							type: reminder.type,
							title: `Appointment Reminder: ${appointment.service?.name || "Service"}`,
							content: `Your appointment at ${appointment.salon?.name || "the salon"} is scheduled for ${appointmentTime.toLocaleString()}`,
							sent: false,
						},
					});
				}
			}
		} catch (error) {
			this.logger.error(
				`Failed to create reminders for appointment ${appointmentId}`,
				error instanceof Error ? error.stack : undefined,
			);
		}
	}

	/**
	 * Helper method to build WHERE clause for GraphQL queries
	 */
	private buildWhereClause(
		params: AppointmentWhereInput,
	): Prisma.AppointmentWhereInput {
		const where: Prisma.AppointmentWhereInput = {};

		if (params.userId) {
			where.userId = params.userId;
		}

		if (params.salonId) {
			where.salonId = params.salonId;
		}

		if (params.clientId) {
			where.clientId = params.clientId;
		}

		if (params.serviceId) {
			where.serviceId = params.serviceId;
		}

		if (params.staffId) {
			where.staffId = params.staffId;
		}

		if (params.status) {
			where.status = params.status;
		}

		// Handle date range filters
		if (params.startDate && params.endDate) {
			where.startTime = {
				gte: new Date(params.startDate),
				lte: new Date(params.endDate),
			};
		} else if (params.startDate) {
			where.startTime = {
				gte: new Date(params.startDate),
			};
		} else if (params.endDate) {
			where.startTime = {
				lte: new Date(params.endDate),
			};
		}

		// Handle upcoming filter
		if (params.upcoming) {
			where.startTime = {
				...where.startTime,
				gte: new Date(),
			};
		}

		return where;
	}

	/**
	 * Helper method to validate date format
	 */
	private isValidDateFormat(date: string): boolean {
		// Simple regex for YYYY-MM-DD format
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(date)) return false;

		// Validate the date is actually valid
		const parsedDate = new Date(date);
		return !Number.isNaN(parsedDate.getTime());
	}

	/**
	 * Standardized error handling
	 */
	private handleError(operation: string, error: unknown): void {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		const errorStack = error instanceof Error ? error.stack : undefined;

		this.logger.error(`Error ${operation}: ${errorMessage}`, errorStack);
	}
}
