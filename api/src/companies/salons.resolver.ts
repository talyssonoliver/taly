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
import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { WorkingHoursDto } from './dto/working-hours.dto';

@Resolver('Salon')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalonsResolver {
  constructor(private readonly salonsService: SalonsService) {}

  @Query('salons')
  async getSalons(
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Args('search', { nullable: true }) search?: string,
  ) {
    return this.salonsService.findAll(page, limit, search);
  }

  @Query('salon')
  async getSalon(@Args('id') id: string) {
    return this.salonsService.findById(id);
  }

  @Mutation('createSalon')
  @Roles(Role.ADMIN, Role.USER)
  async createSalon(
    @Args('input') createSalonDto: CreateSalonDto,
    @CurrentUser() user,
  ) {
    return this.salonsService.create(createSalonDto, user.id);
  }

  @Mutation('updateSalon')
  async updateSalon(
    @Args('id') id: string,
    @Args('input') updateSalonDto: UpdateSalonDto,
    @CurrentUser() user,
  ) {
    const salon = await this.salonsService.findById(id);
    
    if (!salon) {
      throw new Error(Salon with ID  not found);
    }
    
    // Check if user is authorized to update this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to update this salon');
    }
    
    return this.salonsService.update(id, updateSalonDto);
  }

  @Mutation('deleteSalon')
  async deleteSalon(
    @Args('id') id: string,
    @CurrentUser() user,
  ) {
    const salon = await this.salonsService.findById(id);
    
    if (!salon) {
      throw new Error(Salon with ID  not found);
    }
    
    // Check if user is authorized to delete this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to delete this salon');
    }
    
    await this.salonsService.remove(id);
    return true;
  }

  // Services
  @Query('salonServices')
  async getSalonServices(
    @Args('salonId') salonId: string,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.salonsService.findAllServices(salonId, page, limit);
  }

  @Query('salonService')
  async getSalonService(
    @Args('id') id: string,
    @Args('salonId') salonId: string,
  ) {
    return this.salonsService.findServiceById(id, salonId);
  }

  @Mutation('createSalonService')
  async createSalonService(
    @Args('salonId') salonId: string,
    @Args('input') createServiceDto: CreateServiceDto,
    @CurrentUser() user,
  ) {
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new Error(Salon with ID  not found);
    }
    
    // Check if user is authorized to add services to this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to add services to this salon');
    }
    
    return this.salonsService.createService(salonId, createServiceDto);
  }

  @Mutation('updateSalonService')
  async updateSalonService(
    @Args('id') id: string,
    @Args('salonId') salonId: string,
    @Args('input') updateServiceDto: UpdateServiceDto,
    @CurrentUser() user,
  ) {
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new Error(Salon with ID  not found);
    }
    
    const service = await this.salonsService.findServiceById(id, salonId);
    
    if (!service) {
      throw new Error(Service with ID  not found for salon with ID );
    }
    
    // Check if user is authorized to update services for this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to update services for this salon');
    }
    
    return this.salonsService.updateService(id, updateServiceDto);
  }

  @Mutation('deleteSalonService')
  async deleteSalonService(
    @Args('id') id: string,
    @Args('salonId') salonId: string,
    @CurrentUser() user,
  ) {
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new Error(Salon with ID  not found);
    }
    
    const service = await this.salonsService.findServiceById(id, salonId);
    
    if (!service) {
      throw new Error(Service with ID  not found for salon with ID );
    }
    
    // Check if user is authorized to delete services for this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to delete services for this salon');
    }
    
    await this.salonsService.removeService(id);
    return true;
  }

  // Working Hours
  @Query('salonWorkingHours')
  async getSalonWorkingHours(@Args('salonId') salonId: string) {
    return this.salonsService.getWorkingHours(salonId);
  }

  @Mutation('setSalonWorkingHours')
  async setSalonWorkingHours(
    @Args('salonId') salonId: string,
    @Args('input') workingHoursDto: WorkingHoursDto[],
    @CurrentUser() user,
  ) {
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new Error(Salon with ID  not found);
    }
    
    // Check if user is authorized to set working hours for this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to set working hours for this salon');
    }
    
    return this.salonsService.setWorkingHours(salonId, workingHoursDto);
  }
}
