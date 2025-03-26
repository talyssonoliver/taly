import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { OAuthUser } from "../interfaces/oauth-user.interface";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	private readonly logger = new Logger(GoogleStrategy.name);

	constructor(private readonly configService: ConfigService) {
		const clientID = configService.get<string>("GOOGLE_CLIENT_ID");
		const clientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET");
		const callbackURL = `${configService.get<string>("API_URL")}/auth/google/callback`;

		if (!clientID || !clientSecret) {
			throw new Error("Google OAuth credentials are not properly configured");
		}

		super({
			clientID,
			clientSecret,
			callbackURL,
			scope: ["email", "profile"],
		});

		this.logger.log("Google authentication strategy initialized");
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback,
	): Promise<void> {
		try {
			const { id, name, emails, photos } = profile;

			if (!emails || emails.length === 0) {
				this.logger.warn(
					`Google validation failed: No email found in profile for ID ${id}`,
				);
				return done(
					new Error("Email not available from Google profile"),
					false,
				);
			}

			const user: OAuthUser = {
				email: emails[0].value,
				firstName: name?.givenName || "",
				lastName: name?.familyName || "",
				provider: "google",
				providerId: id,
				profileImage: photos?.[0]?.value || undefined,
			};

			this.logger.log(`User authenticated via Google: ${user.email}`);
			done(null, user);
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(
					`Google validation failed: ${error.message}`,
					error.stack,
				);
				done(error, false);
			} else {
				const unknownError = new Error(
					`Google validation failed: ${String(error)}`,
				);
				this.logger.error(unknownError.message);
				done(unknownError, false);
			}
		}
	}
}
