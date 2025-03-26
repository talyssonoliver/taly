import { describe, it, expect } from "@jest/globals";
import prismaMock from "../../mocks/database-mock";

describe("Database Operations", () => {
	it("should create a user successfully", async () => {
		// Setup the mock to return specific data
		const mockUser = {
			id: 1,
			email: "test@example.com",
			name: "Test User",
			role: "CUSTOMER",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Configure the mock to return our test data when user.create is called
		prismaMock.user.create.mockResolvedValue(mockUser);

		// Simulate a service that would use the prisma client
		const userService = {
			createUser: async (data: { email: string; name: string }) => {
				return prismaMock.user.create({
					data: {
						...data,
						role: "CUSTOMER",
					},
				});
			},
		};

		// Execute the method we want to test
		const result = await userService.createUser({
			email: "test@example.com",
			name: "Test User",
		});

		// Assertions
		expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.create).toHaveBeenCalledWith({
			data: {
				email: "test@example.com",
				name: "Test User",
				role: "CUSTOMER",
			},
		});
		expect(result).toEqual(mockUser);
	});

	it("should find users by role", async () => {
		const mockUsers = [
			{ id: 1, email: "user1@example.com", name: "User One", role: "CUSTOMER" },
			{ id: 2, email: "user2@example.com", name: "User Two", role: "CUSTOMER" },
		];

		prismaMock.user.findMany.mockResolvedValue(mockUsers);

		const userService = {
			findUsersByRole: (role: string) => {
				return prismaMock.user.findMany({
					where: { role },
				});
			},
		};

		const result = await userService.findUsersByRole("CUSTOMER");

		expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
		expect(prismaMock.user.findMany).toHaveBeenCalledWith({
			where: { role: "CUSTOMER" },
		});
		expect(result).toEqual(mockUsers);
	});
});