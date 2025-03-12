import { PrismaService } from '../../database/prisma.service';
import { Injectable, Logger } from "@nestjs/common";
import type { PrismaService } from "../../database/prisma.service";
import type {
	WebsiteTheme,
	WebsiteThemeCategory,
} from "../entities/website-theme.entity";

@Injectable()
export class WebsiteThemeRepository {
	private readonly logger = new Logger(WebsiteThemeRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findAll(includeInactive = false): Promise<WebsiteTheme[]> {
		try {
			const where = includeInactive ? {} : { isActive: true };

			return this.prisma.websiteTheme.findMany({
				where,
				orderBy: { name: "asc" },
			});
		} catch (error) {
			this.logger.error("Error finding website themes:", error);
			throw error;
		}
	}

	async findOne(id: string): Promise<WebsiteTheme | null> {
		try {
			return this.prisma.websiteTheme.findUnique({
				where: { id },
			});
		} catch (error) {
			this.logger.error(`Error finding website theme with ID ${id}:`, error);
			throw error;
		}
	}

	async findByCategory(
		category: WebsiteThemeCategory,
	): Promise<WebsiteTheme[]> {
		try {
			return this.prisma.websiteTheme.findMany({
				where: {
					category,
					isActive: true,
				},
				orderBy: { name: "asc" },
			});
		} catch (error) {
			this.logger.error(
				`Error finding website themes by category ${category}:`,
				error,
			);
			throw error;
		}
	}

	async createTheme(themeData: Partial<WebsiteTheme>): Promise<WebsiteTheme> {
		try {
			return this.prisma.websiteTheme.create({
				data: themeData as any,
			});
		} catch (error) {
			this.logger.error("Error creating website theme:", error);
			throw error;
		}
	}

	async updateTheme(
		id: string,
		themeData: Partial<WebsiteTheme>,
	): Promise<WebsiteTheme> {
		try {
			return this.prisma.websiteTheme.update({
				where: { id },
				data: themeData as any,
			});
		} catch (error) {
			this.logger.error(`Error updating website theme with ID ${id}:`, error);
			throw error;
		}
	}

	async removeTheme(id: string): Promise<void> {
		try {
			await this.prisma.websiteTheme.delete({
				where: { id },
			});
		} catch (error) {
			this.logger.error(`Error removing website theme with ID ${id}:`, error);
			throw error;
		}
	}

	async countThemes(): Promise<number> {
		try {
			return this.prisma.websiteTheme.count();
		} catch (error) {
			this.logger.error("Error counting website themes:", error);
			throw error;
		}
	}
}

