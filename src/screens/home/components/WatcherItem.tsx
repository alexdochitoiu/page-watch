"use client";

import { MoreVertical, RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Watcher } from "@/types";

function getStatusColor(status: Watcher["status"]): string {
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
}

interface WatcherItemProps {
  watcher: Watcher;
}

export const WatcherItem: React.FC<WatcherItemProps> = ({ watcher }) => {
  return (
    <div key={watcher.id} className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{watcher.url}</p>
          <p className="text-sm text-muted-foreground">{watcher.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch checked={watcher.status === "active"} onCheckedChange={() => {}} />
            <span className="text-sm text-muted-foreground">
              {watcher.status === "active" ? "Active" : "Paused"}
            </span>
          </div>
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
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{watcher.frequency}</Badge>
        <Badge className={getStatusColor(watcher.status)}>{watcher.status}</Badge>
      </div>

      {watcher.selector && (
        <p className="text-xs text-muted-foreground">Selector: {watcher.selector}</p>
      )}

      <div className="text-xs text-muted-foreground">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <span>Created: {new Date(watcher.created_at).toLocaleDateString()}</span>
          {/*{watcher.last_checked && (*/}
          {/*  <span>Last checked: {new Date(watcher.last_checked).toLocaleDateString()}</span>*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
};
