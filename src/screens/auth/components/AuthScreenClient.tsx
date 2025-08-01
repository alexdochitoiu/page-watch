"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { APP_ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/stores/auth";

export const AuthScreenClient: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(APP_ROUTES.HOME);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return <>{children}</>;
};
