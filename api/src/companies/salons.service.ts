import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SalonRepository } from './repositories/salon.repository';
import { ServiceRepository } from './repositories/service.repository';
import { WorkingHoursRepository } from './repositories/working-hours.repository';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { WorkingHoursDto } from './dto/working-hours.dto';
import { PaginationUtil } from '../common/utils/pagination.util';

@Injectable()
export class SalonsService {
  private readonly logger = new Logger(SalonsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly salonRepository: SalonRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly workingHoursRepository: WorkingHoursRepository,
  ) {}

  async findAll(page: number, limit: number, search?: string) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      
      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined;
      
      const [salons, total] = await Promise.all([
        this.salonRepository.findMany({ skip, take, where }),
        this.salonRepository.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(salons, total, page, limit);
    } catch (error) {
      this.logger.error(`Error finding all salons: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve salons');
    }
  }

  async findById(id: string) {
    try {
      const salon = await this.salonRepository.findById(id);
      
      if (!salon) {
        throw new NotFoundException(`Salon with ID ${id} not found`);
      }
      
      return salon;
    } catch (error) {
      this.logger.error(`Error finding salon by ID: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve salon');
    }
  }

  async create(createSalonDto: CreateSalonDto, ownerId: string) {
    try {
      // Check if user exists
      const owner = await this.prisma.user.findUnique({
        where: { id: ownerId }
      });
      
      if (!owner) {
        throw new NotFoundException(`User with ID ${ownerId} not found`);
      }
      
      // Check if salon with same name already exists for this owner
      const existingSalon = await this.prisma.salon.findFirst({
        where: {
          ownerId,
          name: createSalonDto.name
        }
      });
      
      if (existingSalon) {
        throw new ConflictException(`A salon with the name "${createSalonDto.name}" already exists for this owner`);
      }
      
      // Generate website slug if not provided
      if (!createSalonDto.websiteSlug) {
        const slug = createSalonDto.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        // Check if slug is already taken
        const existingSlug = await this.prisma.salon.findFirst({
          where: { websiteSlug: slug }
        });
        
        if (existingSlug) {
          // Append random string to make unique
          createSalonDto.websiteSlug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
        } else {
          createSalonDto.websiteSlug = slug;
        }
      }
      
      // Create salon using transaction to ensure consistency
      return this.prisma.$transaction(async (prisma) => {
        // Create salon
        const salon = await this.salonRepository.create({
          ...createSalonDto,
          ownerId,
        });
        
        // Create default working hours if not provided
        if (!createSalonDto.workingHours) {
          const defaultWorkingHours = [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 6, openTime: '10:00', closeTime: '16:00', isClosed: false },
            { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
          ];
          
          await Promise.all(
            defaultWorkingHours.map(hours => 
              this.workingHoursRepository.create({
                ...hours,
                salonId: salon.id,
              })
            )
          );
        }
        
        // Return salon with working hours
        return this.findById(salon.id);
      });
    } catch (error) {
      this.logger.error(`Error creating salon: ${error.message}`, error.stack);
      
      // Handle specific exceptions
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      
      // Handle database-specific errors
      if (error.code === 'P2002') {
        throw new ConflictException('A salon with this name or website slug already exists');
      }
      
      // Handle other errors
      throw new InternalServerErrorException(`Failed to create salon: ${error.message}`);
    }
  }

  async update(id: string, updateSalonDto: UpdateSalonDto) {
    try {
      const salon = await this.salonRepository.findById(id);
      
      if (!salon) {
        throw new NotFoundException(`Salon with ID ${id} not found`);
      }
      
      // Check if website slug is being changed and is unique
      if (updateSalonDto.websiteSlug && updateSalonDto.websiteSlug !== salon.websiteSlug) {
        const existingSlug = await this.prisma.salon.findFirst({
          where: { 
            websiteSlug: updateSalonDto.websiteSlug,
            id: { not: id }
          }
        });
        
        if (existingSlug) {
          throw new ConflictException('A salon with this website slug already exists');
        }
      }
      
      // Perform update
      const updatedSalon = await this.salonRepository.update(id, updateSalonDto);
      
      return updatedSalon;
    } catch (error) {
      this.logger.error(`Error updating salon: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      // Handle database-specific errors
      if (error.code === 'P2002') {
        throw new ConflictException('A salon with this name or website slug already exists');
      }
      
      throw new InternalServerErrorException('Failed to update salon');
    }
  }

  async remove(id: string) {
    try {
      const salon = await this.salonRepository.findById(id);
      
      if (!salon) {
        throw new NotFoundException(`Salon with ID ${id} not found`);
      }
      
      // Use transaction to delete salon and related entities
      return this.prisma.$transaction(async (prisma) => {
        // Delete working hours
        await prisma.workingHours.deleteMany({
          where: { salonId: id },
        });
        
        // Delete services
        await prisma.service.deleteMany({
          where: { salonId: id },
        });
        
        // Delete appointments (this will cascade to payments)
        await prisma.appointment.deleteMany({
          where: { salonId: id },
        });
        
        // Delete staff
        await prisma.staff.deleteMany({
          where: { salonId: id },
        });
        
        // Delete clients
        await prisma.client.deleteMany({
          where: { salonId: id },
        });
        
        // Delete the salon itself
        return this.salonRepository.delete(id);
      });
    } catch (error) {
      this.logger.error(`Error removing salon: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to delete salon');
    }
  }

  // Services
  async findAllServices(salonId: string, page: number, limit: number) {
    try {
      // Check if salon exists
      const salon = await this.salonRepository.findById(salonId);
      
      if (!salon) {
        throw new NotFoundException(`Salon with ID ${salonId} not found`);
      }
      
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      
      const where = { salonId };
      
      const [services, total] = await Promise.all([
        this.serviceRepository.findMany({ 
          skip, 
          take, 
          where,
          include: {
            staff: {
              select: {
                id: true,
                bio: true,
                position: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    profileImage: true
                  }
                }
              }
            }
          }
        }),
        this.serviceRepository.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(services, total, page, limit);
    } catch (error) {
      this.logger.error(`Error finding services for salon ${salonId}: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve services');
    }
  }

  async findServiceById(id: string, salonId: string) {
    try {
      const service = await this.serviceRepository.findByIdForSalon(id, salonId);
      
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found in salon ${salonId}`);
      }
      
      return service;
    } catch (error) {
      this.logger.error(`Error finding service by ID: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve service');
    }
  }

  async createService(salonId: string, createServiceDto: CreateServiceDto) {
    try {
      const salon = await this.salonRepository.findById(salonId);
      
      if (!salon) {
        throw new NotFoundException(`Salon with ID ${salonId} not found`);
      }
      
      // Validate service data
      if (createServiceDto.duration <= 0) {
        throw new BadRequestException('Service duration must be greater than 0');
      }
      
      if (createServiceDto.price < 0) {
        throw new BadRequestException('Service price cannot be negative');
      }
      
      // Check if service with same name already exists in this salon
      const existingService = await this.prisma.service.findFirst({
        where: {
          salonId,
          name: createServiceDto.name
        }
      });
      
      if (existingService) {
        throw new ConflictException(`A service with the name "${createServiceDto.name}" already exists in this salon`);
      }
      
      // Create the service
      const newService = await this.serviceRepository.create({
        ...createServiceDto,
        salonId,
      });
      
      return newService;
    } catch (error) {
      this.logger.error(`Error creating service: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create service');
    }
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      const service = await this.serviceRepository.findById(id);
      
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      
      // Validate service data if provided
      if (updateServiceDto.duration !== undefined && updateServiceDto.duration <= 0) {
        throw new BadRequestException('Service duration must be greater than 0');
      }
      
      if (updateServiceDto.price !== undefined && updateServiceDto.price < 0) {
        throw new BadRequestException('Service price cannot be negative');
      }
      
      // Check if service name is being changed and is unique within salon
      if (updateServiceDto.name && updateServiceDto.name !== service.name) {
        const existingService = await this.prisma.service.findFirst({
          where: {
            salonId: service.salonId,
            name: updateServiceDto.name,
            id: { not: id }
          }
        });
        
        if (existingService) {
          throw new ConflictException(`A service with the name "${updateServiceDto.name}" already exists in this salon`);
        }
      }
      
      const updatedService = await this.serviceRepository.update(id, updateServiceDto);
      return updatedService;
    } catch (error) {
      this.logger.error(`Error updating service: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to update service');
    }
  }

  async removeService(id: string) {
    try {
      const service = await this.serviceRepository.findById(id);
      
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      
      // Check if service has appointments
      const appointmentCount = await this.prisma.appointment.count({
        where: { serviceId: id }
      });
      
      if (appointmentCount > 0) {
        // Soft delete - mark as inactive instead of deleting
        return this.serviceRepository.update(id, { isActive: false });
      }
      
      // Hard delete if no appointments
      return this.serviceRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error removing service: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to delete service');
    }
  }

  // Working Hours
  async getWorkingHours(salonId: string) {
    try {
      const salon = await this.salonRepository.findById(salonId);
      
      if (!salon) {
        throw new NotFoundException(`Salon with ID ${salonId} not found`);
      }
      
      const workingHours = await this.workingHoursRepository.findBySalonId(salonId);
      
      // Sort by day of week
      workingHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      
      return workingHours;
    } catch (error) {
      this.logger.error(`Error getting working hours: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to retrieve working hours');
    }
  }

  async setWorkingHours(salonId: string, workingHoursDto: WorkingHoursDto[]) {
    try {
      const salon = await this.salonRepository.findById(salonId);
      
      if (!salon) {
        throw new NotFoundException(`Salon with ID ${salonId} not found`);
      }
      
      // Validate working hours data
      this.validateWorkingHours(workingHoursDto);
      
      // Use transaction to update working hours
      return this.prisma.$transaction(async (prisma) => {
        // Delete existing working hours
        await prisma.workingHours.deleteMany({
          where: { salonId }
        });
        
        // Create new working hours
        const workingHours = await Promise.all(
          workingHoursDto.map(hours => 
            this.workingHoursRepository.create({
              ...hours,
              salonId,
            })
          )
        );
        
        return workingHours;
      });
    } catch (error) {
      this.logger.error(`Error setting working hours: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to update working hours');
    }
  }

  private validateWorkingHours(workingHours: WorkingHoursDto[]) {
    // Check if all days of the week are provided
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Sunday = 0, Monday = 1, etc.
    const providedDays = workingHours.map(hours => hours.dayOfWeek);
    
    if (new Set(providedDays).size !== providedDays.length) {
      throw new BadRequestException('Duplicate days of the week provided');
    }
    
    // Check if all days are covered
    daysOfWeek.forEach(day => {
      if (!providedDays.includes(day)) {
        throw new BadRequestException(`Missing working hours for day ${day}`);
      }
    });
    
    // Validate each working hours entry
    workingHours.forEach(hours => {
      // If isClosed is true, openTime and closeTime can be null
      if (hours.isClosed) {
        return;
      }
      
      if (!hours.openTime || !hours.closeTime) {
        throw new BadRequestException(`For open days, openTime and closeTime are required for day ${hours.dayOfWeek}`);
      }
      
      // Parse time strings to validate format and logic
      const openTime = this.parseTimeString(hours.openTime);
      const closeTime = this.parseTimeString(hours.closeTime);
      
      if (openTime >= closeTime) {
        throw new BadRequestException(`Open time must be before close time for day ${hours.dayOfWeek}`);
      }
    });
  }

  private parseTimeString(timeString: string): number {
    // Expects format "HH:MM"
    const parts = timeString.split(':');
    if (parts.length !== 2) {
      throw new BadRequestException(`Invalid time format: ${timeString}. Expected format: HH:MM`);
    }
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    if (isNaN(hours) || hours < 0 || hours > 23 || isNaN(minutes) || minutes < 0 || minutes > 59) {
      throw new BadRequestException(`Invalid time: ${timeString}`);
    }
    
    return hours * 60 + minutes;
  }
}