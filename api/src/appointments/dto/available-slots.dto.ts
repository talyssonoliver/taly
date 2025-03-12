import { ApiProperty } from '@nestjs/swagger';

export class TimeSlotDto {
  @ApiProperty({
    description: 'Start time in ISO format',
    example: '2023-05-15T14:30:00Z',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time in ISO format',
    example: '2023-05-15T15:00:00Z',
  })
  endTime: string;

  @ApiProperty({
    description: 'Formatted start time',
    example: '2:30 PM',
  })
  formattedStartTime: string;

  @ApiProperty({
    description: 'Formatted end time',
    example: '3:00 PM',
  })
  formattedEndTime: string;
}

export class AvailableSlotsDto {
  @ApiProperty({
    description: 'Available time slots',
    type: [TimeSlotDto],
  })
  timeSlots: TimeSlotDto[];

  @ApiProperty({
    description: 'Message if no slots are available',
    example: 'Salon is closed on this date.',
    required: false,
  })
  message?: string;
}
