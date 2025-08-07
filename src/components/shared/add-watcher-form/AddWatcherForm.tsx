"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  AddWatcherFormSchema,
  checkFrequencyOptions,
  Frequency,
  WatcherFormData,
} from "@/components/shared/add-watcher-form/AddWatcherForm.types";
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
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth";

export const AddWatcherForm: React.FC = () => {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<WatcherFormData>({
    resolver: zodResolver(AddWatcherFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: WatcherFormData) => {
    console.log("Watcher data", data);
    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const { error } = await supabase.from("watchers").insert({
        user_id: user.id,
        name: data.name,
        url: data.url,
        frequency: data.frequency.toLowerCase(),
        selector: data.rules,
      });

      if (error) {
        throw error;
      }

      console.log("Watcher added successfully");
    } catch (error) {
      console.error("Unexpected error adding watcher:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Watcher name</Label>
        <Input id="name" {...register("name")} placeholder="My watcher" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL to monitor</Label>
        <Input id="url" {...register("url")} placeholder="https://example.com" />
        {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
      </div>

      <Controller
        name="frequency"
        control={control}
        defaultValue={Frequency.HOURLY}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="frequency">Check frequency</Label>
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

      {/* TODO: Create custom RulesBuilder component */}
      <div className="space-y-2">
        <Label htmlFor="rules">Monitoring rules</Label>
        <Textarea
          id="rules"
          {...register("rules")}
          placeholder='Example: [{"selector": ".price", "operation": "greater_than", "value": "100"}]'
        />
        {errors.rules && <p className="text-sm text-red-500">{errors.rules.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add watcher"}
      </Button>
    </form>
  );
};
