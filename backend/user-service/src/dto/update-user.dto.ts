import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  role: z.string().optional(),
  planId: z.string().uuid().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
