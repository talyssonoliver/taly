import type { IPaymentProvider } from "../../api/src/payments/interfaces/payment-provider.interface";

// Mock implementation of a payment provider (e.g., Stripe, PayPal)
export const mockPaymentProvider = {
	initialize: jest.fn(),
	processPaymentWithCard: jest.fn().mockResolvedValue({
		success: true,
		transactionId: "mock-transaction-id",
		message: "Payment processed successfully",
	}),
	processPaymentWithToken: jest.fn().mockResolvedValue({
		success: true,
		transactionId: "mock-transaction-id",
		message: "Payment processed successfully",
	}),
	processPaymentWithSavedMethod: jest.fn().mockResolvedValue({
		success: true,
		transactionId: "mock-transaction-id",
		message: "Payment processed successfully",
	}),
	refundPayment: jest.fn().mockResolvedValue({
		success: true,
		transactionId: "mock-refund-id",
		message: "Refund processed successfully",
	}),
	validateToken: jest.fn().mockResolvedValue({
		isValid: true,
		lastFour: "1234",
		expiryMonth: "12",
		expiryYear: "2025",
		cardBrand: "Visa",
	}),
	createCustomer: jest.fn().mockResolvedValue("mock-customer-id"),
	updateCustomer: jest.fn(),
	createPaymentMethod: jest.fn(),
	attachPaymentMethodToCustomer: jest.fn(),
	createSetupIntent: jest.fn(),
} as unknown as IPaymentProvider;
