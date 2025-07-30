import { Plus } from "lucide-react";
import { AddWatcherForm } from "@/components/shared/add-watcher-form/AddWatcherForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const HomeScreen: React.FC = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add website monitor
            </CardTitle>
            <CardDescription>
              Monitor websites for changes and get email notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AddWatcherForm />
          </CardContent>
        </Card>
      </div>

      {/* TODO: Placeholder for future components like WatcherList, Stats, etc. */}
    </div>
  );
};
