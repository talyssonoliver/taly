import { Service } from './service.interface';
import { WorkingHours } from '../entities/working-hours.entity';

export interface Salon {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  logoImage?: string;
  images?: string[];
  isActive: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  services?: Service[];
  workingHours?: WorkingHours[];
  owner?: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
}

export interface SalonWithOwner extends Salon {
  owner: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
}
