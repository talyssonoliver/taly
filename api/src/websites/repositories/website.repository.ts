import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Website } from '../entities/website.entity';
import { CreateWebsiteDto, UpdateWebsiteDto } from '../dto';

@Injectable()
export class WebsiteRepository {
  constructor(
    
    private websiteRepository: Repository<Website>,
  ) {}

  async findAll(userId?: string, options?: { 
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<[Website[], number]> {
    const where: FindOptionsWhere<Website> = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    return this.websiteRepository.findAndCount({
      where,
      skip: options?.skip || 0,
      take: options?.take || 10,
      order: options?.orderBy 
        ? { [options.orderBy]: options.orderDirection || 'DESC' } 
        : { createdAt: 'DESC' },
      relations: ['theme', 'user', 'customDomain'],
    });
  }

  async findById(id: string): Promise<Website> {
    return this.websiteRepository.findOne({
      where: { id },
      relations: ['theme', 'user', 'customDomain'],
    });
  }

  async findByUrl(url: string): Promise<Website> {
    return this.websiteRepository.findOne({
      where: { url },
      relations: ['theme', 'user', 'customDomain'],
    });
  }

  async create(createWebsiteDto: CreateWebsiteDto): Promise<Website> {
    const website = this.websiteRepository.create(createWebsiteDto);
    return this.websiteRepository.save(website);
  }

  async update(id: string, updateWebsiteDto: UpdateWebsiteDto): Promise<Website> {
    await this.websiteRepository.update(id, updateWebsiteDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.websiteRepository.delete(id);
  }
  
  async updatePublishedStatus(id: string, isPublished: boolean): Promise<Website> {
    const updateData: Partial<Website> = { 
      isPublished,
      publishedAt: isPublished ? new Date() : null 
    };
    
    await this.websiteRepository.update(id, updateData);
    return this.findById(id);
  }
  
  async countByUserId(userId: string): Promise<number> {
    return this.websiteRepository.count({
      where: { userId }
    });
  }
}



