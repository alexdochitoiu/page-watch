"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, LoginFormData } from "@/components/shared/login-form/LoginForm.types";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";

export const LoginForm: React.FC = () => {
  const { signIn, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      console.error("Login failed:", error.message);
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
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

      <Button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
