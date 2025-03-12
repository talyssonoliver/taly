import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
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
import { AppointmentStatus } from '../common/enums/appointment-status.enum';

@Resolver('Appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsResolver {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Query('appointments')
  @Roles(Role.ADMIN, Role.STAFF)
  async getAppointments(
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Args('status', { nullable: true }) status?: AppointmentStatus,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @Args('salonId', { nullable: true }) salonId?: string,
  ) {
    return this.appointmentsService.findAll(page, limit, { status, startDate, endDate, salonId });
  }

  @Query('appointment')
  async getAppointment(
    @Args('id') id: string,
    @CurrentUser() user,
  ) {
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new Error(Appointment with ID  not found);
    }
    
    // Check if user is authorized to access this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new Error('You are not authorized to access this appointment');
    }
    
    return appointment;
  }

  @Query('myAppointments')
  async getMyAppointments(
    @CurrentUser() user,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Args('status', { nullable: true }) status?: AppointmentStatus,
    @Args('upcoming', { nullable: true }) upcoming?: boolean,
  ) {
    return this.appointmentsService.findByUserId(user.id, page, limit, { status, upcoming });
  }

  @Query('salonAppointments')
  @Roles(Role.ADMIN, Role.STAFF)
  async getSalonAppointments(
    @Args('salonId') salonId: string,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Args('status', { nullable: true }) status?: AppointmentStatus,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ) {
    return this.appointmentsService.findBySalonId(salonId, page, limit, { status, startDate, endDate });
  }

  @Query('availableTimeSlots')
  async getAvailableTimeSlots(
    @Args('salonId') salonId: string,
    @Args('date') date: string,
    @Args('serviceId') serviceId: string,
    @Args('staffId', { nullable: true }) staffId?: string,
  ) {
    return this.appointmentsService.getAvailableTimeSlots(salonId, date, serviceId, staffId);
  }

  @Mutation('createAppointment')
  async createAppointment(
    @Args('input') createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user,
  ) {
    return this.appointmentsService.create(createAppointmentDto, user.id);
  }

  @Mutation('updateAppointment')
  async updateAppointment(
    @Args('id') id: string,
    @Args('input') updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user,
  ) {
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new Error(Appointment with ID  not found);
    }
    
    // Check if user is authorized to update this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new Error('You are not authorized to update this appointment');
    }
    
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Mutation('rescheduleAppointment')
  async rescheduleAppointment(
    @Args('id') id: string,
    @Args('input') rescheduleAppointmentDto: RescheduleAppointmentDto,
    @CurrentUser() user,
  ) {
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new Error(Appointment with ID  not found);
    }
    
    // Check if user is authorized to reschedule this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new Error('You are not authorized to reschedule this appointment');
    }
    
    return this.appointmentsService.reschedule(id, rescheduleAppointmentDto);
  }

  @Mutation('cancelAppointment')
  async cancelAppointment(
    @Args('id') id: string,
    @Args('input') cancelAppointmentDto: CancelAppointmentDto,
    @CurrentUser() user,
  ) {
    const appointment = await this.appointmentsService.findById(id);
    
    if (!appointment) {
      throw new Error(Appointment with ID  not found);
    }
    
    // Check if user is authorized to cancel this appointment
    const isAuthorized = 
      user.id === appointment.userId || 
      user.role === Role.ADMIN || 
      user.role === Role.STAFF;
      
    if (!isAuthorized) {
      throw new Error('You are not authorized to cancel this appointment');
    }
    
    return this.appointmentsService.cancel(id, cancelAppointmentDto);
  }

  @Mutation('confirmAppointment')
  @Roles(Role.ADMIN, Role.STAFF)
  async confirmAppointment(
    @Args('id') id: string,
  ) {
    return this.appointmentsService.confirm(id);
  }

  @Mutation('completeAppointment')
  @Roles(Role.ADMIN, Role.STAFF)
  async completeAppointment(
    @Args('id') id: string,
  ) {
    return this.appointmentsService.complete(id);
  }

  @Mutation('markNoShow')
  @Roles(Role.ADMIN, Role.STAFF)
  async markNoShow(
    @Args('id') id: string,
  ) {
    return this.appointmentsService.noShow(id);
  }

  @Mutation('deleteAppointment')
  @Roles(Role.ADMIN)
  async deleteAppointment(
    @Args('id') id: string,
  ) {
    await this.appointmentsService.remove(id);
    return true;
  }
}
