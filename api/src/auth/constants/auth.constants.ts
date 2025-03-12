export const AUTH_CONSTANTS = {
  JWT_SECRET: 'jwt-secret',
  JWT_EXPIRES_IN: '1d',
  JWT_REFRESH_SECRET: 'jwt-refresh-secret',
  JWT_REFRESH_EXPIRES_IN: '7d',
  PASSWORD_RESET_EXPIRY: 3600000, // 1 hour in milliseconds
  PROVIDERS: {
    LOCAL: 'local',
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
  },
};
