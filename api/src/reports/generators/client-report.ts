import { Prisma, PrismaClient } from "@prisma/client";

// Create proper interfaces for our data structures
interface ReportFilters {
	startDate?: Date;
	endDate?: Date;
	[key: string]: unknown;
}

interface DemographicItem {
	group: string;
	count: number;
	percentage: string;
}

interface GenderDemographic {
	gender: string;
	count: number;
	percentage: string;
}

interface ServicePreference {
	serviceName: string;
	clientCount: number;
	percentage: string;
}

interface ReferralSource {
	source: string;
	count: number;
	percentage: string;
}

interface ClientReportData {
	summary: {
		totalClients: number;
		newClients: number;
		returningClients: number;
		clientRetentionRate: string;
		averageVisitsPerClient: number;
	};
	demographics: {
		ageGroups: DemographicItem[];
		gender: GenderDemographic[];
	};
	servicePreferences: ServicePreference[];
	referralSources: ReferralSource[];
	filters: {
		startDate: Date;
		endDate: Date;
		[key: string]: unknown;
	};
	generatedAt: Date;
}

// We'll use DateFilter type instead of 'any'
type DateFilter = {
	createdAt: {
		gte: Date;
		lte: Date;
	};
};

const prisma = new PrismaClient();

/**
 * A simpler type definition for groupBy results to avoid circular references
 */
type GroupByResult<T extends string> = {
	[key in T]: string;
} & {
	_count: {
		id: number;
	};
};

/**
 * Generates client reports based on the given filters
 * @param filters Filter criteria for the report
 * @returns Report data object
 */
export async function generateClientReport(
	filters: ReportFilters,
): Promise<ClientReportData> {
	try {
		const startDate =
			filters.startDate ||
			new Date(new Date().setMonth(new Date().getMonth() - 1));
		const endDate = filters.endDate || new Date();

		// Basic filter condition for date range
		const dateFilter: DateFilter = {
			createdAt: {
				gte: startDate,
				lte: endDate,
			},
		};

		// Get total clients
		const totalClients = await prisma.client.count({
			where: dateFilter,
		});

		// Get new clients in the period
		const newClients = await prisma.client.count({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
		});

		// Calculate returning clients
		const returningClients = totalClients - newClients;

		// Calculate retention rate
		const clientRetentionRate =
			totalClients > 0
				? `${((returningClients / totalClients) * 100).toFixed(1)}%`
				: "0%";

		// Get average visits per client
		// Use appointment model instead of booking
		const visitData = await prisma.appointment.groupBy({
			by: ["clientId"],
			_count: {
				id: true,
			},
			where: dateFilter,
		});

		const totalVisits = visitData.reduce(
			(sum, item) => sum + item._count.id,
			0,
		);
		const averageVisitsPerClient =
			totalClients > 0 ? Number((totalVisits / totalClients).toFixed(1)) : 0;

		// Get age group demographics
		const ageGroups = await getAgeGroupDemographics(dateFilter);

		// Get gender demographics
		const genderDemographics = await getGenderDemographics(dateFilter);

		// Get service preferences
		const servicePreferences = await getServicePreferences(dateFilter);

		// Get referral sources
		const referralSources = await getReferralSources(dateFilter);

		const reportData: ClientReportData = {
			summary: {
				totalClients,
				newClients,
				returningClients,
				clientRetentionRate,
				averageVisitsPerClient,
			},
			demographics: {
				ageGroups,
				gender: genderDemographics,
			},
			servicePreferences,
			referralSources,
			filters: {
				startDate,
				endDate,
				...filters,
			},
			generatedAt: new Date(),
		};

		return reportData;
	} catch (error) {
		console.error("Error generating client report:", error);
		throw new Error("Failed to generate client report");
	}
}

async function getAgeGroupDemographics(
	dateFilter: DateFilter,
): Promise<DemographicItem[]> {
	// Get all clients without filtering by specific fields
	const clients = await prisma.client.findMany({
		where: dateFilter,
	});

	// Define age groups
	const ageGroupRanges = [
		{ min: 18, max: 24, name: "18-24" },
		{ min: 25, max: 34, name: "25-34" },
		{ min: 35, max: 44, name: "35-44" },
		{ min: 45, max: 54, name: "45-54" },
		{ min: 55, max: 200, name: "55+" },
	];

	// Initialize counts
	const groups: Record<string, number> = {};
	for (const group of ageGroupRanges) {
		groups[group.name] = 0;
	}

	// Since we don't have date of birth fields in the client model,
	// we'll just use mock data for now or skip this step
	// This is a placeholder - in a real application, you'd integrate with your actual client data schema

	// Format the results
	const total = Object.values(groups).reduce((sum, count) => sum + count, 0);
	return Object.entries(groups).map(([group, count]) => ({
		group,
		count,
		percentage: total > 0 ? `${((count / total) * 100).toFixed(1)}%` : "0%",
	}));
}

async function getGenderDemographics(
	dateFilter: DateFilter,
): Promise<GenderDemographic[]> {
	try {
		// Use raw Prisma query to avoid circular reference issues
		const query = Prisma.sql`
      SELECT gender, COUNT(id) as count
      FROM Client
      WHERE createdAt >= ${dateFilter.createdAt.gte} AND createdAt <= ${dateFilter.createdAt.lte}
      GROUP BY gender
    `;

		const genderCounts =
			await prisma.$queryRaw<Array<{ gender: string; count: bigint }>>(query);

		const total = genderCounts.reduce(
			(sum, item) => sum + Number(item.count),
			0,
		);

		return genderCounts.map((item) => ({
			gender: item.gender || "Not Specified",
			count: Number(item.count),
			percentage:
				total > 0
					? `${((Number(item.count) / total) * 100).toFixed(1)}%`
					: "0%",
		}));
	} catch (error) {
		console.error("Error fetching gender demographics:", error);
		// Return default empty structure if the gender field doesn't exist
		return [{ gender: "Not Available", count: 0, percentage: "0%" }];
	}
}

async function getServicePreferences(
	dateFilter: DateFilter,
): Promise<ServicePreference[]> {
	try {
		// Use raw query for service bookings
		const query = Prisma.sql`
      SELECT serviceId, COUNT(id) as count
      FROM Appointment
      WHERE createdAt >= ${dateFilter.createdAt.gte} AND createdAt <= ${dateFilter.createdAt.lte}
      GROUP BY serviceId
    `;

		const serviceBookings =
			await prisma.$queryRaw<Array<{ serviceId: string; count: bigint }>>(
				query,
			);

		// Fetch service names
		const serviceIds = serviceBookings.map((booking) => booking.serviceId);
		const services = await prisma.service.findMany({
			where: {
				id: {
					in: serviceIds,
				},
			},
			select: {
				id: true,
				name: true,
			},
		});

		const serviceMap = new Map(
			services.map((service) => [service.id, service.name]),
		);
		const totalBookings = serviceBookings.reduce(
			(sum, item) => sum + Number(item.count),
			0,
		);

		return serviceBookings.map((item) => ({
			serviceName: serviceMap.get(item.serviceId) || "Unknown Service",
			clientCount: Number(item.count),
			percentage:
				totalBookings > 0
					? `${((Number(item.count) / totalBookings) * 100).toFixed(1)}%`
					: "0%",
		}));
	} catch (error) {
		console.error("Error fetching service preferences:", error);
		return [];
	}
}

async function getReferralSources(
	dateFilter: DateFilter,
): Promise<ReferralSource[]> {
	try {
		// Use raw query for referral counts
		const query = Prisma.sql`
      SELECT referralSource, COUNT(id) as count
      FROM Client
      WHERE createdAt >= ${dateFilter.createdAt.gte} AND createdAt <= ${dateFilter.createdAt.lte}
      GROUP BY referralSource
    `;

		const referralCounts =
			await prisma.$queryRaw<Array<{ referralSource: string; count: bigint }>>(
				query,
			);

		const total = referralCounts.reduce(
			(sum, item) => sum + Number(item.count),
			0,
		);

		return referralCounts.map((item) => ({
			source: item.referralSource || "Unknown",
			count: Number(item.count),
			percentage:
				total > 0
					? `${((Number(item.count) / total) * 100).toFixed(1)}%`
					: "0%",
		}));
	} catch (error) {
		console.error("Error fetching referral sources:", error);
		return [{ source: "Not Available", count: 0, percentage: "0%" }];
	}
}

function calculateAge(birthDate: Date): number {
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
}
