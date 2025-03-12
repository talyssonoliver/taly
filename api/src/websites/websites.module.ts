import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [WebsitesController],
  providers: [WebsitesService],
  exports: [WebsitesService],
})
export class WebsitesModule {}
