import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WorkingHoursDto } from '../dto/working-hours.dto';
import { DayOfWeek } from '../entities/working-hours.entity';

@Injectable()
export class WorkingHoursRepository {
  private readonly logger = new Logger(WorkingHoursRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findBySalonId(salonId: string) {
    try {
      return this.prisma.workingHours.findMany({
        where: { salonId },
        orderBy: {
          // Order by day of the week (Monday first)
          dayOfWeek: 'asc',
        },
      });
    } catch (error) {
      this.logger.error(Error finding working hours for salon: );
      throw error;
    }
  }

  async create(data: WorkingHoursDto & { salonId: string }) {
    try {
      return this.prisma.workingHours.create({
        data,
      });
    } catch (error) {
      this.logger.error(Error creating working hours: );
      throw error;
    }
  }

  async update(id: string, data: Partial<WorkingHoursDto>) {
    try {
      return this.prisma.workingHours.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(Error updating working hours: );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.workingHours.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(Error deleting working hours: );
      throw error;
    }
  }

  async deleteBySalonId(salonId: string) {
    try {
      return this.prisma.workingHours.deleteMany({
        where: { salonId },
      });
    } catch (error) {
      this.logger.error(Error deleting working hours for salon: );
      throw error;
    }
  }

  async upsertWorkingHours(salonId: string, dayOfWeek: DayOfWeek, data: WorkingHoursDto) {
    try {
      const existingHours = await this.prisma.workingHours.findFirst({
        where: {
          salonId,
          dayOfWeek,
        },
      });

      if (existingHours) {
        return this.prisma.workingHours.update({
          where: { id: existingHours.id },
          data,
        });
      } else {
        return this.prisma.workingHours.create({
          data: {
            ...data,
            salonId,
            dayOfWeek,
          },
        });
      }
    } catch (error) {
      this.logger.error(Error upserting working hours: );
      throw error;
    }
  }
}



