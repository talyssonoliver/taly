import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
// Use relative path to the schema file
import {
	type Payment,
	PaymentSchema,
} from "../../../../packages/serverless-shared/schemas/payment.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface PaymentResponse {
	success: boolean;
	data?: Payment;
	error?: string;
}

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`,
	timeout: 5000, // 5 seconds timeout
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			toast.error("Session expired. Please login again.");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export const PaymentService = {
	getAllPayments: async (): Promise<Payment[]> => {
		try {
			const response = await api.get<Payment[]>("/");
			const validatedData = PaymentSchema.array().parse(response.data);
			return validatedData;
		} catch (error) {
			handleAxiosError(error, "Failed to fetch payments");
		}
	},

	getPaymentById: async (id: string): Promise<Payment> => {
		try {
			const response = await api.get<Payment>(`/${id}`);
			return PaymentSchema.parse(response.data);
		} catch (error) {
			handleAxiosError(error, `Failed to fetch payment with ID ${id}`);
		}
	},

	createPayment: async (payment: Omit<Payment, "id">): Promise<Payment> => {
		try {
			const response = await api.post<Payment>("/", payment);
			toast.success("Payment created successfully.");
			return PaymentSchema.parse(response.data);
		} catch (error) {
			handleAxiosError(error, "Failed to create payment");
		}
	},

	updatePayment: async (
		id: string,
		updatedData: Partial<Payment>,
	): Promise<Payment> => {
		try {
			const response = await api.patch<Payment>(`/${id}`, updatedData);
			toast.success("Payment updated successfully.");
			return PaymentSchema.parse(response.data);
		} catch (error) {
			handleAxiosError(error, `Failed to update payment with ID ${id}`);
		}
	},

	cancelPayment: async (id: string): Promise<string> => {
		try {
			await api.delete(`/${id}`);
			toast.success("Payment cancelled successfully.");
			return "Payment cancelled successfully";
		} catch (error) {
			handleAxiosError(error, `Failed to cancel payment with ID ${id}`);
		}
	},
};

export const processPayment = async (
	paymentData: Payment,
): Promise<PaymentResponse> => {
	try {
		// Validate the payment data against the schema
		const validatedData = PaymentSchema.parse(paymentData);

		// Make API call to process the payment
		const response = await axios.post(`${API_URL}/payments`, validatedData);

		toast.success("Payment processed successfully!");

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		// Handle Zod validation errors
		if (error instanceof z.ZodError) {
			const errorMessage = `Validation error: ${error.errors.map((e) => e.message).join(", ")}`;
			toast.error(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		}

		// Handle Axios errors
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError;
			const errorMessage =
				axiosError.response?.data?.message || "Failed to process payment";
			toast.error(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		}

		// Handle other errors
		const errorMessage =
			error instanceof Error ? error.message : "An unexpected error occurred";
		toast.error(errorMessage);
		return {
			success: false,
			error: errorMessage,
		};
	}
};

export const fetchPaymentHistory = async (
	userId: string,
): Promise<PaymentResponse> => {
	try {
		const response = await axios.get(`${API_URL}/payments/history/${userId}`);

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		const errorMessage = axios.isAxiosError(error)
			? error.response?.data?.message || "Failed to fetch payment history"
			: "An unexpected error occurred";

		toast.error(errorMessage);
		return {
			success: false,
			error: errorMessage,
		};
	}
};

const handleAxiosError = (error: unknown, message: string): never => {
	if (axios.isAxiosError(error)) {
		console.error(message, error.response?.data || error.message);
		toast.error(error.response?.data?.message || message);
		throw new Error(error.response?.data?.message || message);
	}
	console.error(message, error);
	toast.error(message);
	throw new Error(message);
};
