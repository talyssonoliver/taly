import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WebsitesService } from './websites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@ApiTags('websites')
@Controller('websites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all websites' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all websites' })
  async findAll(@Query('userId') userId?: string) {
    return this.websitesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get website by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the website' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Website not found' })
  async findOne(@Param('id') id: string) {
    const website = await this.websitesService.findOne(id);
    if (!website) {
      throw new NotFoundException('Website not found');
    }
    return website;
  }

  @Post()
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Create a new website' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Website has been created' })
  async create(@Body() createWebsiteDto: CreateWebsiteDto) {
    return this.websitesService.create(createWebsiteDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a website' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Website has been updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Website not found' })
  async update(@Param('id') id: string, @Body() updateWebsiteDto: UpdateWebsiteDto) {
    return this.websitesService.update(id, updateWebsiteDto);
  }

  @Delete(':id')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Delete a website' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Website has been deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Website not found' })
  async remove(@Param('id') id: string) {
    return this.websitesService.remove(id);
  }

  @Get(':id/pages')
  @ApiOperation({ summary: 'Get all pages for a website' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all pages' })
  async findAllPages(@Param('id') websiteId: string) {
    return this.websitesService.findAllPages(websiteId);
  }

  @Get(':id/pages/:pageId')
  @ApiOperation({ summary: 'Get page by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the page' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Page not found' })
  async findOnePage(@Param('id') websiteId: string, @Param('pageId') pageId: string) {
    const page = await this.websitesService.findOnePage(websiteId, pageId);
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return page;
  }

  @Post(':id/pages')
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Page has been created' })
  async createPage(@Param('id') websiteId: string, @Body() createPageDto: CreatePageDto) {
    return this.websitesService.createPage(websiteId, createPageDto);
  }

  @Put(':id/pages/:pageId')
  @ApiOperation({ summary: 'Update a page' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Page has been updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Page not found' })
  async updatePage(
    @Param('id') websiteId: string,
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.websitesService.updatePage(websiteId, pageId, updatePageDto);
  }

  @Delete(':id/pages/:pageId')
  @ApiOperation({ summary: 'Delete a page' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Page has been deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Page not found' })
  async removePage(@Param('id') websiteId: string, @Param('pageId') pageId: string) {
    return this.websitesService.removePage(websiteId, pageId);
  }

  @Get('themes')
  @ApiOperation({ summary: 'Get all website themes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all themes' })
  async findAllThemes() {
    return this.websitesService.findAllThemes();
  }

  @Get('themes/:id')
  @ApiOperation({ summary: 'Get theme by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the theme' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Theme not found' })
  async findOneTheme(@Param('id') id: string) {
    const theme = await this.websitesService.findOneTheme(id);
    if (!theme) {
      throw new NotFoundException('Theme not found');
    }
    return theme;
  }

  @Post(':id/publish')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Publish a website' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Website has been published' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Website not found' })
  async publishWebsite(@Param('id') id: string) {
    return this.websitesService.publishWebsite(id);
  }

  @Post(':id/unpublish')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Unpublish a website' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Website has been unpublished' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Website not found' })
  async unpublishWebsite(@Param('id') id: string) {
    return this.websitesService.unpublishWebsite(id);
  }
}
