import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalonsController } from './salons.controller';
import { SalonsService } from './salons.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [SalonsController],
  providers: [SalonsService],
  exports: [SalonsService],
})
export class SalonsModule {}
