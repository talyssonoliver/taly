import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import type { PrismaService } from '../database/prisma.service';
import type { ClientRepository } from './repositories/client.repository';
import type { ClientNoteRepository } from './repositories/client-note.repository';
import type { CreateClientDto } from './dto/create-client.dto';
import type { UpdateClientDto } from './dto/update-client.dto';
import type { AddClientNoteDto } from './dto/add-client-note.dto';
import { PaginationUtil } from '../common/utils/pagination.util';
import { parse } from 'papaparse';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly clientRepository: ClientRepository,
    private readonly clientNoteRepository: ClientNoteRepository,
  ) {}

  async findAll(
    page: number,
    limit: number,
    options: {
      search?: string;
      salonId?: string;
    } = {},
  ) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      const { search, salonId } = options;
      
      // Build filter
      const where: any = {};
      
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      if (salonId) {
        where.salonId = salonId;
      }
      
      const [clients, total] = await Promise.all([
        this.clientRepository.findMany({ skip, take, where }),
        this.clientRepository.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(clients, total, page, limit);
    } catch (error) {
      this.logger.error("Error finding all clients: ", error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.clientRepository.findById(id);
    } catch (error) {
      this.logger.error("Error finding client by ID: ", error);
      throw error;
    }
  }

  async findByEmail(email: string, salonId?: string) {
    try {
      return this.clientRepository.findByEmail(email, salonId);
    } catch (error) {
      this.logger.error("Error finding client by email: ", error);
      throw error;
    }
  }

  async create(createClientDto: CreateClientDto) {
    try {
      const { email, salonId } = createClientDto;
      
      // Check if client already exists for this salon
      const existingClient = await this.findByEmail(email, salonId);
      
      if (existingClient) {
        throw new ConflictException("Client with email  already exists for this salon"");
      }
      
      return this.clientRepository.create(createClientDto);
    } catch (error) {
      this.logger.error("Error creating client: ", error);
      throw error;
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.findById(id);
      
      if (!client) {
        throw new NotFoundException("Client with ID  not found");
      }
      
      // If updating email, check if it's already taken by another client in the same salon
      if (updateClientDto.email && updateClientDto.email !== client.email) {
        const existingClient = await this.findByEmail(updateClientDto.email, client.salonId);
        
        if (existingClient && existingClient.id !== id) {
          throw new ConflictException("Client with email  already exists for this salon");
        }
      }
      
      return this.clientRepository.update(id, updateClientDto);
    } catch (error) {
      this.logger.error("Error updating client: ", error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return this.clientRepository.delete(id);
    } catch (error) {
      this.logger.error("Error removing client: ", error);
      throw error;
    }
  }

  async addNote(id: string, addNoteDto: AddClientNoteDto, createdById: string) {
    try {
      const client = await this.findById(id);
      
      if (!client) {
        throw new NotFoundException("Client with ID not found");
      }
      
      return this.clientNoteRepository.create({
        clientId: id,
        content: addNoteDto.content,
        createdById,
        type: addNoteDto.type,
        isPrivate: addNoteDto.isPrivate || false,
      });
    } catch (error) {
      this.logger.error("Error adding note to client: ", error);
      throw error;
    }
  }

  async getNotes(clientId: string, page: number, limit: number) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      
      const where = { clientId };
      
      const [notes, total] = await Promise.all([
        this.clientNoteRepository.findMany({ 
          skip, 
          take, 
          where,
          orderBy: { createdAt: 'desc' },
        }),
        this.clientNoteRepository.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(notes, total, page, limit);
    } catch (error) {
      this.logger.error("Error getting client notes: ", error);
      throw error;
    }
  }

  async findNoteById(id: string) {
    try {
      return this.clientNoteRepository.findById(id);
    } catch (error) {
      this.logger.error("Error finding note by ID: ", error);
      throw error;
    }
  }

  async removeNote(id: string) {
    try {
      return this.clientNoteRepository.delete(id);
    } catch (error) {
      this.logger.error("Error removing note: ", error);
      throw error;
    }
  }

  async importFromCsv(csvContent: string, salonId: string) {
    try {
      const results = parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
      });
      
      if (results.errors.length > 0) {
        throw new BadRequestException("CSV parsing error: ");
      }
      
      const { data } = results;
      
      if (data.length === 0) {
        throw new BadRequestException('CSV file contains no valid data');
      }
      
      // Validate required columns
      const requiredColumns = ['email', 'firstName', 'lastName'];
      const missingColumns = requiredColumns.filter(
        col => !Object.keys(data[0]).includes(col)
      );
      
      if (missingColumns.length > 0) {
        throw new BadRequestException("Missing required columns: ");
      }
      
      // Process data
      const importResults: {
        total: number;
        imported: number;
        skipped: number;
        errors: Array<{ row: string; error: any }>;
      } = {
        total: data.length,
        imported: 0,
        skipped: 0,
        errors: [],
      };
      
      for (const row of data) {
        try {
          // Skip empty rows or rows without email
          if (!row.email) {
            importResults.skipped++;
            continue;
          }
          
          // Check if client already exists
          const existingClient = await this.findByEmail(row.email, salonId);
          
          if (existingClient) {
            // Update existing client
            await this.clientRepository.update(existingClient.id, {
              ...row,
              salonId,
            });
          } else {
            // Create new client
            await this.clientRepository.create({
              ...row,
              salonId,
            });
          }
          
          importResults.imported++;
        } catch (error) {
          importResults.errors.push({
            row: JSON.stringify(row),
            error: error.message,
          });
          importResults.skipped++;
        }
      }
      
      return importResults;
    } catch (error) {
      this.logger.error("Error importing clients from CSV: ", error);
      throw error;
    }
  }

  async exportToCsv(salonId: string) {
    try {
      // Get all clients for salon
      const clients = await this.clientRepository.findMany({
        where: { salonId },
        orderBy: { lastName: 'asc' },
      });
      
      // Define fields to export (excluding sensitive data)
      const fields = [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'address',
        'birthdate',
        'gender',
        'referralSource',
        'tags',
        'createdAt',
      ];
      
      // Create CSV header row
      const header = fields.join(',');
      
      // Create rows
      const rows = clients.map((client) => {
        return fields.map(field => {
          const value = client[field];
          
          if (value === null || value === undefined) {
            return '';
          }
          
          if (typeof value === 'string') {
            // Escape commas and double quotes
            return "";
          }
          
          if (value instanceof Date) {
            return value.toISOString();
          }
          
          if (Array.isArray(value)) {
            return "";
          }
          
          return value;
        }).join(',');
      });
      
      // Combine header and rows
      const csv = [header, ...rows].join('\\n');
      
      return {
        filename: clients.csv,
        content: csv,
      };
    } catch (error) {
      this.logger.error("Error exporting clients to CSV: ", error);
      throw error;
    }
  }

  async getAppointmentHistory(clientId: string, page: number, limit: number) {
    try {
      const { skip, take } = PaginationUtil.getPaginationValues(page, limit);
      
      const client = await this.findById(clientId);
      
      if (!client) {
        throw new NotFoundException("Client with ID  not found");
      }
      
      // Find all appointments for this client's user account
      const where = { userId: client.userId };
      
      const [appointments, total] = await Promise.all([
        this.prisma.appointment.findMany({
          skip,
          take,
          where,
          orderBy: { startTime: 'desc' },
          include: {
            service: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
            salon: {
              select: {
                id: true,
                name: true,
              },
            },
            staff: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        this.prisma.appointment.count({ where }),
      ]);
      
      return PaginationUtil.createPaginatedResult(appointments, total, page, limit);
    } catch (error) {
      this.logger.error("Error getting client appointment history: ", error);
      throw error;
    }
  }
}
