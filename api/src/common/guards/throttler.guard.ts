import {
	Injectable,
	type ExecutionContext,
	Logger,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { ThrottlerGuard, type ThrottlerLimitDetail } from "@nestjs/throttler";
import type { Request } from "express";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	private readonly logger = new Logger(CustomThrottlerGuard.name);

	/**
	 * Get the request tracker (IP or user ID)
	 * @param req The HTTP request
	 * @returns A promise resolving to the tracking identifier
	 */
	protected async getTracker(req: Record<string, any>): Promise<string> {
		const ip = (req as Request).ip || "127.0.0.1"; // Fallback to localhost if IP is undefined
		const userId = req.user?.id;

		// If user is authenticated, include user ID in the tracker
		return userId ? `${ip}-${userId}` : ip;
	}

	/**
	 * Handle rate limit exceeded exceptions with custom error message
	 * @param context The execution context
	 * @param throttlerLimitDetail Details about the rate limit that was exceeded
	 */
	protected async throwThrottlingException(
		context: ExecutionContext,
		throttlerLimitDetail: ThrottlerLimitDetail,
	): Promise<void> {
		const req = context.switchToHttp().getRequest<Request>();
		const path = req.path || "unknown";
		const ip = req.ip || "unknown";

		this.logger.warn(
			`Rate limit exceeded for IP: ${ip}, path: ${path}, limit: ${throttlerLimitDetail.limit}, TTL: ${throttlerLimitDetail.ttl}`,
		);

		throw new HttpException(
			"Too many requests, please try again later.",
			HttpStatus.TOO_MANY_REQUESTS,
		);
	}
}