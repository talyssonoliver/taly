import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Plan } from '../entities/plan.entity';

@Injectable()
export class PlanRepository {
  constructor(
    
    private planRepository: Repository<Plan>,
  ) {}

  async findAll(includeInactive: boolean = false): Promise<Plan[]> {
    if (includeInactive) {
      return this.planRepository.find();
    }
    
    return this.planRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Plan | null> {
    return this.planRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Plan | null> {
    return this.planRepository.findOne({ where: { name } });
  }

  async findPublicPlans(): Promise<Plan[]> {
    return this.planRepository.find({ 
      where: { isActive: true, isPublic: true },
      order: { tier: 'ASC', price: 'ASC' }
    });
  }
}



