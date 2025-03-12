import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Website } from './entities/website.entity';
import { WebsiteTheme } from './entities/website-theme.entity';
import { WebsitePage } from './entities/website-page.entity';
import { WebsiteRepository } from './repositories/website.repository';
import { WebsiteThemeRepository } from './repositories/website-theme.repository';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class WebsitesService {
  private readonly logger = new Logger(WebsitesService.name);

  constructor(
    private readonly websiteRepository: WebsiteRepository,
    private readonly websiteThemeRepository: WebsiteThemeRepository,
    @InjectRepository(WebsitePage)
    private readonly websitePageRepository: Repository<WebsitePage>,
  ) {}

  /**
   * Find all websites, optionally filtered by user ID
   */
  async findAll(userId?: string): Promise<Website[]> {
    return this.websiteRepository.findAll(userId);
  }

  /**
   * Find a single website by ID
   */
  async findOne(id: string): Promise<Website> {
    return this.websiteRepository.findOne(id);
  }

  /**
   * Create a new website
   */
  async create(createWebsiteDto: CreateWebsiteDto): Promise<Website> {
    // Check if domain is already in use
    const existingWebsite = await this.websiteRepository.findByDomain(createWebsiteDto.domain);
    if (existingWebsite) {
      throw new ConflictException('Domain is already in use');
    }

    // Validate theme
    const theme = await this.websiteThemeRepository.findOne(createWebsiteDto.themeId);
    if (!theme) {
      throw new NotFoundException(Theme with ID \ not found);
    }

    return this.websiteRepository.createWebsite(createWebsiteDto, theme);
  }

  /**
   * Update an existing website
   */
  async update(id: string, updateWebsiteDto: UpdateWebsiteDto): Promise<Website> {
    const website = await this.websiteRepository.findOne(id);
    if (!website) {
      throw new NotFoundException(Website with ID \ not found);
    }

    // If domain is being changed, check if new domain is available
    if (updateWebsiteDto.domain && updateWebsiteDto.domain !== website.domain) {
      const existingWebsite = await this.websiteRepository.findByDomain(updateWebsiteDto.domain);
      if (existingWebsite && existingWebsite.id !== id) {
        throw new ConflictException('Domain is already in use');
      }
    }

    // If theme is being changed, validate new theme
    if (updateWebsiteDto.themeId) {
      const theme = await this.websiteThemeRepository.findOne(updateWebsiteDto.themeId);
      if (!theme) {
        throw new NotFoundException(Theme with ID \ not found);
      }
    }

    return this.websiteRepository.updateWebsite(id, updateWebsiteDto);
  }

  /**
   * Delete a website
   */
  async remove(id: string): Promise<void> {
    const website = await this.websiteRepository.findOne(id);
    if (!website) {
      throw new NotFoundException(Website with ID \ not found);
    }

    await this.websiteRepository.removeWebsite(id);
  }

  /**
   * Get all pages for a website
   */
  async findAllPages(websiteId: string): Promise<WebsitePage[]> {
    const website = await this.websiteRepository.findOne(websiteId);
    if (!website) {
      throw new NotFoundException(Website with ID \ not found);
    }

    return this.websitePageRepository.find({
      where: { website: { id: websiteId } },
      order: { sortOrder: 'ASC' },
    });
  }

  /**
   * Find a specific page
   */
  async findOnePage(websiteId: string, pageId: string): Promise<WebsitePage> {
    const website = await this.websiteRepository.findOne(websiteId);
    if (!website) {
      throw new NotFoundException(Website with ID \ not found);
    }

    const page = await this.websitePageRepository.findOne({
      where: { id: pageId, website: { id: websiteId } },
    });

    if (!page) {
      throw new NotFoundException(Page with ID \ not found);
    }

    return page;
  }

  /**
   * Create a new page for a website
   */
  async createPage(websiteId: string, createPageDto: CreatePageDto): Promise<WebsitePage> {
    const website = await this.websiteRepository.findOne(websiteId);
    if (!website) {
      throw new NotFoundException(Website with ID \ not found);
    }

    // Check if path is already in use for this website
    const existingPage = await this.websitePageRepository.findOne({
      where: { path: createPageDto.path, website: { id: websiteId } },
    });

    if (existingPage) {
      throw new ConflictException(A page with path '\' already exists);
    }

    // Find highest sort order for proper placement
    const maxSortOrder = await this.websitePageRepository
      .createQueryBuilder('page')
      .where('page.websiteId = :websiteId', { websiteId })
      .select('MAX(page.sortOrder)', 'maxSortOrder')
      .getRawOne();

    const page = new WebsitePage();
    page.title = createPageDto.title;
    page.path = createPageDto.path;
    page.content = createPageDto.content;
    page.isPublished = createPageDto.isPublished ?? true;
    page.metaTitle = createPageDto.metaTitle || createPageDto.title;
    page.metaDescription = createPageDto.metaDescription || '';
    page.sortOrder = createPageDto.sortOrder ?? (maxSortOrder?.maxSortOrder || 0) + 1;
    page.website = website;

    return this.websitePageRepository.save(page);
  }

  /**
   * Update an existing page
   */
  async updatePage(
    websiteId: string,
    pageId: string,
    updatePageDto: UpdatePageDto,
  ): Promise<WebsitePage> {
    const page = await this.findOnePage(websiteId, pageId);

    // Check if path is being changed and if it's unique
    if (updatePageDto.path && updatePageDto.path !== page.path) {
      const existingPage = await this.websitePageRepository.findOne({
        where: { path: updatePageDto.path, website: { id: websiteId } },
      });

      if (existingPage && existingPage.id !== pageId) {
        throw new ConflictException(A page with path '\' already exists);
      }
    }

    // Update page properties
    if (updatePageDto.title !== undefined) page.title = updatePageDto.title;
    if (updatePageDto.path !== undefined) page.path = updatePageDto.path;
    if (updatePageDto.content !== undefined) page.content = updatePageDto.content;
    if (updatePageDto.isPublished !== undefined) page.isPublished = updatePageDto.isPublished;
    if (updatePageDto.metaTitle !== undefined) page.metaTitle = updatePageDto.metaTitle;
    if (updatePageDto.metaDescription !== undefined) page.metaDescription = updatePageDto.metaDescription;
    if (updatePageDto.sortOrder !== undefined) page.sortOrder = updatePageDto.sortOrder;

    return this.websitePageRepository.save(page);
  }

  /**
   * Delete a page
   */
  async removePage(websiteId: string, pageId: string): Promise<void> {
    const page = await this.findOnePage(websiteId, pageId);

    // Don't allow deleting the home page
    if (page.path === '/' || page.path === 'home') {
      throw new ConflictException('Cannot delete the home page');
    }

    await this.websitePageRepository.remove(page);
  }

  /**
   * Get all available themes
   */
  async findAllThemes(): Promise<WebsiteTheme[]> {
    return this.websiteThemeRepository.findAll();
  }

  /**
   * Get a specific theme
   */
  async findOneTheme(id: string): Promise<WebsiteTheme> {
    const theme = await this.websiteThemeRepository.findOne(id);
    if (!theme) {
      throw new NotFoundException(Theme with ID \ not found);
    }
    return theme;
  }

  /**
   * Publish a website
   */
  async publishWebsite(id: string): Promise<Website> {
    const website = await this.websiteRepository.findOne(id);
    if (!website) {
      throw new NotFoundException(Website with ID \ not found);
    }

    // Check if there's at least one page
    const pages = await this.websitePageRepository.find({
      where: { website: { id } },
    });

    if (pages.length === 0) {
      throw new ConflictException('Cannot publish a website without any pages');
    }

    // Ensure there's a home page
    const homePage = pages.find(page => page.path === '/' || page.path === 'home');
    if (!homePage) {
      throw new ConflictException('Cannot publish a website without a home page');
    }

    website.isPublished = true;
    website.publishedAt = new Date();
    return this.websiteRepository.save(website);
  }

  /**
   * Unpublish a website
   */
  async unpublishWebsite(id: string): Promise<Website> {
    const website = await this.websiteRepository.findOne(id);
    if (!website) {
      throw new NotFoundException(Website with ID \ not found);
    }

    website.isPublished = false;
    return this.websiteRepository.save(website);
  }
}
