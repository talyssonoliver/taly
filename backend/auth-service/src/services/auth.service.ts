import { Injectable, BadRequestException } from "@nestjs/common";
import type { SignupDto } from "../../../../shared/dto/signup.dto";
import { hashPassword } from "../../../../shared/utils/password-hasher";
import type { AuthRepository } from "../repositories/auth.repository";
import type { NotificationService } from "../integrations/notification.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly notificationService: NotificationService,
	) {}

	async signup(signupDto: SignupDto): Promise<void> {
		const { name, email, password } = signupDto;

		const userExists = await this.authRepository.findByEmail(email);
		if (userExists) {
			throw new BadRequestException("Email already in use");
		}

		const passwordHash = await hashPassword(password);
		const newUser = await this.authRepository.createUser({
			name,
			email,
			passwordHash,
		});

		await this.notificationService.sendEmail({
			to: email,
			subject: "Confirm your email",
			body: `Hello ${name}, please confirm your email.`,
		});
	}
}
