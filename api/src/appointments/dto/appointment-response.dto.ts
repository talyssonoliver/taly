import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
import { Expose, Type } from 'class-transformer';
import { format } from 'date-fns';

class UserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiPropertyOptional({ description: 'User last name' })
  lastName?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  phone?: string;

  @ApiProperty({ description: 'User full name' })
  @Expose()
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return ${this.firstName} ;
    }
    return this.firstName;
  }
}

class SalonDto {
  @ApiProperty({ description: 'Salon ID' })
  id: string;

  @ApiProperty({ description: 'Salon name' })
  name: string;

  @ApiPropertyOptional({ description: 'Salon address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Salon phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Salon email' })
  email?: string;
}

class ServiceDto {
  @ApiProperty({ description: 'Service ID' })
  id: string;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiProperty({ description: 'Service duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Service price' })
  price: number;
}

export class AppointmentResponseDto {
  @ApiProperty({ description: 'Appointment ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Salon ID' })
  salonId: string;

  @ApiProperty({ description: 'Service ID' })
  serviceId: string;

  @ApiPropertyOptional({ description: 'Staff member ID' })
  staffId?: string;

  @ApiProperty({ description: 'Appointment start time' })
  startTime: Date;

  @ApiProperty({ description: 'Appointment end time' })
  endTime: Date;

  @ApiProperty({ 
    description: 'Appointment status',
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @ApiProperty({ description: 'Appointment price' })
  price: number;

  @ApiPropertyOptional({ description: 'Appointment notes' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Cancellation reason' })
  cancellationReason?: string;

  @ApiPropertyOptional({ description: 'Cancellation fee' })
  cancellationFee?: number;

  @ApiPropertyOptional({ description: 'No-show fee' })
  noShowFee?: number;

  @ApiProperty({ description: 'Appointment creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Appointment last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'User information' })
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ description: 'Salon information' })
  @Type(() => SalonDto)
  salon: SalonDto;

  @ApiProperty({ description: 'Service information' })
  @Type(() => ServiceDto)
  service: ServiceDto;

  @ApiPropertyOptional({ description: 'Staff member information' })
  @Type(() => UserDto)
  staff?: UserDto;

  @ApiProperty({ description: 'Formatted start time' })
  @Expose()
  get formattedStartTime(): string {
    return format(this.startTime, 'MMM d, yyyy h:mm a');
  }

  @ApiProperty({ description: 'Formatted end time' })
  @Expose()
  get formattedEndTime(): string {
    return format(this.endTime, 'h:mm a');
  }

  @ApiProperty({ description: 'Formatted date' })
  @Expose()
  get formattedDate(): string {
    return format(this.startTime, 'EEEE, MMMM d, yyyy');
  }

  @ApiProperty({ description: 'Formatted time' })
  @Expose()
  get formattedTime(): string {
    return ${format(this.startTime, 'h:mm a')} - ;
  }

  @ApiProperty({ description: 'Formatted duration' })
  @Expose()
  get formattedDuration(): string {
    const durationInMinutes = (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return ${hours}h m;
    } else if (hours > 0) {
      return ${hours}h;
    } else {
      return ${minutes}m;
    }
  }

  @ApiProperty({ description: 'Formatted price' })
  @Expose()
  get formattedPrice(): string {
    return $;
  }

  @ApiProperty({ description: 'Can be cancelled' })
  @Expose()
  get canBeCancelled(): boolean {
    return ![
      AppointmentStatus.CANCELLED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
    ].includes(this.status);
  }

  @ApiProperty({ description: 'Can be rescheduled' })
  @Expose()
  get canBeRescheduled(): boolean {
    return ![
      AppointmentStatus.CANCELLED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
    ].includes(this.status);
  }
}
