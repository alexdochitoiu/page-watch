"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  AddWatcherFormSchema,
  checkFrequencyOptions,
  Frequency,
  WatcherFormData,
} from "@/components/AddWatcherForm/AddWatcherForm.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const AddWatcherForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<WatcherFormData>({
    resolver: zodResolver(AddWatcherFormSchema),
    mode: "all",
  });

  const onSubmit = (data: WatcherFormData) => {
    console.log("Watcher data", data);
    // submit to API here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Watcher Name</Label>
        <Input id="name" {...register("name")} placeholder="My Website" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL to Monitor</Label>
        <Input id="url" {...register("url")} placeholder="https://example.com" />
        {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} placeholder="your@email.com" />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <Controller
        name="frequency"
        control={control}
        defaultValue={Frequency.HOURLY}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="frequency">Check Frequency</Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="frequency" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {checkFrequencyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && <p className="text-sm text-red-500">{errors.frequency.message}</p>}
          </div>
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="selector">CSS Selector (Optional)</Label>
        <Textarea
          id="selector"
          placeholder="e.g., .price, #content, h1"
          {...register("selector")}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">Leave empty to monitor entire page content</p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Watcher"}
      </Button>
    </form>
  );
};
