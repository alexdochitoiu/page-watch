import { Globe, LogIn } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/routes";

export const Navbar: React.FC = () => {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Globe className="h-8 w-8" />
        <h2 className="font-bold text-foreground/90 w-min leading-[14px]">Page Watch</h2>
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end">
        <Button asChild>
          <Link href={APP_ROUTES.LOGIN} className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span className="hidden md:inline">Login</span>
          </Link>
        </Button>
      </div>

      <ThemeSwitcher />
    </nav>
  );
};
