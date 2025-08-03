import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { WatcherItem } from "@/screens/home/components/WatcherItem";

export const WatcherList: React.FC = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your watchers</div>;
  }

  const { data: watchers, error } = await supabase
    .from("watchers")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching watchers:", error);
    return <div>Error loading watchers</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your watchers</CardTitle>
        <CardDescription>View and manage your website monitors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {watchers.length === 0 ? (
          <div className="text-center text-gray-500">No watchers found. Add a new one!</div>
        ) : (
          watchers.map(watcher => <WatcherItem watcher={watcher} key={watcher.id} />)
        )}
      </CardContent>
    </Card>
  );
};
