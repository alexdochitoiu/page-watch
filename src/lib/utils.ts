import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { WatcherRule, WatcherRuleZod } from "@/types/watcher";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatStr = "PPpp"): string {
  const d = new Date(date);
  return format(d, formatStr);
}

export function isWatcherRules(rules: unknown): rules is WatcherRule[] {
  return WatcherRuleZod.array().safeParse(rules).success;
}
