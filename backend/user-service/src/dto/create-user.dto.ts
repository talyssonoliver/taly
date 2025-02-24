import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: z.string().optional(),
  planId: z.string().uuid().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
