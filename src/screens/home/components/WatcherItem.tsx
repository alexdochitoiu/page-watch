"use client";

import { Edit, MoreVertical, RefreshCw, Trash2 } from "lucide-react";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/lib/utils";
import { getFrequencyLabel, getStatusColor } from "@/screens/home/utils";
import { deleteWatcher, updateWatcherStatus } from "@/screens/home/watcher.actions";
import { Watcher } from "@/types";

interface WatcherItemProps {
  watcher: Watcher;
}

export const WatcherItem: React.FC<WatcherItemProps> = ({ watcher }) => {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (active: boolean) => {
    if (isPending) return;

    try {
      const newStatus = active ? "active" : "paused";
      startTransition(async () => {
        const updatedStatus = await updateWatcherStatus(watcher.id, newStatus);
        console.log(`Watcher is now ${updatedStatus}`);
      });
    } catch (error) {
      console.error("Error updating watcher status:", error);
    }
  };

  const handleDelete = async () => {
    if (isPending) return;

    try {
      startTransition(async () => {
        await deleteWatcher(watcher.id);
        console.log("Watcher deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting watcher:", error);
    }
  };

  return (
    <div key={watcher.id} className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{watcher.name}</p>
          <p className="text-sm text-muted-foreground truncate">{watcher.url}</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={watcher.status === "active"}
            disabled={isPending}
            onCheckedChange={handleStatusChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive" onSelect={e => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your watcher and
                      remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive" onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{getFrequencyLabel(watcher.frequency)}</Badge>
        <Badge className={getStatusColor(watcher.status)}>{watcher.status}</Badge>
      </div>

      {/*{watcher.selector && (*/}
      {/*  <p className="text-xs text-muted-foreground">Selector: {watcher.selector}</p>*/}
      {/*)}*/}

      <div className="text-xs text-muted-foreground">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <span>Created: {formatDate(watcher.created_at)}</span>
          {watcher.last_checked_at && (
            <span>Last checked: {formatDate(watcher.last_checked_at)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
