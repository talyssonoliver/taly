import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [PrismaService],
  exports: [PrismaModule, PrismaService],
})
export class DatabaseModule {}
