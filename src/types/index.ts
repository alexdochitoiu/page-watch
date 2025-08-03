import { Database } from "@/types/supabase";

export type Watcher = Database["public"]["Tables"]["watchers"]["Row"];
