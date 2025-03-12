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
import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { WorkingHoursDto } from './dto/working-hours.dto';
import { PaginationUtil } from '../common/utils/pagination.util';

@ApiTags('Salons')
@Controller('salons')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SalonsController {
  private readonly logger = new Logger(SalonsController.name);

  constructor(private readonly salonsService: SalonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all salons' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    this.logger.log("Finding all users with page={page}, limit={limit}" + (search ? ", search={search}" : ""), { page, limit, search });
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.salonsService.findAll(pageNum, limitNum, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salon by ID' })
  @ApiParam({ name: 'id', description: 'Salon ID' })
  async findOne(@Param('id') id: string) {
    this.logger.log(Finding salon with ID: );
    const salon = await this.salonsService.findById(id);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    return salon;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new salon' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.USER)
  async create(
    @Body() createSalonDto: CreateSalonDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Creating new salon: );
    return this.salonsService.create(createSalonDto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a salon' })
  @ApiParam({ name: 'id', description: 'Salon ID' })
  async update(
    @Param('id') id: string,
    @Body() updateSalonDto: UpdateSalonDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Updating salon with ID: );
    const salon = await this.salonsService.findById(id);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    // Check if user is authorized to update this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to update this salon');
    }
    
    return this.salonsService.update(id, updateSalonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a salon' })
  @ApiParam({ name: 'id', description: 'Salon ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    this.logger.log(Deleting salon with ID: );
    const salon = await this.salonsService.findById(id);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    // Check if user is authorized to delete this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to delete this salon');
    }
    
    await this.salonsService.remove(id);
  }

  // Services
  @Get(':salonId/services')
  @ApiOperation({ summary: 'Get all services for a salon' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllServices(
    @Param('salonId') salonId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    this.logger.log(Finding all services for salon ID: );
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.salonsService.findAllServices(salonId, pageNum, limitNum);
  }

  @Get(':salonId/services/:id')
  @ApiOperation({ summary: 'Get a service by ID for a salon' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  async findOneService(
    @Param('salonId') salonId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(Finding service with ID:  for salon ID: );
    const service = await this.salonsService.findServiceById(id, salonId);
    
    if (!service) {
      throw new NotFoundException(Service with ID  not found for salon with ID );
    }
    
    return service;
  }

  @Post(':salonId/services')
  @ApiOperation({ summary: 'Create a new service for a salon' })
  @HttpCode(HttpStatus.CREATED)
  async createService(
    @Param('salonId') salonId: string,
    @Body() createServiceDto: CreateServiceDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Creating new service:  for salon ID: );
    
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    // Check if user is authorized to add services to this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to add services to this salon');
    }
    
    return this.salonsService.createService(salonId, createServiceDto);
  }

  @Patch(':salonId/services/:id')
  @ApiOperation({ summary: 'Update a service for a salon' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  async updateService(
    @Param('salonId') salonId: string,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser() user,
  ) {
    this.logger.log(Updating service with ID:  for salon ID: );
    
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    const service = await this.salonsService.findServiceById(id, salonId);
    
    if (!service) {
      throw new NotFoundException(Service with ID  not found for salon with ID );
    }
    
    // Check if user is authorized to update services for this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to update services for this salon');
    }
    
    return this.salonsService.updateService(id, updateServiceDto);
  }

  @Delete(':salonId/services/:id')
  @ApiOperation({ summary: 'Delete a service for a salon' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeService(
    @Param('salonId') salonId: string,
    @Param('id') id: string,
    @CurrentUser() user,
  ) {
    this.logger.log(Deleting service with ID:  for salon ID: );
    
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    const service = await this.salonsService.findServiceById(id, salonId);
    
    if (!service) {
      throw new NotFoundException(Service with ID  not found for salon with ID );
    }
    
    // Check if user is authorized to delete services for this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to delete services for this salon');
    }
    
    await this.salonsService.removeService(id);
  }

  // Working Hours
  @Get(':salonId/working-hours')
  @ApiOperation({ summary: 'Get working hours for a salon' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  async getWorkingHours(@Param('salonId') salonId: string) {
    this.logger.log(Getting working hours for salon ID: );
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    return this.salonsService.getWorkingHours(salonId);
  }

  @Post(':salonId/working-hours')
  @ApiOperation({ summary: 'Set working hours for a salon' })
  @HttpCode(HttpStatus.CREATED)
  async setWorkingHours(
    @Param('salonId') salonId: string,
    @Body() workingHoursDto: WorkingHoursDto[],
    @CurrentUser() user,
  ) {
    this.logger.log(Setting working hours for salon ID: );
    
    const salon = await this.salonsService.findById(salonId);
    
    if (!salon) {
      throw new NotFoundException(Salon with ID  not found);
    }
    
    // Check if user is authorized to set working hours for this salon
    if (salon.ownerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to set working hours for this salon');
    }
    
    return this.salonsService.setWorkingHours(salonId, workingHoursDto);
  }
}
