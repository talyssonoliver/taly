export const ErrorMessages = {
  AUTHENTICATION: {
    UNAUTHORIZED: "You are not authorized to access this resource.",
    FORBIDDEN: "You do not have permission to perform this action.",
    INVALID_CREDENTIALS: "The provided credentials are incorrect.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
  },

  VALIDATION: {
    REQUIRED_FIELD: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    MIN_LENGTH: (min: number) => `The minimum length is ${min} characters.`,
    MAX_LENGTH: (max: number) => `The maximum length is ${max} characters.`,
    INVALID_FORMAT: "The format of the input is invalid.",
    RANGE: (min: number, max: number) =>
      `Value must be between ${min} and ${max}.`,
  },

  SERVER: {
    INTERNAL_ERROR: "An unexpected error occurred. Please try again later.",
    NOT_FOUND: "The requested resource could not be found.",
    SERVICE_UNAVAILABLE:
      "The service is currently unavailable. Please try again later.",
    TIMEOUT: "The request timed out. Please try again.",
  },

  BOOKING: {
    ALREADY_BOOKED: "The selected time slot is already booked.",
    INVALID_DATE: "Please select a valid date for your booking.",
    EXCEEDS_CAPACITY: "Booking exceeds capacity limits.",
  },

  PAYMENTS: {
    PAYMENT_FAILED: "The payment could not be processed. Please try again.",
    INVALID_PAYMENT_METHOD: "The selected payment method is not supported.",
    INSUFFICIENT_FUNDS:
      "There are insufficient funds to complete this transaction.",
    PAYMENT_DECLINED: "The payment was declined by the provider.",
  },

  USER: {
    NOT_FOUND: "User not found.",
    EMAIL_ALREADY_EXISTS: "This email address is already in use.",
    INVALID_ROLE: "The specified role is not valid.",
  },

  NOTIFICATIONS: {
    EMAIL_SEND_FAILED: "Failed to send email notification.",
    SMS_SEND_FAILED: "Failed to send SMS notification.",
    PUSH_SEND_FAILED: "Failed to send push notification.",
  },

  API: {
    CONNECTION_FAILED: "Failed to connect to the external service.",
    INVALID_RESPONSE: "Received an invalid response from the server.",
    RATE_LIMIT_EXCEEDED: "API rate limit exceeded. Please try again later.",
  },
};
