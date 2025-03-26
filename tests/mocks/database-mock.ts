import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { beforeEach } from "@jest/globals";

// Create a mock of the Prisma client
export const prismaMock =
	mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// Reset the mock before each test
beforeEach(() => {
	mockReset(prismaMock);
});

export default prismaMock;