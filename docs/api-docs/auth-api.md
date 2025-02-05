# Authentication API Documentation

## Overview
The Authentication API handles user authentication and authorization for the Taly CRM platform. It provides endpoints for user login, registration, token management, and role-based access control (RBAC).

## Base URL
```
https://api.taly.dev/auth
```

---

## **1. User Authentication**

### **1.1 User Registration**
**Endpoint:** `POST /auth/signup`

**Description:** Registers a new user in the system.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "johndoe@example.com",
  "role": "user",
  "token": "<JWT_TOKEN>"
}
```

**Errors:**
- `400 Bad Request` – Invalid input data.
- `409 Conflict` – Email already in use.

---

### **1.2 User Login**
**Endpoint:** `POST /auth/login`

**Description:** Logs in an existing user and returns an access token.

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "refreshToken": "<REFRESH_TOKEN>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "role": "user"
  }
}
```

**Errors:**
- `401 Unauthorized` – Invalid credentials.
- `403 Forbidden` – Account not verified.

---

### **1.3 Refresh Token**
**Endpoint:** `POST /auth/refresh`

**Description:** Generates a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Response:**
```json
{
  "token": "<NEW_JWT_TOKEN>",
  "refreshToken": "<NEW_REFRESH_TOKEN>"
}
```

**Errors:**
- `401 Unauthorized` – Invalid or expired refresh token.

---

## **2. Role-Based Access Control (RBAC)**

### **2.1 Assign Role to User**
**Endpoint:** `POST /auth/assign-role/{userId}/{roleId}`

**Description:** Assigns a role to a user.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "role": "admin"
}
```

**Errors:**
- `403 Forbidden` – Not authorized.

---

### **2.2 Get User Role**
**Endpoint:** `GET /auth/user-role/{userId}`

**Description:** Retrieves the role of a specific user.

**Response:**
```json
{
  "userId": 1,
  "role": "admin"
}
```

**Errors:**
- `404 Not Found` – User not found.

---

## **3. Password Management**

### **3.1 Forgot Password**
**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "johndoe@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent."
}
```

**Errors:**
- `404 Not Found` – Email not found.

---

### **3.2 Reset Password**
**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "<RESET_TOKEN>",
  "newPassword": "NewSecurePass123"
}
```

**Response:**
```json
{
  "message": "Password successfully reset."
}
```

**Errors:**
- `400 Bad Request` – Invalid token or weak password.

---

## **Security & Authentication**
- **All requests require JSON Web Token (JWT)**, except for signup, login, and password recovery.
- **Use the `Authorization` header for authentication**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Tokens expire after 1 hour**. Refresh tokens can be used to generate new tokens.

---

## **Contact & Support**
For any issues, please contact the API support team at **support@taly.dev** or check the documentation at [Taly API Docs](https://api.taly.dev/docs).

---

_Last updated: {{DATE}}_

