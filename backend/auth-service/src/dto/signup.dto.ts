import { z } from "zod";

export const SignupSchema = z.object({
	name: z.string().min(1, "Name is required"), // Verifica se é string e não está vazio
	email: z.string().email("Invalid email address"), // Verifica se é um e-mail válido
	password: z.string().min(8, "Password must be at least 8 characters long"), // Verifica o comprimento mínimo
});

export type SignupDto = z.infer<typeof SignupSchema>; // Tipo inferido automaticamente
