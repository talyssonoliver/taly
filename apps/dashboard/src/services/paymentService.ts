import { Injectable, NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../../prisma/prisma.service";
import type { Payment } from "./entities/payment.entity";
import type { CreatePaymentDto } from "./dto/create-payment.dto";
import type { UpdatePaymentDto } from "./dto/update-payment.dto";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data: createPaymentDto,
    });
    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found.`);
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto
  ): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found.`);
    }

    return payment;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.payment.delete({ where: { id } });
  }
}
