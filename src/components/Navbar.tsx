import { Globe } from "lucide-react";
import React from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const Navbar: React.FC = () => {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Globe className="h-8 w-8" />
        <h2 className="font-bold text-foreground/90 w-min leading-[14px]">Page Watch</h2>
      </div>

      <ThemeSwitcher />
    </nav>
  );
};
