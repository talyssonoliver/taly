import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { StaffRepository } from './repositories/staff.repository';
import { RoleRepository } from './repositories/role.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Role } from '../common/enums/roles.enum';
import { PaginationUtil } from '../common/utils/pagination.util';
import { User, UserWithoutPassword } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly staffRepository: StaffRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  /**
   * Find all users with pagination and optional search
   * @param page - Page number
   * @param limit - Number of items per page
   * @param search - Optional search term for email, firstName, or lastName
   * @param role - Optional role filter
   * @returns Paginated result with users (passwords removed)
   */
  async findAll(page: number, limit: number, search?: string, role?: Role) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      
      let where: any = {};
      
      // Add search condition if provided
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      // Add role filter if provided
      if (role) {
        where.role = role;
      }
      
      // If where is empty, set it to undefined
      if (Object.keys(where).length === 0) {
        where = undefined;
      }
      
      // Get users and total count in parallel
      const [users, total] = await Promise.all([
        this.userRepository.findMany({ skip, take, where }),
        this.userRepository.count({ where }),
      ]);
      
      // Remove passwords from user objects
      const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      return PaginationUtil.createPaginatedResult(sanitizedUsers, total, page, limit);
    } catch (error) {
      this.logger.error(`Error finding all users: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User without password or null if not found
   */
  async findById(id: string): Promise<UserWithoutPassword | null> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        return null;
      }
      
      // Remove password from response
      const { password, ...result } = user;
      
      // Add computed fullName property
      const fullName = `${result.firstName} ${result.lastName || ''}`.trim();
      
      return {
        ...result,
        fullName,
      };
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  /**
   * Find a user by email (includes password for authentication)
   * @param email - User email
   * @returns User with password or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.userRepository.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user by email');
    }
  }

  /**
   * Create a new user
   * @param createUserDto - User creation data
   * @returns Created user without password
   */
  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    try {
      const { email, password, ...rest } = createUserDto;
      
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create user with default role if not specified
      const userData = {
        email,
        password: hashedPassword,
        role: rest.role || Role.USER,
        isActive: rest.isActive !== undefined ? rest.isActive : true,
        ...rest,
      };
      
      // Create user
      const newUser = await this.userRepository.create(userData);
      
      // Remove password from response
      const { password: _, ...result } = newUser;
      
      // Add computed fullName property
      const fullName = `${result.firstName} ${result.lastName || ''}`.trim();
      
      return {
        ...result,
        fullName,
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Create a staff user with permissions
   * @param createStaffDto - Staff user creation data
   * @returns Created staff user without password
   */
  async createStaff(createStaffDto: CreateStaffDto) {
    try {
      const { email, password, permissions, ...rest } = createStaffDto;
      
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create staff user with transaction
      const newStaff = await this.prisma.$transaction(async (prisma) => {
        // Create user with staff role
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: Role.STAFF,
            isActive: true,
            ...rest,
          },
        });
        
        // Create staff profile
        const staff = await prisma.staff.create({
          data: {
            userId: user.id,
            permissions,
          },
        });
        
        return { ...user, staff };
      });
      
      // Remove password from response
      const { password: _, ...result } = newStaff;
      
      // Add computed fullName property
      const fullName = `${result.firstName} ${result.lastName || ''}`.trim();
      
      return {
        ...result,
        fullName,
      };
    } catch (error) {
      this.logger.error(`Error creating staff: ${error.message}`, error.stack);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create staff user');
    }
  }

  /**
   * Update a user
   * @param id - User ID
   * @param updateUserDto - User update data
   * @returns Updated user without password
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      const { password, ...restDto } = updateUserDto;
      
      // If updating email, check if it's already taken
      if (restDto.email && restDto.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(restDto.email);
        
        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('Email already registered');
        }
      }
      
      // If updating password, hash it
      let hashedPassword = undefined;
      if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }
      
      // Update user
      const updatedUser = await this.userRepository.update(id, {
        ...restDto,
        ...(hashedPassword && { password: hashedPassword }),
      });
      
      // Remove password from response
      const { password: _, ...result } = updatedUser;
      
      // Add computed fullName property
      const fullName = `${result.firstName} ${result.lastName || ''}`.trim();
      
      return {
        ...result,
        fullName,
      };
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns Deleted user without password
   */
  async remove(id: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      const deletedUser = await this.userRepository.delete(id);
      
      // Remove password from response
      const { password, ...result } = deletedUser;
      
      return result;
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  /**
   * Activate a user
   * @param id - User ID
   * @returns Activated user without password
   */
  async activate(id: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      if (user.isActive) {
        return { ...user, password: undefined };
      }
      
      const updatedUser = await this.userRepository.update(id, { isActive: true });
      
      // Remove password from response
      const { password, ...result } = updatedUser;
      
      // Add computed fullName property
      const fullName = `${result.firstName} ${result.lastName || ''}`.trim();
      
      return {
        ...result,
        fullName,
      };
    } catch (error) {
      this.logger.error(`Error activating user: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to activate user');
    }
  }

  /**
   * Deactivate a user
   * @param id - User ID
   * @returns Deactivated user without password
   */
  async deactivate(id: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      if (!user.isActive) {
        return { ...user, password: undefined };
      }
      
      const updatedUser = await this.userRepository.update(id, { isActive: false });
      
      // Remove password from response
      const { password, ...result } = updatedUser;
      
      // Add computed fullName property
      const fullName = `${result.firstName} ${result.lastName || ''}`.trim();
      
      return {
        ...result,
        fullName,
      };
    } catch (error) {
      this.logger.error(`Error deactivating user: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }

  /**
   * Assign a role to a user
   * @param userId - User ID
   * @param roleId - Role ID
   * @returns Updated user without password
   */
  async assignRole(userId: string, roleId: string): Promise<UserWithoutPassword> {
    try {
      const [user, role] = await Promise.all([
        this.userRepository.findById(userId),
        this.roleRepository.findById(roleId),
      ]);
      
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }
      
      const updatedUser = await this.userRepository.update(userId, {
        role: role.name as Role,
      });
      
      // Remove password from response
      const { password, ...result } = updatedUser;
      
      // Add computed fullName property
      const fullName = `${result.firstName} ${result.lastName || ''}`.trim();
      
      return {
        ...result,
        fullName,
      };
    } catch (error) {
      this.logger.error(`Error assigning role: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to assign role');
    }
  }
  
  /**
   * Find staff users with pagination and optional search
   * @param page - Page number
   * @param limit - Number of items per page
   * @param search - Optional search term for email, firstName, or lastName
   * @returns Paginated result with staff users (passwords removed)
   */
  async findStaff(page: number, limit: number, search?: string) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      
      let where: any = { role: Role.STAFF };
      
      // Add search condition if provided
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      // Get users with staff details and total count in parallel
      const [staffUsers, total] = await Promise.all([
        this.userRepository.findWithStaff({ skip, take, where }),
        this.userRepository.count({ where }),
      ]);
      
      // Remove passwords from user objects
      const sanitizedUsers = staffUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        // Add computed fullName property
        const fullName = `${userWithoutPassword.firstName} ${userWithoutPassword.lastName || ''}`.trim();
        return {
          ...userWithoutPassword,
          fullName,
        };
      });
      
      return PaginationUtil.createPaginatedResult(sanitizedUsers, total, page, limit);
    } catch (error) {
      this.logger.error(`Error finding staff users: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve staff users');
    }
  }
}