import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TimeSlotRepository {
  private readonly logger = new Logger(TimeSlotRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    try {
      const { skip, take, where, orderBy } = options;
      
      return this.prisma.timeSlot.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { startTime: 'asc' },
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
      this.logger.error(Error finding time slots: );
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.timeSlot.count({
        where,
      });
    } catch (error) {
      this.logger.error(Error counting time slots: );
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
      this.logger.error(Error finding time slot by ID: );
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
      this.logger.error(Error creating time slot: );
      throw error;
    }
  }

  async update(id: string, data: any) {
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
      this.logger.error(Error updating time slot: );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.timeSlot.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(Error deleting time slot: );
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
              // Starts during another time slot
              startTime: {
                gte: startTime,
                lt: endTime,
              },
            },
            {
              // Ends during another time slot
              endTime: {
                gt: startTime,
                lte: endTime,
              },
            },
            {
              // Encompasses another time slot
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
      this.logger.error(Error finding overlapping time slots: );
      throw error;
    }
  }

  async findAvailableTimeSlots(
    salonId: string,
    date: Date,
    staffId?: string,
  ) {
    try {
      // Create start and end date for the given date
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
          startTime: 'asc',
        },
      });
    } catch (error) {
      this.logger.error(Error finding available time slots: );
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
      this.logger.error(Error blocking time slot: );
      throw error;
    }
  }

  async generateTimeSlotsForSalon(
    salonId: string,
    startDate: Date,
    endDate: Date,
    staffIds: string[],
  ) {
    // Implementation would generate time slots for the salon based on working hours
    // This is a complex operation that would require working with salon working hours
    // Just a placeholder for the concept
    this.logger.log(Generating time slots for salon  from  to );
  }
}



