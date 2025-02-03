import axios from "axios";

export interface Payment {
	id: string;
	amount: number;
	status: "pending" | "completed" | "failed";
	date: string;
	paymentMethod: "credit_card" | "paypal" | "bank_transfer";
}

const API_URL = "http://localhost:3000/api/payments";

export const PaymentService = {
	getAllPayments: async (): Promise<Payment[]> => {
		try {
			const response = await axios.get<Payment[]>(API_URL);
			return response.data;
		} catch (error) {
			console.error("Error fetching payments:", error);
			throw new Error("Failed to fetch payments");
		}
	},

	getPaymentById: async (id: string): Promise<Payment> => {
		try {
			const response = await axios.get<Payment>(`${API_URL}/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching payment with ID ${id}:`, error);
			throw new Error("Failed to fetch payment");
		}
	},

	createPayment: async (payment: Omit<Payment, "id">): Promise<Payment> => {
		try {
			const response = await axios.post<Payment>(API_URL, payment);
			return response.data;
		} catch (error) {
			console.error("Error creating payment:", error);
			throw new Error("Failed to create payment");
		}
	},

	updatePayment: async (
		id: string,
		updatedData: Partial<Payment>,
	): Promise<Payment> => {
		try {
			const response = await axios.patch<Payment>(
				`${API_URL}/${id}`,
				updatedData,
			);
			return response.data;
		} catch (error) {
			console.error(`Error updating payment with ID ${id}:`, error);
			throw new Error("Failed to update payment");
		}
	},

	cancelPayment: async (id: string): Promise<string> => {
		try {
			await axios.delete(`${API_URL}/${id}`);
			return "Payment cancelled successfully";
		} catch (error) {
			console.error(`Error cancelling payment with ID ${id}:`, error);
			throw new Error("Failed to cancel payment");
		}
	},
};
