import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import {
	Appointment,
	CreateAppointmentParams,
} from "../interfaces/appointment.interface";

@Injectable()
export class AppointmentRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateAppointmentParams): Promise<Appointment> {
		return this.prisma.appointment.create({
			data,
			include: {
				user: true,
				salon: true,
				service: true,
				staff: true,
			},
		});
	}

	async findMany(params: {
		skip?: number;
		take?: number;
		where?: Prisma.AppointmentWhereInput;
		orderBy?: Prisma.AppointmentOrderByWithRelationInput;
	}): Promise<Appointment[]> {
		const { skip, take, where, orderBy } = params;
		return this.prisma.appointment.findMany({
			skip,
			take,
			where,
			orderBy,
			include: {
				user: true,
				salon: true,
				service: true,
				staff: true,
			},
		});
	}

	async findById(id: string): Promise<Appointment | null> {
		return this.prisma.appointment.findUnique({
			where: { id },
			include: {
				user: true,
				salon: true,
				service: true,
				staff: true,
				reminders: true,
			},
		});
	}

	async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
		return this.prisma.appointment.update({
			where: { id },
			data,
			include: {
				user: true,
				salon: true,
				service: true,
				staff: true,
			},
		});
	}

	async delete(id: string): Promise<Appointment> {
		return this.prisma.appointment.delete({
			where: { id },
		});
	}

	async count(params: {
		where?: Prisma.AppointmentWhereInput;
	}): Promise<number> {
		const { where } = params;
		return this.prisma.appointment.count({ where });
	}
}
