import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentStatus } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { PaginatedResult } from "../common/interfaces/paginated-result.interface";
import { UserWithoutPassword } from "../users/interfaces/user.interface";
import { AppointmentsService } from "./appointments.service";
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { AppointmentWhereInput } from './dto/appointment-where.input';
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { Appointment } from "./interfaces/appointment.interface";
import { TimeSlot } from "./interfaces/time-slot.interface";

@Resolver(() => AppointmentResponseDto)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsResolver {
	constructor(private readonly appointmentsService: AppointmentsService) {}

	@Query(() => [AppointmentResponseDto], { name: 'appointments' })
	@Roles(Role.ADMIN, Role.STAFF)
	async findAll(
		@Args('where', { nullable: true }) where?: AppointmentWhereInput
	): Promise<AppointmentResponseDto[]> {
		const appointments = await this.appointmentsService.findAll(where || {});
		return appointments.map(appointment => 
			AppointmentResponseDto.fromEntity(appointment)
		);
	}

	@Query(() => AppointmentResponseDto, { name: 'appointment' })
	async findOne(
		@Args('id') id: string,
		@CurrentUser() user: UserWithoutPassword,
	): Promise<AppointmentResponseDto> {
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new Error(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to access this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new Error("You are not authorized to access this appointment");
		}

		return AppointmentResponseDto.fromEntity(appointment);
	}

	@Query("myAppointments")
	async getMyAppointments(
		@CurrentUser() user: UserWithoutPassword,
		@Args('page', { nullable: true, defaultValue: 1 }) page: number,
		@Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
		@Args('status', { nullable: true }) status?: AppointmentStatus,
		@Args('upcoming', { nullable: true }) upcoming?: boolean,
	): Promise<PaginatedResult<Appointment>> {
		return this.appointmentsService.findByUserId(user.id, page, limit, {
			status,
			upcoming,
		});
	}

	@Query("salonAppointments")
	@Roles(Role.ADMIN, Role.STAFF)
	async getSalonAppointments(
		@Args('salonId') salonId: string,
		@Args('page', { nullable: true, defaultValue: 1 }) page: number,
		@Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
		@Args('status', { nullable: true }) status?: AppointmentStatus,
		@Args('startDate', { nullable: true }) startDate?: string,
		@Args('endDate', { nullable: true }) endDate?: string,
	): Promise<PaginatedResult<Appointment>> {
		return this.appointmentsService.findBySalonId(salonId, page, limit, {
			status,
			startDate,
			endDate,
		});
	}

	@Query("availableTimeSlots")
	async getAvailableTimeSlots(
		@Args('salonId') salonId: string,
		@Args('date') date: string,
		@Args('serviceId') serviceId: string,
		@Args('staffId', { nullable: true }) staffId?: string,
	): Promise<TimeSlot[]> {
		return this.appointmentsService.getAvailableTimeSlots(
			salonId,
			date,
			serviceId,
			staffId,
		);
	}

	@Mutation(() => AppointmentResponseDto)
	async createAppointment(
		@Args('createAppointmentInput') createAppointmentDto: CreateAppointmentDto,
		@CurrentUser() user: UserWithoutPassword,
	): Promise<AppointmentResponseDto> {
		const appointment = await this.appointmentsService.create(createAppointmentDto, user.id);
		return AppointmentResponseDto.fromEntity(appointment);
	}

	@Mutation(() => AppointmentResponseDto)
	async updateAppointment(
		@Args('id') id: string,
		@Args('updateAppointmentInput') updateAppointmentDto: UpdateAppointmentDto,
		@CurrentUser() user: UserWithoutPassword,
	): Promise<AppointmentResponseDto> {
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new Error(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to update this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new Error("You are not authorized to update this appointment");
		}

		const updatedAppointment = await this.appointmentsService.update(id, updateAppointmentDto);
		return AppointmentResponseDto.fromEntity(updatedAppointment);
	}

	@Mutation("rescheduleAppointment")
	async rescheduleAppointment(
		@Args('id') id: string,
		@Args('input') rescheduleAppointmentDto: RescheduleAppointmentDto,
		@CurrentUser() user: UserWithoutPassword,
	): Promise<Appointment> {
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new Error(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to reschedule this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new Error("You are not authorized to reschedule this appointment");
		}

		return this.appointmentsService.reschedule(id, rescheduleAppointmentDto);
	}

	@Mutation("cancelAppointment")
	async cancelAppointment(
		@Args('id') id: string,
		@Args('input') cancelAppointmentDto: CancelAppointmentDto,
		@CurrentUser() user: UserWithoutPassword,
	): Promise<Appointment> {
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new Error(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to cancel this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new Error("You are not authorized to cancel this appointment");
		}

		return this.appointmentsService.cancel(id, cancelAppointmentDto);
	}

	@Mutation('confirmAppointment')
	@Roles(Role.ADMIN, Role.STAFF)
	async confirmAppointment(@Args('id') id: string): Promise<Appointment> {
		return this.appointmentsService.confirm(id);
	}

	@Mutation('completeAppointment')
	@Roles(Role.ADMIN, Role.STAFF)
	async completeAppointment(@Args('id') id: string): Promise<Appointment> {
		return this.appointmentsService.complete(id);
	}

	@Mutation('markNoShow')
	@Roles(Role.ADMIN, Role.STAFF)
	async markNoShow(@Args('id') id: string): Promise<Appointment> {
		return this.appointmentsService.noShow(id);
	}

	@Mutation(() => AppointmentResponseDto)
	@Roles(Role.ADMIN)
	async removeAppointment(@Args('id') id: string): Promise<AppointmentResponseDto> {
		const appointment = await this.appointmentsService.remove(id);
		return AppointmentResponseDto.fromEntity(appointment);
	}
}
