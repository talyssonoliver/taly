import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { type Payment, PaymentSchema } from "@shared/schemas/payment.schema";
import { z } from "zod";

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
  }
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
    updatedData: Partial<Payment>
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
