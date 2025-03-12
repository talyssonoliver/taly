import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

export async function teardownApp(app: INestApplication): Promise<void> {
  const prismaService = app.get(PrismaService);
  
  // Clean up test data
  await prismaService.$transaction([
    prismaService.payment.deleteMany(),
    prismaService.refund.deleteMany(),
    prismaService.appointment.deleteMany(),
    prismaService.subscription.deleteMany(),
    prismaService.availability.deleteMany(),
    prismaService.service.deleteMany(),
    prismaService.salon.deleteMany(),
    prismaService.client.deleteMany(),
    prismaService.user.deleteMany(),
  ]);
  
  // Disconnect Prisma
  await prismaService.$disconnect();
}
