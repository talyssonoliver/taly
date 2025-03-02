import { Injectable, NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../../prisma/prisma.service";
import type { Booking } from "./entities/booking.entity";
import type { CreateBookingDto } from "./dto/create-booking.dto";
import type { UpdateBookingDto } from "./dto/update-booking.dto";

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = await this.prisma.booking.create({
      data: createBookingDto,
    });
    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found.`);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto
  ): Promise<Booking> {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found.`);
    }
    return booking;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id } });
  }
}
