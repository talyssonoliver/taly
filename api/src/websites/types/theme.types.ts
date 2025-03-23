/**
 * Type definitions for Website Theme-related operations
 */

/**
 * Base record structure for a website theme from the database
 */
export interface WebsiteThemeRecord {
	id: string;
	name: string;
	description?: string;
	thumbnail?: string;
	category: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	[key: string]: unknown; // For any other properties that might exist
}

/**
 * Parameters for finding multiple theme records
 */
export interface ThemeFindManyParams {
	where?: {
		category?: string;
		isActive?: boolean;
		[key: string]: unknown;
	};
	orderBy?: {
		name?: "asc" | "desc";
		[key: string]: unknown;
	};
	skip?: number;
	take?: number;
}

/**
 * Parameters for finding a unique theme record
 */
export interface ThemeFindUniqueParams {
	where: {
		id: string;
	};
}

/**
 * Parameters for creating a theme record
 */
export interface ThemeCreateParams {
	data: Record<string, unknown>;
}

/**
 * Parameters for updating a theme record
 */
export interface ThemeUpdateParams {
	where: {
		id: string;
	};
	data: Record<string, unknown>;
}

/**
 * Parameters for deleting a theme record
 */
export interface ThemeDeleteParams {
	where: {
		id: string;
	};
}

/**
 * Parameters for counting theme records
 */
export interface ThemeCountParams {
	where?: Record<string, unknown>;
}

/**
 * Result of a database count query
 */
export interface CountQueryResult {
	count: number | string;
}

/**
 * Theme model interface for proxy implementation
 */
export interface ThemeModel {
	findMany: (args?: ThemeFindManyParams) => Promise<WebsiteThemeRecord[]>;
	findUnique: (
		args: ThemeFindUniqueParams,
	) => Promise<WebsiteThemeRecord | null>;
	create: (args: ThemeCreateParams) => Promise<WebsiteThemeRecord>;
	update: (args: ThemeUpdateParams) => Promise<WebsiteThemeRecord>;
	delete: (args: ThemeDeleteParams) => Promise<WebsiteThemeRecord>;
	count: (args?: ThemeCountParams) => Promise<number>;
}
