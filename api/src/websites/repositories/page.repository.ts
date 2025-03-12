import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Page } from '../entities/page.entity';
import { CreatePageDto, UpdatePageDto } from '../dto';

@Injectable()
export class PageRepository {
  constructor(
    
    private pageRepository: Repository<Page>,
  ) {}

  async findAllByWebsiteId(websiteId: string): Promise<Page[]> {
    return this.pageRepository.find({
      where: { websiteId },
      order: { sortOrder: 'ASC' },
    });
  }

  async findById(id: string): Promise<Page> {
    return this.pageRepository.findOne({
      where: { id },
      relations: ['website'],
    });
  }

  async findBySlug(websiteId: string, slug: string): Promise<Page> {
    return this.pageRepository.findOne({
      where: { websiteId, slug },
    });
  }

  async findHomePage(websiteId: string): Promise<Page> {
    return this.pageRepository.findOne({
      where: { websiteId, isHomePage: true },
    });
  }

  async create(createPageDto: CreatePageDto & { websiteId: string }): Promise<Page> {
    const page = this.pageRepository.create(createPageDto);
    return this.pageRepository.save(page);
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    await this.pageRepository.update(id, updatePageDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.pageRepository.delete(id);
  }
  
  async updatePublishedStatus(id: string, isPublished: boolean): Promise<Page> {
    const updateData: Partial<Page> = { 
      isPublished,
      lastPublishedAt: isPublished ? new Date() : null 
    };
    
    await this.pageRepository.update(id, updateData);
    return this.findById(id);
  }
  
  async updateSortOrder(pages: { id: string; sortOrder: number }[]): Promise<void> {
    const queryRunner = this.pageRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (const page of pages) {
        await queryRunner.manager.update(Page, page.id, { sortOrder: page.sortOrder });
      }
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}



