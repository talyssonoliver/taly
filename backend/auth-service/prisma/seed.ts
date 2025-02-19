import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Clear existing data
  await prisma.credentials.deleteMany({});

  // Create admin user
  await prisma.credentials.create({
    data: {
      email: "admin@example.com",
      passwordHash: await hashPassword("admin123"),
      roles: "admin",
    },
  });

  // Create regular user
  await prisma.credentials.create({
    data: {
      email: "user@example.com",
      passwordHash: await hashPassword("user123"),
      roles: "user",
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
