export interface TimeSlot {
  id: string;
  salonId: string;
  staffId?: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  salon?: {
    id: string;
    name: string;
  };
  staff?: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
}

export interface TimeSlotParams {
  salonId: string;
  startTime: Date;
  endTime: Date;
  staffId?: string;
  isAvailable?: boolean;
  notes?: string;
}

export interface AvailableTimeSlot {
  startTime: string;
  endTime: string;
  formattedStartTime: string;
  formattedEndTime: string;
}

export interface AvailableTimeSlotsResponse {
  timeSlots: AvailableTimeSlot[];
  message?: string;
}
