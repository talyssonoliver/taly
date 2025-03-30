import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

import { Plan } from "../entities/plan.entity";

@Injectable()
export class PlanRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(includeInactive = false): Promise<Plan[]> {
		if (includeInactive) {
			return this.prisma.plan.findMany();
		}

		return this.prisma.plan.findMany({
			where: { isActive: true },
		});
	}

	async findOne(id: string): Promise<Plan | null> {
		return this.prisma.plan.findUnique({
			where: { id },
		});
	}

	async findByName(name: string): Promise<Plan | null> {
		return this.prisma.plan.findFirst({
			where: { name },
		});
	}

	async findPublicPlans(): Promise<Plan[]> {
		return this.prisma.plan.findMany({
			where: { isActive: true, isPublic: true },
			orderBy: [{ tier: "asc" }, { price: "asc" }],
		});
	}
}
