import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { logInfo, logError } from "./file-logger.js";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

/**
 * Cleans up expired temporary files in an S3 bucket.
 *
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {number} retentionDays - The number of days before a file is considered expired.
 * @returns {Promise<string[]>} - List of deleted file keys.
 */
export const cleanupS3TempFiles = async (
  bucketName: string,
  retentionDays = 7
): Promise<string[]> => {
  try {
    logInfo(`🔍 Scanning S3 bucket "${bucketName}" for expired files...`);

    const now = new Date();
    const retentionThreshold = new Date(
      now.setDate(now.getDate() - retentionDays)
    );

    const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
    const listResponse = await s3.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      logInfo("📂 No files found in the bucket.");
      return [];
    }

    // Filter objects older than retention threshold
    const expiredFiles = listResponse.Contents.filter(
      (file) =>
        file.LastModified && new Date(file.LastModified) < retentionThreshold
    ).map((file) => {
      if (file.Key) {
        return file.Key;
      }
      throw new Error("File key is undefined or null");
    });

    if (expiredFiles.length === 0) {
      logInfo("✅ No expired files found for deletion.");
      return [];
    }

    logInfo(
      `🗑️ Deleting ${expiredFiles.length} expired files from bucket "${bucketName}"...`
    );

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: { Objects: expiredFiles.map((Key) => ({ Key })) },
    });

    await s3.send(deleteCommand);

    logInfo(`✅ Successfully deleted ${expiredFiles.length} files.`);
    return expiredFiles;
  } catch (error) {
    logError("❌ Failed to clean up S3 temporary files:", error);
    throw new Error("S3 cleanup failed.");
  }
};
