import { Injectable, NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../../prisma/prisma.service";
import type { Report } from "./entities/report.entity";
import type { CreateReportDto } from "./dto/create-report.dto";
import type { UpdateReportDto } from "./dto/update-report.dto";

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const report = await this.prisma.report.create({
      data: createReportDto,
    });
    return report;
  }

  async findAll(): Promise<Report[]> {
    return this.prisma.report.findMany();
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found.`);
    }
    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.prisma.report.update({
      where: { id },
      data: updateReportDto,
    });

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found.`);
    }

    return report;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.report.delete({ where: { id } });
  }
}
