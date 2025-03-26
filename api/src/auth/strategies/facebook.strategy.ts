import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { OAuthUser } from "../interfaces/oauth-user.interface";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
	private readonly logger = new Logger(FacebookStrategy.name);

	constructor(private readonly configService: ConfigService) {
		const clientID = configService.get<string>("FACEBOOK_APP_ID");
		const clientSecret = configService.get<string>("FACEBOOK_APP_SECRET");
		const callbackURL = `${configService.get<string>("API_URL")}/auth/facebook/callback`;

		if (!clientID || !clientSecret) {
			throw new Error("Facebook OAuth credentials are not properly configured");
		}

		super({
			clientID,
			clientSecret,
			callbackURL,
			profileFields: ["id", "emails", "name", "photos"],
			scope: ["email"],
		});

		this.logger.log("Facebook authentication strategy initialized");
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: (error: Error | null, user?: OAuthUser | false) => void,
	): Promise<void> {
		try {
			const { id, name, emails, photos } = profile;

			if (!emails || emails.length === 0) {
				this.logger.warn(
					`Facebook validation failed: No email found in profile for ID ${id}`,
				);
				return done(
					new Error("Email not available from Facebook profile"),
					false,
				);
			}

			const user: OAuthUser = {
				email: emails[0].value,
				firstName: name?.givenName || "",
				lastName: name?.familyName || "",
				provider: "facebook",
				providerId: id,
				profileImage: photos?.[0]?.value || undefined,
			};

			this.logger.log(`User authenticated via Facebook: ${user.email}`);
			done(null, user);
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(
					`Facebook validation failed: ${error.message}`,
					error.stack,
				);
				done(error, false);
			} else {
				const unknownError = new Error(
					`Facebook validation failed: ${String(error)}`,
				);
				this.logger.error(unknownError.message);
				done(unknownError, false);
			}
		}
	}
}
