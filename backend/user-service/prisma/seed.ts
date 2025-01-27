// user-service/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Create sample plans
	const freePlan = await prisma.plan.create({
		data: { name: "Free", maxBookings: 50, transactionFee: 3.0 },
	});

	const proPlan = await prisma.plan.create({
		data: { name: "Pro", maxBookings: 300, transactionFee: 0.0 },
	});

	const premiumPlan = await prisma.plan.create({
		data: { name: "Premium", maxBookings: -1, transactionFee: 0.0 },
	});

	// Create a sample user
	await prisma.user.create({
		data: {
			name: "John Doe",
			email: "john@example.com",
			role: "OWNER",
			planId: freePlan.id,
		},
	});
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
