import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/roles.enum';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AddClientNoteDto } from './dto/add-client-note.dto';

@Resolver('Client')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query('clients')
  @Roles(Role.ADMIN, Role.STAFF)
  async getClients(
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('salonId', { nullable: true }) salonId?: string,
  ) {
    return this.clientsService.findAll(page, limit, { search, salonId });
  }

  @Query('client')
  @Roles(Role.ADMIN, Role.STAFF)
  async getClient(@Args('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Mutation('createClient')
  @Roles(Role.ADMIN, Role.STAFF)
  async createClient(@Args('input') createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Mutation('updateClient')
  @Roles(Role.ADMIN, Role.STAFF)
  async updateClient(
    @Args('id') id: string,
    @Args('input') updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Mutation('deleteClient')
  @Roles(Role.ADMIN)
  async deleteClient(@Args('id') id: string) {
    await this.clientsService.remove(id);
    return true;
  }

  @Mutation('addClientNote')
  @Roles(Role.ADMIN, Role.STAFF)
  async addClientNote(
    @Args('clientId') clientId: string,
    @Args('input') addNoteDto: AddClientNoteDto,
    @CurrentUser() user,
  ) {
    return this.clientsService.addNote(clientId, addNoteDto, user.id);
  }

  @Query('clientNotes')
  @Roles(Role.ADMIN, Role.STAFF)
  async getClientNotes(
    @Args('clientId') clientId: string,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.clientsService.getNotes(clientId, page, limit);
  }

  @Mutation('deleteClientNote')
  @Roles(Role.ADMIN, Role.STAFF)
  async deleteClientNote(
    @Args('noteId') noteId: string,
    @CurrentUser() user,
  ) {
    const note = await this.clientsService.findNoteById(noteId);
    
    if (!note) {
      throw new Error('Note not found');
    }
    
    // Only allow the note creator or admin to delete notes
    if (note.createdById !== user.id && user.role !== Role.ADMIN) {
      throw new Error('You are not authorized to delete this note');
    }
    
    await this.clientsService.removeNote(noteId);
    return true;
  }

  @Query('clientAppointmentHistory')
  @Roles(Role.ADMIN, Role.STAFF)
  async getClientAppointmentHistory(
    @Args('clientId') clientId: string,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.clientsService.getAppointmentHistory(clientId, page, limit);
  }
}
