FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY api/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY api/ .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the API port
EXPOSE 4000

# Set NODE_ENV to production by default
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]