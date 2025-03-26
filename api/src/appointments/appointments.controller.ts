import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	HttpStatus,
	Logger,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import { AppointmentStatus } from "@prisma/client";
import { Request } from "express";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { PaginationUtil } from "../common/utils/pagination.util";
import { UserWithoutPassword } from "../users/interfaces/user.interface";
import { AppointmentsService } from "./appointments.service";
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";

// Define pagination DTO to separate from filters
class PaginationDto {
	@ApiQuery({ name: "page", required: false, type: Number })
	page?: string = "1";

	@ApiQuery({ name: "limit", required: false, type: Number })
	limit?: string = "10";
}

// Define interface for query parameters
interface AppointmentQuery extends PaginationDto {
	status?: AppointmentStatus;
	startDate?: string;
	endDate?: string;
	salonId?: string;
	upcoming?: boolean;
}

interface AvailableSlotsQuery {
	date: string;
	serviceId: string;
	staffId?: string;
}

@ApiTags("Appointments")
@Controller("appointments")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AppointmentsController {
	private readonly logger = new Logger(AppointmentsController.name);

	constructor(private readonly appointmentsService: AppointmentsService) {}

	@Get()
	@ApiOperation({ summary: "Get all appointments" })
	@ApiQuery({ name: "page", required: false, type: Number })
	@ApiQuery({ name: "limit", required: false, type: Number })
	@ApiQuery({ name: "status", required: false, enum: AppointmentStatus })
	@ApiQuery({ name: "startDate", required: false, type: String })
	@ApiQuery({ name: "endDate", required: false, type: String })
	@Roles(Role.ADMIN, Role.STAFF)
	async findAll(@Query() query: AppointmentQuery) {
		const {
			page = "1",
			limit = "10",
			...filters
		} = query;

		this.logger.log("Finding all appointments");
		const { page: pageNum, limit: limitNum } =
			PaginationUtil.normalizePaginationParams(page, limit);
			
		return this.appointmentsService.findAllWithPagination(pageNum, limitNum, filters);
	}

	@Get("me")
	@ApiOperation({ summary: "Get current user appointments" })
	@ApiQuery({ name: "page", required: false, type: Number })
	@ApiQuery({ name: "limit", required: false, type: Number })
	@ApiQuery({ name: "status", required: false, enum: AppointmentStatus })
	async findMyAppointments(@Query() query: AppointmentQuery, @Req() req: Request) {
		const { page = "1", limit = "10", ...filters } = query;
		const user = req.user as UserWithoutPassword;

		this.logger.log(`Finding appointments for user ID: ${user.id}`);
		const { page: pageNum, limit: limitNum } =
			PaginationUtil.normalizePaginationParams(page, limit);
		return this.appointmentsService.findByUserId(user.id, pageNum, limitNum, filters);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get appointment by ID" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	async findOne(@Param("id") id: string, @Req() req: Request) {
		const user = req.user as UserWithoutPassword;

		this.logger.log(`Finding appointment with ID: ${id}`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to access this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new ForbiddenException(
				"You are not authorized to access this appointment",
			);
		}

		return appointment;
	}

	@Get("salon/:salonId")
	@ApiOperation({ summary: "Get appointments for a salon" })
	@ApiParam({ name: "salonId", description: "Salon ID" })
	@ApiQuery({ name: "page", required: false, type: Number })
	@ApiQuery({ name: "limit", required: false, type: Number })
	@ApiQuery({ name: "status", required: false, enum: AppointmentStatus })
	@ApiQuery({ name: "startDate", required: false, type: String })
	@ApiQuery({ name: "endDate", required: false, type: String })
	@Roles(Role.ADMIN, Role.STAFF)
	async findBySalon(@Param() params: SalonIdParam, @Query() query: AppointmentQuery) {
		const { salonId } = params;
		const { page = "1", limit = "10", status, startDate, endDate } = query;

		this.logger.log(`Finding appointments for salon ID: ${salonId}`);
		const { page: pageNum, limit: limitNum } =
			PaginationUtil.normalizePaginationParams(page, limit);
		return this.appointmentsService.findBySalonId(salonId, pageNum, limitNum, {
			status,
			startDate,
			endDate,
		});
	}

	@Get("salon/:salonId/available-slots")
	@ApiOperation({ summary: "Get available time slots for a salon" })
	@ApiParam({ name: "salonId", description: "Salon ID" })
	@ApiQuery({
		name: "date",
		required: true,
		type: String,
		description: "Date in YYYY-MM-DD format",
	})
	@ApiQuery({ name: "serviceId", required: true, type: String })
	@ApiQuery({ name: "staffId", required: false, type: String })
	async getAvailableSlots(@Param() params: SalonIdParam, @Query() query: AvailableSlotsQuery) {
		const { salonId } = params;
		const { date, serviceId, staffId } = query;

		this.logger.log(
			`Finding available slots for salon ID: ${salonId}, date: ${date}, service: ${serviceId}`,
		);
		return this.appointmentsService.getAvailableTimeSlots(
			salonId,
			date,
			serviceId,
			staffId,
		);
	}

	@Post()
	@ApiOperation({ summary: "Create a new appointment" })
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: Request) {
		const user = req.user as UserWithoutPassword;
		this.logger.log(`Creating new appointment for user ID: ${user.id}`);
		return this.appointmentsService.create(createAppointmentDto, user.id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update an appointment" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	async update(
		@Param("id") id: string,
		@Body() updateAppointmentDto: UpdateAppointmentDto,
		@Req() req: Request,
	) {
		const user = req.user as UserWithoutPassword;

		this.logger.log(`Updating appointment with ID: ${id}`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to update this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new ForbiddenException(
				"You are not authorized to update this appointment",
			);
		}

		return this.appointmentsService.update(id, updateAppointmentDto);
	}

	@Patch(":id/reschedule")
	@ApiOperation({ summary: "Reschedule an appointment" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	async reschedule(
		@Param("id") id: string,
		@Body() rescheduleAppointmentDto: RescheduleAppointmentDto,
		@Req() req: Request,
	) {
		const user = req.user as UserWithoutPassword;

		this.logger.log(`Rescheduling appointment with ID: ${id}`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to reschedule this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new ForbiddenException(
				"You are not authorized to reschedule this appointment",
			);
		}

		return this.appointmentsService.reschedule(id, rescheduleAppointmentDto);
	}

	@Patch(":id/cancel")
	@ApiOperation({ summary: "Cancel an appointment" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	async cancel(
		@Param("id") id: string,
		@Body() cancelAppointmentDto: CancelAppointmentDto,
		@Req() req: Request,
	) {
		const user = req.user as UserWithoutPassword;

		this.logger.log(`Cancelling appointment with ID: ${id}`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		// Check if user is authorized to cancel this appointment
		const isAuthorized =
			user.id === appointment.userId ||
			user.role === Role.ADMIN ||
			user.role === Role.STAFF;

		if (!isAuthorized) {
			throw new ForbiddenException(
				"You are not authorized to cancel this appointment",
			);
		}

		return this.appointmentsService.cancel(id, cancelAppointmentDto);
	}

	@Patch(":id/confirm")
	@ApiOperation({ summary: "Confirm an appointment" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	@Roles(Role.ADMIN, Role.STAFF)
	async confirm(@Param("id") id: string) {
		this.logger.log(`Confirming appointment with ID: ${id}`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		return this.appointmentsService.confirm(id);
	}

	@Patch(":id/complete")
	@ApiOperation({ summary: "Mark an appointment as completed" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	@Roles(Role.ADMIN, Role.STAFF)
	async complete(@Param("id") id: string) {
		this.logger.log(`Completing appointment with ID: ${id}`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		return this.appointmentsService.complete(id);
	}

	@Patch(":id/no-show")
	@ApiOperation({ summary: "Mark an appointment as no-show" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	@Roles(Role.ADMIN, Role.STAFF)
	async noShow(@Param("id") id: string) {
		this.logger.log(`Marking appointment with ID: ${id} as no-show`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		return this.appointmentsService.noShow(id);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete an appointment" })
	@ApiParam({ name: "id", description: "Appointment ID" })
	@HttpCode(HttpStatus.NO_CONTENT)
	@Roles(Role.ADMIN)
	async remove(@Param("id") id: string) {
		this.logger.log(`Deleting appointment with ID: ${id}`);
		const appointment = await this.appointmentsService.findById(id);

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`);
		}

		await this.appointmentsService.remove(id);
	}
}
