import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Response } from "express";

@Catch(
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
	PrismaClientUnknownRequestError,
	PrismaClientRustPanicError,
	PrismaClientInitializationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
		private readonly logger = new Logger(PrismaExceptionFilter.name);

		catch(
			exception:
				| PrismaClientKnownRequestError
				| PrismaClientValidationError
				| PrismaClientInitializationError
				| PrismaClientRustPanicError
				| PrismaClientUnknownRequestError,
			host: ArgumentsHost,
		) {
			const ctx = host.switchToHttp();
			const response = ctx.getResponse<Response>();
			const request = ctx.getRequest();

			this.logger.error(
				`Prisma Exception: ${exception.message}`,
				exception.stack,
			);

			// Handle known Prisma errors
			if (exception instanceof PrismaClientKnownRequestError) {
				return this.handlePrismaError(exception, response);
			}

			// Handle Prisma validation errors
			if (exception instanceof PrismaClientValidationError) {
				return response.status(HttpStatus.BAD_REQUEST).json({
					statusCode: HttpStatus.BAD_REQUEST,
					message: "Validation error in database query",
					error: exception.message,
					timestamp: new Date().toISOString(),
					path: request.url,
				});
			}

			// Handle Prisma initialization errors
			if (exception instanceof PrismaClientInitializationError) {
				this.logger.error("Database connection failed", exception.stack);
				return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
					message: "Database connection failed",
					error: "Please try again later",
					timestamp: new Date().toISOString(),
					path: request.url,
				});
			}

			// Handle other Prisma errors
			return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: "Internal server error",
				timestamp: new Date().toISOString(),
				path: request.url,
			});
		}

		private handlePrismaError(
			exception: PrismaClientKnownRequestError,
			response: Response,
		) {
			const code = exception.code;
			const meta = exception.meta || {};

			switch (code) {
				// Unique constraint violation
				case "P2002": {
					const target = Array.isArray(meta.target)
						? meta.target.join(", ")
						: meta.target || "field";

					return response.status(HttpStatus.CONFLICT).json({
						statusCode: HttpStatus.CONFLICT,
						message: `Unique constraint violation: ${target} already exists`,
						error: "Conflict",
					});
				}

				// Foreign key constraint violation
				case "P2003": {
					const fieldName = meta.field_name || "field";

					return response.status(HttpStatus.BAD_REQUEST).json({
						statusCode: HttpStatus.BAD_REQUEST,
						message: `Foreign key constraint violation: ${fieldName} references non-existent record`,
						error: "Bad Request",
					});
				}

				// Record not found
				case "P2025":
					return response.status(HttpStatus.NOT_FOUND).json({
						statusCode: HttpStatus.NOT_FOUND,
						message: "Record not found",
						error: "Not Found",
						details: exception.message,
					});

				// Records not connected
				case "P2018":
					return response.status(HttpStatus.BAD_REQUEST).json({
						statusCode: HttpStatus.BAD_REQUEST,
						message: "Required related records not found",
						error: "Bad Request",
					});

				// Value required but not set
				case "P2011":
					return response.status(HttpStatus.BAD_REQUEST).json({
						statusCode: HttpStatus.BAD_REQUEST,
						message: `Required field value not provided: ${meta.constraint || ""}`,
						error: "Bad Request",
					});

				// Default case for other Prisma errors
				default:
					return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						message: "Database error",
						error: "Internal Server Error",
						code: exception.code,
					});
			}
		}
	}
