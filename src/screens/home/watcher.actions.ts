"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Watcher } from "@/types";

export const updateWatcherStatus = async (watcherId: string, newStatus: Watcher["status"]) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("watchers")
      .update({ status: newStatus })
      .eq("id", watcherId);

    if (error) {
      throw error;
    }

    revalidatePath("/");
    return newStatus;
  } catch (error) {
    console.error("Error updating watcher status:", error);
    throw error;
  }
};

export const deleteWatcher = async (watcherId: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("watchers").delete().eq("id", watcherId);

    if (error) {
      throw error;
    }

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("Error deleting watcher:", error);
    throw error;
  }
};
