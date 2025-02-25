import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Catalog Service...");

  // Clear existing services
  await prisma.service.deleteMany({});

  // Seed initial services
  await prisma.service.createMany({
    data: [
      {
        id: "service-1",
        name: "Haircut",
        description: "Professional haircut and styling",
        price: 30.0,
        duration: 45,
        isActive: true,
      },
      {
        id: "service-2",
        name: "Beard Trim",
        description: "Precision beard trimming and shaping",
        price: 15.0,
        duration: 30,
        isActive: true,
      },
      {
        id: "service-3",
        name: "Hair Coloring",
        description: "Custom hair coloring and highlights",
        price: 80.0,
        duration: 90,
        isActive: true,
      },
      {
        id: "service-4",
        name: "Facial Treatment",
        description: "Deep cleansing facial treatment",
        price: 50.0,
        duration: 60,
        isActive: true,
      },
      {
        id: "service-5",
        name: "Manicure & Pedicure",
        description: "Professional nail care service",
        price: 40.0,
        duration: 60,
        isActive: true,
      },
    ],
  });

  console.log("Catalog Service seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding catalog database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
