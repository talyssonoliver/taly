import { cleanupS3TempFiles } from "./utils/s3-cleaner.js";
import { logInfo, logError } from "./utils/file-logger.js";
import type { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<object> => {
  logInfo("🧹 Cleanup process started...");

  try {
    // Extract optional parameters from the event
    const bucketName =
      event.queryStringParameters?.bucketName || process.env.S3_BUCKET;
    const retentionPeriod = event.queryStringParameters?.retentionPeriod
      ? Number.parseInt(event.queryStringParameters.retentionPeriod, 10)
      : process.env.RETENTION_DAYS
        ? Number.parseInt(process.env.RETENTION_DAYS, 10)
        : undefined;

    if (!bucketName) {
      throw new Error("S3 bucket name is required.");
    }

    // Perform cleanup operation
    const deletedFiles = await cleanupS3TempFiles(bucketName, retentionPeriod);

    logInfo(
      `✅ Cleanup completed. ${deletedFiles.length} temporary files removed.`
    );

    return buildResponse(200, {
      success: true,
      message: "Cleanup successful",
      deletedFiles,
    });
  } catch (error) {
    logError("❌ Cleanup process failed:", error);
    return buildResponse(500, {
      success: false,
      message: "Cleanup failed due to an error.",
    });
  }
};

/**
 * Constructs a standardized HTTP response.
 *
 * @param {number} statusCode - The HTTP status code.
 * @param {object} body - The response body.
 * @returns {object} - The structured HTTP response.
 */
const buildResponse = (statusCode: number, body: object) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
