import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "../../../api/src/users/dto/create-user.dto";

describe("CreateUserDto", () => {
	let dto: CreateUserDto;

	beforeEach(() => {
		dto = plainToInstance(CreateUserDto, {
			email: "test@example.com",
			password: "Password123!",
			firstName: "John",
			lastName: "Doe",
		});
	});

	it("should validate a correct dto", async () => {
		const errors = await validate(dto);
		expect(errors.length).toBe(0);
	});

	it("should fail if email is invalid", async () => {
		dto.email = "invalid-email";
		const errors = await validate(dto);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints).toHaveProperty("isEmail");
	});

	it("should fail if password is too short", async () => {
		// Setup
		const dto = new CreateUserDto();
		dto.email = "test@example.com";
		dto.password = "short"; // Too short password
		dto.firstName = "Test";

		// Execute
		const errors = await validate(dto);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints).toHaveProperty("isLength");
	});

	it("should fail if password lacks complexity", async () => {
		dto.password = "passwordonly";
		const errors = await validate(dto);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints).toHaveProperty("matches");
	});

	it("should fail if firstName is missing", async () => {
		dto.firstName = "";
		const errors = await validate(dto);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints).toHaveProperty("isNotEmpty");
	});

	it("should pass if lastName is missing (optional)", async () => {
		dto.lastName = undefined;
		const errors = await validate(dto);
		expect(errors.length).toBe(0);
	});
});