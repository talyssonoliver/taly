import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AppointmentRepository } from './repositories/appointment.repository';
import { TimeSlotRepository } from './repositories/time-slot.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { PaginationUtil } from '../common/utils/pagination.util';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { DateUtil } from '../common/utils/date.util';
import { NotificationsService } from '../notifications/notifications.service';
import { SalonsService } from '../salons/salons.service';
import { APPOINTMENT_CONSTANTS } from './constants/appointment.constants';
import { addMinutes, parseISO, format, isAfter, isBefore } from 'date-fns';

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
  ) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      const { status, startDate, endDate, salonId } = options;
      
      // Build filter
      const where: any = {};
      
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
      
      return PaginationUtil.createPaginatedResult(appointments, total, page, limit);
    } catch (error) {
      this.logger.error(Error finding all appointments: );
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.appointmentRepository.findById(id);
    } catch (error) {
      this.logger.error(Error finding appointment by ID: );
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
  ) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      const { status, upcoming } = options;
      
      // Build filter
      const where: any = { userId };
      
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
          orderBy: { startTime: upcoming ? 'asc' : 'desc' },
        }),
        this.appointmentRepository.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(appointments, total, page, limit);
    } catch (error) {
      this.logger.error(Error finding appointments for user: );
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
  ) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      const { status, startDate, endDate } = options;
      
      // Build filter
      const where: any = { salonId };
      
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
      
      return PaginationUtil.createPaginatedResult(appointments, total, page, limit);
    } catch (error) {
      this.logger.error(Error finding appointments for salon: );
      throw error;
    }
  }

  async getAvailableTimeSlots(
    salonId: string, 
    date: string,
    serviceId: string,
    staffId?: string,
  ) {
    try {
      // Validate date format
      if (!DateUtil.isValidDateString(date)) {
        throw new BadRequestException('Invalid date format. Please use YYYY-MM-DD format.');
      }
      
      // Get service details
      const service = await this.prisma.service.findFirst({
        where: { id: serviceId, salonId, isActive: true },
      });
      
      if (!service) {
        throw new NotFoundException(Service with ID  not found for salon with ID );
      }
      
      // Get salon working hours for the day
      const dayOfWeek = DateUtil.getDayOfWeek(date);
      const workingHours = await this.prisma.workingHours.findFirst({
        where: { salonId, dayOfWeek },
      });
      
      if (!workingHours || workingHours.isClosed) {
        return { timeSlots: [], message: 'Salon is closed on this date.' };
      }
      
      const parsedDate = parseISO(date);
      const serviceDuration = service.duration;
      
      // Generate all possible time slots for the day
      const timeSlots = this.generateTimeSlots(
        parsedDate,
        workingHours.openTime,
        workingHours.closeTime,
        serviceDuration,
      );
      
      // Remove unavailable time slots
      const availableTimeSlots = await this.filterAvailableTimeSlots(
        timeSlots,
        salonId,
        serviceDuration,
        staffId,
      );
      
      return { timeSlots: availableTimeSlots };
    } catch (error) {
      this.logger.error(Error getting available time slots: );
      throw error;
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    try {
      const { salonId, serviceId, startTime, staffId, notes } = createAppointmentDto;
      
      // Check if salon and service exist
      const service = await this.prisma.service.findFirst({
        where: { id: serviceId, salonId, isActive: true },
      });
      
      if (!service) {
        throw new NotFoundException(Service with ID  not found for salon with ID );
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
        throw new ConflictException('The selected time slot is not available.');
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
      await this.notificationsService.sendAppointmentConfirmation(appointment);
      
      // Create reminder for the appointment
      await this.createReminders(appointment.id, startDateTime);
      
      return appointment;
    } catch (error) {
      this.logger.error(Error creating appointment: );
      throw error;
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const appointment = await this.findById(id);
      
      if (!appointment) {
        throw new NotFoundException(Appointment with ID  not found);
      }
      
      // Validate if appointment can be updated
      if (
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.CANCELLED ||
        appointment.status === AppointmentStatus.NO_SHOW
      ) {
        throw new BadRequestException(Cannot update a  appointment);
      }
      
      // If notes is the only field being updated, just update notes
      if (Object.keys(updateAppointmentDto).length === 1 && updateAppointmentDto.notes !== undefined) {
        return this.appointmentRepository.update(id, { notes: updateAppointmentDto.notes });
      }
      
      // If changing service, validate and recalculate times
      if (updateAppointmentDto.serviceId) {
        const service = await this.prisma.service.findFirst({
          where: { 
            id: updateAppointmentDto.serviceId, 
            salonId: appointment.salonId, 
            isActive: true 
          },
        });
        
        if (!service) {
          throw new NotFoundException(Service with ID  not found for this salon);
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
            throw new ConflictException('The new service duration conflicts with existing appointments.');
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
      this.logger.error(Error updating appointment: );
      throw error;
    }
  }

  async reschedule(id: string, rescheduleDto: RescheduleAppointmentDto) {
    try {
      const { startTime, staffId } = rescheduleDto;
      const appointment = await this.findById(id);
      
      if (!appointment) {
        throw new NotFoundException(Appointment with ID  not found);
      }
      
      // Validate if appointment can be rescheduled
      if (
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.CANCELLED ||
        appointment.status === AppointmentStatus.NO_SHOW
      ) {
        throw new BadRequestException(Cannot reschedule a  appointment);
      }
      
      // Get the service to calculate end time
      const service = await this.prisma.service.findUnique({
        where: { id: appointment.serviceId },
      });
      
      if (!service) {
        throw new NotFoundException(Service for this appointment not found);
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
        throw new ConflictException('The selected time slot is not available.');
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
      await this.notificationsService.sendAppointmentRescheduled(updatedAppointment);
      
      return updatedAppointment;
    } catch (error) {
      this.logger.error(Error rescheduling appointment: );
      throw error;
    }
  }

  async cancel(id: string, cancelDto: CancelAppointmentDto) {
    try {
      const appointment = await this.findById(id);
      
      if (!appointment) {
        throw new NotFoundException(Appointment with ID  not found);
      }
      
      // Check if appointment is already cancelled or completed
      if (
        appointment.status === AppointmentStatus.CANCELLED ||
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.NO_SHOW
      ) {
        throw new BadRequestException(Cannot cancel a  appointment);
      }
      
      // Calculate cancellation fee based on salon policy
      const salon = await this.salonsService.findById(appointment.salonId);
      const appointmentTime = new Date(appointment.startTime);
      const currentTime = new Date();
      const hoursDifference = (appointmentTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
      
      let cancellationFee = 0;
      if (hoursDifference < APPOINTMENT_CONSTANTS.LATE_CANCELLATION_HOURS) {
        // Apply cancellation fee
        cancellationFee = appointment.price * (salon.cancellationFeePercentage || APPOINTMENT_CONSTANTS.DEFAULT_CANCELLATION_FEE_PERCENTAGE) / 100;
      }
      
      // Update appointment as cancelled
      const updatedAppointment = await this.appointmentRepository.update(id, {
        status: AppointmentStatus.CANCELLED,
        cancellationReason: cancelDto.reason,
        cancellationFee,
      });
      
      // Delete pending reminders
      await this.prisma.reminder.deleteMany({ where: { appointmentId: id, sent: false } });
      
      // Send cancellation notification
      await this.notificationsService.sendAppointmentCancelled(updatedAppointment);
      
      return updatedAppointment;
    } catch (error) {
      this.logger.error(Error cancelling appointment: );
      throw error;
    }
  }

  async confirm(id: string) {
    try {
      const appointment = await this.findById(id);
      
      if (!appointment) {
        throw new NotFoundException(Appointment with ID  not found);
      }
      
      // Check if appointment can be confirmed
      if (appointment.status !== AppointmentStatus.SCHEDULED && appointment.status !== AppointmentStatus.PENDING) {
        throw new BadRequestException(Cannot confirm a  appointment);
      }
      
      // Update appointment as confirmed
      const updatedAppointment = await this.appointmentRepository.update(id, {
        status: AppointmentStatus.CONFIRMED,
      });
      
      // Send confirmation notification
      await this.notificationsService.sendAppointmentConfirmed(updatedAppointment);
      
      return updatedAppointment;
    } catch (error) {
      this.logger.error(Error confirming appointment: );
      throw error;
    }
  }

  async complete(id: string) {
    try {
      const appointment = await this.findById(id);
      
      if (!appointment) {
        throw new NotFoundException(Appointment with ID  not found);
      }
      
      // Check if appointment can be completed
      if (
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.CANCELLED ||
        appointment.status === AppointmentStatus.NO_SHOW
      ) {
        throw new BadRequestException(Cannot complete a  appointment);
      }
      
      // Update appointment as completed
      const updatedAppointment = await this.appointmentRepository.update(id, {
        status: AppointmentStatus.COMPLETED,
      });
      
      // Delete all reminders
      await this.prisma.reminder.deleteMany({ where: { appointmentId: id } });
      
      // Send feedback request
      await this.notificationsService.sendFeedbackRequest(updatedAppointment);
      
      return updatedAppointment;
    } catch (error) {
      this.logger.error(Error completing appointment: );
      throw error;
    }
  }

  async noShow(id: string) {
    try {
      const appointment = await this.findById(id);
      
      if (!appointment) {
        throw new NotFoundException(Appointment with ID  not found);
      }
      
      // Check if appointment can be marked as no-show
      if (
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.CANCELLED ||
        appointment.status === AppointmentStatus.NO_SHOW
      ) {
        throw new BadRequestException(Cannot mark a  appointment as no-show);
      }
      
      // Calculate no-show fee based on salon policy
      const salon = await this.salonsService.findById(appointment.salonId);
      const noShowFee = appointment.price * (salon.noShowFeePercentage || APPOINTMENT_CONSTANTS.DEFAULT_NO_SHOW_FEE_PERCENTAGE) / 100;
      
      // Update appointment as no-show
      const updatedAppointment = await this.appointmentRepository.update(id, {
        status: AppointmentStatus.NO_SHOW,
        noShowFee,
      });
      
      // Delete all reminders
      await this.prisma.reminder.deleteMany({ where: { appointmentId: id } });
      
      // Send no-show notification
      await this.notificationsService.sendNoShowNotification(updatedAppointment);
      
      return updatedAppointment;
    } catch (error) {
      this.logger.error(Error marking appointment as no-show: );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const appointment = await this.findById(id);
      
      if (!appointment) {
        throw new NotFoundException(Appointment with ID  not found);
      }
      
      // Delete reminders
      await this.prisma.reminder.deleteMany({ where: { appointmentId: id } });
      
      // Delete appointment
      return this.appointmentRepository.delete(id);
    } catch (error) {
      this.logger.error(Error removing appointment: );
      throw error;
    }
  }

  // Helper methods
  private generateTimeSlots(
    date: Date,
    openTime: string,
    closeTime: string,
    serviceDuration: number,
  ) {
    const timeSlots = [];
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
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
  ) {
    const availableTimeSlots = [];
    
    for (const slot of timeSlots) {
      const isAvailable = await this.isTimeSlotAvailable(
        salonId,
        slot.startTime,
        slot.endTime,
        staffId,
      );
      
      if (isAvailable) {
        availableTimeSlots.push({
          startTime: slot.startTime.toISOString(),
          endTime: slot.endTime.toISOString(),
          formattedStartTime: format(slot.startTime, 'h:mm a'),
          formattedEndTime: format(slot.endTime, 'h:mm a'),
        });
      }
    }
    
    return availableTimeSlots;
  }

  private async isTimeSlotAvailable(
    salonId: string,
    startTime: Date,
    endTime: Date,
    staffId?: string,
    excludeAppointmentId?: string,
  ) {
    // Basic time validation
    if (isAfter(startTime, endTime)) {
      return false;
    }
    
    // Check if the salon is open during this time
    const dayOfWeek = format(startTime, 'EEEE').toUpperCase();
    const workingHours = await this.prisma.workingHours.findFirst({
      where: { 
        salonId, 
        dayOfWeek: dayOfWeek as any,
      },
    });
    
    if (!workingHours || workingHours.isClosed) {
      return false;
    }
    
    // Parse working hours
    const [openHour, openMinute] = workingHours.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = workingHours.closeTime.split(':').map(Number);
    
    const openDateTime = new Date(startTime);
    openDateTime.setHours(openHour, openMinute, 0, 0);
    
    const closeDateTime = new Date(startTime);
    closeDateTime.setHours(closeHour, closeMinute, 0, 0);
    
    // Check if appointment is within working hours
    if (isBefore(startTime, openDateTime) || isAfter(endTime, closeDateTime)) {
      return false;
    }
    
    // Find overlapping appointments
    const overlappingAppointments = await this.prisma.appointment.findMany({
      where: {
        salonId,
        status: {
          notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
        },
        OR: [
          {
            // Starts during another appointment
            startTime: {
              gte: startTime,
              lt: endTime,
            },
          },
          {
            // Ends during another appointment
            endTime: {
              gt: startTime,
              lte: endTime,
            },
          },
          {
            // Encompasses another appointment
            startTime: {
              lte: startTime,
            },
            endTime: {
              gte: endTime,
            },
          },
        ],
        ...(staffId && { staffId }),
        ...(excludeAppointmentId && { 
          id: { not: excludeAppointmentId },
        }),
      },
    });
    
    return overlappingAppointments.length === 0;
  }

  private async createReminders(appointmentId: string, appointmentTime: Date) {
    try {
      // Create reminders at different time intervals
      const reminderTimes = [
        addMinutes(appointmentTime, -APPOINTMENT_CONSTANTS.REMINDER_TIME_24_HOURS),
        addMinutes(appointmentTime, -APPOINTMENT_CONSTANTS.REMINDER_TIME_1_HOUR),
      ];
      
      // Only create reminders for future times
      const now = new Date();
      const futureReminders = reminderTimes.filter(time => time > now);
      
      // Create reminder entries
      await Promise.all(
        futureReminders.map(reminderTime => 
          this.prisma.reminder.create({
            data: {
              appointmentId,
              reminderTime,
              sent: false,
              type: 'EMAIL',
            },
          })
        )
      );
    } catch (error) {
      this.logger.error(Error creating reminders: );
      // Don't throw, just log the error
    }
  }
}
