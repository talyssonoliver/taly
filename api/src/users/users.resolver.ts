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
import type { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { CreateStaffDto } from './dto/create-staff.dto';

@Resolver('User')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  @Roles(Role.ADMIN)
  async getUsers(
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Args('search', { nullable: true }) search?: string,
  ) {
    return this.usersService.findAll(page, limit, search);
  }

  @Query('user')
  @Roles(Role.ADMIN, Role.STAFF)
  async getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Query('me')
  async getMe(@CurrentUser() user) {
    return this.usersService.findById(user.id);
  }

  @Mutation('createUser')
  @Roles(Role.ADMIN)
  async createUser(@Args('input') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Mutation('createStaff')
  @Roles(Role.ADMIN)
  async createStaff(@Args('input') createStaffDto: CreateStaffDto) {
    return this.usersService.createStaff(createStaffDto);
  }

  @Mutation('updateUser')
  @Roles(Role.ADMIN)
  async updateUser(
    @Args('id') id: string,
    @Args('input') updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation('updateMe')
  async updateMe(
    @CurrentUser() user,
    @Args('input') updateUserDto: UpdateUserDto,
  ) {
    // Prevent role change from profile update
    if (updateUserDto.role) {
      throw new Error('Role cannot be changed from profile update');
    }
    
    return this.usersService.update(user.id, updateUserDto);
  }

  @Mutation('removeUser')
  @Roles(Role.ADMIN)
  async removeUser(@Args('id') id: string) {
    await this.usersService.remove(id);
    return true;
  }

  @Mutation('activateUser')
  @Roles(Role.ADMIN)
  async activateUser(@Args('id') id: string) {
    return this.usersService.activate(id);
  }

  @Mutation('deactivateUser')
  @Roles(Role.ADMIN)
  async deactivateUser(@Args('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Mutation('assignRole')
  @Roles(Role.ADMIN)
  async assignRole(
    @Args('userId') userId: string,
    @Args('roleId') roleId: string,
  ) {
    return this.usersService.assignRole(userId, roleId);
  }
}
