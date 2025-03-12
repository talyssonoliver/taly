export const CLIENT_CONSTANTS = {
  // Import/Export Configuration
  CSV_FIELDS: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'zipCode',
    'birthdate',
    'gender',
    'referralSource',
    'tags',
    'notes',
  ],
  
  // Tags
  DEFAULT_TAGS: [
    'VIP',
    'Loyalty Program',
    'New Client',
    'Regular',
    'Sensitive Skin',
    'Allergies',
    'Walk-in',
    'High Value',
    'Special Needs',
  ],
  
  // Note types display names
  NOTE_TYPE_LABELS: {
    GENERAL: 'General',
    APPOINTMENT: 'Appointment',
    MEDICAL: 'Medical',
    PREFERENCE: 'Preference',
    FEEDBACK: 'Feedback',
  },
  
  // Pagination defaults
  DEFAULT_CLIENTS_PAGE_SIZE: 20,
  DEFAULT_NOTES_PAGE_SIZE: 10,
  
  // Gender options
  GENDER_OPTIONS: [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other/Prefer not to say' },
  ],
  
  // Date format for display
  BIRTHDATE_FORMAT: 'MMMM d, yyyy',
  
  // Maximum field lengths
  MAX_NOTE_LENGTH: 1000,
};
