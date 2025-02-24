import { generateReport } from "./src/services/reportService";
import type { APIGatewayEvent } from "aws-lambda";

const buildResponse = (statusCode: number, body: object) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event: APIGatewayEvent): Promise<object> => {
  console.info("🔄 Report generation process started...");

  try {
    const isHttpEvent = event && event.queryStringParameters !== undefined;
    const params = isHttpEvent
      ? event.queryStringParameters
      : event.body
        ? JSON.parse(event.body)
        : {};

    const { startDate, endDate, format = "json" } = params;

    if (!startDate || !endDate) {
      console.warn("⚠️ Missing required parameters: startDate or endDate.");
      return buildResponse(400, {
        message: "Missing required parameters: startDate and endDate.",
      });
    }

    const reportData = await generateReport({ startDate, endDate, format });
    console.info("✅ Report generated successfully.");
    return buildResponse(200, { success: true, report: reportData });
  } catch (error: unknown) {
    console.error("Report generation failed:", error);
    return buildResponse(500, {
      success: false,
      message: "An error occurred while generating the report.",
    });
  }
};
