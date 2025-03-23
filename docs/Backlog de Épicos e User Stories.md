# Taly CRM - MVP Backlog (Monolithic Architecture)

## Overall Goal
A functional system where company owners can register, manage a basic profile, create and manage appointments, and process payments (basic integration). Customers can view a basic public booking page (if we can get to it).

## Assumptions

- **Monolithic Backend**: All backend logic is within the `api/src` directory (NestJS).
- **Frontend Apps**: Separate Next.js apps for dashboard (`apps/dashboard`), public booking (`apps/booking`), and potentially payments (`apps/payments`). We'll prioritize dashboard and a very basic booking for the MVP.
- **Simplified Deployment**: AWS App Runner for backend, Netlify/Vercel for frontend, PostgreSQL (local Docker, RDS in staging/prod), Redis (local Docker, ElastiCache in staging/prod).
- **No Kubernetes (Initially)**: Deferring Kubernetes until after the MVP.
- **Minimal UI/UX Polish**: Focus on functionality, not extensive styling/design.

## Epic 1: User Authentication & Registration
> **Status**: Backend largely complete, frontend needs significant work

### User Story 1.1: User Registration (Email/Password) ⭐ HIGH PRIORITY
**As** a company owner,  
**I want to** register with my email and password,  
**So that** I can access the platform.

#### Acceptance Criteria:
- [ ] Registration form fields: email, password, first name, last name. (Exists in `api/src/auth/dto/register.dto.ts`)
- [ ] Password validation (min length, complexity - defined in `shared/validation/validators/password.validator.ts`)
- [ ] Email validation (format - handled by class-validator in DTO)
- [ ] Email uniqueness check
- [ ] Password hashing (bcrypt in `auth.service.ts`)
- [ ] User creation in the database (`users.service.ts`, `user.repository.ts`, `prisma/schema.prisma`)
- [ ] JWT generation upon successful registration (`auth.service.ts`)
- [ ] Email confirmation (basic - just log it, don't actually send yet)
- [ ] Frontend form (`apps/dashboard/src/pages/signup.tsx` - Needs adaptation)

#### Technical Tasks:

**Backend (Largely Complete):**
- [x] POST `/api/auth/register` endpoint (`auth.controller.ts`, `auth.resolver.ts`)
- [x] `AuthService.register()` method
- [x] `UsersService.create()` method
- [ ] Implement email sending (placeholder logging for now). Use `mail/mail.service.ts` with console.log for MVP

**Frontend (Needs Work):**
- [ ] Adapt `apps/dashboard/src/pages/signup.tsx` to be a functional registration form:
  - [ ] Form fields (name, email, password, confirm password) using shared UI components
  - [ ] Client-side validation (mirroring backend validation)
  - [ ] onSubmit handler to call the backend API
  - [ ] Error handling and display
  - [ ] Redirect to login on success

### User Story 1.2: User Login (Email/Password) ⭐ HIGH PRIORITY
**As** a registered user,  
**I want to** log in with my email and password,  
**So that** I can access the platform.

#### Acceptance Criteria:
- [ ] Login form with email and password fields
- [ ] Password validation
- [ ] JWT generation upon successful login
- [ ] JWT validation for protected routes (using `JwtAuthGuard`)
- [ ] Frontend login page

#### Technical Tasks:

**Backend (Largely Complete):**
- [x] POST `/api/auth/login` endpoint (`auth.controller.ts`, `auth.resolver.ts`)
- [x] `AuthService.login()` and `validateUser()` methods
- [x] `LocalStrategy` in `auth/strategies/local.strategy.ts`
- [x] `JwtStrategy` in `auth/strategies/jwt.strategy.ts`
- [x] `JwtAuthGuard` in `common/guards/jwt-auth.guard.ts`

**Frontend (Needs Work):**
- [ ] Create a `login.tsx` page (in `apps/dashboard/src/pages/`)
- [ ] Implement login form with email and password fields
- [ ] Handle form submission and call the backend API
- [ ] Store the JWT (in cookie or local storage)
- [ ] Redirect to the dashboard on success
- [ ] Handle login errors

### User Story 1.3: Password Recovery ⭐ MEDIUM PRIORITY
**As** a user,  
**I want to** be able to recover my password if I forget it,  
**So that** I can regain access to my account.

#### Acceptance Criteria:
- [ ] "Forgot Password" link/button on the login page
- [ ] Form to request a password reset (email address)
- [ ] Generation of a unique, time-limited reset token
- [ ] Sending a password reset email with token link (placeholder logging for MVP)
- [ ] Form to enter a new password, using the token for validation
- [ ] Password update upon successful validation

#### Technical Tasks:

**Backend (Largely Complete):**
- [x] POST `/api/auth/forgot-password` endpoint (`auth.controller.ts`, `auth.resolver.ts`)
- [x] POST `/api/auth/reset-password/:token` endpoint
- [x] Logic in `AuthService` to generate reset tokens, store them, and validate them
- [ ] Implement timeout interceptor for request handling
- [ ] Implement transform interceptor for response standardization

**Frontend (Needs Work):**
- [ ] Create "Forgot Password" and "Reset Password" pages
- [ ] Implement forms and handle API calls
- [ ] Handle token validation and error display

### User Story 1.4: User Profile (Basic) ⭐ MEDIUM PRIORITY
**As** a registered user,  
**I want to** view and update my basic profile information,  
**So that** the data is accurate and I can keep it updated.

#### Acceptance Criteria:
- [ ] Profile page displaying user information (name, email)
- [ ] Edit user's name and email
- [ ] Password change
- [ ] Update user info in database

#### Technical Tasks:

**Backend:**
- [x] Files: `api/src/users/users.controller.ts` `api/src/users/users.service.ts`
- [ ] Implement endpoints (GET `/me` PATCH `/me`)

**Frontend (Deferred)**
- [ ] Create profile view/edit page

## Epic 2: Appointment Management
> **Status**: Backend has basic CRUD operations, frontend needs significant work

### User Story 2.1: Create Appointments ⭐ HIGH PRIORITY
**As** a company owner or staff member,  
**I want to** create new appointments,  
**So that** I can schedule services for clients.

#### Acceptance Criteria:
- [ ] Form to create appointments, including:
  - Client (for MVP, a text field for name/email)
  - Service (for MVP, a text field; later, a dropdown)
  - Date and time
  - Optional notes
- [ ] Validation: date/time in the future, no double booking (basic check)
- [ ] Data persistence in the database

#### Technical Tasks:

**Backend (Partially Complete):**
- [x] POST `/api/appointments` endpoint (`appointments.controller.ts`, `appointments.resolver.ts`)
- [x] `CreateAppointmentDto` in `api/src/appointments/dto/create-appointment.dto.ts`
- [x] `AppointmentsService.create()` method
- [ ] Basic validation in `AppointmentsService`
- [ ] Basic conflict detection

**Frontend (Needs Work):**
- [ ] Create appointment form in dashboard app
- [ ] Integrate with backend API

### User Story 2.2: View Appointments ⭐ HIGH PRIORITY
**As** a company owner or staff member,  
**I want to** view a list of appointments,  
**So that** I can manage the schedule.

#### Acceptance Criteria:
- [ ] List view of appointments (basic list sufficient for MVP)
- [ ] Display appointment details (client, service, date/time, status)
- [ ] Basic filtering by date range
- [ ] Sorting by date/time

#### Technical Tasks:

**Backend (Partially Complete):**
- [x] GET `/api/appointments` endpoint with query parameters
- [ ] `AppointmentsService.findAll()` method with filtering/sorting

**Frontend (Needs Work):**
- [ ] Create appointment list component in dashboard app
- [ ] Use `useBooking` hook for simple booking list

### User Story 2.3: Update Appointments ⭐ MEDIUM PRIORITY
**As** a company owner or staff member,  
**I want to** update existing appointments,  
**So that** I can reschedule or make changes.

#### Acceptance Criteria:
- [ ] Ability to edit appointment details (date, time, service, notes)
- [ ] Validation (prevent past dates, double booking)
- [ ] Persistence of changes in database

#### Technical Tasks:

**Backend (Partially Complete):**
- [x] PATCH `/api/appointments/:id` endpoint
- [x] `UpdateAppointmentDto` in `api/src/appointments/dto/update-appointment.dto.ts`
- [x] `AppointmentsService.update()` method

**Frontend (Needs Work):**
- [ ] UI for editing appointment details

### User Story 2.4: Cancel Appointments ⭐ MEDIUM PRIORITY
**As** a company owner or staff member,  
**I want to** cancel an existing appointment,  
**So that** I can remove bookings that will no longer occur.

#### Acceptance Criteria:
- [ ] Ability to cancel an appointment
- [ ] Update appointment status to cancelled
- [ ] Send email/SMS notification (Deferred)

#### Technical Tasks:

**Backend (Partially Complete):**
- [x] PATCH `/api/appointments/:id/cancel` endpoint
- [x] `CancelAppointmentDto` in `api/src/appointments/dto/cancel-appointment.dto.ts`
- [x] `AppointmentsService.cancel()` method

**Frontend (Needs Work):**
- [ ] UI for cancelling appointments

## Epic 3: Basic Payment Processing
> **Status**: Backend partial, no payment provider integration yet, frontend needs work

### User Story 3.1: Create Payment Record ⭐ MEDIUM PRIORITY
**As** a company owner,  
**I want to** record a payment for a service,  
**So that** I can manage payments.

#### Acceptance Criteria:
- [ ] Payment record is associated with an appointment
- [ ] Record payment amount
- [ ] Record payment date
- [ ] Record payment status (e.g., "pending," "completed")
- [ ] Basic interface

#### Technical Tasks:

**Backend (Partially Complete):**
- [x] POST `/api/payments` endpoint
- [x] `CreatePaymentDto`
- [x] `PaymentService.create()` method

**Frontend:**
- [ ] Display payments data

## Epic 4: Initial Dashboard
> **Status**: Basic page exists, needs backend connection

### User Story 4.1: Display Basic Metrics ⭐ HIGH PRIORITY
**As** a company owner,  
**I want to** see basic metrics on my dashboard,  
**So that** I can get a quick overview of my business.

#### Acceptance Criteria:
- [ ] Display total number of appointments
- [ ] Display total revenue (sum of completed payments)
- [ ] Optional (if time): Display number of new clients this month

#### Technical Tasks:

**Backend:**
- [ ] Create endpoints for summary data
- [ ] Implement metric calculation logic

**Frontend:**
- [ ] Update `apps/dashboard/src/pages/index.tsx`
- [ ] Fetch data from backend API
- [ ] Display metrics using `DashboardCard` components

## Epic 5: Basic Infrastructure
> **Status**: Partially implemented

### User Story 5.1: Basic CI/CD Pipeline ⭐ MEDIUM PRIORITY
**As** a DevOps engineer,  
**I want to** have a CI/CD pipeline that automatically runs basic tests,  
**So that** changes are automatically verified.

#### Acceptance Criteria:
- [ ] GitHub Actions pipeline configured
- [ ] Backend and frontend unit tests run
- [ ] Linter runs

### User Story 5.2: Backend Structure ⭐ HIGH PRIORITY
**As** a backend developer,  
**I want to** have a well-structured backend,  
**So that** the code is organized and maintainable.

#### Acceptance Criteria:
- [x] Main backend structure
- [x] Auth module to handle authentication
- [x] Config module
- [x] Database module
- [ ] Submodules for booking, clients, payments, subscriptions, notifications, and users

## Epic 6: Custom Website
> **Status**: Deferred for after MVP

## Summary of MVP Priorities

1. **User Registration and Login** ⭐ HIGH PRIORITY
   - Functional email/password authentication
   - Password reset functionality
   - Backend mostly complete, frontend needs work

2. **Appointment Management** ⭐ HIGH PRIORITY
   - Create and view appointments
   - Basic CRUD operations
   - Backend mostly complete, frontend needs significant work

3. **Payment Management** ⭐ MEDIUM PRIORITY
   - Record basic payment information
   - NO payment provider integration in MVP
   - Backend mostly complete, frontend needs work

4. **Dashboard** ⭐ HIGH PRIORITY
   - Display key metrics (appointments, revenue)
   - Frontend needs significant work

5. **Deployment** ⭐ MEDIUM PRIORITY
   - Backend: AWS App Runner
   - Frontend: Netlify/Vercel
   - Database: PostgreSQL (RDS)
   - Cache: Redis (ElastiCache)

6. **CI/CD** ⭐ MEDIUM PRIORITY
   - Basic tests and linting
   - Automated builds