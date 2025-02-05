# Payment API Documentation

## Overview
The Payment API handles payment processing, transaction history, and refund management for the Taly CRM platform. It provides endpoints for processing payments, retrieving transaction details, and handling refunds securely.

## Base URL
```
https://api.taly.dev/payment
```

---

## **1. Payment Processing**

### **1.1 Initiate a Payment**
**Endpoint:** `POST /payment/charge`

**Description:** Processes a new payment for a service or booking.

**Request Body:**
```json
{
  "userId": 1,
  "bookingId": 101,
  "amount": 49.99,
  "currency": "USD",
  "paymentMethod": "credit_card",
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Response:**
```json
{
  "transactionId": 2001,
  "status": "successful",
  "amount": 49.99,
  "currency": "USD",
  "timestamp": "2024-06-10T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request` – Invalid payment data.
- `402 Payment Required` – Payment declined.
- `404 Not Found` – User or booking not found.

---

### **1.2 Get Payment Details**
**Endpoint:** `GET /payment/{transactionId}`

**Description:** Retrieves details of a specific payment transaction.

**Response:**
```json
{
  "transactionId": 2001,
  "userId": 1,
  "bookingId": 101,
  "amount": 49.99,
  "currency": "USD",
  "status": "successful",
  "paymentMethod": "credit_card",
  "timestamp": "2024-06-10T10:00:00Z"
}
```

**Errors:**
- `404 Not Found` – Transaction not found.

---

### **1.3 List User Payments**
**Endpoint:** `GET /payment/user/{userId}`

**Description:** Retrieves all payments made by a specific user.

**Response:**
```json
[
  {
    "transactionId": 2001,
    "amount": 49.99,
    "currency": "USD",
    "status": "successful"
  },
  {
    "transactionId": 2002,
    "amount": 29.99,
    "currency": "USD",
    "status": "pending"
  }
]
```

**Errors:**
- `404 Not Found` – No transactions found for the user.

---

## **2. Refund Management**

### **2.1 Request a Refund**
**Endpoint:** `POST /payment/refund`

**Description:** Initiates a refund for a completed payment.

**Request Body:**
```json
{
  "transactionId": 2001,
  "reason": "Service was not as expected"
}
```

**Response:**
```json
{
  "refundId": 5001,
  "transactionId": 2001,
  "status": "processing",
  "requestedAt": "2024-06-11T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request` – Invalid refund request.
- `404 Not Found` – Transaction not found or not eligible for refund.

---

### **2.2 Get Refund Status**
**Endpoint:** `GET /payment/refund/{refundId}`

**Description:** Retrieves the status of a refund request.

**Response:**
```json
{
  "refundId": 5001,
  "transactionId": 2001,
  "status": "completed",
  "processedAt": "2024-06-12T10:00:00Z"
}
```

**Errors:**
- `404 Not Found` – Refund request not found.

---

## **3. Security & Authentication**
- **All requests require JSON Web Token (JWT)** for authentication.
- **Use the `Authorization` header for authentication**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Payments are securely processed via PCI-DSS-compliant gateways.**
- **Refund requests require admin or manager role approval.**

---

## **Contact & Support**
For any issues, please contact the API support team at **support@taly.dev** or check the documentation at [Taly API Docs](https://api.taly.dev/docs).

---

_Last updated: {{DATE}}_

