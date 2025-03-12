export const SALON_CONSTANTS = {
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DEFAULT_SALON_IMAGE: 'https://via.placeholder.com/800x400?text=Salon',
  
  DAYS_OF_WEEK: [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ],
  
  SERVICE_CATEGORIES: [
    'Hair',
    'Nails',
    'Skin',
    'Massage',
    'Makeup',
    'Eyebrows & Lashes',
    'Spa Treatments',
    'Waxing',
    'Other',
  ],
  
  DEFAULT_WORKING_HOURS: {
    MONDAY: { openTime: '09:00', closeTime: '18:00', isClosed: false },
    TUESDAY: { openTime: '09:00', closeTime: '18:00', isClosed: false },
    WEDNESDAY: { openTime: '09:00', closeTime: '18:00', isClosed: false },
    THURSDAY: { openTime: '09:00', closeTime: '18:00', isClosed: false },
    FRIDAY: { openTime: '09:00', closeTime: '18:00', isClosed: false },
    SATURDAY: { openTime: '10:00', closeTime: '16:00', isClosed: false },
    SUNDAY: { openTime: null, closeTime: null, isClosed: true },
  },
};
