"use client";

import { ThemeProvider } from "next-themes";
import { PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    return initialize();
  }, [initialize]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};
