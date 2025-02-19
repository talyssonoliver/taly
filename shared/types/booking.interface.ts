export interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  service: string;
  customerEmail: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
  createdAt: string;
  updatedAt: string;
}
