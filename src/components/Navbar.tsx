import { Globe } from "lucide-react";
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Globe className="h-8 w-8" />
        <h2 className="font-bold text-foreground/90 w-min leading-[14px]">Page Watch</h2>
      </div>
    </nav>
  );
};
