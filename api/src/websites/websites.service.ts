import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { CreateWebsiteDto } from "./dto/create-website.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { UpdateWebsiteDto } from "./dto/update-website.dto";
import { WebsitePage } from "./entities/website-page.entity";
import { WebsiteTheme } from "./entities/website-theme.entity";
import { Website } from "./entities/website.entity";
import { WebsiteThemeRepository } from "./repositories/website-theme.repository";
import { WebsiteRepository } from "./repositories/website.repository";

@Injectable()
export class WebsitesService {
	private readonly logger = new Logger(WebsitesService.name);

	constructor(
		private readonly websiteRepository: WebsiteRepository,
		private readonly websiteThemeRepository: WebsiteThemeRepository,
		private readonly prisma: PrismaService,
	) {}

	/**
	 * Find all websites, optionally filtered by user ID
	 */
	async findAll(userId?: string): Promise<Website[]> {
		// Adjust return type to match what the repository returns
		const [websites] = await this.websiteRepository.findAll(userId);
		return websites;
	}

	/**
	 * Find a single website by ID
	 */
	async findOne(id: string): Promise<Website> {
		// Using findById from the repository
		const website = await this.websiteRepository.findById(id);
		if (!website) {
			throw new NotFoundException(`Website with ID ${id} not found`);
		}
		return website;
	}

	/**
	 * Create a new website
	 */
	async create(createWebsiteDto: CreateWebsiteDto): Promise<Website> {
		// Check if URL is already in use
		const existingWebsite = await this.websiteRepository.findByUrl(
			createWebsiteDto.url || this.generateUrl(createWebsiteDto.name),
		);
		if (existingWebsite) {
			throw new ConflictException("URL is already in use");
		}

		// Validate theme
		const theme = await this.websiteThemeRepository.findOne(
			createWebsiteDto.themeId,
		);
		if (!theme) {
			throw new NotFoundException(
				`Theme with ID ${createWebsiteDto.themeId} not found`,
			);
		}

		return this.websiteRepository.create(createWebsiteDto, theme);
	}

	/**
	 * Update an existing website
	 */
	async update(
		id: string,
		updateWebsiteDto: UpdateWebsiteDto,
	): Promise<Website> {
		const website = await this.websiteRepository.findById(id);
		if (!website) {
			throw new NotFoundException(`Website with ID ${id} not found`);
		}

		// If URL is being changed, check if new URL is available
		if (updateWebsiteDto.url && updateWebsiteDto.url !== website.url) {
			const existingWebsite = await this.websiteRepository.findByUrl(
				updateWebsiteDto.url,
			);
			if (existingWebsite && existingWebsite.id !== id) {
				throw new ConflictException("URL is already in use");
			}
		}

		// If theme is being changed, validate new theme
		if (updateWebsiteDto.themeId) {
			const theme = await this.websiteThemeRepository.findOne(
				updateWebsiteDto.themeId,
			);
			if (!theme) {
				throw new NotFoundException(
					`Theme with ID ${updateWebsiteDto.themeId} not found`,
				);
			}
		}

		return this.websiteRepository.update(id, updateWebsiteDto);
	}

	/**
	 * Delete a website
	 */
	async remove(id: string): Promise<void> {
		const website = await this.websiteRepository.findById(id);
		if (!website) {
			throw new NotFoundException(`Website with ID ${id} not found`);
		}

		await this.websiteRepository.remove(id);
	}

	/**
	 * Get all pages for a website
	 */
	async findAllPages(websiteId: string): Promise<WebsitePage[]> {
		const website = await this.websiteRepository.findById(websiteId);
		if (!website) {
			throw new NotFoundException(`Website with ID ${websiteId} not found`);
		}

		// Using correct Prisma model name based on schema
		return this.prisma.websitePage.findMany({
			where: { websiteId },
			orderBy: { sortOrder: "asc" },
		}) as unknown as WebsitePage[];
	}

	/**
	 * Find a specific page
	 */
	async findOnePage(websiteId: string, pageId: string): Promise<WebsitePage> {
		const website = await this.websiteRepository.findById(websiteId);
		if (!website) {
			throw new NotFoundException(`Website with ID ${websiteId} not found`);
		}

		// Using correct Prisma model name
		const page = await this.prisma.websitePage.findFirst({
			where: { id: pageId, websiteId },
		});

		if (!page) {
			throw new NotFoundException(`Page with ID ${pageId} not found`);
		}

		return page as unknown as WebsitePage;
	}

	/**
	 * Create a new page for a website
	 */
	async createPage(
		websiteId: string,
		createPageDto: CreatePageDto,
	): Promise<WebsitePage> {
		const website = await this.websiteRepository.findById(websiteId);
		if (!website) {
			throw new NotFoundException(`Website with ID ${websiteId} not found`);
		}

		// Using correct Prisma model name
		const existingPage = await this.prisma.websitePage.findFirst({
			where: { path: createPageDto.path, websiteId },
		});

		if (existingPage) {
			throw new ConflictException(
				`A page with path '${createPageDto.path}' already exists`,
			);
		}

		// Find highest sort order for proper placement
		const maxSortOrder = await this.prisma.websitePage.aggregate({
			where: { websiteId },
			_max: {
				sortOrder: true,
			},
		});

		const newSortOrder = (maxSortOrder._max.sortOrder || 0) + 1;

		// Using correct Prisma model name
		return this.prisma.websitePage.create({
			data: {
				title: createPageDto.title,
				path: createPageDto.path,
				content: createPageDto.content as unknown as Record<string, unknown>,
				isPublished: createPageDto.isPublished ?? true,
				metaTitle: createPageDto.metaTitle || createPageDto.title,
				metaDescription: createPageDto.metaDescription || "",
				sortOrder: createPageDto.sortOrder ?? newSortOrder,
				websiteId,
			},
		}) as unknown as WebsitePage;
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
			// Using correct Prisma model name
			const existingPage = await this.prisma.websitePage.findFirst({
				where: {
					path: updatePageDto.path,
					websiteId,
					id: { not: pageId },
				},
			});

			if (existingPage) {
				throw new ConflictException(
					`A page with path '${updatePageDto.path}' already exists`,
				);
			}
		}

		// Update page properties
		const data: Partial<UpdatePageDto> = {};
		if (updatePageDto.title !== undefined) data.title = updatePageDto.title;
		if (updatePageDto.path !== undefined) data.path = updatePageDto.path;
		if (updatePageDto.content !== undefined)
			data.content = updatePageDto.content;
		if (updatePageDto.isPublished !== undefined)
			data.isPublished = updatePageDto.isPublished;
		if (updatePageDto.metaTitle !== undefined)
			data.metaTitle = updatePageDto.metaTitle;
		if (updatePageDto.metaDescription !== undefined)
			data.metaDescription = updatePageDto.metaDescription;
		if (updatePageDto.sortOrder !== undefined)
			data.sortOrder = updatePageDto.sortOrder;

		// Using correct Prisma model name
		return this.prisma.websitePage.update({
			where: { id: pageId },
			data,
		}) as unknown as WebsitePage;
	}

	/**
	 * Delete a page
	 */
	async removePage(websiteId: string, pageId: string): Promise<void> {
		const page = await this.findOnePage(websiteId, pageId);

		// Don't allow deleting the home page
		if (page.path === "/" || page.path === "home") {
			throw new ConflictException("Cannot delete the home page");
		}

		// Using correct Prisma model name
		await this.prisma.websitePage.delete({
			where: { id: pageId },
		});
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
			throw new NotFoundException(`Theme with ID ${id} not found`);
		}
		return theme;
	}

	/**
	 * Publish a website
	 */
	async publishWebsite(id: string): Promise<Website> {
		const website = await this.websiteRepository.findById(id);
		if (!website) {
			throw new NotFoundException(`Website with ID ${id} not found`);
		}

		// Check if there's at least one page
		// Using correct Prisma model name
		const pages = await this.prisma.websitePage.findMany({
			where: { websiteId: id },
		});

		if (pages.length === 0) {
			throw new ConflictException("Cannot publish a website without any pages");
		}

		// Ensure there's a home page
		const homePage = pages.find(
			(page: { path: string }) => page.path === "/" || page.path === "home",
		);

		if (!homePage) {
			throw new ConflictException(
				"Cannot publish a website without a home page",
			);
		}

		// Update in repository with publishedAt included in the DTO
		const updateData: Partial<UpdateWebsiteDto> & { publishedAt: Date } = {
			isPublished: true,
			publishedAt: new Date(),
		};

		return this.websiteRepository.update(id, updateData);
	}

	/**
	 * Unpublish a website
	 */
	async unpublishWebsite(id: string): Promise<Website> {
		const website = await this.websiteRepository.findById(id);
		if (!website) {
			throw new NotFoundException(`Website with ID ${id} not found`);
		}

		// Update in repository
		return this.websiteRepository.update(id, {
			isPublished: false,
		});
	}

	async getWebsite(id: string): Promise<Website> {
		const website = await this.websiteRepository.findById(id);
		if (!website) {
			throw new NotFoundException(`Website with ID ${id} not found`);
		}
		return website;
	}

	/**
	 * Generate URL slug from name
	 * @private
	 */
	private generateUrl(name: string): string {
		return name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	}
}
