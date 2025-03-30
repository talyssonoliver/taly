import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../api/src/common/enums/roles.enum';
import { PaginationUtil } from '../../../api/src/common/utils/pagination.util';
import { RoleRepository } from '../../../api/src/users/repositories/role.repository';
import { StaffRepository } from '../../../api/src/users/repositories/staff.repository';
import { UserRepository } from '../../../api/src/users/repositories/user.repository';
import { UsersService } from '../../../api/src/users/users.service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;
  let staffRepository: StaffRepository;
  let roleRepository: RoleRepository;
  let prismaService: any;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
    firstName: 'John',
    lastName: 'Doe',
    role: Role.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: 'user-id',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: Role.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStaff = {
    id: 'staff-id',
    userId: 'user-id',
    permissions: { canRead: true, canWrite: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRole = {
    id: 'role-id',
    name: Role.ADMIN,
    description: 'Administrator',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Create mocks directly without using NestJS testing module
    prismaService = {
      $transaction: jest.fn((callback) => callback({
        user: {
          create: jest.fn().mockResolvedValue(mockUser),
        },
        staff: {
          create: jest.fn().mockResolvedValue(mockStaff),
        }
      })),
      user: {
        create: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockResolvedValue(mockUser),
        delete: jest.fn().mockResolvedValue(mockUser),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      staff: {
        create: jest.fn().mockResolvedValue(mockStaff),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    
    userRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithStaff: jest.fn(),
    } as unknown as UserRepository;
    
    staffRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
    } as unknown as StaffRepository;
    
    roleRepository = {
      findById: jest.fn(),
    } as unknown as RoleRepository;
    
    // Directly instantiate the service with mocks
    service = new UsersService(
      prismaService as any, 
      userRepository,
      roleRepository,
      staffRepository
    );
  });

  describe('findAll', () => {
    it('should return paginated users with sanitized data', async () => {
      const mockUsers = [mockUser, mockUser];
      const mockPaginatedResult = {
        data: mockUsers.map(user => ({ ...user, password: undefined })),
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false
        },
      };

      // Setup mocks
      jest.spyOn(PaginationUtil, 'getPaginationValues').mockReturnValue({ skip: 0, take: 10 });
      jest.spyOn(userRepository, 'findMany').mockResolvedValue(mockUsers);
      jest.spyOn(userRepository, 'count').mockResolvedValue(2);
      jest.spyOn(PaginationUtil, 'createPaginatedResult').mockReturnValue(mockPaginatedResult);

      // Execute
      const result = await service.findAll(1, 10);

      // Verify
      expect(userRepository.findMany).toHaveBeenCalledWith({ skip: 0, take: 10, where: {} }); // Fix: use empty object instead of undefined
      expect(userRepository.count).toHaveBeenCalledWith({}); // Fix: remove the where property wrapper
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should apply search filter when provided', async () => {
      // Setup mocks
      jest.spyOn(PaginationUtil, 'getPaginationValues').mockReturnValue({ skip: 0, take: 10 });
      jest.spyOn(userRepository, 'findMany').mockResolvedValue([mockUser]);
      jest.spyOn(userRepository, 'count').mockResolvedValue(1);
      jest.spyOn(PaginationUtil, 'createPaginatedResult').mockReturnValue({
        data: [{ ...mockUser, password: undefined }],
        meta: { 
          total: 1, 
          page: 1, 
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false 
        },
      });

      // Execute
      await service.findAll(1, 10, 'john');

      // Verify
      expect(userRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { email: { contains: 'john', mode: 'insensitive' } },
            { firstName: { contains: 'john', mode: 'insensitive' } },
            { lastName: { contains: 'john', mode: 'insensitive' } },
          ],
        },
      });
    });

    it('should apply role filter when provided', async () => {
      // Setup mocks
      jest.spyOn(PaginationUtil, 'getPaginationValues').mockReturnValue({ skip: 0, take: 10 });
      jest.spyOn(userRepository, 'findMany').mockResolvedValue([mockUser]);
      jest.spyOn(userRepository, 'count').mockResolvedValue(1);
      jest.spyOn(PaginationUtil, 'createPaginatedResult').mockReturnValue({
        data: [{ ...mockUser, password: undefined }],
        meta: { 
          total: 1, 
          page: 1, 
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false 
        },
      });

      // Execute
      await service.findAll(1, 10, undefined, Role.USER);

      // Verify
      expect(userRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { role: Role.USER },
      });
    });
  });

  describe('findById', () => {
    it('should return user without password when found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

      // Execute
      const result = await service.findById('user-id');

      // Verify
      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({
        ...mockUserWithoutPassword,
        fullName: 'John Doe',
      });
      expect((result as any).password).toBeUndefined();
    });

    it('should return null when user not found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Execute
      const result = await service.findById('nonexistent-id');

      // Verify
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user with password when found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);

      // Execute
      const result = await service.findByEmail('test@example.com');

      // Verify
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user and return without password', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser);

      // Execute
      const result = await service.create({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      });

      // Verify
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.USER,
        isActive: true,
      });
      expect((result as any).password).toBeUndefined();
      expect(result.fullName).toBe('John Doe');
    });

    it('should throw ConflictException when email already exists', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);

      // Execute & Verify
      await expect(
        service.create({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update and return user without password', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue({
        ...mockUser,
        firstName: 'Updated',
      });

      // Execute
      const result = await service.update('user-id', { firstName: 'Updated' });

      // Verify
      expect(userRepository.update).toHaveBeenCalledWith('user-id', { firstName: 'Updated' });
      expect((result as any).password).toBeUndefined();
      expect(result.firstName).toBe('Updated');
      expect(result.fullName).toBe('Updated Doe');
    });

    it('should hash password when updating password', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'update').mockResolvedValue(mockUser);

      // Execute
      await service.update('user-id', { password: 'NewPassword123!' });

      // Verify
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
      expect(userRepository.update).toHaveBeenCalledWith('user-id', {
        password: 'hashed-password',
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Execute & Verify
      await expect(
        service.update('nonexistent-id', { firstName: 'Updated' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return user without password', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'delete').mockResolvedValue(mockUser);

      // Execute
      const result = await service.remove('user-id');

      // Verify
      expect(userRepository.delete).toHaveBeenCalledWith('user-id');
      expect((result as any).password).toBeUndefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Execute & Verify
      await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('activate', () => {
    it('should activate and return user without password', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue({
        ...mockUser,
        isActive: false,
      });
      jest.spyOn(userRepository, 'update').mockResolvedValue({
        ...mockUser,
        isActive: true,
      });

      // Execute
      const result = await service.activate('user-id');

      // Verify
      expect(userRepository.update).toHaveBeenCalledWith('user-id', { isActive: true });
      expect((result as any).password).toBeUndefined();
      expect(result.isActive).toBe(true);
    });

    it('should not update if user is already active', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue({
        ...mockUser,
        isActive: true,
      });
      jest.spyOn(userRepository, 'update');

      // Execute
      const result = await service.activate('user-id');

      // Verify
      expect(userRepository.update).not.toHaveBeenCalled();
      expect((result as any).password).toBeUndefined();
      expect(result.isActive).toBe(true);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Execute & Verify
      await expect(service.activate('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should deactivate and return user without password', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue({
        ...mockUser,
        isActive: true,
      });
      jest.spyOn(userRepository, 'update').mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      // Execute
      const result = await service.deactivate('user-id');

      // Verify
      expect(userRepository.update).toHaveBeenCalledWith('user-id', { isActive: false });
      expect((result as any).password).toBeUndefined();
      expect(result.isActive).toBe(false);
    });

    it('should not update if user is already inactive', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue({
        ...mockUser,
        isActive: false,
      });
      jest.spyOn(userRepository, 'update');

      // Execute
      const result = await service.deactivate('user-id');

      // Verify
      expect(userRepository.update).not.toHaveBeenCalled();
      expect((result as any).password).toBeUndefined();
      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Execute & Verify
      await expect(service.deactivate('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRole', () => {
    it('should assign role and return user without password', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(roleRepository, 'findById').mockResolvedValue(mockRole);
      jest.spyOn(userRepository, 'update').mockResolvedValue({
        ...mockUser,
        role: Role.ADMIN,
      });

      // Execute
      const result = await service.assignRole('user-id', 'role-id');

      // Verify
      expect(userRepository.update).toHaveBeenCalledWith('user-id', { role: Role.ADMIN });
      expect((result as any).password).toBeUndefined();
      expect(result.role).toBe(Role.ADMIN);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
      jest.spyOn(roleRepository, 'findById').mockResolvedValue(mockRole);

      // Execute & Verify
      await expect(service.assignRole('nonexistent-id', 'role-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when role not found', async () => {
      // Setup mocks
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(roleRepository, 'findById').mockResolvedValue(null);

      // Execute & Verify
      await expect(service.assignRole('user-id', 'nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findStaff', () => {
    it('should return paginated staff users with sanitized data', async () => {
      const mockStaffUser = {
        ...mockUser,
        role: Role.STAFF,
        staff: mockStaff,
      };

      // Setup mocks
      const mockPaginatedResult = {
        data: [
          {
            ...mockStaffUser,
            password: undefined,
            fullName: 'John Doe',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false
        },
      };

      // Setup mocks
      jest.spyOn(PaginationUtil, 'getPaginationValues').mockReturnValue({ skip: 0, take: 10 });
      jest.spyOn(userRepository, 'findWithStaff').mockResolvedValue([mockStaffUser]);
      jest.spyOn(userRepository, 'count').mockResolvedValue(1);
      jest.spyOn(PaginationUtil, 'createPaginatedResult').mockReturnValue(mockPaginatedResult);

      // Execute
      const result = await service.findStaff(1, 10);

      // Verify
      expect(userRepository.findWithStaff).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { role: Role.STAFF },
      });
      expect(userRepository.count).toHaveBeenCalledWith({ where: { role: Role.STAFF } });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should apply search filter when provided', async () => {
      // Setup mocks
      jest.spyOn(PaginationUtil, 'getPaginationValues').mockReturnValue({ skip: 0, take: 10 });
      jest.spyOn(userRepository, 'findWithStaff').mockResolvedValue([]);
      jest.spyOn(userRepository, 'count').mockResolvedValue(0);
      jest.spyOn(PaginationUtil, 'createPaginatedResult').mockReturnValue({
        data: [],
        meta: { 
          total: 0, 
          page: 1, 
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false 
        },
      });

      // Execute
      await service.findStaff(1, 10, 'john');

      // Verify
      expect(userRepository.findWithStaff).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          role: Role.STAFF,
          OR: [
            { email: { contains: 'john', mode: 'insensitive' } },
            { firstName: { contains: 'john', mode: 'insensitive' } },
            { lastName: { contains: 'john', mode: 'insensitive' } },
          ],
        },
      });
    });
  });

  describe('createStaff', () => {
    it('should create a staff user with permissions', async () => {
      const staffUser = {
        ...mockUser,
        role: Role.STAFF,
        staff: mockStaff,
      };

      // Setup mocks
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(staffRepository, 'create').mockResolvedValue(mockStaff);
      
      // Fix: Properly mock the $transaction implementation
      prismaService.$transaction = jest.fn().mockImplementation(async (callback) => {
        // First create the mock implementation to match what Prisma would do
        const mockTransactionPrisma = {
          user: {
            create: jest.fn().mockResolvedValue({
              ...mockUser,
              role: Role.STAFF
            })
          },
          staff: {
            create: jest.fn().mockResolvedValue(mockStaff)
          }
        };
        
        // Call the callback with our mock Prisma client
        await callback(mockTransactionPrisma);
        
        // Return the expected result
        return staffUser;
      });

      // Execute
      const result = await service.createStaff({
        email: 'staff@example.com',
        password: 'Password123!',
        firstName: 'Staff',
        lastName: 'User',
        permissions: { canRead: true, canWrite: true },
      });

      // Verify
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(prismaService.$transaction).toHaveBeenCalled();
      
      expect(result.role).toBe(Role.STAFF);
      expect(result).toHaveProperty('staff');
      expect((result as any).password).toBeUndefined();
    });

    // ...existing code...
  });
  
  // Add a test that specifically uses the staffRepository
  describe('findStaffByUserId', () => {
    it('should call staffRepository.findByUserId with the correct id', async () => {
      // Setup mocks
      jest.spyOn(staffRepository, 'findByUserId').mockResolvedValue(mockStaff);
      
      // Execute the method that would use staffRepository
      const result = await service.findStaffByUserId('user-id');
      
      // Verify
      expect(staffRepository.findByUserId).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockStaff);
    });
  });
});