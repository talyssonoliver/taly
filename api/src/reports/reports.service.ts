import { Injectable } from '@nestjs/common';
import { ReportRepository } from './repositories/report.repository';
import { Report } from './entities/report.entity';
import { 
  generateAppointmentReport,
  generateRevenueReport,
  generateClientReport,
  generateStaffPerformanceReport,
} from './generators';
import { generatePdf } from './generators/pdf-generator';
import { generateExcel } from './generators/excel-generator';

@Injectable()
export class ReportsService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async findAll(query): Promise<Report[]> {
    return this.reportRepository.findAll(query);
  }

  async findOne(id: string): Promise<Report> {
    return this.reportRepository.findOne(id);
  }

  async create(reportData): Promise<Report> {
    return this.reportRepository.create(reportData);
  }

  async generateAppointmentReport(filters) {
    const reportData = await generateAppointmentReport(filters);
    
    // Save the report to database
    const report = await this.reportRepository.create({
      type: 'appointment',
      title: 'Appointment Report',
      data: reportData,
      filters,
      createdAt: new Date(),
    });

    return report;
  }

  async generateRevenueReport(filters) {
    const reportData = await generateRevenueReport(filters);
    
    // Save the report to database
    const report = await this.reportRepository.create({
      type: 'revenue',
      title: 'Revenue Report',
      data: reportData,
      filters,
      createdAt: new Date(),
    });

    return report;
  }

  async generateClientReport(filters) {
    const reportData = await generateClientReport(filters);
    
    // Save the report to database
    const report = await this.reportRepository.create({
      type: 'client',
      title: 'Client Report',
      data: reportData,
      filters,
      createdAt: new Date(),
    });

    return report;
  }

  async generateStaffPerformanceReport(filters) {
    const reportData = await generateStaffPerformanceReport(filters);
    
    // Save the report to database
    const report = await this.reportRepository.create({
      type: 'staff-performance',
      title: 'Staff Performance Report',
      data: reportData,
      filters,
      createdAt: new Date(),
    });

    return report;
  }

  async downloadReportAsPdf(id: string) {
    const report = await this.reportRepository.findOne(id);
    if (!report) {
      throw new Error('Report not found');
    }

    const pdfBuffer = await generatePdf(report);
    
    return {
      buffer: pdfBuffer,
      filename: ${report.title.replace(/\s+/g, '-').toLowerCase()}-.pdf,
      contentType: 'application/pdf',
    };
  }

  async downloadReportAsExcel(id: string) {
    const report = await this.reportRepository.findOne(id);
    if (!report) {
      throw new Error('Report not found');
    }

    const excelBuffer = await generateExcel(report);
    
    return {
      buffer: excelBuffer,
      filename: ${report.title.replace(/\s+/g, '-').toLowerCase()}-.xlsx,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }
}
