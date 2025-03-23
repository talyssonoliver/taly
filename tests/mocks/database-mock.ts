import type { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";
import { beforeEach } from "@jest/globals";

import type { PrismaService } from "../../api/src/database/prisma.service";

export const prismaMock =
	mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaService>;

beforeEach(() => {
	mockReset(prismaMock);
});

export default prismaMock;