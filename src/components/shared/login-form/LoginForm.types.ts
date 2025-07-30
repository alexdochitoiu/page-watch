import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string("Please enter your password")
    .min(6, "Password must be at least 6 characters long"),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
