import { NextFunction, Request, Response } from "express";

export function errorHandlerMiddleware(
	err: unknown,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction,
) {
	const statusCode = 500;
	const message =
		err instanceof Error ? err.message : "An unexpected error occurred";

	// Log the error
	console.error(`[Error] ${message}`);
	if (err instanceof Error && err.stack) {
		console.error(err.stack);
	}

	// Send error response
	res.status(statusCode).json({
		error: {
			message,
			statusCode,
			timestamp: new Date().toISOString(),
			path: req.path,
		},
	});
}
