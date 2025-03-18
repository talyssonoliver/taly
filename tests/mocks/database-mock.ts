import type { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";

import type { PrismaService } from "../../api/src/database/prisma.service";

// Mock the Prisma client deeply, allowing to mock every call.
export const prismaMock =
	mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaService>;

// Reset the mocks before each test
beforeEach(() => {
	mockReset(prismaMock);
});

export default prismaMock;
