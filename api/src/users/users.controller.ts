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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { PaginationUtil } from '../common/utils/pagination.util';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    this.logger.log(Finding all users with page={page}, limit={limit}" + (search ? ", search={search}" : ""), { page, limit, search });
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.usersService.findAll(pageNum, limitNum, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async findOne(@Param('id') id: string) {
    this.logger.log(Finding user with ID: );
    const user = await this.usersService.findById(id);
    
    if (!user) {
      throw new NotFoundException(User with ID  not found);
    }
    
    return user;
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user) {
    this.logger.log(Getting profile for user ID: );
    const userProfile = await this.usersService.findById(user.id);
    
    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }
    
    return userProfile;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(Creating new user with email: );
    return this.usersService.create(createUserDto);
  }

  @Post('staff')
  @ApiOperation({ summary: 'Create a new staff member' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async createStaff(@Body() createStaffDto: CreateStaffDto) {
    this.logger.log(Creating new staff with email: );
    return this.usersService.createStaff(createStaffDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(Updating user with ID: );
    const user = await this.usersService.findById(id);
    
    if (!user) {
      throw new NotFoundException(User with ID  not found);
    }
    
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser() user,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(Updating profile for user ID: );
    
    // Prevent role change from profile update
    if (updateUserDto.role) {
      throw new BadRequestException('Role cannot be changed from profile update');
    }
    
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    this.logger.log(Deleting user with ID: );
    const user = await this.usersService.findById(id);
    
    if (!user) {
      throw new NotFoundException(User with ID  not found);
    }
    
    await this.usersService.remove(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(Role.ADMIN)
  async activate(@Param('id') id: string) {
    this.logger.log(Activating user with ID: );
    const user = await this.usersService.findById(id);
    
    if (!user) {
      throw new NotFoundException(User with ID  not found);
    }
    
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string) {
    this.logger.log(Deactivating user with ID: );
    const user = await this.usersService.findById(id);
    
    if (!user) {
      throw new NotFoundException(User with ID  not found);
    }
    
    return this.usersService.deactivate(id);
  }
}
