export const APPOINTMENT_CONSTANTS = {
  // Time slot configuration
  TIME_SLOT_INTERVAL_MINUTES: 15, // Slots are created every 15 minutes
  MIN_APPOINTMENT_DURATION: 15, // Minimum appointment duration in minutes
  MAX_APPOINTMENT_DURATION: 240, // Maximum appointment duration in minutes
  
  // Cancellation policies
  LATE_CANCELLATION_HOURS: 24, // Hours before appointment when cancellation fee applies
  DEFAULT_CANCELLATION_FEE_PERCENTAGE: 50, // Default cancellation fee (50% of service price)
  DEFAULT_NO_SHOW_FEE_PERCENTAGE: 100, // Default no-show fee (100% of service price)
  
  // Reminder times (minutes before appointment)
  REMINDER_TIME_24_HOURS: 24 * 60, // 24 hours before
  REMINDER_TIME_1_HOUR: 60, // 1 hour before
  
  // Status auto-update times
  AUTO_NO_SHOW_MINUTES: 15, // Mark as no-show 15 minutes after appointment start
  AUTO_COMPLETE_MINUTES: 60, // Auto-complete 1 hour after appointment end time
  
  // Booking constraints
  MIN_ADVANCE_BOOKING_HOURS: 1, // Minimum hours in advance for booking
  MAX_ADVANCE_BOOKING_DAYS: 60, // Maximum days in advance for booking
  
  // Pagination defaults
  DEFAULT_APPOINTMENTS_PAGE_SIZE: 10,
  
  // Time format
  TIME_FORMAT: 'h:mm a', // e.g., 2:30 PM
  DATE_FORMAT: 'EEEE, MMMM d, yyyy', // e.g., Monday, January 15, 2023
  DATETIME_FORMAT: 'MMM d, yyyy h:mm a', // e.g., Jan 15, 2023 2:30 PM
  
  // Calendar settings
  CALENDAR_START_HOUR: 8, // 8 AM
  CALENDAR_END_HOUR: 20, // 8 PM
  
  // Appointment colors by status
  STATUS_COLORS: {
    SCHEDULED: '#4299e1', // blue
    CONFIRMED: '#48bb78', // green
    CANCELLED: '#e53e3e', // red
    COMPLETED: '#805ad5', // purple
    NO_SHOW: '#dd6b20', // orange
    PENDING: '#d69e2e', // yellow
    RESCHEDULED: '#319795', // teal
  },
};
