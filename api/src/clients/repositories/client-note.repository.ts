import { PrismaService } from '../../database/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';
import type { NoteType } from '../entities/client-note.entity';

@Injectable()
export class ClientNoteRepository {
  private readonly logger = new Logger(ClientNoteRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findMany(options: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    try {
      const { skip, take, where, orderBy } = options;
      
      return this.prisma.clientNote.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error("Error finding client notes: ", error);
      throw error;
    }
  }

  async count(options: { where?: any }) {
    try {
      const { where } = options;
      
      return this.prisma.clientNote.count({
        where,
      });
    } catch (error) {
      this.logger.error("Error counting client notes: ", error );
      throw error;
    }
  }

  async findById(id: string) {
    try {
      return this.prisma.clientNote.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error("Error finding client note by ID:", error);
      throw error;
    }
  }

  async create(data: {
    clientId: string;
    createdById: string;
    content: string;
    type?: NoteType;
    isPrivate?: boolean;
  }) {
    try {
      return this.prisma.clientNote.create({
        data,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error("Error creating client note: ", error);
      throw error;
    }
  }

  async update(id: string, data: {
    content?: string;
    type?: NoteType;
    isPrivate?: boolean;
  }) {
    try {
      return this.prisma.clientNote.update({
        where: { id },
        data,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error("Error updating client note: ", error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.clientNote.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error("Error deleting client note: ", error);
      throw error;
    }
  }
}



