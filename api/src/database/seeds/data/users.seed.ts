import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../common/enums/roles.enum';

export async function seedUsers(prisma: PrismaService) {
  const saltRounds = 10;
  
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const userPassword = await bcrypt.hash('user123', saltRounds);
  const staffPassword = await bcrypt.hash('staff123', saltRounds);
  
  const users = [
    // Admin user
    {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      isActive: true,
    },
    // Regular user
    {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: Role.USER,
      isActive: true,
    },
    // Staff user
    {
      email: 'staff@example.com',
      password: staffPassword,
      firstName: 'Staff',
      lastName: 'User',
      role: Role.STAFF,
      isActive: true,
    },
    // Salon owner
    {
      email: 'owner@example.com',
      password: userPassword,
      firstName: 'Salon',
      lastName: 'Owner',
      role: Role.USER,
      isActive: true,
    },
    // Doctor
    {
      email: 'doctor@example.com',
      password: userPassword,
      firstName: 'Doctor',
      lastName: 'Smith',
      role: Role.DOCTOR,
      isActive: true,
    },
  ];
  
  const createdUsers = [];
  
  for (const userData of users) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    
    if (!existingUser) {
      const user = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(user);
    } else {
      createdUsers.push(existingUser);
    }
  }
  
  return createdUsers;
}
