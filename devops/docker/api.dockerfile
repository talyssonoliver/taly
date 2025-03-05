# Base image
FROM node:18-alpine AS base

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only package.json and pnpm files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies only
RUN pnpm install --frozen-lockfile

# Copy remaining files
COPY . .

# Build the project
RUN pnpm run build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm in production image
RUN npm install -g pnpm

# Copy built files from build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json

# Expose the API port
EXPOSE 3000

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main.js"]
