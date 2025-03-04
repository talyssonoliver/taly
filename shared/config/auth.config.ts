export const AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || "3600s", // 1 hour
  bcryptSaltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),

  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

  nextAuthSecret: process.env.NEXTAUTH_SECRET || "default_nextauth_secret",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",

  oauthProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
};

if (!AuthConfig.jwtSecret) {
  console.warn("JWT_SECRET is not set. Using default secret.");
}

if (!AuthConfig.googleClientId || !AuthConfig.googleClientSecret) {
  console.warn("Google OAuth credentials are not fully set.");
}
