
**3. `docs/onboarding/setup-local-environment.md`**

```markdown
# Setting Up Your Local Development Environment

This document guides you through setting up your local machine for developing on the Taly platform.

## Prerequisites

Before you begin, make sure you have the following tools installed:

1.  **Node.js and pnpm:** Follow the instructions in the [Tools](tools.md) document.
2.  **Docker and Docker Compose:**  Follow the instructions in the [Tools](tools.md) document.
3. **Code Editor:**  Visual Studio Code (recommended) with relevant extensions.

## Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taly.git
cd taly
```
Make sure to change your-username

### 2. Install Dependencies

```bash
pnpm install
```
This will install all dependencies for the monorepo, including backend, frontend, and shared packages.

3. Configure Environment Variables
Backend:

Create a .env file in the api/ directory.

Copy the contents of api/.env-example into .env.

Fill in the required values, especially DATABASE_URL. For local development with Docker Compose, the DATABASE_URL will likely be: postgresql://postgres:password@localhost:5432/taly?schema=public

You may also need to add the JWT Secrets.

Repeat for all services.

Frontend:

Create .env files in each of the frontend application directories (apps/dashboard, apps/booking, apps/payments).

Add the NEXT_PUBLIC_API_BASE_URL variable, pointing to your locally running backend (e.g., http://localhost:4000).

Serverless Functions:

Create .env files in each serverless function directory (serverless/send-email, etc.) as needed.

4. Start the Database (using Docker Compose)

```bash
docker-compose up -d
```
This command starts the PostgreSQL and Redis containers defined in docker-compose.yml. The -d flag runs the containers in detached mode (in the background).

5. Run Database Migrations
Navigate to the backend directory:
    
    ```bash 
    cd api
    ```
Run the following commands to apply migrations and seed data:

```bash
pnpm prisma migrate dev
pnpm prisma db seed
``` 

6. Start the Backend Services
In the api/ directory, run:

```bash
pnpm dev
```
This command starts start the NestJS backend API server in development mode.

7. Start the Frontend Applications
In separate terminal windows, navigate to each frontend application directory (apps/dashboard, apps/booking, apps/payments) and run:

```bash
pnpm dev
```
This command starts the Next.js frontend applications in development mode.

8. (Optional) Run Serverless Functions Locally
If you need to test serverless functions locally, navigate to a specific serverless function directory (e.g., serverless/send-email) and run:

```bash
pnpm install
serverless offline
```
This command runs the serverless function locally using the Serverless Framework.
This requires the serverless-offline plugin to be installed (see serverless.yml in each function's directory).

9. Access the Applications
Dashboard: http://localhost:3000

Booking App: http://localhost:3001 (if configured)

Payments App: http://localhost:3002 (if configured)

Important Notes:

Ports: The ports (3000, 3001, 3002, 4000) are defaults. If you have conflicts, you may need to adjust them in the package.json scripts and docker-compose.yml file.

Docker Compose: If you make changes to docker-compose.yml, you may need to rebuild the images using docker-compose up -d --build.

Database: The first time you run docker-compose up, it will create a new PostgreSQL database. Subsequent runs will reuse the existing database. To reset the database, you can stop and remove the containers and volumes (docker-compose down -v).

Secrets: Never commit sensitive information (passwords, API keys) to the repository. Use .env files, which are ignored by Git.

Troubleshooting: Use the pnpm clean:full in the root directory to remove all node_modules, the .turbo folder and lock files and restore the packages.

```
```