import type { Company } from "./company.interface";


export interface Website {
	id: string;
	companyId: string;
	url: string;

	// Relations - optional, used for includes
	company?: Company;
}

export type CreateWebsiteParams = Omit<Website, "id">;

export type UpdateWebsiteParams = Partial<Omit<Website, "id" | "salonId">>;