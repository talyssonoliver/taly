import { generateReport } from "./src/services/reportService.js";

const buildResponse = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  console.info("🔄 Report generation process started...");

  try {
    const isHttpEvent = event && event.queryStringParameters !== undefined;
    const params = isHttpEvent
      ? event.queryStringParameters
      : JSON.parse(event.body || "{}");

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
  } catch (error) {
    console.error("Report generation failed:", error);
    return buildResponse(500, {
      success: false,
      message: "An error occurred while generating the report.",
    });
  }
};
