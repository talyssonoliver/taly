export const JwtConfig = {
  secret: process.env.JWT_SECRET || "default_jwt_secret",
  expirationTime: process.env.JWT_EXPIRATION_TIME || "3600s", // Default to 1 hour
  algorithm: process.env.JWT_ALGORITHM || "HS256",

  // Refresh Token Configuration
  refreshSecret: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || "7d", // Default to 7 days

  // Token Issuer and Audience
  issuer: process.env.JWT_ISSUER || "taly-crm",
  audience: process.env.JWT_AUDIENCE || "taly-users",
};

// Ensure critical environment variables are set
if (!JwtConfig.secret) {
  console.warn("JWT_SECRET is not set. Using default secret.");
}

if (!JwtConfig.refreshSecret) {
  console.warn("JWT_REFRESH_SECRET is not set. Using default refresh secret.");
}
