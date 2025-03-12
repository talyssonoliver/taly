import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';
import type { ClientsService } from './clients.service';
import type { CreateClientDto } from './dto/create-client.dto';
import type { UpdateClientDto } from './dto/update-client.dto';
import type { AddClientNoteDto } from './dto/add-client-note.dto';
import type { ImportClientsDto } from './dto/import-clients.dto';
import { PaginationUtil } from '../common/utils/pagination.util';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { Client } from './entities/client.entity';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Roles(Role.ADMIN, Role.STAFF)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('salonId') salonId?: string,
  ) {
    this.logger.log(`Finding all users with page=${page}, limit=${limit}${search ? `, search=${search}` : ""}`, { page, limit, search });
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.clientsService.findAll(pageNum, limitNum, { search, salonId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async findOne(@Param('id') id: string) {
    this.logger.log("Finding client with ID: ");
    const client = await this.clientsService.findById(id);
    
    if (!client) {
      throw new NotFoundException("Client with ID  not found");
    }
    
    return client;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.STAFF)
  async create(@Body() createClientDto: CreateClientDto) {
    this.logger.log("Creating new client: ");
    return this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    this.logger.log("Updating client with ID: ");
    const client = await this.clientsService.findById(id);
    
    if (!client) {
      throw new NotFoundException("Client with ID  not found");
    }
    
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    this.logger.log("Deleting client with ID: ");
    const client = await this.clientsService.findById(id);
    
    if (!client) {
      throw new NotFoundException("Client with ID  not found");
    }
    
    await this.clientsService.remove(id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.STAFF)
  async addNote(
    @Param('id') id: string,
    @Body() addNoteDto: AddClientNoteDto,
    @CurrentUser() user,
  ) {
    this.logger.log("Adding note to client with ID: " );
    const client = await this.clientsService.findById(id);
    
    if (!client) {
      throw new NotFoundException(Client, "with ID  not found");
    }
    
    return this.clientsService.addNote(id, addNoteDto, user.id);
  }

  @Get(':id/notes')
  @ApiOperation({ summary: 'Get client notes' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async getNotes(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    this.logger.log("Getting notes for client with ID: ");
    const client = await this.clientsService.findById(id);
    
    if (!client) {
      throw new NotFoundException("Client with ID  not found");
    }
    
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.clientsService.getNotes(id, pageNum, limitNum);
  }

  @Delete(':clientId/notes/:noteId')
  @ApiOperation({ summary: 'Delete a client note' })
  @ApiParam({ name: 'clientId', description: 'Client ID' })
  @ApiParam({ name: 'noteId', description: 'Note ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.STAFF)
  async removeNote(
    @Param('clientId') clientId: string,
    @Param('noteId') noteId: string,
    @CurrentUser() user,
  ) {
    this.logger.log("Deleting note  from client ");
    
    const note = await this.clientsService.findNoteById(noteId);
    
    if (!note || note.clientId !== clientId) {
      throw new NotFoundException("Note not found for this client");
    }
    
    // Only allow the note creator or admin to delete notes
    if (note.createdById !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to delete this note');
    }
    
    await this.clientsService.removeNote(noteId);
  }
  @Post('import')
  @ApiOperation({ summary: 'Import clients from CSV file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.ADMIN)
  async importClients(
    @UploadedFile() file: Multer.File,
    @Body() importClientsDto: ImportClientsDto,
  ) {
    this.logger.log("Importing clients from file: ");
    
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }
    
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV');
    }
    
    return this.clientsService.importFromCsv(file.buffer.toString(), importClientsDto.salonId);
  }

  @Get('export/:salonId')
  @ApiOperation({ summary: 'Export clients to CSV' })
  @ApiParam({ name: 'salonId', description: 'Salon ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async exportClients(@Param('salonId') salonId: string) {
    this.logger.log("Exporting clients for salon: " );
    return this.clientsService.exportToCsv(salonId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get client appointment history' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @Roles(Role.ADMIN, Role.STAFF)
  async getHistory(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    this.logger.log("Getting appointment history for client with ID:" );
    const client = await this.clientsService.findById(id);
    
    if (!client) {
      throw new NotFoundException(Client, "with ID  not found");
    }
    
    const { page: pageNum, limit: limitNum } = PaginationUtil.normalizePaginationParams(page, limit);
    return this.clientsService.getAppointmentHistory(id, pageNum, limitNum);
  }
}
