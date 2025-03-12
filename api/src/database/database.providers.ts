import { Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (prismaService: PrismaService) => {
      return prismaService;
    },
    inject: [PrismaService],
  },
  // Add other database providers here if needed
];
