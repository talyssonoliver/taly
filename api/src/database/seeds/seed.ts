import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { PrismaService } from '../prisma.service';
import { seedUsers } from './data/users.seed';
import { seedSalons } from './data/salons.seed';
import { seedServices } from './data/services.seed';
import { seedPlans } from './data/plans.seed';

async function seed() {
  const logger = new Logger('Seed');
  logger.log('Starting database seeding...');

  try {
    const app = await NestFactory.create(AppModule);
    const prismaService = app.get(PrismaService);
    
    logger.log('Cleaning database before seeding...');
    await prismaService.cleanDatabase();
    
    logger.log('Seeding users...');
    const users = await seedUsers(prismaService);
    logger.log("Seeded  users");

    logger.log('Seeding salons...');
    const salons = await seedSalons(prismaService, users);
    logger.log('Seeded  salons');

    logger.log('Seeding services...');
    const services = await seedServices(prismaService, salons);
    logger.log('Seeded  services');

    logger.log('Seeding subscription plans...');
    const plans = await seedPlans(prismaService, users);
    logger.log('Seeded  subscription plans');
    
    logger.log('Seeding completed successfully');
    
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed: ', error.stack);
    process.exit(1);
  }
}

seed();
