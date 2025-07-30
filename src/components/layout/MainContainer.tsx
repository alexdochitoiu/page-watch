import { PropsWithChildren } from "react";
import { Navbar } from "@/components/layout/Navbar";

export const MainContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8">{children}</div>
    </main>
  );
};
