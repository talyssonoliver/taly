import {
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { Client, Prisma } from "@prisma/client";
import { PaginatedResult } from "../common/interfaces/paginated-result.interface";
import { PaginationUtil } from "../common/utils/pagination.util";
import { PrismaService } from "../prisma/prisma.service";
import { AddClientNoteDto } from "./dto/add-client-note.dto";
import { ClientDto } from "./dto/client.dto";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientRepository } from "./repositories/client.repository";

@Injectable()
export class ClientsService {
	private readonly logger = new Logger(ClientsService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly clientRepository: ClientRepository,
	) {}

	async findAllWithPagination(
		salonId: string,
		page: number,
		limit: number,
		search?: string,
	): Promise<PaginatedResult<Client>> {
		try {
			const { skip, take } = PaginationUtil.getPaginationValues(page, limit);

			// Build where clause
			const where: Prisma.ClientWhereInput = { salonId };

			if (search) {
				where.OR = [
					{ firstName: { contains: search, mode: "insensitive" } },
					{ lastName: { contains: search, mode: "insensitive" } },
					{ email: { contains: search, mode: "insensitive" } },
					{ phoneNumber: { contains: search, mode: "insensitive" } },
				];
			}

			const [clients, total] = await Promise.all([
				this.clientRepository.findMany({ skip, take, where }),
				this.clientRepository.count({ where }),
			]);

			return PaginationUtil.createPaginatedResult(clients, total, page, limit);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`Error finding all clients: ${errorMessage}`);
			throw error;
		}
	}

	async findById(id: string, salonId: string): Promise<Client> {
		try {
			const client = await this.clientRepository.findById(id);

			if (!client) {
				throw new NotFoundException(`Client with ID ${id} not found`);
			}

			return client;
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`Error finding client by ID: ${errorMessage}`);
			throw error;
		}
	}

	async create(createClientDto: CreateClientDto): Promise<ClientDto> {
		const client = await this.prisma.client.create({
			data: createClientDto,
		});

		return this.mapToDto(client);
	}

	async update(
		id: string,
		updateClientDto: UpdateClientDto,
	): Promise<ClientDto> {
		// Only keep fields that are present in the DTO
		const updateData = Object.entries(updateClientDto)
			.filter(([_, value]) => value !== undefined)
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

		const client = await this.prisma.client.update({
			where: { id },
			data: updateData,
		});

		return this.mapToDto(client);
	}

	private mapToDto(client: Client): ClientDto {
		return new ClientDto(client);
	}

	async remove(id: string, salonId: string): Promise<void> {
		try {
			// Check if client exists and belongs to the salon
			await this.findById(id, salonId);

			// Delete client
			await this.clientRepository.delete(id);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`Error removing client: ${errorMessage}`);
			throw error;
		}
	}

	async addNote(
		clientId: string,
		salonId: string,
		noteDto: AddClientNoteDto,
		userId: string,
	): Promise<Client> {
		try {
			// Check if client exists and belongs to the salon
			const client = await this.findById(clientId, salonId);

			// Create note
			await this.prisma.clientNote.create({
				data: {
					clientId,
					createdBy: userId,
					note: noteDto.content,
					createdAt: new Date(),
				},
			});

			// Return updated client with notes
			return this.findById(clientId, salonId);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`Error adding note to client: ${errorMessage}`);
			throw error;
		}
	}

	async validateUser(userId: string | undefined): Promise<string> {
		if (!userId) {
			throw new UnauthorizedException("User not authenticated");
		}
		return userId;
	}
}
