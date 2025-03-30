import { Injectable, Logger } from "@nestjs/common";
import * as ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { ReportColumn } from "../interfaces/report-column.interface";
import { Report } from "../interfaces/report.interface";

@Injectable()
export class ExcelGenerator {
	private readonly uploadsDir = path.join(process.cwd(), "uploads", "reports");
	private readonly logger = new Logger(ExcelGenerator.name);

	constructor() {
		// Ensure uploads directory exists
		if (!fs.existsSync(this.uploadsDir)) {
			fs.mkdirSync(this.uploadsDir, { recursive: true });
		}
	}

	async generateAppointmentReport(data: any): Promise<string> {
		const filename = "appointment-report-.xlsx";
		const filePath = path.join(this.uploadsDir, filename);

		const workbook = new ExcelJS.Workbook();

		// Add summary worksheet
		const summarySheet = workbook.addWorksheet("Summary");

		// Add title
		summarySheet.mergeCells("A1:F1");
		summarySheet.getCell("A1").value = "Appointment Report";
		summarySheet.getCell("A1").font = { size: 16, bold: true };
		summarySheet.getCell("A1").alignment = { horizontal: "center" };

		// Add summary data
		summarySheet.getCell("A3").value = "Total Appointments:";
		summarySheet.getCell("B3").value = data.totalAppointments;

		// Add status breakdown
		summarySheet.getCell("A5").value = "Status Breakdown";
		summarySheet.getCell("A5").font = { bold: true };

		let row = 6;
		Object.entries(data.statusBreakdown).forEach(([status, count]) => {
			summarySheet.getCell(`A${row}`).value = status;
			summarySheet.getCell(`B${row}`).value = count;
			row++;
		});

		// Add service utilization
		row += 1;
		summarySheet.getCell(`A${row}`).value = "Service Utilization";
		summarySheet.getCell(`A${row}`).font = { bold: true };
		row++;

		Object.entries(data.serviceUtilization).forEach(([service, count]) => {
			summarySheet.getCell(`A${row}`).value = service;
			summarySheet.getCell(`B${row}`).value = count;
			row++;
		});

		// Add staff workload
		row += 1;
		summarySheet.getCell(`A${row}`).value = "Staff Workload";
		summarySheet.getCell(`A${row}`).font = { bold: true };
		row++;

		Object.entries(data.staffWorkload).forEach(([staff, count]) => {
			summarySheet.getCell(`A${row}`).value = staff;
			summarySheet.getCell(`B${row}`).value = count;
			row++;
		});

		// Add daily appointments
		row += 1;
		summarySheet.getCell(`A${row}`).value = "Daily Appointments";
		summarySheet.getCell(`A${row}`).font = { bold: true };
		row++;

		Object.entries(data.dailyAppointments).forEach(([date, count]) => {
			summarySheet.getCell(`A${row}`).value = date;
			summarySheet.getCell(`B${row}`).value = count;
			row++;
		});

		// Add details worksheet
		const detailsSheet = workbook.addWorksheet("Appointment Details");

		// Add headers
		detailsSheet.columns = [
			{ header: "Client", key: "client", width: 20 },
			{ header: "Service", key: "service", width: 20 },
			{ header: "Staff", key: "staff", width: 20 },
			{ header: "Date", key: "date", width: 20 },
			{ header: "Status", key: "status", width: 15 },
			{ header: "Duration (min)", key: "duration", width: 15 },
			{ header: "Price ($)", key: "price", width: 15 },
		];

		// Add style to header row
		detailsSheet.getRow(1).font = { bold: true };

		// Add appointment data
		data.appointments.forEach((appointment) => {
			detailsSheet.addRow({
				client: appointment.clientName,
				service: appointment.serviceName,
				staff: appointment.staffName,
				date: new Date(appointment.date).toLocaleString(),
				status: appointment.status,
				duration: appointment.duration,
				price: appointment.price,
			});
		});

		// Save the workbook
		await workbook.xlsx.writeFile(filePath);

		return filePath;
	}

	async generateRevenueReport(data: any): Promise<string> {
		const filename = "revenue-report-.xlsx";
		const filePath = path.join(this.uploadsDir, filename);

		const workbook = new ExcelJS.Workbook();

		// Add summary worksheet
		const summarySheet = workbook.addWorksheet("Summary");

		// Add title
		summarySheet.mergeCells("A1:F1");
		summarySheet.getCell("A1").value = "Revenue Report";
		summarySheet.getCell("A1").font = { size: 16, bold: true };
		summarySheet.getCell("A1").alignment = { horizontal: "center" };

		// Add summary data
		summarySheet.getCell("A3").value = "Total Revenue:";
		summarySheet.getCell("B3").value = data.totalRevenue;
		summarySheet.getCell("B3").numFmt = "$#,##0.00";

		summarySheet.getCell("A4").value = "Total Fees:";
		summarySheet.getCell("B4").value = data.totalFees;
		summarySheet.getCell("B4").numFmt = "$#,##0.00";

		summarySheet.getCell("A5").value = "Net Revenue:";
		summarySheet.getCell("B5").value = data.netRevenue;
		summarySheet.getCell("B5").numFmt = "$#,##0.00";

		summarySheet.getCell("A6").value = "Average Transaction Value:";
		summarySheet.getCell("B6").value = data.averageTransactionValue;
		summarySheet.getCell("B6").numFmt = "$#,##0.00";

		// Add revenue by service
		summarySheet.getCell("A8").value = "Revenue by Service";
		summarySheet.getCell("A8").font = { bold: true };

		let row = 9;
		Object.entries(data.revenueByService).forEach(([service, amount]) => {
			summarySheet.getCell(`A${row}`).value = service;
			summarySheet.getCell(`B${row}`).value = amount;
			summarySheet.getCell(`B${row}`).numFmt = "$#,##0.00";
			row++;
		});

		// Add revenue by staff
		row += 1;
		summarySheet.getCell(`A${row}`).value = "Revenue by Staff";
		summarySheet.getCell(`A${row}`).font = { bold: true };
		row++;

		Object.entries(data.revenueByStaff).forEach(([staff, amount]) => {
			summarySheet.getCell(`A${row}`).value = staff;
			summarySheet.getCell(`B${row}`).value = amount;
			summarySheet.getCell(`B${row}`).numFmt = "$#,##0.00";
			row++;
		});

		// Add payment methods
		row += 1;
		summarySheet.getCell(`A${row}`).value = "Payment Methods";
		summarySheet.getCell(`A${row}`).font = { bold: true };
		row++;

		Object.entries(data.paymentMethods).forEach(([method, amount]) => {
			summarySheet.getCell(`A${row}`).value = method;
			summarySheet.getCell(`B${row}`).value = amount;
			summarySheet.getCell(`B${row}`).numFmt = "$#,##0.00";
			row++;
		});

		// Add daily revenue
		row += 1;
		summarySheet.getCell(`A${row}`).value = "Daily Revenue";
		summarySheet.getCell(`A${row}`).font = { bold: true };
		row++;

		Object.entries(data.dailyRevenue).forEach(([date, amount]) => {
			summarySheet.getCell(`A${row}`).value = date;
			summarySheet.getCell(`B${row}`).value = amount;
			summarySheet.getCell(`B${row}`).numFmt = "$#,##0.00";
			row++;
		});

		// Add transactions worksheet
		const transactionsSheet = workbook.addWorksheet("Transactions");

		// Add headers
		transactionsSheet.columns = [
			{ header: "Date", key: "date", width: 20 },
			{ header: "Client", key: "client", width: 20 },
			{ header: "Service", key: "service", width: 20 },
			{ header: "Staff", key: "staff", width: 20 },
			{ header: "Amount ($)", key: "amount", width: 15 },
			{ header: "Fee ($)", key: "fee", width: 15 },
			{ header: "Payment Method", key: "method", width: 15 },
		];

		// Add style to header row
		transactionsSheet.getRow(1).font = { bold: true };

		// Add transaction data
		data.transactions.forEach((transaction) => {
			transactionsSheet.addRow({
				date: new Date(transaction.date).toLocaleString(),
				client: transaction.clientName,
				service: transaction.serviceName,
				staff: transaction.staffName,
				amount: transaction.amount,
				fee: transaction.fee,
				method: transaction.paymentMethod,
			});
		});

		// Format currency columns
		transactionsSheet.getColumn("amount").numFmt = "$#,##0.00";
		transactionsSheet.getColumn("fee").numFmt = "$#,##0.00";

		// Save the workbook
		await workbook.xlsx.writeFile(filePath);

		return filePath;
	}

	async generateClientReport(data: any): Promise<string> {
		const filename = "client-report-.xlsx";
		const filePath = path.join(this.uploadsDir, filename);

		const workbook = new ExcelJS.Workbook();

		// Add summary worksheet
		const summarySheet = workbook.addWorksheet("Summary");

		// Add title
		summarySheet.mergeCells("A1:F1");
		summarySheet.getCell("A1").value = "Client Report";
		summarySheet.getCell("A1").font = { size: 16, bold: true };
		summarySheet.getCell("A1").alignment = { horizontal: "center" };

		// Add summary data
		summarySheet.getCell("A3").value = "Total Clients:";
		summarySheet.getCell("B3").value = data.totalClients;

		summarySheet.getCell("A4").value = "New Clients:";
		summarySheet.getCell("B4").value = data.newClients;

		summarySheet.getCell("A5").value = "Total Appointments:";
		summarySheet.getCell("B5").value = data.totalAppointments;

		summarySheet.getCell("A6").value = "Total Revenue:";
		summarySheet.getCell("B6").value = data.totalRevenue;
		summarySheet.getCell("B6").numFmt = "$#,##0.00";

		summarySheet.getCell("A7").value = "Average Revenue Per Client:";
		summarySheet.getCell("B7").value = data.averageRevenuePerClient;
		summarySheet.getCell("B7").numFmt = "$#,##0.00";

		summarySheet.getCell("A8").value = "Retention Rate:";
		summarySheet.getCell("B8").value = data.retentionRate;
		summarySheet.getCell("B8").numFmt = "0.00%";

		// Add top clients
		summarySheet.getCell("A10").value = "Top 10 Clients by Revenue";
		summarySheet.getCell("A10").font = { bold: true };

		let row = 11;
		data.clientStatistics.slice(0, 10).forEach((client, index) => {
			summarySheet.getCell(`A${row}`).value = `${index + 1}. ${client.name}`;
			summarySheet.getCell(`B${row}`).value = client.totalSpent;
			summarySheet.getCell(`B${row}`).numFmt = "$#,##0.00";
			summarySheet.getCell(`C${row}`).value =
				`Appointments: ${client.appointmentsCount}`;
			row++;
		});

		// Add clients worksheet
		const clientsSheet = workbook.addWorksheet("Client Details");

		// Add headers
		clientsSheet.columns = [
			{ header: "Name", key: "name", width: 20 },
			{ header: "Email", key: "email", width: 30 },
			{ header: "Phone", key: "phone", width: 15 },
			{ header: "Client Since", key: "since", width: 15 },
			{ header: "Appointments", key: "appointments", width: 15 },
			{ header: "Total Spent ($)", key: "spent", width: 15 },
			{ header: "New Client", key: "isNew", width: 10 },
			{ header: "Last Visit", key: "lastVisit", width: 15 },
		];

		// Add style to header row
		clientsSheet.getRow(1).font = { bold: true };

		// Add client data
		data.clientStatistics.forEach((client) => {
			clientsSheet.addRow({
				name: client.name,
				email: client.email,
				phone: client.phone,
				since: new Date(client.createdAt).toLocaleDateString(),
				appointments: client.appointmentsCount,
				spent: client.totalSpent,
				isNew: client.isNew ? "Yes" : "No",
				lastVisit: client.lastVisit
					? new Date(client.lastVisit).toLocaleDateString()
					: "N/A",
			});
		});

		// Format currency column
		clientsSheet.getColumn("spent").numFmt = "$#,##0.00";

		// Save the workbook
		await workbook.xlsx.writeFile(filePath);

		return filePath;
	}

	async generateStaffReport(data: any): Promise<string> {
		const filename = "staff-report-.xlsx";
		const filePath = path.join(this.uploadsDir, filename);

		const workbook = new ExcelJS.Workbook();

		// Add summary worksheet
		const summarySheet = workbook.addWorksheet("Summary");

		// Add title
		summarySheet.mergeCells("A1:F1");
		summarySheet.getCell("A1").value = "Staff Performance Report";
		summarySheet.getCell("A1").font = { size: 16, bold: true };
		summarySheet.getCell("A1").alignment = { horizontal: "center" };

		// Add summary data
		summarySheet.getCell("A3").value = "Total Staff:";
		summarySheet.getCell("B3").value = data.totalStaff;

		summarySheet.getCell("A4").value = "Total Appointments:";
		summarySheet.getCell("B4").value = data.totalAppointments;

		summarySheet.getCell("A5").value = "Total Revenue:";
		summarySheet.getCell("B5").value = data.totalRevenue;
		summarySheet.getCell("B5").numFmt = "$#,##0.00";

		// Add staff performance worksheet
		const staffSheet = workbook.addWorksheet("Staff Performance");

		// Add headers
		staffSheet.columns = [
			{ header: "Name", key: "name", width: 20 },
			{ header: "Appointments", key: "appointments", width: 15 },
			{ header: "Revenue ($)", key: "revenue", width: 15 },
			{ header: "Unique Clients", key: "uniqueClients", width: 15 },
			{ header: "Repeat Clients", key: "repeatClients", width: 15 },
			{ header: "Retention Rate (%)", key: "retention", width: 15 },
			{ header: "Avg. Revenue/Appt ($)", key: "avgRevenue", width: 20 },
			{ header: "Total Minutes", key: "minutes", width: 15 },
		];

		// Add style to header row
		staffSheet.getRow(1).font = { bold: true };

		// Add staff data
		data.staffPerformance.forEach((staff) => {
			staffSheet.addRow({
				name: staff.name,
				appointments: staff.appointmentsCount,
				revenue: staff.revenue,
				uniqueClients: staff.uniqueClients,
				repeatClients: staff.repeatClients,
				retention: staff.retentionRate,
				avgRevenue: staff.averageRevenuePerAppointment,
				minutes: staff.totalServiceMinutes,
			});
		});

		// Format currency and percentage columns
		staffSheet.getColumn("revenue").numFmt = "$#,##0.00";
		staffSheet.getColumn("avgRevenue").numFmt = "$#,##0.00";
		staffSheet.getColumn("retention").numFmt = "0.00%";

		// Add service breakdown worksheet
		const serviceSheet = workbook.addWorksheet("Service Breakdown");

		// Prepare headers (dynamic based on services offered)
		const serviceHeaders = [{ header: "Staff", key: "staff", width: 20 }];

		// Collect all unique services
		const allServices = new Set();
		data.staffPerformance.forEach((staff) => {
			Object.keys(staff.serviceBreakdown).forEach((service) => {
				allServices.add(service);
			});
		});

		// Add service columns
		Array.from(allServices).forEach((service) => {
			serviceHeaders.push({
				header: service,
				key: service,
				width: 15,
			});
		});

		serviceSheet.columns = serviceHeaders;

		// Add style to header row
		serviceSheet.getRow(1).font = { bold: true };

		// Add service breakdown data
		data.staffPerformance.forEach((staff) => {
			const rowData = { staff: staff.name };

			// Add counts for each service
			Array.from(allServices).forEach((service) => {
				rowData[service] = staff.serviceBreakdown[service] || 0;
			});

			serviceSheet.addRow(rowData);
		});

		// Save the workbook
		await workbook.xlsx.writeFile(filePath);

		return filePath;
	}

	async generateExcelBuffer(report: Report): Promise<Buffer> {
		try {
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet(report.title);

			// Add report title
			const titleRow = worksheet.addRow([report.title]);
			titleRow.font = { size: 16, bold: true };
			worksheet.addRow([]); // Add empty row after title

			// Add column headers
			const headerRow = worksheet.addRow(
				report.columns.map((column: ReportColumn) => column.header),
			);
			headerRow.font = { bold: true };

			// Set column widths
			report.columns.forEach((column: ReportColumn, index: number) => {
				if (column.width) {
					worksheet.getColumn(index + 1).width = column.width;
				}
			});

			// Add data rows
			if (Array.isArray(report.data)) {
				for (const item of report.data) {
					// Ensure item is an object before processing
					if (typeof item !== "object" || item === null) {
						this.logger.warn("Skipping non-object data row:", item);
						continue;
					}

					const rowData = report.columns.map((column: ReportColumn) => {
						const path = column.field.split(".");
						let value: unknown = item;

						for (const segment of path) {
							if (value && typeof value === "object" && segment in value) {
								value = (value as Record<string, unknown>)[segment];
							} else {
								value = null;
								break;
							}
						}

						// Format value based on column type
						if (column.type === "currency" && typeof value === "number") {
							return value.toFixed(2);
						} else if (column.type === "date" && value instanceof Date) {
							return value.toISOString().split("T")[0];
						} else if (column.type === "datetime" && value instanceof Date) {
							return value.toLocaleString();
						}

						return value !== null && value !== undefined ? String(value) : "";
					});

					worksheet.addRow(rowData);
				}
			}

			// Add summary rows if provided
			if (report.summary && typeof report.summary === "object") {
				worksheet.addRow([]); // Empty row before summary

				for (const [key, value] of Object.entries(report.summary)) {
					const summaryValue =
						typeof value === "number" ? value.toFixed(2) : String(value);
					worksheet.addRow([key, summaryValue]);
				}
			}

			// Calculate totals for columns marked with 'calculateTotal'
			if (Array.isArray(report.data)) {
				const totalsRow: Record<number, number> = {};

				report.columns.forEach((column: ReportColumn, index: number) => {
					if (column.calculateTotal) {
						let total = 0;

						for (const item of report.data) {
							if (typeof item !== "object" || item === null) continue;

							const path = column.field.split(".");
							let value: unknown = item;

							for (const segment of path) {
								if (value && typeof value === "object" && segment in value) {
									value = (value as Record<string, unknown>)[segment];
								} else {
									value = null;
									break;
								}
							}

							if (typeof value === "number") {
								total += value;
							} else if (typeof value === "string") {
								const numValue = Number.parseFloat(value);
								if (!isNaN(numValue)) {
									total += numValue;
								}
							}
						}

						totalsRow[index + 1] = total;
					}
				});

				if (Object.keys(totalsRow).length > 0) {
					worksheet.addRow([]); // Empty row before totals

					const totalRowData: string[] = Array(report.columns.length).fill("");
					totalRowData[0] = "Total:";

					Object.entries(totalsRow).forEach(([colIndex, total]) => {
						const column = report.columns[Number.parseInt(colIndex, 10) - 1];
						const formattedTotal =
							column.type === "currency" ? total.toFixed(2) : total.toString();
						totalRowData[Number.parseInt(colIndex, 10) - 1] = formattedTotal;
					});

					const totalRow = worksheet.addRow(totalRowData);
					totalRow.font = { bold: true };
				}
			}

			// Generate buffer
			return await workbook.xlsx.writeBuffer();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`Error generating Excel file: ${errorMessage}`);
			throw error;
		}
	}
}
