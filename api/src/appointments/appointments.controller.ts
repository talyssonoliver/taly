import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { PaginationUtil } from '../common/utils/pagination.util';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AppointmentsController {
  private readonly logger = new Logger(AppointmentsController.name);

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @Roles(Role.ADMIN, Role.STAFF)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('salonId') salonId?: string,
  ) {
    this.logger.log('Finding all appointments');
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.appointmentsService.findAll(pageNum, limitNum, { status, startDate, endDate, salonId });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user appointments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  async findMyAppointments(
    @CurrentUser() user,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: AppointmentStatus,
    @Query('upcoming') upcoming?: boolean,
  ) {
    this.logger.log(Finding appointments for user ID: );
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.appointmentsService.findByUserId(user.id, pageNum, limitNum, { status, upcoming });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    this.logger.log(Finding appointment with ID: );
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    // Check if user is authorized to access this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to access this appointment');
    }
    
    return appointment;
  }

  @Get('salon/:salonId')
  @ApiOperation({ summary: 'Get appointments for a salon' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @Roles(Role.ADMIN, Role.STAFF)
  async findBySalon(
    @Param('salonId') salonId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    this.logger.log(Finding appointments for salon ID: );
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.appointmentsService.findBySalonId(salonId, pageNum, limitNum, { status, startDate, endDate });
  }

  @Get('salon/:salonId/available-slots')
  @ApiOperation({ summary: 'Get available time slots for a salon' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'serviceId', required: true, type: String })
  @ApiQuery({ name: 'staffId', required: false, type: String })
  async getAvailableSlots(
    @Param('salonId') salonId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
    @Query('staffId') staffId?: string,
  ) {
    this.logger.log(Finding available slots for salon ID: , date: , service: );
    return this.appointmentsService.getAvailableTimeSlots(salonId, date, serviceId, staffId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Creating new appointment for user ID: );
    return this.appointmentsService.create(createAppointmentDto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Updating appointment with ID: );
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    // Check if user is authorized to update this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to update this appointment');
    }
    
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  async reschedule(
    @Param('id') id: string,
    @Body() rescheduleAppointmentDto: RescheduleAppointmentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Rescheduling appointment with ID: );
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    // Check if user is authorized to reschedule this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to reschedule this appointment');
    }
    
    return this.appointmentsService.reschedule(id, rescheduleAppointmentDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  async cancel(
    @Param('id') id: string,
    @Body() cancelAppointmentDto: CancelAppointmentDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Cancelling appointment with ID: );
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    // Check if user is authorized to cancel this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized to cancel this appointment');
    }
    
    return this.appointmentsService.cancel(id, cancelAppointmentDto);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async confirm(
    @Param('id') id: string,
  ) {
    this.logger.log(Confirming appointment with ID: );
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    return this.appointmentsService.confirm(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark an appointment as completed' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async complete(
    @Param('id') id: string,
  ) {
    this.logger.log(Completing appointment with ID: );
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    return this.appointmentsService.complete(id);
  }

  @Patch(':id/no-show')
  @ApiOperation({ summary: 'Mark an appointment as no-show' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async noShow(
    @Param('id') id: string,
  ) {
    this.logger.log(Marking appointment with ID:  as no-show);
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    return this.appointmentsService.noShow(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async remove(
    @Param('id') id: string,
  ) {
    this.logger.log(Deleting appointment with ID: );
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new NotFoundException(Appointment with ID  not found);
    }
    
    await this.appointmentsService.remove(id);
  }
}
