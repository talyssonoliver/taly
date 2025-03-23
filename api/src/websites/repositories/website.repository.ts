import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreateWebsiteDto } from "../dto/create-website.dto";
import { UpdateWebsiteDto } from "../dto/update-website.dto";
import { WebsiteTheme } from "../entities/website-theme.entity";
import { Website } from "../entities/website.entity";

@Injectable()
export class WebsiteRepository {
	private readonly logger = new Logger(WebsiteRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findAll(userId?: string): Promise<[Website[], number]> {
		try {
			const whereCondition = userId ? { userId } : {};

			const websites = await this.prisma.website.findMany({
				where: whereCondition as Prisma.WebsiteWhereInput,
				include: {
					user: true,
					customDomain: true,
					theme: {
						select: {
							id: true,
							name: true,
							description: true,
							thumbnail: true,
							category: true,
							isActive: true,
						},
					},
					pages: {
						select: {
							id: true,
							title: true,
							path: true,
							isPublished: true,
							sortOrder: true,
						},
					},
				} as Prisma.WebsiteInclude,
			});

			const count = await this.prisma.website.count({
				where: whereCondition as Prisma.WebsiteWhereInput,
			});

			return [websites as unknown as Website[], count];
		} catch (error) {
			this.logger.error(
				`Error finding websites: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findById(id: string): Promise<Website | null> {
		try {
			const website = await this.prisma.website.findUnique({
				where: { id },
				include: {
					user: true,
					customDomain: true,
					theme: true,
					pages: true,
				} as Prisma.WebsiteInclude,
			});

			return website as unknown as Website;
		} catch (error) {
			this.logger.error(
				`Error finding website with ID ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findByUrl(url: string): Promise<Website | null> {
		try {
			const website = await this.prisma.website.findFirst({
				where: { url },
				include: {
					user: true,
					customDomain: true,
					theme: true,
					pages: true,
				} as Prisma.WebsiteInclude,
			});

			return website as unknown as Website;
		} catch (error) {
			this.logger.error(
				`Error finding website with URL ${url}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async create(
		createWebsiteDto: CreateWebsiteDto,
		theme: WebsiteTheme,
	): Promise<Website> {
		try {
			// Create base data with the required structure
			const data = {
				name: createWebsiteDto.name,
				description: createWebsiteDto.description,
				userId: createWebsiteDto.userId,
				themeId: createWebsiteDto.themeId,
				isPublished: createWebsiteDto.isPublished || false,
				url: createWebsiteDto.url || this.generateUrl(createWebsiteDto.name),
			};

			// Add JSON fields if they exist
			let jsonData = {};
			if (createWebsiteDto.themeSettings) {
				jsonData = {
					...jsonData,
					themeSettings:
						createWebsiteDto.themeSettings as unknown as Prisma.InputJsonValue,
				};
			}

			if (createWebsiteDto.settings) {
				jsonData = {
					...jsonData,
					settings:
						createWebsiteDto.settings as unknown as Prisma.InputJsonValue,
				};
			}

			const website = await this.prisma.website.create({
				data: {
					...data,
					...jsonData,
				} as unknown as Prisma.WebsiteCreateInput,
				include: {
					user: true,
					customDomain: true,
					theme: true,
					pages: true,
				} as Prisma.WebsiteInclude,
			});

			return website as unknown as Website;
		} catch (error) {
			this.logger.error(
				`Error creating website: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async update(
		id: string,
		updateData: Partial<UpdateWebsiteDto> & { publishedAt?: Date },
	): Promise<Website> {
		try {
			// Convert entity fields to Prisma fields
			const prismaData: Record<string, unknown> = {};

			// Map standard fields
			if ("name" in updateData) prismaData.name = updateData.name;
			if ("description" in updateData)
				prismaData.description = updateData.description;
			if ("themeId" in updateData) prismaData.themeId = updateData.themeId;
			if ("isPublished" in updateData)
				prismaData.isPublished = updateData.isPublished;
			if ("url" in updateData) prismaData.url = updateData.url;
			if ("publishedAt" in updateData)
				prismaData.publishedAt = updateData.publishedAt;

			// Map JSON fields with type casting
			if ("themeSettings" in updateData) {
				prismaData.themeSettings =
					updateData.themeSettings as unknown as Prisma.InputJsonValue;
			}

			if ("settings" in updateData) {
				prismaData.settings =
					updateData.settings as unknown as Prisma.InputJsonValue;
			}

			const website = await this.prisma.website.update({
				where: { id },
				data: prismaData as unknown as Prisma.WebsiteUpdateInput,
				include: {
					user: true,
					customDomain: true,
					theme: true,
					pages: true,
				} as Prisma.WebsiteInclude,
			});

			return website as unknown as Website;
		} catch (error) {
			this.logger.error(
				`Error updating website with ID ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async remove(id: string): Promise<void> {
		try {
			await this.prisma.website.delete({
				where: { id },
			});
		} catch (error) {
			this.logger.error(
				`Error removing website with ID ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	private generateUrl(name: string): string {
		return name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	}
}
