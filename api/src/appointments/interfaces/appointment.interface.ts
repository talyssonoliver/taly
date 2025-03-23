import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export interface Appointment {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  staffId?: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  price: number;
  notes?: string;
  cancellationReason?: string;
  cancellationFee?: number;
  noShowFee?: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  };
  salon?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  staff?: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  reminders?: Array<{
    id: string;
    reminderTime: Date;
    sent: boolean;
    sentAt?: Date;
    type: string;
  }>;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  startDate?: string | Date;
  endDate?: string | Date;
  salonId?: string;
  userId?: string;
  serviceId?: string;
  staffId?: string;
  upcoming?: boolean;
}

export interface CreateAppointmentParams {
  userId: string;
  salonId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  staffId?: string;
  notes?: string;
  status?: AppointmentStatus;
  price: number;
}

export interface AppointmentWithRelations extends Appointment {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  };
  salon: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
}
