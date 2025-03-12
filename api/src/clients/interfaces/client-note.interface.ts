import { NoteType } from '../entities/client-note.entity';

export interface ClientNote {
  id: string;
  clientId: string;
  createdById: string;
  content: string;
  type: NoteType;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
  };
}
