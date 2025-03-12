export const USER_CONSTANTS = {
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  DEFAULT_AVATAR: 'https://ui-avatars.com/api/?background=random',
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  
  STAFF_PERMISSIONS: {
    'users:read': 'View users',
    'users:write': 'Create/edit users',
    'users:delete': 'Delete users',
    'appointments:read': 'View appointments',
    'appointments:write': 'Create/edit appointments',
    'appointments:delete': 'Delete appointments',
    'services:read': 'View services',
    'services:write': 'Create/edit services',
    'services:delete': 'Delete services',
    'reports:view': 'View reports',
    'settings:view': 'View settings',
    'settings:edit': 'Edit settings',
  },
};
