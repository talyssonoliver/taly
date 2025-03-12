import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { testSalon, testUser, testClient, testService } from './fixtures';

export async function setupApp(app: INestApplication): Promise<void> {
  // Apply global pipes and middleware
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Seed the database with test data
  await seedDatabase(app);
}

async function seedDatabase(app: INestApplication): Promise<void> {
  const prismaService = app.get(PrismaService);
  
  // Clear existing test data
  await prismaService.$transaction([
    prismaService.payment.deleteMany(),
    prismaService.appointment.deleteMany(),
    prismaService.service.deleteMany(),
    prismaService.salon.deleteMany(),
    prismaService.client.deleteMany(),
    prismaService.user.deleteMany(),
  ]);
  
  // Create test users
  const adminUser = await prismaService.user.create({
    data: {
      email: 'admin@example.com',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // bcrypt hash of 'password123'
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  
  const stylistUser = await prismaService.user.create({
    data: {
      email: 'stylist@example.com',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
      firstName: 'Stylist',
      lastName: 'User',
      role: 'STYLIST',
    },
  });
  
  const clientUser = await prismaService.user.create({
    data: {
      email: 'client@example.com',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
      firstName: 'Client',
      lastName: 'User',
      role: 'CLIENT',
    },
  });
  
  // Create test salon
  const salon = await prismaService.salon.create({
    data: {
      name: 'Test Salon',
      address: '123 Main St, Anytown, AN 12345',
      phone: '+1-555-123-4567',
      email: 'salon@example.com',
      businessHours: [
        { day: 'MONDAY', open: '09:00', close: '18:00' },
        { day: 'TUESDAY', open: '09:00', close: '18:00' },
        { day: 'WEDNESDAY', open: '09:00', close: '18:00' },
        { day: 'THURSDAY', open: '09:00', close: '18:00' },
        { day: 'FRIDAY', open: '09:00', close: '18:00' },
        { day: 'SATURDAY', open: '10:00', close: '16:00' },
      ],
    },
  });
  
  // Create test services
  const haircut = await prismaService.service.create({
    data: {
      name: 'Haircut',
      description: 'Basic haircut and style',
      price: 45.0,
      duration: 45,
      salonId: salon.id,
    },
  });
  
  const color = await prismaService.service.create({
    data: {
      name: 'Hair Color',
      description: 'Full color treatment',
      price: 85.0,
      duration: 90,
      salonId: salon.id,
    },
  });
  
  // Create test clients
  const client = await prismaService.client.create({
    data: {
      firstName: 'Test',
      lastName: 'Client',
      email: 'testclient@example.com',
      phone: '+1-555-987-6543',
      notes: 'Test client notes',
      stylistId: stylistUser.id,
    },
  });
  
  // Create test availability for stylist
  await prismaService.availability.createMany({
    data: [
      { day: 'MONDAY', startTime: '09:00', endTime: '17:00', userId: stylistUser.id },
      { day: 'TUESDAY', startTime: '09:00', endTime: '17:00', userId: stylistUser.id },
      { day: 'WEDNESDAY', startTime: '09:00', endTime: '17:00', userId: stylistUser.id },
      { day: 'THURSDAY', startTime: '09:00', endTime: '17:00', userId: stylistUser.id },
      { day: 'FRIDAY', startTime: '09:00', endTime: '17:00', userId: stylistUser.id },
    ],
  });
  
  // Create test appointment
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const appointment = await prismaService.appointment.create({
    data: {
      date: tomorrow.toISOString(),
      status: 'CONFIRMED',
      notes: 'Test appointment notes',
      salonId: salon.id,
      serviceId: haircut.id,
      clientId: client.id,
      stylistId: stylistUser.id,
    },
  });
  
  // Create test payment
  await prismaService.payment.create({
    data: {
      amount: haircut.price,
      status: 'PENDING',
      paymentMethod: 'CREDIT_CARD',
      appointmentId: appointment.id,
    },
  });
  
  // Create test subscription
  await prismaService.subscription.create({
    data: {
      planName: 'VIP Membership',
      price: 49.99,
      billingCycle: 'MONTHLY',
      status: 'ACTIVE',
      startDate: new Date().toISOString(),
      features: ['Discounted services', 'Free bi-monthly haircuts'],
      clientId: client.id,
    },
  });
}
