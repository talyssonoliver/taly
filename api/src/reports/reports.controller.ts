import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll(@Query() query): Promise<Report[]> {
    return this.reportsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Report> {
    const report = await this.reportsService.findOne(id);
    if (!report) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }
    return report;
  }

  @Post()
  async create(@Body() reportData): Promise<Report> {
    return this.reportsService.create(reportData);
  }

  @Get('generate/appointments')
  async generateAppointmentReport(@Query() query) {
    return this.reportsService.generateAppointmentReport(query);
  }

  @Get('generate/revenue')
  async generateRevenueReport(@Query() query) {
    return this.reportsService.generateRevenueReport(query);
  }

  @Get('generate/clients')
  async generateClientReport(@Query() query) {
    return this.reportsService.generateClientReport(query);
  }

  @Get('generate/staff')
  async generateStaffPerformanceReport(@Query() query) {
    return this.reportsService.generateStaffPerformanceReport(query);
  }

  @Get('download/:id/pdf')
  async downloadPdf(@Param('id') id: string) {
    return this.reportsService.downloadReportAsPdf(id);
  }

  @Get('download/:id/excel')
  async downloadExcel(@Param('id') id: string) {
    return this.reportsService.downloadReportAsExcel(id);
  }
}
