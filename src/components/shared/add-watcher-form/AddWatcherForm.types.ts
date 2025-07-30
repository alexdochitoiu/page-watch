import { z } from "zod";

export enum Frequency {
  EVERY_5_MINUTES = "5",
  EVERY_15_MINUTES = "15",
  EVERY_30_MINUTES = "30",
  HOURLY = "60",
  EVERY_2_HOURS = "120",
  EVERY_4_HOURS = "240",
  EVERY_6_HOURS = "360",
  EVERY_12_HOURS = "720",
  DAILY = "1440",
  WEEKLY = "10080",
}

export const AddWatcherFormSchema = z.object({
  name: z.string("Please enter a name for the watcher").nonempty("Name is required"),
  url: z.url("Please enter a valid URL"),
  email: z.email("Please enter a valid email"),
  frequency: z.enum(Frequency),
  selector: z.string().optional(),
});

export type WatcherFormData = z.infer<typeof AddWatcherFormSchema>;

export const checkFrequencyOptions = [
  { value: Frequency.EVERY_5_MINUTES, label: "Every 5 minutes" },
  { value: Frequency.EVERY_15_MINUTES, label: "Every 15 minutes" },
  { value: Frequency.EVERY_30_MINUTES, label: "Every 30 minutes" },
  { value: Frequency.HOURLY, label: "Hourly" },
  { value: Frequency.EVERY_2_HOURS, label: "Every 2 hours" },
  { value: Frequency.EVERY_4_HOURS, label: "Every 4 hours" },
  { value: Frequency.EVERY_6_HOURS, label: "Every 6 hours" },
  { value: Frequency.EVERY_12_HOURS, label: "Every 12 hours" },
  { value: Frequency.DAILY, label: "Daily" },
  { value: Frequency.WEEKLY, label: "Weekly" },
];
