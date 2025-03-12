FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY apps/dashboard/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY apps/dashboard/ .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

# Expose the frontend port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]