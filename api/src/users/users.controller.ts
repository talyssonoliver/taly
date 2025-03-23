import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PaginationUtil } from '../common/utils/pagination.util';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

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
    this.logger.log(`Finding all users with page=${page}, limit=${limit}${search ? `, search=${search}` : ''}`, { page, limit, search });
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.usersService.findAll(pageNum, limitNum, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async findOne(@Param('id') id: string) {
    this.logger.log(`Finding user with ID: ${id}`);
    return this.getUserOrFail(id);
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: { id: string }) {
    this.logger.log(`Getting profile for user ID: ${user.id}`);
    return this.getUserOrFail(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`);
    return this.usersService.create(createUserDto);
  }

  @Post('staff')
  @ApiOperation({ summary: 'Create a new staff member' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async createStaff(@Body() createStaffDto: CreateStaffDto) {
    this.logger.log(`Creating new staff with email: ${createStaffDto.email}`);
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
    this.logger.log(`Updating user with ID: ${id}`);
    await this.getUserOrFail(id);
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`Updating profile for user ID: ${user.id}`);
    
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
    this.logger.log(`Deleting user with ID: ${id}`);
    await this.getUserOrFail(id);
    await this.usersService.remove(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(Role.ADMIN)
  async activate(@Param('id') id: string) {
    this.logger.log(`Activating user with ID: ${id}`);
    await this.getUserOrFail(id);
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string) {
    this.logger.log(`Deactivating user with ID: ${id}`);
    await this.getUserOrFail(id);
    return this.usersService.deactivate(id);
  }

  /**
   * Helper method to find a user by ID and throw NotFoundException if not found
   */
  private async getUserOrFail(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
