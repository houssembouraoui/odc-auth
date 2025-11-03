# odc-auth

## Goal

A reusable, standalone authentication service that can run locally and be integrated with any external application via its exposed APIs. This service is designed to be decoupled, containerized, and follow a clean, maintainable architecture.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Language:** TypeScript
- **Containerization:** Docker + Docker Compose
- **Authentication:** JWT (Access & Refresh Tokens)
- **Hashing:** bcrypt
- **Email Sending:** Nodemailer (or config-ready placeholder)

---

## Architecture Structure

Layered, maintainable project structure:

```
/src
    /app
        server.ts
        routes.ts
    /config
        env.ts
        database.ts
    /models
        user.model.ts        // Prisma schema maps here
    /routes
        auth.routes.ts
    /controllers
        auth.controller.ts
    /services
        auth.service.ts
    /repositories
        user.repository.ts
    /middleware
        auth.middleware.ts
        error.middleware.ts
    /utils
        token.util.ts
        email.util.ts
        hash.util.ts
prisma/schema.prisma
docker-compose.yml
Dockerfile
```

---

## Database Model (Prisma)

User representation for verification and password flows:

```prisma
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  password          String
  name              String?
  isVerified        Boolean  @default(false)
  verificationToken String?
  resetToken        String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

## Authentication Endpoints

| Category            | Method | Endpoint                  | Description                          |
| ------------------- | ------ | ------------------------- | ------------------------------------ |
| Core                | POST   | /auth/register            | Create account                       |
|                     | POST   | /auth/login               | Log in, return JWT tokens            |
|                     | POST   | /auth/logout              | Revoke refresh token                 |
|                     | GET    | /auth/me                  | Return authenticated user info       |
| Token / Session     | POST   | /auth/refresh             | Refresh access token                 |
|                     | POST   | /auth/token/revoke        | Revoke a refresh token               |
| Password Management | POST   | /auth/password/forgot     | Send reset link/token                |
|                     | POST   | /auth/password/reset      | Apply reset token to update password |
|                     | POST   | /auth/password/change     | Change password (authenticated)      |
| Email Verification  | POST   | /auth/verify-email        | Verify email using token             |
|                     | POST   | /auth/resend-verification | Resend verification email            |

---

## Key Implementation Requirements

- JWT Access Token (short-lived) & Refresh Token (long-lived).
- Store refresh tokens in DB (or hashed).
- Passwords hashed with bcrypt.
- Protected routes with `auth.middleware.ts` (verifies access token).
- Global error handling via `error.middleware.ts`.
- Run with Docker Compose: `docker-compose up --build` spins up the Node server and PostgreSQL database.
- Prisma migrations auto-run on container startup.

---

## Environment Variables

Set these in `.env`:

```
DATABASE_URL=postgresql://postgres:password@db:5432/odc_auth
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_HOST=smtp.example.com
EMAIL_USER=example@example.com
EMAIL_PASS=examplepassword
PORT=4000
```

---

## How to Run (Local Development)

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd odc-auth
   ```
2. **Ensure Docker & Docker Compose are installed.**
3. **Copy .env.example to .env** and update secrets as needed:
   ```bash
   cp .env.example .env
   ```
4. **Start all services (Node.js + PostgreSQL + Prisma migration):**
   ```bash
   docker-compose up --build
   ```
5. The API server will be available at [http://localhost:4000](http://localhost:4000)
6. Use an API client (Postman, Thunder Client, etc.) to interact with endpoints.

---

## Usage Example: Integrating with Your App

- Develop or configure your main application to consume odc-auth's HTTP endpoints for all authentication needs.
- odc-auth is fully decoupled; no direct integration required outside API communication.

---

## Boilerplate Generation

This template can quickly generate:

- Project directory structure
- Example API controllers, services, and repository logic
- Full Docker and Compose configuration
- Postman/Thunder Client example API tests

Feel free to expand this README with API request/response examples, deployment steps, or contribution guidelines as needed.
