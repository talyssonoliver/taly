import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Report } from '../entities/report.entity';

@Injectable()
export class ReportRepository {
  constructor(
    
    private readonly repository: Repository<Report>,
  ) {}

  async findAll(query): Promise<Report[]> {
    const queryBuilder = this.repository.createQueryBuilder('report');
    
    if (query.type) {
      queryBuilder.andWhere('report.type = :type', { type: query.type });
    }
    
    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('report.createdAt BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    }
    
    return queryBuilder
      .orderBy('report.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Report> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data): Promise<Report> {
    const report = this.repository.create(data);
    return this.repository.save(report);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}



