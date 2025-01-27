# CODEOWNERS File
# This file defines automatic code review responsibilities
# for different folders or files in the repository.

# General backend directory
/backend/ @backend-team @lead-backend-dev

# Authentication service
/backend/auth-service/ @auth-team

# User service
/backend/user-service/ @user-team

# Booking service
/backend/booking-service/ @booking-team

# Payment service
/backend/payment-service/ @payment-team

# Notification service
/backend/notification-service/ @notification-team

# General frontend directory
/apps/dashboard/ @frontend-team @lead-frontend-dev

# Serverless directory
/serverless/ @serverless-team

# DevOps and infrastructure
/devops/ @devops-team @lead-devops

# GitHub Actions workflows
/.github/workflows/ @ci-cd-team

# Documentation
/docs/ @docs-team

# Tests (unit, integration, and e2e)
tests/ @qa-team
