import api from "./api.js";

interface CreatePaymentPayload {
  amount: number;
  currency: string;
  customerId: string;
  description?: string;
}

const createPayment = async (
  payload: CreatePaymentPayload
): Promise<Payment> => {
  const response = await api.post<Payment>("/payments", payload);
  return response.data;
};

const getPayment = async (id: string): Promise<Payment> => {
  const response = await api.get<Payment>(`/payments/${id}`);
  return response.data;
};

const getAllPayments = async (): Promise<Payment[]> => {
  const response = await api.get<Payment[]>("/payments");
  return response.data;
};

export const paymentService = {
  createPayment,
  getPayment,
  getAllPayments,
};
