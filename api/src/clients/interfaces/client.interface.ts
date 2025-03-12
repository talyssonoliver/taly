import { Gender } from '../entities/client.entity';
import { ClientNote } from './client-note.interface';

export interface Client {
  id: string;
  salonId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  birthdate?: Date;
  gender?: Gender;
  referralSource?: string;
  tags?: string[];
  notes?: string;
  preferences?: Record<string, any>;
  medicalInfo?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  salon?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
  clientNotes?: ClientNote[];
  _count?: {
    notes: number;
  };
}

export interface ClientWithNotes extends Client {
  clientNotes: ClientNote[];
}
