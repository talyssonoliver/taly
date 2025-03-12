import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

@Injectable()
export class AppointmentRepository {
  private readonly logger = new Logger(AppointmentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
    include?: any;
  }) {
    try {
      const { skip, take, where, orderBy, include } = options;
      
      return this.prisma.appointment.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { startTime: 'desc' },
        include: include || {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          salon: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
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
      this.logger.error(Error finding appointments: );
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.appointment.count({
        where,
      });
    } catch (error) {
      this.logger.error(Error counting appointments: );
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.appointment.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          salon: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
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
          reminders: {
            where: {
              sent: false,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(Error finding appointment by ID: );
      throw error;
    }
  }

  async create(data: {
    userId: string;
    salonId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    price: number;
    staffId?: string;
    notes?: string;
    status?: AppointmentStatus;
  }) {
    try {
      return this.prisma.appointment.create({
        data,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          salon: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
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
      this.logger.error(Error creating appointment: );
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      return this.prisma.appointment.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          salon: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
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
      this.logger.error(Error updating appointment: );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.appointment.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(Error deleting appointment: );
      throw error;
    }
  }

  async findUpcomingAppointmentsForReminders(minutesAhead: number) {
    try {
      const now = new Date();
      const futureTime = new Date(now.getTime() + minutesAhead * 60000);
      
      return this.prisma.appointment.findMany({
        where: {
          startTime: {
            gte: now,
            lte: futureTime,
          },
          status: {
            in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING],
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          salon: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
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
      this.logger.error(Error finding upcoming appointments for reminders: );
      throw error;
    }
  }
}



