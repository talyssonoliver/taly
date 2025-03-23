import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import {
	WebsiteTheme,
	WebsiteThemeCategory,
} from "../entities/website-theme.entity";

@Injectable()
export class WebsiteThemeRepository {
	private readonly logger = new Logger(WebsiteThemeRepository.name);

	constructor(private readonly prisma: PrismaService) {}

	async findAll(): Promise<WebsiteTheme[]> {
		try {
			const themes = await this.prisma.theme.findMany({
				orderBy: { name: "asc" },
			});
			return themes as unknown as WebsiteTheme[];
		} catch (error) {
			this.logger.error(`Error finding themes: ${error.message}`, error.stack);
			throw error;
		}
	}

	async findOne(id: string): Promise<WebsiteTheme | null> {
		try {
			const theme = await this.prisma.theme.findUnique({
				where: { id },
			});
			return theme as unknown as WebsiteTheme;
		} catch (error) {
			this.logger.error(
				`Error finding theme ${id}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	async findByCategory(
		category: WebsiteThemeCategory,
	): Promise<WebsiteTheme[]> {
		try {
			return this.prisma.theme.findMany({
				where: {
					category,
					isActive: true,
				},
				orderBy: { name: "asc" },
			}) as unknown as WebsiteTheme[];
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
			return this.prisma.theme.create({
				data: themeData as Record<string, unknown>,
			}) as unknown as WebsiteTheme;
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
			return this.prisma.theme.update({
				where: { id },
				data: themeData as Record<string, unknown>,
			}) as unknown as WebsiteTheme;
		} catch (error) {
			this.logger.error(`Error updating website theme with ID ${id}:`, error);
			throw error;
		}
	}

	async removeTheme(id: string): Promise<void> {
		try {
			await this.prisma.theme.delete({
				where: { id },
			});
		} catch (error) {
			this.logger.error(`Error removing website theme with ID ${id}:`, error);
			throw error;
		}
	}

	async countThemes(): Promise<number> {
		try {
			return this.prisma.theme.count();
		} catch (error) {
			this.logger.error("Error counting website themes:", error);
			throw error;
		}
	}
}
