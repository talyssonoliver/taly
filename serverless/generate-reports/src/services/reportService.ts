import { fetchReportData } from "../utils/dataFetcher";
import { formatAsCSV, formatAsJSON } from "../utils/formatters";

type ReportParams = {
  startDate: string;
  endDate: string;
  format?: string;
};

export const generateReport = async ({
  startDate,
  endDate,
  format = "json",
}: ReportParams): Promise<object | string> => {
  console.info(
    `Generating report from ${startDate} to ${endDate} in ${format.toUpperCase()} format...`
  );

  try {
    const reportData = await fetchReportData(startDate, endDate);

    if (!reportData || reportData.length === 0) {
      console.warn("No data found for the given date range.");
      return { message: "No data available for the given date range." };
    }

    const formattedReport =
      format.toLowerCase() === "csv"
        ? formatAsCSV(reportData)
        : formatAsJSON(reportData);

    console.info("Report generated successfully.");
    return formattedReport;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report.");
  }
};
