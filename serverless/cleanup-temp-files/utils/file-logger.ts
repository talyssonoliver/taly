import fs from "node:fs";
import path from "node:path";

/**
 * Logs a message with a timestamp.
 *
 * @param {string} level - The log level (`INFO`, `WARN`, `ERROR`).
 * @param {string} message - The message to log.
 * @param {unknown} [data] - Optional additional data.
 */
const log = (level: string, message: string, data?: unknown): void => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }

  writeToLogFile(logMessage, data);
};

/**
 * Writes log messages to a file.
 *
 * @param {string} logMessage - The log message.
 * @param {unknown} [data] - Optional additional data.
 */
const writeToLogFile = (logMessage: string, data?: unknown): void => {
  try {
    const logDir = path.resolve(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, "cleanup-temp-files.log");
    const logEntry = data
      ? `${logMessage} - ${JSON.stringify(data)}\n`
      : `${logMessage}\n`;

    fs.appendFileSync(logFile, logEntry, "utf8");
  } catch (error) {
    console.error("❌ Failed to write log to file:", error);
  }
};

/**
 * Logs an informational message.
 *
 * @param {string} message - The message to log.
 * @param {unknown} [data] - Optional additional data.
 */
export const logInfo = (message: string, data?: unknown): void => {
  log("INFO", message, data);
};

/**
 * Logs a warning message.
 *
 * @param {string} message - The warning message.
 * @param {unknown} [data] - Optional additional data.
 */
export const logWarn = (message: string, data?: unknown): void => {
  log("WARN", message, data);
};

/**
 * Logs an error message.
 *
 * @param {string} message - The error message.
 * @param {unknown} [data] - Optional additional data.
 */
export const logError = (message: string, data?: unknown): void => {
  log("ERROR", message, data);
};
