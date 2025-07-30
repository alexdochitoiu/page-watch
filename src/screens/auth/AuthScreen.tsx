import Link from "next/link";
import { FaGoogle, FaFacebook, FaApple, FaDiscord } from "react-icons/fa";
import { LoginForm } from "@/components/shared/login-form/LoginForm";
import { RegisterForm } from "@/components/shared/register-form/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_ROUTES } from "@/lib/routes";

export enum AuthTabs {
  LOGIN = "login",
  REGISTER = "register",
}

interface AuthScreenProps {
  tab?: AuthTabs;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ tab = AuthTabs.LOGIN }) => {
  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-md">
      <Card className="w-full mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={tab} className="w-full">
            <TabsList className="w-full flex justify-center">
              <TabsTrigger value={AuthTabs.LOGIN} asChild>
                <Link href={APP_ROUTES.LOGIN}>Login</Link>
              </TabsTrigger>
              <TabsTrigger value={AuthTabs.REGISTER} asChild>
                <Link href={APP_ROUTES.REGISTER}>Register</Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={AuthTabs.LOGIN}>
              <LoginForm />
            </TabsContent>

            <TabsContent value={AuthTabs.REGISTER}>
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground mb-2">Or continue with</div>

      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <FaGoogle className="h-5 w-5 text-red-600" />
        </Button>
        <Button variant="outline">
          <FaFacebook className="h-5 w-5 text-blue-700" />
        </Button>
        <Button variant="outline">
          <FaDiscord className="h-5 w-5 text-blue-500" />
        </Button>
        <Button variant="outline">
          <FaApple className="h-5 w-5 text-black-600" />
        </Button>
      </div>
    </div>
  );
};
