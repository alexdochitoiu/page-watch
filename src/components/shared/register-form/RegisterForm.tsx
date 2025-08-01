"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  RegisterFormSchema,
  RegisterFormData,
} from "@/components/shared/register-form/RegisterForm.types";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";

export const RegisterForm: React.FC = () => {
  const { signUp, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { error } = await signUp(data.email, data.password);
    if (error) {
      console.error("Registration failed:", error.message);
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} placeholder="your@email.com" />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" {...register("password")} placeholder="********" />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          {...register("confirmPassword")}
          placeholder="********"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Register"}
      </Button>
    </form>
  );
};
