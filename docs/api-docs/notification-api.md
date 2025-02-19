# Notification API Documentation

## Overview

The Notification API handles the dispatching of email and SMS notifications for the Taly CRM platform. It provides endpoints for sending, scheduling, and managing notifications related to bookings, payments, and user activities.

## Base URL

```
https://api.taly.dev/notification
```

---

## **1. Notification Management**

### **1.1 Send a Notification**

**Endpoint:** `POST /notification/send`

**Description:** Sends an email or SMS notification to a user.

**Request Body:**

```json
{
  "userId": 1,
  "type": "email",
  "subject": "Booking Confirmation",
  "message": "Your booking has been confirmed for June 15, 2024, at 2:00 PM."
}
```

**Response:**

```json
{
  "notificationId": 501,
  "status": "sent",
  "timestamp": "2024-06-10T10:00:00Z"
}
```

**Errors:**

- `400 Bad Request` – Invalid input data.
- `404 Not Found` – User not found.
- `500 Internal Server Error` – Notification service failure.

---

### **1.2 Get Notification by ID**

**Endpoint:** `GET /notification/{id}`

**Description:** Retrieves a specific notification by ID.

**Response:**

```json
{
  "notificationId": 501,
  "userId": 1,
  "type": "email",
  "subject": "Booking Confirmation",
  "message": "Your booking has been confirmed for June 15, 2024, at 2:00 PM.",
  "status": "sent",
  "timestamp": "2024-06-10T10:00:00Z"
}
```

**Errors:**

- `404 Not Found` – Notification not found.

---

### **1.3 List Notifications for a User**

**Endpoint:** `GET /notification/user/{userId}`

**Description:** Retrieves all notifications sent to a specific user.

**Response:**

```json
[
  {
    "notificationId": 501,
    "type": "email",
    "subject": "Booking Confirmation",
    "status": "sent"
  },
  {
    "notificationId": 502,
    "type": "sms",
    "subject": "Payment Receipt",
    "status": "delivered"
  }
]
```

**Errors:**

- `404 Not Found` – No notifications found for the user.

---

### **1.4 Schedule a Notification**

**Endpoint:** `POST /notification/schedule`

**Description:** Schedules a notification to be sent at a future date and time.

**Request Body:**

```json
{
  "userId": 1,
  "type": "email",
  "subject": "Upcoming Appointment Reminder",
  "message": "Reminder: You have an appointment on June 15, 2024, at 2:00 PM.",
  "sendAt": "2024-06-14T12:00:00Z"
}
```

**Response:**

```json
{
  "notificationId": 503,
  "status": "scheduled",
  "sendAt": "2024-06-14T12:00:00Z"
}
```

**Errors:**

- `400 Bad Request` – Invalid input data.
- `500 Internal Server Error` – Unable to schedule notification.

---

### **1.5 Cancel a Scheduled Notification**

**Endpoint:** `DELETE /notification/cancel/{id}`

**Description:** Cancels a scheduled notification before it is sent.

**Response:**

```json
{
  "message": "Notification cancelled successfully."
}
```

**Errors:**

- `404 Not Found` – Notification not found or already sent.
- `403 Forbidden` – Cannot cancel an already processed notification.

---

## **2. Security & Authentication**

- **All requests require JSON Web Token (JWT)**, except for system-triggered notifications.
- **Use the `Authorization` header for authentication**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **RBAC applies**, restricting notification actions to users with the appropriate permissions.

---

## **Contact & Support**

For any issues, please contact the API support team at **support@taly.dev** or check the documentation at [Taly API Docs](https://api.taly.dev/docs).

---

_Last updated: {{DATE}}_
