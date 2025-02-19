import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const freePlan = await prisma.plan.create({
    data: {
      name: "Free",
      price: 0.0,
      features: [],
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: "Pro",
      price: 100.0,
      features: [],
    },
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: "Premium",
      price: 500.0,
      features: [],
    },
  });

  // Create a sample customer
  await prisma.company.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      role: "CUSTOMER",
    },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
