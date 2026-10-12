# Multi-stage Docker build for Listly
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace package files
COPY package.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install dependencies
RUN npm --prefix server install
RUN npm --prefix client install

# Copy source files
COPY server ./server
COPY client ./client

# Generate prisma client and build both projects
RUN cd server && npx prisma generate
RUN cd server && npm run build
RUN cd client && npm run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5000

# Seed database on start if fresh and run
CMD ["sh", "-c", "cd server && npx prisma db push && npm run seed && npm start"]
