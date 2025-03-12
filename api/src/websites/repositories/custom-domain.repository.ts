import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CustomDomain } from '../entities/custom-domain.entity';

@Injectable()
export class CustomDomainRepository {
  constructor(
    
    private customDomainRepository: Repository<CustomDomain>,
  ) {}

  async findByWebsiteId(websiteId: string): Promise<CustomDomain> {
    return this.customDomainRepository.findOne({
      where: { websiteId },
    });
  }

  async findById(id: string): Promise<CustomDomain> {
    return this.customDomainRepository.findOne({
      where: { id },
      relations: ['website'],
    });
  }

  async findByDomain(domain: string): Promise<CustomDomain> {
    return this.customDomainRepository.findOne({
      where: { domain },
      relations: ['website'],
    });
  }

  async create(data: Partial<CustomDomain>): Promise<CustomDomain> {
    const customDomain = this.customDomainRepository.create(data);
    return this.customDomainRepository.save(customDomain);
  }

  async update(id: string, data: Partial<CustomDomain>): Promise<CustomDomain> {
    await this.customDomainRepository.update(id, data);
    return this.findById(id);
  }

  async updateStatus(id: string, status: 'pending' | 'active' | 'failed' | 'verifying', errorMessage?: string): Promise<CustomDomain> {
    const updateData: Partial<CustomDomain> = { 
      status,
      verifiedAt: status === 'active' ? new Date() : undefined,
      errorMessage: errorMessage || null,
    };
    
    await this.customDomainRepository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.customDomainRepository.delete(id);
  }
}



