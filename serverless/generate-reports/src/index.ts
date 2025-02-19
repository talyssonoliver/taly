import { generateReport } from "./services/reportService";

const validateParams = (startDate: string, endDate: string) =>
  !startDate || !endDate
    ? {
        status: 400,
        message: "Missing required parameters: startDate and endDate.",
      }
    : null;

const buildResponse = (statusCode: number, body: object) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info("🔄 Report generation process started...");

  const { queryStringParameters = {} } = event;
  const { startDate, endDate, format = "json" } = queryStringParameters || {};

  const error = validateParams(startDate || "", endDate || "");
  if (error) return buildResponse(error.status, { message: error.message });

  try {
    const reportData = await generateReport({
      startDate: startDate || "",
      endDate: endDate || "",
      format: format || "json",
    });
    console.info("✅ Report generated successfully.");
    return buildResponse(200, { success: true, report: reportData });
  } catch (error) {
    console.error("❌ Report generation failed:", error);
    return buildResponse(500, {
      success: false,
      message: "An error occurred while generating the report.",
    });
  }
};
