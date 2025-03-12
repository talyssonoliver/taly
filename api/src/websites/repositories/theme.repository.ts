import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from '../entities/theme.entity';

@Injectable()
export class ThemeRepository {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  async findAll(options?: { 
    category?: string;
    isPremium?: boolean;
    isActive?: boolean;
    skip?: number;
    take?: number;
  }): Promise<[Theme[], number]> {
    const where: any = {};
    
    if (options?.category) {
      where.category = options.category;
    }
    
    if (options?.isPremium !== undefined) {
      where.isPremium = options.isPremium;
    }
    
    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }
    
    return this.themeRepository.findAndCount({
      where,
      skip: options?.skip || 0,
      take: options?.take || 20,
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Theme> {
    return this.themeRepository.findOne({
      where: { id },
    });
  }

  async findWithStats(): Promise<any[]> {
    // This would likely use a raw query to join with websites and get usage stats
    return this.themeRepository
      .createQueryBuilder('theme')
      .leftJoin('websites', 'website', 'website.themeId = theme.id')
      .select('theme.*')
      .addSelect('COUNT(website.id)', 'usageCount')
      .groupBy('theme.id')
      .getRawMany();
  }
}
