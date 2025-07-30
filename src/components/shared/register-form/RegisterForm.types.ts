import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    email: z.email("Please enter a valid email"),
    password: z
      .string("Please enter your password")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string("Please confirm your password")
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match",
  });

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;
