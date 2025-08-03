import { Plus } from "lucide-react";
import { AddWatcherForm } from "@/components/shared/add-watcher-form/AddWatcherForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WatcherList } from "@/screens/home/components/WatcherList";

export const HomeScreen: React.FC = async () => {
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

      <div className="lg:col-span-2">
        <WatcherList />
      </div>
    </div>
  );
};
