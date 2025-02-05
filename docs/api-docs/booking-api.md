# Booking API Documentation

## Overview
The Booking API handles appointment scheduling, modifications, and cancellations for the Taly CRM platform. It provides endpoints for salon owners and customers to manage their bookings efficiently.

## Base URL
```
https://api.taly.dev/booking
```

---

## **1. Booking Management**

### **1.1 Create a Booking**
**Endpoint:** `POST /booking`

**Description:** Creates a new booking in the system.

**Request Body:**
```json
{
  "customerId": 1,
  "salonId": 5,
  "serviceId": 3,
  "dateTime": "2024-06-15T14:00:00Z",
  "notes": "Customer prefers a quiet environment."
}
```

**Response:**
```json
{
  "id": 101,
  "customerId": 1,
  "salonId": 5,
  "serviceId": 3,
  "dateTime": "2024-06-15T14:00:00Z",
  "status": "confirmed",
  "createdAt": "2024-06-10T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request` – Invalid input data.
- `404 Not Found` – Customer or Salon not found.
- `409 Conflict` – Overlapping booking.

---

### **1.2 Get Booking by ID**
**Endpoint:** `GET /booking/{id}`

**Description:** Retrieves a booking by its ID.

**Response:**
```json
{
  "id": 101,
  "customerId": 1,
  "salonId": 5,
  "serviceId": 3,
  "dateTime": "2024-06-15T14:00:00Z",
  "status": "confirmed"
}
```

**Errors:**
- `404 Not Found` – Booking not found.

---

### **1.3 List Bookings for a Salon**
**Endpoint:** `GET /booking/salon/{salonId}`

**Description:** Retrieves all bookings for a specific salon.

**Response:**
```json
[
  {
    "id": 101,
    "customerId": 1,
    "dateTime": "2024-06-15T14:00:00Z",
    "status": "confirmed"
  },
  {
    "id": 102,
    "customerId": 2,
    "dateTime": "2024-06-16T11:00:00Z",
    "status": "pending"
  }
]
```

**Errors:**
- `404 Not Found` – No bookings found for the salon.

---

### **1.4 Update Booking**
**Endpoint:** `PUT /booking/{id}`

**Description:** Updates an existing booking.

**Request Body:**
```json
{
  "dateTime": "2024-06-16T15:00:00Z",
  "status": "rescheduled"
}
```

**Response:**
```json
{
  "id": 101,
  "customerId": 1,
  "dateTime": "2024-06-16T15:00:00Z",
  "status": "rescheduled"
}
```

**Errors:**
- `400 Bad Request` – Invalid input data.
- `404 Not Found` – Booking not found.

---

### **1.5 Cancel Booking**
**Endpoint:** `DELETE /booking/{id}`

**Description:** Cancels a booking.

**Response:**
```json
{
  "message": "Booking cancelled successfully."
}
```

**Errors:**
- `404 Not Found` – Booking not found.
- `403 Forbidden` – Cannot cancel past bookings.

---

## **2. Security & Authentication**
- **All requests require JSON Web Token (JWT)**, except for public availability checks.
- **Use the `Authorization` header for authentication**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Role-Based Access Control (RBAC) is applied**, allowing only salon owners and admins to modify bookings.

---

## **Contact & Support**
For any issues, please contact the API support team at **support@taly.dev** or check the documentation at [Taly API Docs](https://api.taly.dev/docs).

---

_Last updated: {{DATE}}_

