FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install OpenSSL 1.1 compatibility for Prisma + build tools
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl1.1-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/app/server.js"]