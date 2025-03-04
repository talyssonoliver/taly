import { z } from "zod";

export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentMethod: "credit_card" | "paypal" | "bank_transfer";
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "completed", "failed"]),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"]),
  currency: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
