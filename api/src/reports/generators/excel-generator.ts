import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ExcelGenerator {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'reports');

  constructor() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async generateAppointmentReport(data: any): Promise<string> {
    const filename = ppointment-report-.xlsx;
    const filePath = path.join(this.uploadsDir, filename);
    
    const workbook = new ExcelJS.Workbook();
    
    // Add summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add title
    summarySheet.mergeCells('A1:F1');
    summarySheet.getCell('A1').value = 'Appointment Report';
    summarySheet.getCell('A1').font = { size: 16, bold: true };
    summarySheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Add summary data
    summarySheet.getCell('A3').value = 'Total Appointments:';
    summarySheet.getCell('B3').value = data.totalAppointments;
    
    // Add status breakdown
    summarySheet.getCell('A5').value = 'Status Breakdown';
    summarySheet.getCell('A5').font = { bold: true };
    
    let row = 6;
    Object.entries(data.statusBreakdown).forEach(([status, count]) => {
      summarySheet.getCell(A).value = status;
      summarySheet.getCell(B).value = count;
      row++;
    });
    
    // Add service utilization
    row += 1;
    summarySheet.getCell(A).value = 'Service Utilization';
    summarySheet.getCell(A).font = { bold: true };
    row++;
    
    Object.entries(data.serviceUtilization).forEach(([service, count]) => {
      summarySheet.getCell(A).value = service;
      summarySheet.getCell(B).value = count;
      row++;
    });
    
    // Add staff workload
    row += 1;
    summarySheet.getCell(A).value = 'Staff Workload';
    summarySheet.getCell(A).font = { bold: true };
    row++;
    
    Object.entries(data.staffWorkload).forEach(([staff, count]) => {
      summarySheet.getCell(A).value = staff;
      summarySheet.getCell(B).value = count;
      row++;
    });
    
    // Add daily appointments
    row += 1;
    summarySheet.getCell(A).value = 'Daily Appointments';
    summarySheet.getCell(A).font = { bold: true };
    row++;
    
    Object.entries(data.dailyAppointments).forEach(([date, count]) => {
      summarySheet.getCell(A).value = date;
      summarySheet.getCell(B).value = count;
      row++;
    });
    
    // Add details worksheet
    const detailsSheet = workbook.addWorksheet('Appointment Details');
    
    // Add headers
    detailsSheet.columns = [
      { header: 'Client', key: 'client', width: 20 },
      { header: 'Service', key: 'service', width: 20 },
      { header: 'Staff', key: 'staff', width: 20 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Duration (min)', key: 'duration', width: 15 },
      { header: 'Price ($)', key: 'price', width: 15 },
    ];
    
    // Add style to header row
    detailsSheet.getRow(1).font = { bold: true };
    
    // Add appointment data
    data.appointments.forEach(appointment => {
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
    const filename = evenue-report-.xlsx;
    const filePath = path.join(this.uploadsDir, filename);
    
    const workbook = new ExcelJS.Workbook();
    
    // Add summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add title
    summarySheet.mergeCells('A1:F1');
    summarySheet.getCell('A1').value = 'Revenue Report';
    summarySheet.getCell('A1').font = { size: 16, bold: true };
    summarySheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Add summary data
    summarySheet.getCell('A3').value = 'Total Revenue:';
    summarySheet.getCell('B3').value = data.totalRevenue;
    summarySheet.getCell('B3').numFmt = '$#,##0.00';
    
    summarySheet.getCell('A4').value = 'Total Fees:';
    summarySheet.getCell('B4').value = data.totalFees;
    summarySheet.getCell('B4').numFmt = '$#,##0.00';
    
    summarySheet.getCell('A5').value = 'Net Revenue:';
    summarySheet.getCell('B5').value = data.netRevenue;
    summarySheet.getCell('B5').numFmt = '$#,##0.00';
    
    summarySheet.getCell('A6').value = 'Average Transaction Value:';
    summarySheet.getCell('B6').value = data.averageTransactionValue;
    summarySheet.getCell('B6').numFmt = '$#,##0.00';
    
    // Add revenue by service
    summarySheet.getCell('A8').value = 'Revenue by Service';
    summarySheet.getCell('A8').font = { bold: true };
    
    let row = 9;
    Object.entries(data.revenueByService).forEach(([service, amount]) => {
      summarySheet.getCell(A).value = service;
      summarySheet.getCell(B).value = amount;
      summarySheet.getCell(B).numFmt = '$#,##0.00';
      row++;
    });
    
    // Add revenue by staff
    row += 1;
    summarySheet.getCell(A).value = 'Revenue by Staff';
    summarySheet.getCell(A).font = { bold: true };
    row++;
    
    Object.entries(data.revenueByStaff).forEach(([staff, amount]) => {
      summarySheet.getCell(A).value = staff;
      summarySheet.getCell(B).value = amount;
      summarySheet.getCell(B).numFmt = '$#,##0.00';
      row++;
    });
    
    // Add payment methods
    row += 1;
    summarySheet.getCell(A).value = 'Payment Methods';
    summarySheet.getCell(A).font = { bold: true };
    row++;
    
    Object.entries(data.paymentMethods).forEach(([method, amount]) => {
      summarySheet.getCell(A).value = method;
      summarySheet.getCell(B).value = amount;
      summarySheet.getCell(B).numFmt = '$#,##0.00';
      row++;
    });
    
    // Add daily revenue
    row += 1;
    summarySheet.getCell(A).value = 'Daily Revenue';
    summarySheet.getCell(A).font = { bold: true };
    row++;
    
    Object.entries(data.dailyRevenue).forEach(([date, amount]) => {
      summarySheet.getCell(A).value = date;
      summarySheet.getCell(B).value = amount;
      summarySheet.getCell(B).numFmt = '$#,##0.00';
      row++;
    });
    
    // Add transactions worksheet
    const transactionsSheet = workbook.addWorksheet('Transactions');
    
    // Add headers
    transactionsSheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Client', key: 'client', width: 20 },
      { header: 'Service', key: 'service', width: 20 },
      { header: 'Staff', key: 'staff', width: 20 },
      { header: 'Amount ($)', key: 'amount', width: 15 },
      { header: 'Fee ($)', key: 'fee', width: 15 },
      { header: 'Payment Method', key: 'method', width: 15 },
    ];
    
    // Add style to header row
    transactionsSheet.getRow(1).font = { bold: true };
    
    // Add transaction data
    data.transactions.forEach(transaction => {
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
    transactionsSheet.getColumn('amount').numFmt = '$#,##0.00';
    transactionsSheet.getColumn('fee').numFmt = '$#,##0.00';
    
    // Save the workbook
    await workbook.xlsx.writeFile(filePath);
    
    return filePath;
  }

  async generateClientReport(data: any): Promise<string> {
    const filename = client-report-.xlsx;
    const filePath = path.join(this.uploadsDir, filename);
    
    const workbook = new ExcelJS.Workbook();
    
    // Add summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add title
    summarySheet.mergeCells('A1:F1');
    summarySheet.getCell('A1').value = 'Client Report';
    summarySheet.getCell('A1').font = { size: 16, bold: true };
    summarySheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Add summary data
    summarySheet.getCell('A3').value = 'Total Clients:';
    summarySheet.getCell('B3').value = data.totalClients;
    
    summarySheet.getCell('A4').value = 'New Clients:';
    summarySheet.getCell('B4').value = data.newClients;
    
    summarySheet.getCell('A5').value = 'Total Appointments:';
    summarySheet.getCell('B5').value = data.totalAppointments;
    
    summarySheet.getCell('A6').value = 'Total Revenue:';
    summarySheet.getCell('B6').value = data.totalRevenue;
    summarySheet.getCell('B6').numFmt = '$#,##0.00';
    
    summarySheet.getCell('A7').value = 'Average Revenue Per Client:';
    summarySheet.getCell('B7').value = data.averageRevenuePerClient;
    summarySheet.getCell('B7').numFmt = '$#,##0.00';
    
    summarySheet.getCell('A8').value = 'Retention Rate:';
    summarySheet.getCell('B8').value = data.retentionRate;
    summarySheet.getCell('B8').numFmt = '0.00%';
    
    // Add top clients
    summarySheet.getCell('A10').value = 'Top 10 Clients by Revenue';
    summarySheet.getCell('A10').font = { bold: true };
    
    let row = 11;
    data.clientStatistics.slice(0, 10).forEach((client, index) => {
      summarySheet.getCell(A).value = ${index + 1}. ;
      summarySheet.getCell(B).value = client.totalSpent;
      summarySheet.getCell(B).numFmt = '$#,##0.00';
      summarySheet.getCell(C).value = Appointments: ;
      row++;
    });
    
    // Add clients worksheet
    const clientsSheet = workbook.addWorksheet('Client Details');
    
    // Add headers
    clientsSheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Client Since', key: 'since', width: 15 },
      { header: 'Appointments', key: 'appointments', width: 15 },
      { header: 'Total Spent ($)', key: 'spent', width: 15 },
      { header: 'New Client', key: 'isNew', width: 10 },
      { header: 'Last Visit', key: 'lastVisit', width: 15 },
    ];
    
    // Add style to header row
    clientsSheet.getRow(1).font = { bold: true };
    
    // Add client data
    data.clientStatistics.forEach(client => {
      clientsSheet.addRow({
        name: client.name,
        email: client.email,
        phone: client.phone,
        since: new Date(client.createdAt).toLocaleDateString(),
        appointments: client.appointmentsCount,
        spent: client.totalSpent,
        isNew: client.isNew ? 'Yes' : 'No',
        lastVisit: client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'N/A',
      });
    });
    
    // Format currency column
    clientsSheet.getColumn('spent').numFmt = '$#,##0.00';
    
    // Save the workbook
    await workbook.xlsx.writeFile(filePath);
    
    return filePath;
  }

  async generateStaffReport(data: any): Promise<string> {
    const filename = staff-report-.xlsx;
    const filePath = path.join(this.uploadsDir, filename);
    
    const workbook = new ExcelJS.Workbook();
    
    // Add summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add title
    summarySheet.mergeCells('A1:F1');
    summarySheet.getCell('A1').value = 'Staff Performance Report';
    summarySheet.getCell('A1').font = { size: 16, bold: true };
    summarySheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Add summary data
    summarySheet.getCell('A3').value = 'Total Staff:';
    summarySheet.getCell('B3').value = data.totalStaff;
    
    summarySheet.getCell('A4').value = 'Total Appointments:';
    summarySheet.getCell('B4').value = data.totalAppointments;
    
    summarySheet.getCell('A5').value = 'Total Revenue:';
    summarySheet.getCell('B5').value = data.totalRevenue;
    summarySheet.getCell('B5').numFmt = '$#,##0.00';
    
    // Add staff performance worksheet
    const staffSheet = workbook.addWorksheet('Staff Performance');
    
    // Add headers
    staffSheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Appointments', key: 'appointments', width: 15 },
      { header: 'Revenue ($)', key: 'revenue', width: 15 },
      { header: 'Unique Clients', key: 'uniqueClients', width: 15 },
      { header: 'Repeat Clients', key: 'repeatClients', width: 15 },
      { header: 'Retention Rate (%)', key: 'retention', width: 15 },
      { header: 'Avg. Revenue/Appt ($)', key: 'avgRevenue', width: 20 },
      { header: 'Total Minutes', key: 'minutes', width: 15 },
    ];
    
    // Add style to header row
    staffSheet.getRow(1).font = { bold: true };
    
    // Add staff data
    data.staffPerformance.forEach(staff => {
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
    staffSheet.getColumn('revenue').numFmt = '$#,##0.00';
    staffSheet.getColumn('avgRevenue').numFmt = '$#,##0.00';
    staffSheet.getColumn('retention').numFmt = '0.00%';
    
    // Add service breakdown worksheet
    const serviceSheet = workbook.addWorksheet('Service Breakdown');
    
    // Prepare headers (dynamic based on services offered)
    const serviceHeaders = [{ header: 'Staff', key: 'staff', width: 20 }];
    
    // Collect all unique services
    const allServices = new Set();
    data.staffPerformance.forEach(staff => {
      Object.keys(staff.serviceBreakdown).forEach(service => {
        allServices.add(service);
      });
    });
    
    // Add service columns
    Array.from(allServices).forEach(service => {
      serviceHeaders.push({
        header: service,
        key: service,
        width: 15
      });
    });
    
    serviceSheet.columns = serviceHeaders;
    
    // Add style to header row
    serviceSheet.getRow(1).font = { bold: true };
    
    // Add service breakdown data
    data.staffPerformance.forEach(staff => {
      const rowData = { staff: staff.name };
      
      // Add counts for each service
      Array.from(allServices).forEach(service => {
        rowData[service] = staff.serviceBreakdown[service] || 0;
      });
      
      serviceSheet.addRow(rowData);
    });
    
    // Save the workbook
    await workbook.xlsx.writeFile(filePath);
    
    return filePath;
  }
}
