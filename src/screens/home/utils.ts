import { Watcher } from "@/types";
import { checkFrequencyOptions } from "@/types/watcher";

export const getFrequencyLabel = (frequency: Watcher["frequency"]): string => {
  return checkFrequencyOptions.find(option => option.value === frequency)?.label || frequency;
};

export const getStatusColor = (status: Watcher["status"]): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
